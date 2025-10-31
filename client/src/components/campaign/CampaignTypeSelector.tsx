import React from "react";
import { useCampaignTypes } from "@/queries/useCampaignTypes";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export function CampaignTypeSelector({ value, onChange }: Props) {
  const { data: types, isLoading, error } = useCampaignTypes();

  return (
    <div className="mt-2">
      {isLoading ? (
        <div className="text-sm text-gray-500">Loading types...</div>
      ) : error ? (
        <div className="text-sm text-red-500">Failed to load types</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 mt-2">
          {(types || []).map((t: any) => {
            const id = t.compaign_type_id ?? t._id;
            const idStr = id !== undefined && id !== null ? String(id) : "";
            const selected =
              String(value) === idStr || String(value) === String(t.name);
            return (
              <button
                key={t._id}
                type="button"
                onClick={() => onChange(idStr)}
                className={`w-full text-left p-4 border  ${
                  selected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-gray-500">
                  {t.status ? "Active" : "Inactive"}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
