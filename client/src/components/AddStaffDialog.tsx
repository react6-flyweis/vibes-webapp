import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import StaffCategorySelector from "@/components/StaffCategorySelector";
import { useCreateStaff } from "@/hooks/useCreateStaff";
import { LoadingButton } from "./ui/loading-button";
import { extractApiErrorMessage } from "@/lib/apiErrors";
import { toast } from "@/hooks/use-toast";
import { PlusIcon } from "lucide-react";

const addStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  working_price: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "string" ? Number(v || 0) : v))
    .refine((n) => !Number.isNaN(n) && n >= 0, {
      message: "Please enter a valid non-negative price",
    }),
  staff_category_id: z.string().min(1, "Please select a category"),
});

type AddStaffFormValues = z.infer<typeof addStaffSchema>;

type Props = {
  trigger?: React.ReactNode;
};

export function AddStaffDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<AddStaffFormValues>({
    resolver: zodResolver(addStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      working_price: 0,
      staff_category_id: "all",
    },
  });

  const createStaff = useCreateStaff();

  const handleSubmit = async (values: AddStaffFormValues) => {
    // Map form values to API payload and call create mutation.
    const { name, email, working_price, staff_category_id } = values;

    // convert staff_category_id to number when possible
    const staffCategoryIdNum = Number(staff_category_id) || 0;

    const payload = {
      name,
      email: email || undefined,
      // static / placeholder fields requested by the caller
      password: "password123",
      agreePrivacyPolicy: false,
      business_name: "Vibes",
      business_category_id: 1,
      staff_category_id: staffCategoryIdNum,
      price: Number(working_price) || 0,
      review_count: 0,
      status: true,
    };

    try {
      await createStaff.mutateAsync(payload);
      toast({
        title: "Staff added",
        description: `${name} has been added successfully.`,
      });
      setOpen(false);
    } catch (err) {
      const errorMessage = extractApiErrorMessage(err);
      form.setError("root", { type: "server", message: errorMessage });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="default" className="bg-gradient-cta">
            <PlusIcon />
            Add Staff
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Staff</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 w-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="working_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      {...field}
                      value={String(field.value ?? "")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="staff_category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <StaffCategorySelector
                      value={String(field.value ?? "all")}
                      onChange={(v: string) => field.onChange(v)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* root form errors */}
            {(form.formState.errors as any)?.root?.message && (
              <FormItem>
                <div className="text-sm font-medium text-destructive">
                  {(form.formState.errors as any).root.message}
                </div>
              </FormItem>
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
                Add staff
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
