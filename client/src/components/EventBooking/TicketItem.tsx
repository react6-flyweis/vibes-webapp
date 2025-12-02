import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventEntryTicket } from "@/queries/tickets";
import { IEventTicket } from "@/hooks/useEvents";

interface Props {
  ticket: EventEntryTicket | IEventTicket | any;
  value: number;
  onChange: (qty: number) => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "general":
      return "text-blue-600 bg-blue-100";
    case "vip":
      return "text-purple-600 bg-purple-100";
    case "premium":
      return "text-gold-600 bg-yellow-100";
    case "early_bird":
      return "text-green-600 bg-green-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export default function TicketItem({ ticket, value, onChange }: Props) {
  const title = ticket.query || `Ticket #${ticket.ticket_id}`;
  const price = ticket.price || 0;
  const tag = ticket.tag || "general";
  const facility = ticket.facility || [];
  const maxCapacity = ticket.max_capacity || ticket.total_seats || 100;

  return (
    <div className="p-4 border border-white/20 rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white">{title}</h3>
            <Badge className={getCategoryColor(tag)}>
              {tag?.replace("_", " ")}
            </Badge>
          </div>
          {/* <p className="text-blue-100 text-sm mb-2">{ticket.description}</p> */}
          <div className="flex flex-wrap gap-1">
            {facility?.map((facility: any, i: number) => (
              <Badge key={i} variant="outline" className="text-xs text-white">
                {facility.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">${price}</div>
          <p className="text-xs text-blue-100">
            {/* {ticket.available} */}
            {maxCapacity} available
            {/* max capacity */}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Select
          value={value.toString()}
          onValueChange={(v) => onChange(parseInt(v))}
        >
          <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {/* {Array.from(
              { length: Math.min(ticket.maxPerUser + 1, ticket.available + 1) },
              (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i === 0 ? "None" : `${i} ticket${i > 1 ? "s" : ""}`}
                </SelectItem>
              )
            )} */}
            {Array.from({ length: 6 }, (_, i) => (
              <SelectItem key={i} value={i.toString()}>
                {i === 0 ? "None" : `${i} ticket${i > 1 ? "s" : ""}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {value > 0 && (
          <div className="text-green-400 font-semibold">
            ${(price * value).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
