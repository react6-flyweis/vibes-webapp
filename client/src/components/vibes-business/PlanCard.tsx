import React from "react";

type Plan = {
  _id: string;
  planDuration?: string;
  plan_name?: string;
  price?: number | string;
  description?: string;
  line_one?: string;
  line_two?: string;
  line_three?: string;
  line_four?: string;
  line_five?: string;
  line_six?: string;
};

type Props = {
  plan: Plan;
  onSelect: () => void;
};

const PlanCard: React.FC<Props> = ({ plan, onSelect }) => {
  return (
    <div className="card bg-gray-900 bg-opacity-70 rounded-xl p-6 shadow-2xl text-white">
      <div className="mb-4">
        <div className="text-sm opacity-80">{plan.planDuration}</div>
        <div className="text-3xl font-extrabold">{plan.plan_name}</div>
        <div className="text-2xl font-bold mt-2">
          ${plan.price}
          <span className="text-sm">/{plan.planDuration}</span>
        </div>
      </div>

      {plan.description && (
        <p className="text-sm opacity-80 mb-4">{plan.description}</p>
      )}

      <ul className="space-y-2 mb-6">
        {[
          plan.line_one,
          plan.line_two,
          plan.line_three,
          plan.line_four,
          plan.line_five,
          plan.line_six,
        ]
          .filter(Boolean)
          .map((line, i) => (
            <li key={i} className="flex items-start">
              <span className="text-pink-400 mr-3">✓</span>
              <span className="opacity-80">{line}</span>
            </li>
          ))}
      </ul>

      <button
        onClick={onSelect}
        className="w-full bg-blue-700 text-white py-2 rounded-full font-semibold"
      >
        Select plan
      </button>
    </div>
  );
};

export default PlanCard;
