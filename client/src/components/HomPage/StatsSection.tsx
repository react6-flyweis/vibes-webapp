import React from "react";

interface StatItem {
  value: string;
  label: string;
  color: string;
}

const StatsSection: React.FC = () => {
  const stats: StatItem[] = [
    {
      value: "3,847+",
      label: "Active Vendors",
      color: "text-purple-700",
    },
    {
      value: "95.2%",
      label: "Satisfaction Rate",
      color: "text-blue-700",
    },
    {
      value: "$2.4M",
      label: "Monthly Transactions",
      color: "text-purple-700",
    },
    {
      value: "24/7",
      label: "Mobile Access",
      color: "text-blue-700",
    },
  ];

  return (
    <div className="w-full flex justify-center px-6 py-10">
      {/* Outer gradient wrapper */}
      <div className="w-full container rounded-2xl p-[2px] bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
        {/* Inner card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 p-8">
          {stats.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-gray-600 text-sm mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
