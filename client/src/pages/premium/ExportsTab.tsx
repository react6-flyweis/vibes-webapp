import React from "react";
import type { Reports } from "@/api/premiumDashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const cardClasses =
  "bg-white/10 text-slate-200 border-slate-700 backdrop-blur-xs";

// const downloadCSV = (filename: string, data: string) => {
//   const blob = new Blob([data], { type: "text/csv" });
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   a.click();
//   toast({
//     title: "Export Complete",
//     description: `${filename} has been downloaded.`,
//   });
// };

export default function ExportsTab({
  exportsReport,
}: {
  exportsReport?: Reports["export_tools"];
}) {
  const { toast } = useToast();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className={`${cardClasses} text-black`}>
        <CardHeader>
          <CardTitle className="text-white">Export Options</CardTitle>
          <CardDescription className="text-white">
            Download your event data in various formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Guest List (PDF/CSV)
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Menu & Contributions
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Budget Report
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Event Schedule
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Analytics Report
          </Button>
        </CardContent>
      </Card>

      <Card className={`${cardClasses} text-black`}>
        <CardHeader>
          <CardTitle className="text-white">Print-Ready Templates</CardTitle>
          <CardDescription className="text-white">
            Professional printables for your events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Welcome Signs
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Menu Cards
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Place Cards
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Thank You Cards
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Event Timeline
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
