import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useCreateVendorEmailTemplate } from "@/mutations/useCreateVendorEmailTemplate";
import { useToast } from "@/hooks/use-toast";

type FormValues = {
  subject: string;
  message: string;
};

type Props = {
  onCreated?: (t: any) => void;
};

export default function CreateTemplateDialog({ onCreated }: Props) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<FormValues>({
    defaultValues: { subject: "", message: "" },
  });

  const { toast } = useToast();
  const createMutation = useCreateVendorEmailTemplate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        vendor_id: 1, // assumption kept from previous implementation
        Title: values.subject || "Untitled Template",
        subTitle: "",
        Subject: values.subject,
        Preview: values.message,
        defultTemplate: false,
        image: "",
        Status: true,
      };

      const data = await createMutation.mutateAsync(payload);

      const created = {
        id: data?.EmailTemplate_id ?? data?._id ?? Date.now(),
        title: data?.Title ?? payload.Title,
        category: "Custom",
        subject: data?.Subject ?? payload.Subject,
        preview: (data?.Preview ?? (payload.Preview || "")).slice(0, 120),
        raw: data,
      };

      toast({
        title: "Template created",
        description: "Your template was saved.",
      });

      // notify parent
      onCreated?.(created);

      // reset + close
      form.reset();
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Failed to create",
        description: err?.message ?? "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ Create Template</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex items-start justify-between">
          <div>
            <DialogTitle className="text-lg font-semibold">
              Create Email Template
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Apply filters to find specific vendor leads in your CRM pipeline.
            </p>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the Subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the Message..."
                        className="min-h-[160px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-2 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <LoadingButton isLoading={isSubmitting} type="submit">
                  Save Template
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
