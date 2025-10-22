import React from "react";

type Props = {
  steps: string[];
  current: number;
};

export default function StepProgress({ steps, current }: Props) {
  const percent = Math.round(((current + 1) / steps.length) * 100);
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="font-medium">Registration Progress</div>
        <div className="text-sm">{percent}%</div>
      </div>

      <div className="w-full bg-gray-100 h-2 rounded mt-3 overflow-hidden">
        <div
          className="h-2 bg-gradient-to-r from-violet-400 to-violet-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-6">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 text-center">
            <div
              className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                i <= current
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <div
              className={`text-xs mt-2 ${
                i <= current ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {s}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
