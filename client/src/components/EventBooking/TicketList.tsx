import React from "react";
import TicketItem from "./TicketItem";
import {
  EventEntryTicket,
  useAllEventEntryTicketsQuery,
} from "@/queries/tickets";

interface Props {
  selectedTickets: Record<string, number>;
  onChange: (ticket: EventEntryTicket, qty: number) => void;
}

export default function TicketList({ selectedTickets, onChange }: Props) {
  const {
    data: fetchedTickets = [],
    isLoading,
    isError,
    error,
  } = useAllEventEntryTicketsQuery();

  if (isLoading) return <div>Loading tickets...</div>;
  if (isError)
    return (
      <div className="text-red-500">
        Failed to load tickets: {(error as any)?.message || "Unknown error"}
      </div>
    );

  return (
    <div className="space-y-4">
      {fetchedTickets?.map((t) => (
        <TicketItem
          key={t.event_entry_tickets_id}
          ticket={t}
          value={selectedTickets[t.event_entry_tickets_id] || 0}
          onChange={(qty) => onChange(t, qty)}
        />
      ))}
    </div>
  );
}
