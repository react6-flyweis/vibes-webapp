import React from "react";
import { Card } from "@/components/ui/card";

export default function CollaborationCard() {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Collaboration</h3>
      <div className="space-y-3">
        <button className="w-full p-2 border rounded">Add Comment</button>
        <button className="w-full p-2 border rounded">Report Issue</button>
        <button className="w-full p-2 border rounded">Version History</button>
      </div>
    </Card>
  );
}
