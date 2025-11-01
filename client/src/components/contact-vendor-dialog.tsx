import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { useContactVendor } from "@/hooks/useContactVendor";
import { extractApiErrorMessage } from "@/lib/apiErrors";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/hooks/use-toast";
import SuccessDialog from "./SuccessDialog";

type Props = {
  vendorId: number | string;
  userId?: number | null;
  eventId?: number | null;
  trigger?: React.ReactNode;
};

const contactSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  description: z.string().min(1, "Description is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactVendorDialog({
  vendorId,
  eventId,
  trigger,
}: Props) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const user = useAuthStore((s) => s.user);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { topic: "", description: "" },
  });

  const contact = useContactVendor();

  const onSubmit = async (values: ContactFormValues) => {
    const payload = {
      vendor_id: Number(vendorId),
      user_id: Number(user?.user_id ?? 0),
      event_id: eventId ?? null,
      topic: values.topic,
      description: values.description,
    };

    try {
      await contact.mutateAsync(payload);
      form.reset();
      setOpen(false);
      setSuccessOpen(true);
    } catch (err) {
      const msg = extractApiErrorMessage(err);
      form.setError("root", { type: "server", message: msg });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button>Contact</Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Request Vendor</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Short topic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your request" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(form.formState.errors as any)?.root?.message && (
              <div className="text-sm text-destructive">
                {(form.formState.errors as any).root.message}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <LoadingButton
                className="bg-gradient-cta"
                isLoading={form.formState.isSubmitting}
                type="submit"
              >
                Send Request
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>

      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Request sent"
        description="Your details have been sent to vendor. They will get back to you soon."
        onDone={() => setSuccessOpen(false)}
      />
    </Dialog>
  );
}
