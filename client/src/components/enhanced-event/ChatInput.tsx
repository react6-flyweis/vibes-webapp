import React from "react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
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
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: (payload) =>
      axiosInstance.post(`/api/master/event-discussion-chat/create`, payload),
  });

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

      queryClient.invalidateQueries({
        queryKey: [`/api/events/${eventId}/messages`],
      });

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
                  onKeyPress={(e: any) => {
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
