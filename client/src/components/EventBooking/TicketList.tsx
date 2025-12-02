import React from "react";
import TicketItem from "./TicketItem";
// import { EventEntryTicket } from "@/queries/tickets";
import { IEventTicket } from "@/hooks/useEvents";

interface Props {
  selectedTickets: Record<string, number>;
  onChange: (ticket: any, qty: number) => void;
  tickets: IEventTicket[];
}

export default function TicketList({
  selectedTickets,
  onChange,
  tickets,
}: Props) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-yellow-400 p-4 text-center">
        No tickets available for this event.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((t, i) => (
        <TicketItem
          key={t._id}
          ticket={{ ...t, ...t.ticketDateils?.[i] }}
          value={selectedTickets[t.ticket_id] || 0}
          onChange={(qty) => onChange(t, qty)}
        />
      ))}
    </div>
  );
}
