import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import PlanSelector from "@/components/corporate/PlanSelector";
import { useCreateCorporateClient } from "@/mutations/vendor/createCorporateClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "../ui/loading-button";
import { extractApiErrorMessage } from "@/lib/apiErrors";

const CreateClientSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().optional(),
  employeeCount: z.number().min(1, "Employee count must be at least 1"),
  contactEmail: z.string().email("Invalid email address"),
  plan: z.string().min(1, "Please select a plan"),
});

export type CreateClientFormValues = z.infer<typeof CreateClientSchema>;

interface Props {
  defaultValues?: Partial<CreateClientFormValues>;
}

export default function CreateClientForm({ defaultValues = {} }: Props) {
  const form = useForm<CreateClientFormValues>({
    resolver: zodResolver(CreateClientSchema),
    defaultValues: defaultValues as any,
  });

  const { toast } = useToast();
  const createMutation = useCreateCorporateClient();

  const onSubmit = async (data: CreateClientFormValues) => {
    // map to API shape
    const payload = {
      CompanyName: data.companyName,
      industry: data.industry ?? "",
      ContactEmail: data.contactEmail,
      Plan_id: Number(data.plan) || data.plan,
      EmployeeCount: data.employeeCount,
      Status: true,
    };

    try {
      await createMutation.mutateAsync(payload);
      toast({
        title: "Client Added Successfully",
        description: "New corporate client has been onboarded.",
      });
    } catch (error) {
      const errorMessage = extractApiErrorMessage(error);
      form.setError("root", { message: errorMessage });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Company Name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Industry"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Count *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Employee Count"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-300"
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : String(field.value)
                    }
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Contact Email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2 lg:col-span-1">
                <FormLabel>Plan *</FormLabel>
                <PlanSelector
                  value={field.value || ""}
                  onChange={(v) => field.onChange(v)}
                  className="w-full"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-end">
            <LoadingButton
              type="submit"
              isLoading={form.formState.isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
            >
              {form.formState.isSubmitting ? "Adding..." : "Add Client"}
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
}
