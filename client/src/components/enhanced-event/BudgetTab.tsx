import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function BudgetTab({ budget, budgetSummary, newBudgetItem, setNewBudgetItem, newBudgetCategory, setNewBudgetCategory, newBudgetCost, setNewBudgetCost, onCreateBudgetItem }: any) {
  const formatCurrency = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Estimated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(budgetSummary.totalEstimated || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(budgetSummary.totalActual || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency((budgetSummary.totalEstimated || 0) - (budgetSummary.totalActual || 0))}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Items</CardTitle>
          <CardDescription>Track expenses by category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3">Add Budget Item</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input placeholder="Item name..." value={newBudgetItem} onChange={(e: any) => setNewBudgetItem(e.target.value)} />
              <Select value={newBudgetCategory} onValueChange={setNewBudgetCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="drinks">Drinks</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="decorations">Decorations</SelectItem>
                  <SelectItem value="rentals">Rentals</SelectItem>
                  <SelectItem value="venue">Venue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Cost ($)" value={newBudgetCost} onChange={(e: any) => setNewBudgetCost(e.target.value)} />
              <Button onClick={onCreateBudgetItem} disabled={!newBudgetItem.trim() || !newBudgetCategory || !newBudgetCost}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {budget.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No expenses yet. Add your first budget item!</div>
          ) : (
            <div className="space-y-3">
              {budget.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div>
                    <h4 className="font-medium">{item.itemName}</h4>
                    <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.actualCost ? formatCurrency(item.actualCost) : formatCurrency(item.estimatedCost || 0)}</div>
                    <div className="text-sm text-gray-500">{item.actualCost ? 'Actual' : 'Estimated'}</div>
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
