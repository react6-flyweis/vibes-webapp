import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import { useVenuesQuery, Venue } from "@/queries/venues";
import { useToast } from "@/hooks/use-toast";

interface VenueSelectorProps {
  value?: string;
  onChange: (value: string, venue?: any) => void;
  className?: string;
}

export default function VenueSelector({ value, onChange }: VenueSelectorProps) {
  const { toast } = useToast();
  const { data, isLoading: loading, isError, error } = useVenuesQuery();

  // Convert data to a stable venues array
  const venues: Venue[] = Array.isArray(data) ? data : [];

  // Show toast once when query errors
  useEffect(() => {
    if (isError) {
      const msg = String(
        (error as any)?.message ?? error ?? "Failed to load venues"
      );
      toast({
        title: "Unable to load venues",
        description: msg,
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  return (
    <FormControl>
      <Select
        onValueChange={(val) => {
          const found = venues.find(
            (v: any) => String(v.venue_details_id ?? v._id) === String(val)
          );
          onChange(val, found);
        }}
        defaultValue={value}
      >
        <SelectTrigger className="bg-white/10 border-white/20 text-white">
          <SelectValue placeholder="Select a venue" />
        </SelectTrigger>
        <SelectContent>
          {loading && (
            <SelectItem value="__loading__" disabled>
              Loading venues...
            </SelectItem>
          )}
          {error && (
            <SelectItem value="__error__" disabled>
              Failed to load venues
            </SelectItem>
          )}
          {Array.isArray(venues) &&
            venues.length === 0 &&
            !loading &&
            !error && (
              <SelectItem value="__none__" disabled>
                No venues available
              </SelectItem>
            )}
          {Array.isArray(venues) &&
            venues.map((v: any) => (
              <SelectItem
                key={v._id ?? v.venue_details_id}
                value={String(v.venue_details_id ?? v._id)}
              >
                {v.name} {v.capacity ? `· ${v.capacity} capacity` : ""}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </FormControl>
  );
}
