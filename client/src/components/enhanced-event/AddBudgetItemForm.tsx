"use client";

import React, { useState } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type Props = {
  eventId?: string;
  templateId?: number | undefined;
};

type FormValues = {
  category: string;
  cost: string;
  masterItem?: string; // selected master item _id
};

type LocalItem = {
  id: number; // temporary client id
  itemName: string;
  category: string; // category id or value from CategorySelector
  cost: string; // as entered (dollars)
  masterItem?: string; // master item _id if chosen
};

export default function AddBudgetItemForm({ eventId, templateId }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<LocalItem[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      masterItem: "",
      category: "",
      cost: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async ({
      url,
      payload,
      method,
    }: {
      url: string;
      payload: any;
      method: "PUT" | "POST";
    }) => axiosInstance.request({ url, method, data: payload }),
    onSuccess: () => {
      if (eventId) {
        queryClient.invalidateQueries({
          queryKey: [`/api/events/${eventId}/budget`],
        });
      }
      // also invalidate master templates list in case UI depends on it
      queryClient.invalidateQueries({ queryKey: [`/api/master/budget-items`] });
      form.reset();
      setItems([]);
      toast({ title: "Budget items saved!" });
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

    setItems((s) => [...s, newItem]);
    // clear form values for next entry
    form.reset();
  };

  // Save all local items using the create endpoint in the format the API expects
  const onSaveAll = async () => {
    if (items.length === 0) {
      toast({ title: "No items to save", variant: "destructive" });
      return;
    }

    // Map local items to API payload shape
    const itemsPayload = items.map((it) => ({
      // If user picked a master item, prefer sending its id (string _id or numeric items_id)
      item_id: it.masterItem ?? it.id,
      category_id: parseInt(String(it.category)) || it.category,
      // price should be a number in dollars (e.g. 175.0)
      price: parseFloat(it.cost) || 0,
    }));

    // Choose endpoint and payload shape based on whether a template id was passed in
    const url = templateId
      ? `/api/master/budget-items/update`
      : `/api/master/budget-items/create`;

    const payload = templateId
      ? { id: templateId, items: itemsPayload, status: true }
      : { items: itemsPayload, status: true };

    try {
      await mutation.mutateAsync({
        url,
        payload,
        method: templateId ? "PUT" : "POST",
      });
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-2">
            <LoadingButton isLoading={false} type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </LoadingButton>

            <LoadingButton
              isLoading={mutation.isPending}
              type="button"
              onClick={onSaveAll}
              className="bg-blue-600"
            >
              Save All ({items.length})
            </LoadingButton>
          </div>
        </div>
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
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setItems((s) => s.filter((item) => item.id !== it.id))
                      }
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remove
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
