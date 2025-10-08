import { EventData } from "@/queries/events";

interface HeroSectionProps {
  event: EventData;
  stats?: {
    confirmedCount: number;
    totalItems: number;
    itemsByCategory: Record<string, { completed: number; total: number }>;
  };
}

export default function HeroSection({ event, stats }: HeroSectionProps) {
  const completionPercentage = stats?.totalItems
    ? Math.round(
        (Object.values(stats.itemsByCategory).reduce(
          (acc, cat) => acc + cat.completed,
          0
        ) /
          stats.totalItems) *
          100
      )
    : 0;

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
              {stats?.confirmedCount || 0}
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
              {stats?.totalItems || 0}
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
