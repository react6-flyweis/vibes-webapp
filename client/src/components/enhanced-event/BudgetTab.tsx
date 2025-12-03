import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddBudgetItemForm from "./AddBudgetItemForm";
import { useMasterBudgetItemsById } from "@/queries/masterBudgetItems";
import { PlanEventMapData } from "@/queries/planEventMaps";
import { IEvent } from "@/hooks/useEvents";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useUpdateMasterBudgetItems } from "@/mutations/masterBudgetItems";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BudgetTab({
  eventId,
  planMap,
  event,
}: {
  eventId: string;
  planMap: PlanEventMapData;
  event: IEvent;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents);

  // if planMap contains budget_items_id (array), pick first id and fetch that template
  const templateId = Array.isArray(planMap?.budget_items_id)
    ? planMap.budget_items_id[0]
    : undefined;

  const { data: budgetData, isLoading } = useMasterBudgetItemsById(
    templateId as number | undefined
  );

  const items = (budgetData?.items ?? []).map((item: any) => {
    const id = item.item_id;

    const itemName =
      item.itemName ||
      item.item_details?.itemtxt ||
      item.item_details?.name ||
      item.item_details?.item_name ||
      `Item ${item.item_id ?? id}`;

    const category =
      item.category ||
      item.category_details?.categorytxt ||
      item.category_details?.category_text ||
      item.category_details?.item_category ||
      "Uncategorized";

    const emoji =
      item.category_details?.emozi || item.category_details?.emoji || "";

    const actualCost =
      item.actualCost ?? item.actual_cost ?? item.actual_amount ?? null;

    const estimatedCost =
      item.estimatedCost ??
      item.estimated_cost ??
      (item.price != null ? item.price : null);

    return {
      id,
      itemName,
      category,
      emoji,
      actualCost: actualCost != null ? actualCost : undefined,
      estimatedCost: estimatedCost != null ? estimatedCost : undefined,
      // keep original shape available if needed elsewhere
      raw: item,
    } as any;
  });

  const totalEstimated = items.reduce(
    (sum: number, it: any) => sum + (it.estimatedCost ?? 0),
    0
  );

  const totalActual =
    event?.budget_max != null
      ? event.budget_max
      : items.reduce((sum: number, it: any) => sum + (it.actualCost ?? 0), 0);

  const remaining = totalActual - totalEstimated;

  // Mutation to delete an item from the budget template
  // Since there's no dedicated delete endpoint, we update the template with remaining items
  const deleteMutation = useUpdateMasterBudgetItems({
    onSuccess: () => {
      if (eventId) {
        queryClient.invalidateQueries({
          queryKey: [`/api/events/${eventId}/budget`],
        });
      }
      toast({ title: "Item deleted successfully" });
    },
  });

  const handleDelete = (item: any) => {
    if (window.confirm(`Delete "${item.itemName}"?`)) {
      if (!templateId) {
        toast({ title: "No template ID", variant: "destructive" });
        return;
      }

      // Build updated list excluding the deleted item
      const updatedItems = items
        .filter((it: any) => it.id !== item.id)
        .map((it: any) => ({
          item_id: it.raw?.item_id ?? it.id,
          category_id:
            parseInt(String(it.raw?.category_id ?? it.category)) || it.category,
          price:
            parseFloat(String(it.raw?.price ?? (it.estimatedCost || 0))) || 0,
        }));

      deleteMutation.mutate({
        id: templateId,
        items: updatedItems,
        status: false,
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Estimated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? (
                <div className="h-8 w-24 rounded bg-gray-200 animate-pulse" />
              ) : (
                formatCurrency(totalEstimated)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? (
                <div className="h-8 w-24 rounded bg-gray-200 animate-pulse" />
              ) : (
                formatCurrency(totalActual)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {isLoading ? (
                <div className="h-8 w-24 rounded bg-gray-200 animate-pulse" />
              ) : (
                formatCurrency(remaining)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Budget Items</CardTitle>
              <CardDescription>Track expenses by category</CardDescription>
            </div>
            {items.length > 0 && (
              <Button
                variant={editMode ? "secondary" : "outline"}
                size="sm"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Done Editing" : "Edit Budget"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex-1">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="text-right w-32">
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <AddBudgetItemForm
                eventId={eventId}
                templateId={templateId}
                planMapId={planMap?.plan_event_id}
                remaining={remaining}
                editingItem={editingItem}
                onEditComplete={() => setEditingItem(null)}
              />

              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No expenses yet. Add your first budget item!
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{item.itemName}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {item.category}
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <div className="font-medium">
                          {formatCurrency(
                            item.actualCost ?? item.estimatedCost ?? 0
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.actualCost != null ? "Actual" : "Estimated"}
                        </div>
                      </div>
                      {editMode && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item)}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
