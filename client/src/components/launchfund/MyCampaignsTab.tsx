import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const MyCampaignsTab: React.FC = () => {
  return (
    <div className="py-16 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <PlusCircle className="w-6 h-6 text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Featured Campaigns
      </h3>
      <p className="mt-2 text-sm text-gray-500 max-w-xl">
        Hand-picked exceptional campaigns making a difference
      </p>

      <Button className="mt-6">
        <PlusCircle className="w-4 h-4 mr-2" /> Create Your First Campaign
      </Button>
    </div>
  );
};

export default MyCampaignsTab;
