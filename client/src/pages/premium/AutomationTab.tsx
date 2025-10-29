import React from "react";
import type { Reports } from "@/api/premiumDashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mail, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const cardClasses =
  "bg-white/10 text-slate-200 border-slate-700 backdrop-blur-xs";

export default function AutomationTab({
  automation,
}: {
  automation?: Reports["automation"];
}) {
  const { toast } = useToast();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className={cardClasses}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-500" />
            RSVP Automation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Auto-reminders</span>
            <Badge className="bg-green-500 text-white">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Follow-up messages</span>
            <Badge className="bg-green-500 text-white">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Thank you notes</span>
            <Badge className="text-white" variant="outline">
              Setup Required
            </Badge>
          </div>
          <Button
            className="w-full"
            onClick={() =>
              toast({
                title: "Automation Configured",
                description:
                  "RSVP automation settings have been updated successfully.",
              })
            }
          >
            Configure Automation
          </Button>
        </CardContent>
      </Card>

      <Card className={cardClasses}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Smart Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Low RSVP alerts</span>
            <Badge className="bg-green-500 text-white">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Budget overrun warnings</span>
            <Badge className="bg-green-500 text-white">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Task deadline alerts</span>
            <Badge className="text-white" variant="outline">
              Setup Required
            </Badge>
          </div>
          <Button
            className="w-full"
            onClick={() =>
              toast({
                title: "Notifications Updated",
                description: "Smart notification preferences have been saved.",
              })
            }
          >
            Manage Notifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
