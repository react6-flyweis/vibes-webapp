import React from "react";
import { Crown } from "lucide-react";

const FeaturedTab: React.FC = () => {
  return (
    <div className="py-16 flex flex-col items-center text-center">
      <Crown className="w-10 h-10 text-yellow-400 mb-3" />
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Featured Campaigns
      </h3>
      <p className="mt-2 text-sm text-gray-500 max-w-xl">
        Hand-picked exceptional campaigns making a difference
      </p>
    </div>
  );
};

export default FeaturedTab;
