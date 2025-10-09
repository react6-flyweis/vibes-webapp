import React from "react";
import { Ticket, MapPin, CreditCard, CheckCircle } from "lucide-react";

export type StepItem = {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
};

interface Props {
  steps?: StepItem[];
  current: string;
}

export default function Stepper({
  steps = [
    { key: "tickets", label: "Select Tickets", icon: Ticket },
    { key: "seats", label: "Choose Seats", icon: MapPin },
    { key: "checkout", label: "Checkout", icon: CreditCard },
    { key: "confirmation", label: "Confirmation", icon: CheckCircle },
  ],
  current,
}: Props) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((stepItem, index) => {
          const IconComponent = stepItem.icon;
          const isActive = current === stepItem.key;
          const isCompleted =
            ["tickets", "seats", "checkout", "confirmation"].indexOf(current) >
            index;

          return (
            <div key={stepItem.key} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive
                    ? "border-blue-400 bg-blue-400"
                    : isCompleted
                    ? "border-green-400 bg-green-400"
                    : "border-gray-400 bg-transparent"
                }`}
              >
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <span
                className={`ml-2 text-sm ${
                  isActive ? "text-blue-400" : "text-gray-300"
                }`}
              >
                {stepItem.label}
              </span>
              {index < steps.length - 1 && (
                <div className="w-8 h-px bg-gray-400 ml-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
