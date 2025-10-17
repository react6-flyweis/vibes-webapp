import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Automation() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">CRM Automation Rules</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Set up automated actions for different pipeline stages
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                ✉️
              </div>
              <div className="text-xl font-semibold">Email Sequences</div>
              <div className="text-sm text-muted-foreground">
                Automated email follow-ups based on vendor behavior
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>Lead Discovered</div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>Non-Responder Follow-up</div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>Onboarding Sequence</div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full">
                Configure Sequences
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                🎯
              </div>
              <div className="text-xl font-semibold">Lead Scoring</div>
              <div className="text-sm text-muted-foreground">
                AI-powered vendor qualification and prioritization
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>Platform Quality Score</div>
                <div className="px-3 py-1 border rounded">20pts</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Product Fit Score</div>
                <div className="px-3 py-1 border rounded">20pts</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Engagement Score</div>
                <div className="px-3 py-1 border rounded">20pts</div>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full">
                Adjust Scoring
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
