import React from "react";
import {
  useEventSetupRequirementsQuery,
  SetupRequirement,
} from "@/queries/eventSetupRequirements";

export function SetupRequirements() {
  const { data: setupRequirements = [], isLoading } =
    useEventSetupRequirementsQuery();

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Setup Requirements</h3>
      <div className="space-y-2">
        {isLoading ? (
          <div className="p-2 text-sm text-gray-500">Loading...</div>
        ) : setupRequirements && setupRequirements.length > 0 ? (
          setupRequirements.map((req: SetupRequirement) => (
            <div
              key={req._id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-3">
                <div className="text-xl">{req.emozi || "🔧"}</div>
                <div>
                  <div className="text-sm font-medium">{req.name}</div>
                  <div className="text-xs text-gray-500">
                    Qty: {req.quantity ?? "—"}
                  </div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  req.status
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {req.status ? "Confirmed" : "Pending"}
              </span>
            </div>
          ))
        ) : (
          <div className="p-2 text-sm text-gray-500">
            No setup requirements found.
          </div>
        )}
      </div>
    </div>
  );
}
