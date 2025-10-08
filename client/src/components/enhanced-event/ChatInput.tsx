import React from "react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Send } from "lucide-react";
import { useSendEventMessage } from "@/mutations/sendEventMessage";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function ChatInput({ eventId }: { eventId?: string }) {
  const { toast } = useToast();

  const sendMessageMutation = useSendEventMessage({ eventId });

  const form = useForm<{ message: string }>({ defaultValues: { message: "" } });

  const onSubmit = async (values: { message: string }) => {
    const messageText = values.message?.trim();
    if (!messageText || !eventId) return;

    try {
      const payload = {
        message: messageText,
        event_id: eventId ? Number(eventId) : undefined,
        status: true,
      } as any;
      await sendMessageMutation.mutateAsync(payload);

      form.reset();
      toast({ title: "Message sent!" });
    } catch (err) {
      toast({ title: "Failed to send message", description: String(err) });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Type your message..."
                  {...field}
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          type="submit"
          isLoading={form.formState.isSubmitting}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </LoadingButton>
      </form>
    </Form>
  );
}
