import React from "react";

import { Button } from "@/components/ui/button";
import CreateClientForm from "@/components/corporate/CreateClientForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings } from "lucide-react";
import { useCorporateClients } from "@/queries/corporateClients";

export default function ClientsTab() {
  const { data: corporateClients = [], isLoading } = useCorporateClients();

  // create mutation now handled inside CreateClientForm

  const getStatusColor = (status: string | boolean) => {
    const s =
      typeof status === "boolean" ? (status ? "active" : "suspended") : status;
    switch (s) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-300";
      case "trial":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-300";
      case "suspended":
        return "bg-red-500/20 text-red-300 border-red-300";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Corporate Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateClientForm />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {corporateClients.map((client) => (
          <Card
            key={client._id}
            className="bg-white/10 backdrop-blur-sm border-white/20"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white text-lg">
                    {client.CompanyName}
                  </CardTitle>
                  <p className="text-slate-300">{client.industry}</p>
                </div>
                <Badge
                  className={getStatusColor(
                    client.Status ? ("active" as any) : ("suspended" as any)
                  )}
                >
                  {client.Status ? "active" : "suspended"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Plan:</span>
                  <span className="text-white font-semibold">
                    {client.plan_details
                      ? `Plan ${client.plan_details.PricingPlans_id}`
                      : client.Plan_id}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Monthly Fee:</span>
                  <span className="text-white font-semibold">
                    $
                    {client.plan_details
                      ? client.plan_details.MinBookingFee
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Employees:</span>
                  <span className="text-white">{client.EmployeeCount}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Events This Month:</span>
                  <span className="text-white">-</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
