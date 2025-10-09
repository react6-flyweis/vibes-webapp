import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, Bell, Heart, Share2, UserPlus } from "lucide-react";
import { TicketType } from "./types";
// Pricing helpers (moved here from shared utils to keep this component self-contained)
const calculateSubtotal = (
  selectedTickets: Record<string, number>,
  ticketTypes: any[]
) => {
  let subtotal = 0;
  Object.entries(selectedTickets).forEach(([ticketId, qty]) => {
    const t = ticketTypes.find((x) => x.id === ticketId);
    if (t) subtotal += t.price * qty;
  });
  return subtotal;
};

const calculateDiscount = (
  subtotal: number,
  promo?: { discount: number } | null
) => {
  if (!promo || !promo.discount) return 0;
  return subtotal * (promo.discount / 100);
};

const calculatePlatformFee = (subtotalAfterDiscount: number) => {
  return subtotalAfterDiscount * 0.07;
};

const calculateTotal = (
  subtotal: number,
  discount: number,
  platformFee: number
) => {
  return subtotal - discount + platformFee;
};

interface Props {
  selectedTickets: Record<string, number>;
  selectedSeats: string[];
  promo?: { discount: number } | null;
}

export default function OrderSummary({
  selectedTickets,
  selectedSeats,
  promo,
}: Props) {
  const subtotal = calculateSubtotal(selectedTickets, []);
  const discount = calculateDiscount(subtotal, promo ?? null);
  const platformFee = calculatePlatformFee(subtotal - discount);
  const total = calculateTotal(subtotal, discount, platformFee);

  return (
    <div>
      <div className="space-y-4">
        {Object.entries(selectedTickets)
          .filter(([_, q]) => q > 0)
          .map(([ticketId, quantity]) => {
            const ticket = null;
            // const ticket = ticketTypes.find((t) => t.id === ticketId);
            if (!ticket) return null;
            return (
              <div key={ticketId} className="flex justify-between">
                <div>
                  <div className="text-white font-medium">{ticket.name}</div>
                  <div className="text-blue-100 text-sm">Qty: {quantity}</div>
                </div>
                <div className="text-white font-semibold">
                  ${(ticket.price * quantity).toFixed(2)}
                </div>
              </div>
            );
          })}

        {selectedSeats.length > 0 && (
          <div className="pt-2 border-t border-white/20">
            <div className="text-white font-medium mb-1">Selected Seats</div>
            <div className="text-blue-100 text-sm">
              {selectedSeats.join(", ")}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-white/20 space-y-2">
          <div className="flex justify-between text-white">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Discount ({promo?.discount}%)</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-white">
            <span>Platform Fee (7%)</span>
            <span>${platformFee.toFixed(2)}</span>
          </div>
          <div className="pt-2 border-t border-white/20">
            <div className="flex justify-between text-lg font-semibold text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            <Heart className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Invite
          </Button>
        </div>
      </div>

      <div className="mt-4 text-xs text-blue-100">
        <div className="flex items-center gap-1 mb-1">
          <Shield className="h-3 w-3" />
          <span>Secure payment with Stripe</span>
        </div>
        <div className="flex items-center gap-1">
          <Bell className="h-3 w-3" />
          <span>Get notifications for updates</span>
        </div>
      </div>
    </div>
  );
}
