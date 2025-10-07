import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddBudgetItemForm from "./AddBudgetItemForm";
import { useMasterBudgetItems } from "@/queries/masterBudgetItems";

export default function BudgetTab({ eventId }: { eventId?: string }) {
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  // master templates via extracted hook
  const { data: masterBudgetData, isLoading: masterLoading } =
    useMasterBudgetItems();

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
              {/* {formatCurrency(budgetSummary.totalEstimated || 0)} */}0
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {/* {formatCurrency(budgetSummary.totalActual || 0)} */}0
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {/* {formatCurrency((budgetSummary.totalEstimated || 0) - (budgetSummary.totalActual || 0))} */}
              0
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
          <AddBudgetItemForm eventId={eventId} />

          {masterBudgetData?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No expenses yet. Add your first budget item!
            </div>
          ) : (
            <div className="space-y-3">
              {masterBudgetData?.map((item: any) => (
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
                        : formatCurrency(item.estimatedCost || 0)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.actualCost ? "Actual" : "Estimated"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
