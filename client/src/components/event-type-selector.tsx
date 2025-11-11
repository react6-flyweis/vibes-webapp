import React from "react";
import { useEventTypesQuery, EventType } from "@/queries/event-types";
import { Card } from "@/components/ui/card";

type EventTypeItem = EventType;

type Props = {
  value?: string;
  onChange: (value: string, item?: EventTypeItem) => void;
  className?: string;
};

export default function EventTypeSelector({ value, onChange }: Props) {
  const { data, isLoading, isError } = useEventTypesQuery();

  // Show a single skeleton card while loading to avoid layout shift
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 md:col-span-2 bg-white/5 border-white/10">
          <div className="flex flex-col items-center gap-3 animate-pulse">
            <div className="w-12 h-12 bg-white/20 rounded-full" />
            <div className="w-3/4 h-5 bg-white/20 rounded" />
            <div className="w-1/2 h-4 bg-white/10 rounded" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {isError && (
        <div className="md:col-span-2 text-sm text-red-300">
          Error loading event types — using defaults
        </div>
      )}

      {data?.map((it) => {
        const val = String(it.event_type_id || "");
        const active = value === val;

        return (
          <Card
            key={it.event_type_id}
            className={`p-6 cursor-pointer transition-all ${
              active
                ? "bg-purple-500/30 border-purple-400 scale-105"
                : "bg-white/5 border-white/20 hover:bg-white/10"
            }`}
            onClick={() => onChange(val, it)}
          >
            <div className="text-center">
              <div className="w-12 h-12 text-2xl mx-auto mb-3">
                {it.emozi ?? "✨"}
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {it.name ?? it.code ?? val}
              </h4>
              <p className="text-purple-200 text-sm">Select this event type</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
