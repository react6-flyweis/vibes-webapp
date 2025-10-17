import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function Outreach() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Vendor Outreach Management</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Track and manage all vendor communication
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <CardContent className="flex flex-col items-center text-center">
            <div className="text-4xl text-blue-500 mb-4">✉️</div>
            <div className="text-lg font-semibold">Email Outreach</div>
            <div className="text-2xl font-bold mt-2">1247</div>
            <div className="text-sm text-muted-foreground">Total Sent</div>

            <div className="w-full mt-6 text-sm flex justify-between">
              <div className="text-left">Lead Discovered</div>
              <div className="text-right">145</div>
            </div>
            <div className="w-full mt-2">
              <Progress value={20} className="h-3" />
            </div>

            <div className="w-full mt-6">
              <Button variant="outline" className="w-full">
                View Email Campaign
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="flex flex-col items-center text-center">
            <div className="text-4xl text-purple-500 mb-4">💬</div>
            <div className="text-lg font-semibold">Social Outreach</div>
            <div className="text-2xl font-bold mt-2">355</div>
            <div className="text-sm text-muted-foreground">DMs Sent</div>

            <div className="w-full mt-6 text-sm flex justify-between">
              <div className="text-left">Response Rate</div>
              <div className="text-right">41.0%</div>
            </div>
            <div className="w-full mt-2">
              <Progress value={41} className="h-3" />
            </div>

            <div className="w-full mt-6">
              <Button variant="outline" className="w-full">
                View Social Campaign
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardContent className="flex flex-col items-center text-center">
            <div className="text-4xl text-green-500 mb-4">📞</div>
            <div className="text-lg font-semibold">Phone Outreach</div>
            <div className="text-2xl font-bold mt-2">89</div>
            <div className="text-sm text-muted-foreground">Calls Made</div>

            <div className="w-full mt-6 text-sm flex justify-between">
              <div className="text-left">Connect Rate</div>
              <div className="text-right">67.4%</div>
            </div>
            <div className="w-full mt-2">
              <Progress value={67} className="h-3" />
            </div>

            <div className="w-full mt-6">
              <Button variant="outline" className="w-full">
                View Call Log
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
