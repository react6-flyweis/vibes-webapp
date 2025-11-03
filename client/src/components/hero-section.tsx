import { EventData } from "@/queries/events";
import { Guest } from "@/queries/guests";
import { PlanEventMapData } from "@/queries/planEventMaps";

interface HeroSectionProps {
  event: EventData;
  guests?: Guest[];
  planMap?: PlanEventMapData;
}

export default function HeroSection({
  event,
  guests,
  planMap,
}: HeroSectionProps) {
  // Derive items from the planMap prop in a defensive way. Different shapes are
  // possible depending on how plan maps are loaded/stored, so check common
  // patterns: `planMap.items` or `planMap.plans[].items`.
  const itemsFromPlanMap: any[] = (() => {
    if (!planMap) return [];
    const pm: any = planMap as any;

    // direct items array
    if (Array.isArray(pm.items)) return pm.items;

    // plans array with items per plan
    if (Array.isArray(pm.plans)) {
      return pm.plans.flatMap((p: any) =>
        Array.isArray(p.items) ? p.items : []
      );
    }

    // fallback: try to find any array-valued property that looks like items
    for (const key of Object.keys(pm)) {
      if (Array.isArray(pm[key])) return pm[key];
    }

    return [];
  })();

  const totalItems = itemsFromPlanMap.length;

  const completedCount = itemsFromPlanMap.filter((it: any) => {
    // handle a few common completed indicators
    return Boolean(
      it.completed ||
        it.isCompleted ||
        it.done ||
        it.status === "done" ||
        it.status === "completed"
    );
  }).length;

  const completionPercentage =
    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <div className="w-full">
      <div
        className="max-w-7xl mx-auto flex flex-col justify-center items-center px-4 py-8 md:py-16 rounded-lg"
        style={{
          background:
            "linear-gradient(90deg, #9333EA 0%, #DB2777 50%, #F97316 100%)",
        }}
      >
        {/* Event Title & Description */}
        <div className="text-center text-white mb-8 px-2 sm:px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {event.name_title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl">{event.description}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {/* Confirmed */}
          <div className="bg-white/20 backdrop-blur-xs rounded-lg p-4 flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {guests?.length || 0}
            </div>
            <div className="text-sm sm:text-base text-white">Confirmed</div>
          </div>

          {/* Date */}
          <div className="bg-white/20 backdrop-blur-xs rounded-lg p-4 flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {event.date?.split(",")[1]?.trim().split(" ")[0] || "Dec 15"}
            </div>
            <div className="text-sm sm:text-base text-white">Date</div>
          </div>

          {/* Menu Items */}
          <div className="bg-white/20 backdrop-blur-xs rounded-lg p-4 flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {totalItems || 0}
            </div>
            <div className="text-sm sm:text-base text-white">Menu Items</div>
          </div>

          {/* Completion */}
          <div className="bg-white/20 backdrop-blur-xs rounded-lg p-4 flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {completionPercentage}%
            </div>
            <div className="text-sm sm:text-base text-white">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
}
