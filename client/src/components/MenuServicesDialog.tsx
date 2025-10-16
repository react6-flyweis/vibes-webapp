import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type FormValues = {
  cuisine: string;
  specialPreferences: string;
  pricePerPerson: string;
};

type Props = {
  open: boolean;
  initial?: Partial<FormValues>;
  onBack: () => void;
  onClose: () => void;
  onSubmit: (vals: FormValues) => void;
};

export default function MenuServicesDialog({
  open,
  initial,
  onBack,
  onClose,
  onSubmit,
}: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      cuisine: initial?.cuisine || "Italian",
      specialPreferences: initial?.specialPreferences || "",
      pricePerPerson: initial?.pricePerPerson || "",
    },
  });

  const handleSubmit = (vals: FormValues) => {
    onSubmit(vals);
    form.reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Menu & Services</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="cuisine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine Preferences</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Italian">Italian</SelectItem>
                        <SelectItem value="Indian">Indian</SelectItem>
                        <SelectItem value="Continental">Continental</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Preferences</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your preferences" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePerPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated price per person</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 1000" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={onBack}>
                ← Previous
              </Button>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
