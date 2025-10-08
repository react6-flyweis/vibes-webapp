import { useEventAmenitiesQuery, EventAmenity } from "@/queries/eventAmenities";

export function VenueAmenities({
  amenitiesEnabled,
}: {
  amenitiesEnabled?: number[] | null;
}) {
  const { data: apiAmenities, isLoading, isError } = useEventAmenitiesQuery();

  // Build a set of enabled amenity ids from the plan map prop
  const enabledIds = new Set<number>(
    (amenitiesEnabled ?? []).filter(Boolean) as number[]
  );

  const items: {
    name: string;
    id?: number;
    image?: string | null;
    emoji?: string | null;
    available: boolean;
  }[] = [];

  if (isLoading) {
    // simple loading skeleton
    return (
      <div>
        <h3 className="font-semibold text-lg mb-2">Amenities</h3>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-6 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h3 className="font-semibold text-lg mb-2">Amenities</h3>
        <div className="text-red-600">Failed to load amenities</div>
      </div>
    );
  }

  // Normalize API amenities
  (apiAmenities ?? []).forEach((a: EventAmenity) => {
    // If enabledIds provided and non-empty, use it to determine availability for this event.
    // Otherwise, fall back to the amenity's global `status` flag.
    const available =
      enabledIds.size > 0
        ? enabledIds.has(a.event_amenities_id ?? -1)
        : !!a.status;
    items.push({
      name: a.name,
      id: a.event_amenities_id ?? undefined,
      image: a.image,
      emoji: a.emoji,
      available,
    });
  });

  // If API returned nothing, show an empty state
  const isEmpty = items.length === 0;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Amenities</h3>
      {isEmpty ? (
        <div className="text-sm text-gray-500">No amenities available</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {items.map((amenity) => (
            <div key={amenity.name} className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  amenity.available ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span
                className={`text-sm ${
                  !amenity.available ? "text-gray-400" : ""
                }`}
              >
                {amenity.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
