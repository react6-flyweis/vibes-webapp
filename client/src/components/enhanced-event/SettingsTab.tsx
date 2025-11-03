import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUpdatePlanEventMap } from "@/mutations/planEventMap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PriceConfirmationDialog from "@/components/PriceConfirmationDialog";
import PaymentDialog from "@/components/enhanced-event/PaymentDialog";
import InvitationSuccessDialog from "@/components/InvitationSuccessDialog";
import useCreateEventPayment, {
  CreateEventPaymentPayload,
  PaymentIntent,
} from "@/mutations/useCreateEventPayment";
import EventTypeSelector from "@/components/event-type-select";
import { Input } from "@/components/ui/input";
import ThemeSelector from "@/components/theme-selector";
import DressCodeSelector from "@/components/dress-code-selector";
import { PlanEventMapData } from "@/queries/planEventMaps";
import { EventData } from "@/queries/events";

export default function SettingsTab({
  event,
  planMap,
}: {
  event: EventData;
  planMap?: PlanEventMapData;
}) {
  console.log("SettingsTab planMap:", planMap);
  const { toast } = useToast();

  // UI state
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>();
  const [selectedEventType, setSelectedEventType] = useState<
    string | undefined
  >();
  const [selectedDressCode, setSelectedDressCode] = useState<
    string | undefined
  >();

  // Payment dialog shown after successful save
  // first show a simple confirmation `PaymentDialog`; when user proceeds,
  // open the full `PriceConfirmationDialog` with methods/Stripe.
  const [showPrePaymentDialog, setShowPrePaymentDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [priceEstimate, setPriceEstimate] = useState<number>(99.99);

  const createEventPaymentMutation = useCreateEventPayment();
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);

  const eid = planMap?.event_id ?? event?.event_id ?? event?._id ?? null;

  const updatePlanMapMutation = useUpdatePlanEventMap({
    onSuccess: () => {
      toast({ title: "Settings saved", description: "Plan map updated." });
      // open payment dialog after saving
      setPriceEstimate(99.99);
      // show a lightweight pre-payment confirmation first
      setShowPrePaymentDialog(true);
    },
    onError: (err: any) => {
      toast({
        title: "Save failed",
        description: (err && err.message) || "Failed to update plan map.",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Event Settings</CardTitle>
          <CardDescription>
            Configure event details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Type
              </label>
              <EventTypeSelector
                event={event}
                value={selectedEventType}
                onChange={(v: string) => setSelectedEventType(v)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <ThemeSelector
                value={selectedTheme}
                onChange={(v) => setSelectedTheme(v)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Dress Code
              </label>
              <DressCodeSelector
                value={selectedDressCode}
                onChange={(v) => setSelectedDressCode(v)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Music Playlist URL
              </label>
              <Input
                type="url"
                placeholder="Spotify, Apple Music, or YouTube playlist URL..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Total Budget
              </label>
              <Input type="number" placeholder="Enter total budget..." />
            </div>

            <Button
              className="w-full"
              onClick={() => {
                if (!eid) {
                  toast({
                    title: "Missing event id",
                    description: "Cannot save settings: event id is missing.",
                    variant: "destructive",
                  });
                  return;
                }
                const pmId = planMap?.plan_event_id ?? "";
                updatePlanMapMutation.mutate({ id: pmId, event_id: eid });
              }}
              disabled={updatePlanMapMutation.isPending}
            >
              {updatePlanMapMutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <PaymentDialog
        open={showPrePaymentDialog}
        onOpenChange={setShowPrePaymentDialog}
        amount={priceEstimate}
        onPay={() => {
          // When user proceeds from the lightweight dialog, open the full flow
          setShowPrePaymentDialog(false);
          setShowPaymentDialog(true);
        }}
      />

      <PriceConfirmationDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        priceEstimate={priceEstimate}
        onConfirm={(payment) => {
          // payment reached a terminal "confirmed" state
          toast({
            title: "Payment confirmed",
            description: `Payment successful`,
          });
          setShowPaymentDialog(false);
          // show the invitation success dialog with GIF
          setShowInviteSuccess(true);
          console.log("Payment confirmed from SettingsTab:", payment);
        }}
        onPrevious={() => setShowPaymentDialog(false)}
        onMethodSelect={async (method: number) => {
          if (!eid) {
            throw new Error("Missing event id");
          }

          const payload: CreateEventPaymentPayload = {
            amount: priceEstimate || 0,
            payment_method_id: method,
            billingDetails: "EventSettings",
            event_id: Number(eid) ?? 0,
          };

          const res = await createEventPaymentMutation.mutateAsync(payload);
          const apiPayload = res?.data?.data ?? res?.data ?? res;

          if (apiPayload?.amount) setPriceEstimate(Number(apiPayload.amount));

          const paymentIntent: PaymentIntent = {
            id: apiPayload.payment_intent_id,
            clientSecret: apiPayload.client_secret ?? "",
            amount: apiPayload.amount,
            currency: apiPayload.currency,
            status: apiPayload.status || apiPayload.payment_status,
          };

          return paymentIntent;
        }}
      />
      <InvitationSuccessDialog
        open={showInviteSuccess}
        onOpenChange={setShowInviteSuccess}
      />
    </>
  );
}
