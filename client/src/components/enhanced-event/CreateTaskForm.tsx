import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "../ui/loading-button";
import { useForm } from "react-hook-form";
import { useCreateTask } from "@/mutations/createTask";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface CreateTaskFormProps {
  eventId?: string | number;
  disabled?: boolean;
  onCreated?: (task: any) => void;
}

type CreateTaskFormValues = {
  taskTitle: string;
  description?: string;
};

export default function CreateTaskForm({
  eventId,
  onCreated,
}: CreateTaskFormProps) {
  const form = useForm<CreateTaskFormValues>({
    defaultValues: { taskTitle: "", description: "" },
  });
  const createMutation = useCreateTask({
    eventId,
    onSuccess: (data) => {
      form.reset();
      if (onCreated) onCreated(data);
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: CreateTaskFormValues) => {
    const trimmed = values.taskTitle?.trim();
    if (!trimmed) {
      form.setError("taskTitle", {
        type: "required",
        message: "Title is required",
      });
      return;
    }
    try {
      await createMutation.mutateAsync({
        taskTitle: trimmed,
        description: values.description,
        event_id: eventId,
      });

      toast({ title: "Task created!" });
    } catch (err: any) {
      toast({
        title: "Failed to create task",
        description: err?.message ?? "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h4 className="font-medium mb-3">Add New Task</h4>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="taskTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Task title..."
                    {...field}
                    className="rounded-xl border-gray-200 h-12 px-4"
                  />
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
                <FormLabel className="text-sm text-gray-600">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Task description (optional)..."
                    {...field}
                    className="rounded-xl border-gray-200 px-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton type="submit" isLoading={form.formState.isSubmitting}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
