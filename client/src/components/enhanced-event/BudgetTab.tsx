import React from "react";
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

export default function BudgetTab({
  eventId,
  planMap,
}: {
  eventId: string;
  planMap: PlanEventMapData;
}) {
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  // if planMap contains budget_items_id (array), pick first id and fetch that template
  const templateId = Array.isArray(planMap?.budget_items_id)
    ? planMap.budget_items_id[0]
    : undefined;

  const { data: budgetData, isLoading } = useMasterBudgetItemsById(
    templateId as number | undefined
  );

  const items = budgetData?.items ?? [];

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
                // TODO: wire up real summary values
                0
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
                0
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
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Items</CardTitle>
          <CardDescription>Track expenses by category</CardDescription>
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
              <AddBudgetItemForm eventId={eventId} templateId={templateId} />

              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No expenses yet. Add your first budget item!
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white"
                    >
                      <div>
                        <h4 className="font-medium">{item.itemName}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {item.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {item.actualCost
                            ? formatCurrency(item.actualCost)
                            : formatCurrency(
                                item.estimatedCost ||
                                  (item.price
                                    ? Math.round(item.price * 100)
                                    : 0)
                              )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.actualCost ? "Actual" : "Estimated"}
                        </div>
                      </div>
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
