import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const addItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type AddItemForm = z.infer<typeof addItemSchema>;

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  defaultCategory?: string;
}

export default function AddItemModal({ isOpen, onClose, eventId, defaultCategory = "drinks" }: AddItemModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<AddItemForm>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      name: "",
      description: "",
      category: defaultCategory,
      imageUrl: "",
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: AddItemForm) => {
      const response = await apiRequest("POST", `/api/events/${eventId}/menu-items`, {
        ...data,
        contributorId: 2, // Using user 2 as current user for demo
        imageUrl: data.imageUrl || undefined,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/menu-items`] });
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/stats`] });
      toast({
        title: "Success",
        description: "Menu item added successfully!",
      });
      form.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add menu item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddItemForm) => {
    addItemMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="party-dark">Add New Item</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="party-dark">Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Margarita Mix" {...field} />
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
                  <FormLabel className="party-dark">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description..." 
                      rows={3}
                      {...field} 
                    />
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
                  <FormLabel className="party-dark">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="drinks">Drinks</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="decorations">Decorations</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="party-dark">Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addItemMutation.isPending}
                className="flex-1 bg-party-coral hover:bg-red-500 text-white"
              >
                {addItemMutation.isPending ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
