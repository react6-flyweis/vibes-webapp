import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useCreatePricingPlan from "@/mutations/useCreatePricingPlan";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "../ui/loading-button";
import { extractApiErrorMessage } from "@/lib/apiErrors";

export type PricingFormValues = {
  minBookingFee: number | "";
  priceRangeMin: number | "";
  priceRangeMax: number | "";
  depositRequired: boolean;
  paymentMethods: string[];
};

const PAYMENT_OPTIONS = ["Cash", "Credit Card", "PayPal", "Venmo", "Zelle"];

type Props = {
  defaultValues?: Partial<PricingFormValues>;
};

export default function PricingForm({ defaultValues }: Props) {
  const form = useForm<PricingFormValues>({
    defaultValues: {
      minBookingFee: 0,
      priceRangeMin: 0,
      priceRangeMax: 0,
      depositRequired: false,
      paymentMethods: [],
      ...(defaultValues || {}),
    },
  });

  const handleSubmit = async (values: PricingFormValues) => {
    // Map payment method names to ids. This is a placeholder mapping.
    // Replace with real ids or mapping logic if you have a payment-methods master list.
    const paymentMethodIds = (values.paymentMethods || [])
      .map((name) => {
        const idx = PAYMENT_OPTIONS.indexOf(name);
        return idx >= 0 ? idx + 1 : 0; // API expects numeric ids; use index+1 as example
      })
      .filter(Boolean) as number[];

    const payload = {
      MinBookingFee: Number(values.minBookingFee) || 0,
      PriceRangeMin: Number(values.priceRangeMin) || 0,
      PriceRangeMax: Number(values.priceRangeMax) || 0,
      isDeposit: !!values.depositRequired,
      PaymentMethods: paymentMethodIds,
      Status: true,
    };
    try {
      await createPricingMutation.mutateAsync(payload);
      toast({
        title: "Pricing plan created",
        description: "Pricing plan saved successfully.",
      });
    } catch (err) {
      const errorMessage = extractApiErrorMessage(err);
      toast({
        title: "Error",
        description: errorMessage || "Failed to save pricing plan",
        variant: "destructive",
      });
      form.setError("root", {
        type: "server",
        message: errorMessage || "Failed to save pricing plan",
      });
    }
  };

  const { toast } = useToast();
  const createPricingMutation = useCreatePricingPlan();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="minBookingFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 text-sm">
                  Minimum Booking Fee * ($)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={field.value as any}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="bg-white/10 border-white/10 text-white placeholder:text-slate-300 h-10 mt-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceRangeMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 text-sm">
                  Price Range Min * ($)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={field.value as any}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="bg-white/10 border-white/10 text-white placeholder:text-slate-300 h-10 mt-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceRangeMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 text-sm">
                  Price Range Max * ($)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={field.value as any}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="bg-white/10 border-white/10 text-white placeholder:text-slate-300 h-10 mt-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="depositRequired"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3 pt-2">
                <input
                  id="depositRequired"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-5 w-5 text-purple-600 bg-white/5 border-white/10 rounded"
                />
                <label
                  htmlFor="depositRequired"
                  className="text-slate-300 text-sm"
                >
                  Deposit required for bookings
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <p className="text-slate-300 text-sm mb-2">
            Accepted Payment Methods *
          </p>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_OPTIONS.map((method) => (
              <FormField
                key={method}
                control={form.control}
                name="paymentMethods"
                render={({ field }) => {
                  const active = field.value?.includes(method);
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        if (active) {
                          field.onChange(
                            field.value.filter((m: string) => m !== method)
                          );
                        } else {
                          field.onChange([...(field.value || []), method]);
                        }
                      }}
                      className={`rounded-full px-3 py-1 text-sm border ${
                        active
                          ? "bg-white/10 text-white border-white/10"
                          : "bg-transparent text-slate-300 border-white/10"
                      }`}
                    >
                      {method}
                    </button>
                  );
                }}
              />
            ))}
          </div>
        </div>

        <div className="pt-4">
          <LoadingButton
            type="submit"
            className="rounded bg-purple-600 px-4 py-2 text-white"
            isLoading={form.formState.isSubmitting}
          >
            Save Pricing
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
