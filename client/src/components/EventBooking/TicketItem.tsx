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

interface Props {
  ticket: EventEntryTicket;
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
  return (
    <div className="p-4 border border-white/20 rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white">{ticket.title}</h3>
            <Badge className={getCategoryColor(ticket.tag)}>
              {ticket.tag?.replace("_", " ")}
            </Badge>
          </div>
          {/* <p className="text-blue-100 text-sm mb-2">{ticket.description}</p> */}
          <div className="flex flex-wrap gap-1">
            {ticket.facility?.map((facility, i) => (
              <Badge key={i} variant="outline" className="text-xs text-white">
                {facility.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">${ticket.price}</div>
          <p className="text-xs text-blue-100">
            {/* {ticket.available} */}
            available
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
            ${(ticket.price * value).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
