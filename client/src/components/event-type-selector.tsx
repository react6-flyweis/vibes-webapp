import React from "react";
import { Card } from "@/components/ui/card";
import { DollarSign, Users } from "lucide-react";

type Props = {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
};

const data: {
  code: string;
  name: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
}[] = [
  {
    code: "public",
    name: "Public Ticketed Events",
    Icon: DollarSign,
    description: "Concerts, festivals, shows, workshops with ticket sales",
  },
  {
    code: "private",
    name: "Private Party Planning",
    Icon: Users,
    description: "Weddings, birthdays, corporate events, private celebrations",
  },
];

export default function EventTypeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((it) => {
        const val = String(it.code || "");
        const active = value === val;

        return (
          <Card
            key={it.code}
            className={`p-6 cursor-pointer transition-all ${
              active
                ? "bg-purple-500/30 border-purple-400 scale-105"
                : "bg-white/5 border-white/20 hover:bg-white/10"
            }`}
            onClick={() => onChange(val)}
          >
            <div className="text-center">
              <div className="w-12 h-12 text-2xl mx-auto mb-3">
                {it.Icon ? (
                  <it.Icon className="w-12 h-12 mx-auto text-white/90" />
                ) : (
                  <span className="text-2xl">✨</span>
                )}
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {it.name ?? it.code ?? val}
              </h4>
              {it.description && (
                <p className="text-purple-200 text-sm">{it.description}</p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
