import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  useEventTicketSeatsQuery,
  getBookedSeatNumbers,
} from "@/queries/eventSeats";

interface Props {
  selectedSeats: string[];
  onChange: (seats: string[]) => void;
  requiredCount: number;
  eventId?: number | string;
  onBack?: () => void;
  onContinue?: () => void;
  reserving?: boolean;
}

export default function SeatSelection({
  selectedSeats,
  onChange,
  requiredCount,
  eventId,
  onBack,
  onContinue,
  reserving = false,
}: Props) {
  // Parse eventId (component accepts number|string)
  const parsedEventId =
    typeof eventId === "undefined" || eventId === null
      ? undefined
      : Number(eventId);

  const {
    data: seats = [],
    isLoading: loading,
    error,
  } = useEventTicketSeatsQuery(
    typeof parsedEventId === "number" && !Number.isNaN(parsedEventId)
      ? parsedEventId
      : undefined
  );

  const occupiedNumbers = useMemo(() => {
    const set = new Set<number>();
    const apiSet = getBookedSeatNumbers(seats);
    apiSet.forEach((s) => {
      const n = Number(s);
      if (!Number.isNaN(n)) set.add(n);
    });
    return set;
  }, [seats]);

  const toggleSeat = (seatIndex: number) => {
    // seatIndex is numeric id (1..100)
    if (occupiedNumbers.has(seatIndex)) return;

    const normalize = (s: string | number) => {
      if (typeof s === "number") return s;
      // allow strings like 'A12' or '12'
      const asNum = Number(String(s).replace(/^A/i, ""));
      return Number.isNaN(asNum) ? null : asNum;
    };

    const isSelected = selectedSeats.some((s) => normalize(s) === seatIndex);

    if (isSelected) {
      onChange(selectedSeats.filter((s) => normalize(s) !== seatIndex));
    } else if (selectedSeats.length < requiredCount) {
      // add numeric id (per request: also add it as number)
      onChange([...selectedSeats, seatIndex.toString()]);
    }
  };

  // If any of the currently selected seats become occupied (from API), remove them
  useEffect(() => {
    if (!selectedSeats || selectedSeats.length === 0) return;

    const normalize = (s: string | number) => {
      if (typeof s === "number") return s;
      const asNum = Number(String(s).replace(/^A/i, ""));
      return Number.isNaN(asNum) ? null : asNum;
    };

    const conflicted = selectedSeats
      .map(normalize)
      .filter(
        (n): n is number => typeof n === "number" && occupiedNumbers.has(n)
      );

    if (conflicted.length > 0) {
      onChange(
        selectedSeats.filter((s) => {
          const n = normalize(s);
          return !(typeof n === "number" && occupiedNumbers.has(n));
        })
      );
    }
  }, [seats]);

  return (
    <div>
      <div className="mb-6">
        <div className="bg-linear-to-b from-purple-600 to-purple-800 p-4 rounded text-center mb-4">
          <h3 className="text-white font-semibold">STAGE</h3>
        </div>

        <div className="grid grid-cols-10 gap-1 max-w-md mx-auto">
          {Array.from({ length: 100 }, (_, i) => {
            const seatIndex = i + 1; // numeric id
            const seatLabel = `A${seatIndex}`; // visual label

            const normalize = (s: string | number) => {
              if (typeof s === "number") return s;
              const asNum = Number(String(s).replace(/^A/i, ""));
              return Number.isNaN(asNum) ? null : asNum;
            };

            const isSelected = selectedSeats.some(
              (s) => normalize(s) === seatIndex
            );
            const isOccupied = occupiedNumbers.has(seatIndex);

            return (
              <button
                key={seatLabel}
                onClick={() => toggleSeat(seatIndex)}
                disabled={isOccupied}
                aria-pressed={isSelected}
                aria-label={`Seat ${seatLabel} ${
                  isOccupied
                    ? "occupied"
                    : isSelected
                    ? "selected"
                    : "available"
                }`}
                className={`w-6 h-6 rounded text-xs font-semibold transition-colors ${
                  isOccupied
                    ? "bg-red-500 cursor-not-allowed"
                    : isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                }`}
              >
                {seatIndex}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Occupied</span>
          </div>
        </div>

        {loading && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            Loading booked seats...
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="bg-white/20! text-white hover:bg-white/10"
        >
          Back to Tickets
        </Button>
        <Button
          onClick={onContinue}
          disabled={
            selectedSeats.length !== requiredCount || Boolean(reserving)
          }
          className="bg-blue-600 hover:bg-blue-700"
        >
          {reserving ? "Reserving..." : "Continue to Checkout"}
        </Button>
      </div>
    </div>
  );
}
