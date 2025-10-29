import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useCorporatePricingPlans } from "@/hooks/useCorporatePricingPlans";
import PricingForm from "@/components/pricing/PricingForm";

export default function PricingTab() {
  const { data, isLoading, isError } = useCorporatePricingPlans();

  return (
    <Card className="bg-white/5 backdrop-blur-md border-white/10 p-4">
      <CardHeader>
        <CardTitle className="text-white">Pricing Plans</CardTitle>
        <p className="text-slate-300">Configure booking and price ranges</p>
      </CardHeader>
      <CardContent>
        {/* Add pricing form so admins can create plans inline */}
        <div className="mb-6">
          <PricingForm />
        </div>
        {isLoading ? (
          <p className="text-slate-300">Loading pricing plans...</p>
        ) : isError ? (
          <p className="text-red-400">Failed to load pricing plans.</p>
        ) : !data || data.length === 0 ? (
          <p className="text-slate-300">No pricing plans found.</p>
        ) : (
          <Table className="text-white">
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Plan ID</TableHead>
                <TableHead className="text-white">Min Booking Fee</TableHead>
                <TableHead className="text-white">Price Min</TableHead>
                <TableHead className="text-white">Price Max</TableHead>
                <TableHead className="text-white">Deposit</TableHead>
                <TableHead className="text-white">Payment Methods</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Created By</TableHead>
                <TableHead className="text-white">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => {
                const mapping = [
                  "Cash",
                  "Credit Card",
                  "PayPal",
                  "Venmo",
                  "Zelle",
                ];
                const paymentLabels = (p.PaymentMethods || [])
                  .map((id) => mapping[id - 1] || String(id))
                  .join(", ");

                return (
                  <TableRow key={p._id}>
                    <TableCell className="font-medium text-white">
                      {p.PricingPlans_id ?? p._id}
                    </TableCell>
                    <TableCell className="text-white">
                      ${p.MinBookingFee}
                    </TableCell>
                    <TableCell className="text-white">
                      ${p.PriceRangeMin}
                    </TableCell>
                    <TableCell className="text-white">
                      ${p.PriceRangeMax}
                    </TableCell>
                    <TableCell className="text-white">
                      {p.isDeposit ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-white">
                      {paymentLabels}
                    </TableCell>
                    <TableCell className="text-white">
                      {p.Status ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell className="text-white">
                      {p.created_by_details?.name || "—"}
                    </TableCell>
                    <TableCell className="text-white">
                      {p.CreateAt ? new Date(p.CreateAt).toLocaleString() : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
