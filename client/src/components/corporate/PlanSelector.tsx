import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCorporatePricingPlans } from "@/queries/corporatePricingPlans";

interface PlanSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function PlanSelector({
  value,
  onChange,
  className,
  placeholder = "Select Plan",
  disabled = false,
}: PlanSelectorProps) {
  const {
    data: pricingPlans = [],
    isLoading,
    isError,
  } = useCorporatePricingPlans();

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={
          (className ?? "") + " bg-white/10 border-white/20 text-white"
        }
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <div className="p-3 text-slate-300">Loading plans...</div>
        )}
        {isError && (
          <div className="p-3 text-rose-400">Failed to load plans</div>
        )}
        {!isLoading && pricingPlans.length === 0 && (
          <div className="p-3 text-slate-300">No plans available</div>
        )}
        {pricingPlans.map((plan: any) => (
          <SelectItem
            key={plan._id}
            value={String(plan.PricingPlans_id ?? plan._id)}
          >
            ${plan.PriceRangeMin} - ${plan.PriceRangeMax} (Min Fee $
            {plan.MinBookingFee})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
