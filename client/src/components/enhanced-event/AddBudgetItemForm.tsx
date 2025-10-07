"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loading-button";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type Props = {
  eventId?: string;
};

type FormValues = {
  itemName: string;
  category: string;
  cost: string; // dollars as string from input
};

export default function AddBudgetItemForm({ eventId }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: {
      itemName: "",
      category: "",
      cost: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) =>
      axiosInstance.post(`/api/master/budget-items/create`, payload),
    onSuccess: () => {
      if (eventId) {
        queryClient.invalidateQueries({
          queryKey: [`/api/events/${eventId}/budget`],
        });
        queryClient.invalidateQueries({
          queryKey: [`/api/events/${eventId}/budget/summary`],
        });
      }
      form.reset();
      toast({ title: "Budget item added!" });
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!eventId) {
      toast({ title: "Missing event ID", variant: "destructive" });
      return;
    }

    const payload = {
      eventId,
      itemName: values.itemName.trim(),
      category: values.category,
      estimatedCost: Math.round(parseFloat(values.cost || "0") * 100),
    };

    try {
      await mutation.mutateAsync(payload);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to add item",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border rounded-lg p-4 bg-gray-50"
      >
        <h4 className="font-medium mb-3">Add Budget Item</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <FormField
            control={form.control}
            name="itemName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Item name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="drinks">Drinks</SelectItem>
                      <SelectItem value="entertainment">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="decorations">Decorations</SelectItem>
                      <SelectItem value="rentals">Rentals</SelectItem>
                      <SelectItem value="venue">Venue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Cost ($)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center">
            <LoadingButton
              isLoading={form.formState.isSubmitting}
              type="submit"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
}
