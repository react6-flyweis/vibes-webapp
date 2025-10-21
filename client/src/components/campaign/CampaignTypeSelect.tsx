import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCampaignTypes } from "@/queries/useCampaignTypes";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export const CampaignTypeSelect: React.FC<Props> = ({ value, onChange }) => {
  const { data: types, isLoading, error } = useCampaignTypes();

  if (isLoading)
    return <div className="text-sm text-gray-500">Loading types...</div>;
  if (error)
    return <div className="text-sm text-red-500">Failed to load types</div>;

  return (
    <Select value={value} onValueChange={(v) => onChange(String(v))}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All Types" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        {(types || []).map((t: any) => {
          const id = t.compaign_type_id ?? t.name;
          return (
            <SelectItem key={t._id} value={String(id)}>
              <div className="flex flex-col">
                <span className="font-medium">{t.name}</span>
                <span className="text-sm text-gray-500">
                  {t.status ? "Active" : "Inactive"}
                </span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default CampaignTypeSelect;
