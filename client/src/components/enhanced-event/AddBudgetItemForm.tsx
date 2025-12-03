"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategorySelector from "@/components/category-selector";
import ItemsSelector from "@/components/items-selector";
import { LoadingButton } from "@/components/ui/loading-button";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCreatePlanEventMap } from "@/mutations/planEventMap";
import {
  useCreateMasterBudgetItems,
  useUpdateMasterBudgetItems,
} from "@/mutations/masterBudgetItems";

type Props = {
  eventId?: string;
  templateId?: number | undefined;
  planMapId?: string | number | undefined;
  remaining?: number; // remaining budget in dollars (optional)
  editingItem?: any; // item being edited from BudgetTab
  onEditComplete?: () => void; // callback when edit is complete
};

type FormValues = {
  category: string;
  cost: string;
  masterItem?: string; // selected master item _id
};

type LocalItem = {
  // id: client-side id (for new items) or server-side id string/number preserved in `serverId`
  id: string | number;
  itemName: string;
  category: string; // category id or value from CategorySelector
  cost: string; // as entered (dollars)
  masterItem?: string; // master item _id if chosen
  serverId?: string | number; // original server item id when loaded from template
};

export default function AddBudgetItemForm({
  eventId,
  templateId,
  planMapId,
  remaining,
  editingItem,
  onEditComplete,
}: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<LocalItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      masterItem: "",
      category: "",
      cost: "",
    },
  });

  const createMutation = useCreateMasterBudgetItems({
    onSuccess: (data) => {
      if (eventId) {
        queryClient.invalidateQueries({
          queryKey: [`/api/events/${eventId}/budget`],
        });
      }
      form.reset();
      setItems([]);
      return data;
    },
  });

  const updateMutation = useUpdateMasterBudgetItems({
    onSuccess: () => {
      if (eventId) {
        queryClient.invalidateQueries({
          queryKey: [`/api/events/${eventId}/budget`],
        });
      }
      form.reset();
      setItems([]);
    },
  });

  // hook to create plan event map for this event (only used when creating new budget template)
  const createPlanMap = useCreatePlanEventMap({
    onSuccess: () => {
      if (eventId) {
        queryClient.invalidateQueries({
          queryKey: [`/api/master/plan-event-map/event/${eventId}`],
        });
      }
      toast({ title: "Plan map created with budget template" });
    },
    onError: (err) => {
      toast({
        title: "Failed to create plan map",
        description: err?.message || String(err),
        variant: "destructive",
      });
    },
  });

  // Add item locally to the items array (does not call API)
  const onAddLocal = async (values: FormValues) => {
    const masterId = values.masterItem;
    if (!masterId) {
      toast({ title: "Select an item", variant: "destructive" });
      return;
    }

    // Do not resolve master item here — ItemsSelector owns fetching.
    const name = masterId || "Selected item";
    const defaultPrice = "0";

    const newItem: LocalItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      itemName: name,
      category: values.category,
      cost: values.cost || defaultPrice,
      masterItem: masterId,
    };

    const parsed = parseFloat(newItem.cost || "0");
    const newItemDollars = isNaN(parsed) ? 0 : parsed;
    const currentItemsDollars = items.reduce((sum, it) => {
      const p = parseFloat(it.cost as string) || 0;
      return sum + p;
    }, 0);

    if (typeof remaining === "number") {
      // remaining is already in dollars
      if (currentItemsDollars + newItemDollars > remaining) {
        setError(
          `Adding this item would exceed the remaining budget ($${remaining.toFixed(
            2
          )}).`
        );
        return;
      }
    }

    if (editingId != null) {
      setItems((s) =>
        s.map((it) =>
          it.id === editingId ? { ...it, ...newItem, id: it.id } : it
        )
      );
      setEditingId(null);
      if (onEditComplete) onEditComplete();
    } else {
      setItems((s) => [...s, newItem]);
    }

    // clear form values for next entry and any prior error
    form.reset();
    setError(null);
  };

  // No need to load existing template items - only work with new items in the form
  // Existing items are displayed in BudgetTab

  // Populate form when editingItem from BudgetTab changes
  useEffect(() => {
    if (editingItem) {
      // Convert the BudgetTab item format to form values
      const itemId = editingItem.raw?.item_id ?? editingItem.id;
      const categoryId = editingItem.raw?.category_id ?? editingItem.category;
      const price =
        editingItem.raw?.price ?? (editingItem.estimatedCost || 0) / 100;

      form.setValue("masterItem", String(itemId ?? ""));
      form.setValue("category", String(categoryId ?? ""));
      form.setValue("cost", String(price ?? "0"));

      // Set the existing item in local items state for editing
      const existingItemInState = items.find((it) => it.id === editingItem.id);
      if (!existingItemInState) {
        // Add to items if not already there
        const localItem: LocalItem = {
          id: itemId,
          serverId: itemId,
          itemName: editingItem.itemName,
          category: String(categoryId ?? ""),
          cost: String(price ?? "0"),
          masterItem: String(itemId ?? ""),
        };
        setItems((prev) => [...prev, localItem]);
      }
      setEditingId(editingItem.id);
    }
  }, [editingItem]);

  // Save only the new items in local state
  const onSaveAll = async () => {
    if (items.length === 0) {
      toast({ title: "No items to save", variant: "destructive" });
      return;
    }

    // Filter to only new items (those without serverId - not loaded from existing template)
    const newItems = items.filter((it) => !it.serverId);

    if (newItems.length === 0) {
      toast({ title: "No new items to save", variant: "destructive" });
      return;
    }

    // Map local items to API payload shape
    const itemsPayload = newItems.map((it) => ({
      // If user picked a master item, prefer sending its id (string _id or numeric items_id).
      item_id: parseInt(String(it.masterItem ?? it.id)),
      category_id: parseInt(String(it.category)),
      // price is already in dollars (e.g. 175.0)
      price: parseFloat(it.cost) || 0,
    }));

    try {
      let res;
      if (templateId) {
        // Update existing template
        res = await updateMutation.mutateAsync({
          id: templateId,
          items: itemsPayload,
          status: false,
        });
      } else {
        // Create new template
        res = await createMutation.mutateAsync({
          items: itemsPayload,
          status: true,
        });
      }

      // If creating a new template and no plan map exists, create one
      if (!templateId) {
        try {
          const returnedId =
            res?.data?.data?.budget_items_id ?? res?.data?.budget_items_id;
          // fallback to nested structure depending on axios wrapper
          if (returnedId && eventId && !planMapId) {
            // ensure array form
            const ids = Array.isArray(returnedId) ? returnedId : [returnedId];
            const planPayload: any = {
              event_id: eventId,
              budget_items_id: ids,
            };
            // only create plan map for new templates
            await createPlanMap.mutateAsync(planPayload);
          }
        } catch (err) {
          // non-fatal: show toast but do not block
          console.error("Failed to create plan map after budget create:", err);
        }
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to save items",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onAddLocal)}
        className="border rounded-lg p-4 bg-gray-50"
      >
        <h4 className="font-medium mb-3">Add Budget Item</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <FormField
            control={form.control}
            name="masterItem"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ItemsSelector
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick an existing item"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CategorySelector
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Category"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* masterItem selector moved to first column (replaced free-text name) */}

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Cost ($)"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (error) setError(null);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-2">
            <LoadingButton isLoading={false} type="submit">
              <Plus className="w-4 h-4 mr-2" />
              {editingId != null ? "Update" : "Add"}
            </LoadingButton>

            {editingId != null && (
              <button
                type="button"
                onClick={() => {
                  form.reset();
                  setEditingId(null);
                }}
                className="text-sm text-gray-600 px-3 py-1 rounded border"
              >
                Cancel
              </button>
            )}

            <LoadingButton
              isLoading={createMutation.isPending || updateMutation.isPending}
              type="button"
              onClick={onSaveAll}
              className="bg-blue-600"
            >
              Save All ({items.length})
            </LoadingButton>
          </div>
        </div>
        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      </form>

      {/* Items preview list */}
      {items.length > 0 && (
        <div className="mt-4 border rounded-lg p-3 bg-white">
          <h5 className="font-medium mb-2">Items to save ({items.length})</h5>
          <div className="space-y-2">
            {items.map((it) => {
              return (
                <div
                  key={it.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="font-medium">{it.itemName}</div>
                    <div className="text-sm text-muted-foreground">{`Category: ${it.category} • Price: $${it.cost}`}</div>
                    {it.serverId && (
                      <div className="text-xs text-gray-400">
                        Existing template item
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        // populate form for edit
                        form.setValue("masterItem", it.masterItem ?? "");
                        form.setValue("category", String(it.category ?? ""));
                        form.setValue("cost", String(it.cost ?? ""));
                        setEditingId(it.id);
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setItems((s) => s.filter((item) => item.id !== it.id))
                      }
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Form>
  );
}
