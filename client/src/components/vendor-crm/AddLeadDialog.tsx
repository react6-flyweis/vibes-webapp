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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useCreateLead from "@/mutations/vendor-crm/createLeadMutation";

type FormValues = {
  vendorName: string;
  platform: string;
  profileUrl?: string;
  productType?: string;
  contactEmail?: string;
  contactPhone?: string;
  discoverySource?: string;
  priority?: "High" | "Medium" | "Low";
  estimatedValue?: number | "";
  tags?: string;
  notes?: string;
};

export default function AddLeadDialog() {
  const [open, setOpen] = React.useState(false);
  // react-query mutation for creating leads
  const createLeadMutation = useCreateLead();
  const form = useForm<FormValues>({
    defaultValues: {
      vendorName: "",
      platform: "",
      profileUrl: "",
      productType: "",
      contactEmail: "",
      contactPhone: "",
      discoverySource: "",
      priority: "Medium",
      estimatedValue: "",
      tags: "",
      notes: "",
    },
  });

  const { toast } = useToast();

  const handleSubmit = async (values: FormValues) => {
    // Map form values to the API payload expected by the server
    const payload = {
      Vendor_name: values.vendorName,
      platform: values.platform,
      shop_Profile_url: values.profileUrl || undefined,
      product_serviceType: values.productType || undefined,
      ContactEmail: values.contactEmail || undefined,
      ContactPhone: values.contactPhone || undefined,
      DiscoverySource: values.discoverySource || undefined,
      ContactMobile: values.contactPhone || undefined,
      EstimetedValuePrice:
        values.estimatedValue === ""
          ? null
          : (values.estimatedValue as number | undefined),
      Tags: values.tags
        ? values.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
      Notes: values.notes || undefined,
      LeadStatus: "Active",
    };

    try {
      await createLeadMutation.mutateAsync(payload as any);

      toast({
        title: "Lead added",
        description: `${values.vendorName || "Vendor"} was added to your CRM.`,
      });

      form.reset();
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Failed to add lead",
        description: err?.message ?? "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const watchedName = form.watch("vendorName");
  const watchedPlatform = form.watch("platform");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex items-start justify-between">
          <div>
            <DialogTitle className="text-lg font-semibold">
              Add Lead
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Add a new vendor lead to your CRM.
            </p>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vendorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Enchanted" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform *</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="Etsy">Etsy</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="profileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shop/Profile URL</FormLabel>
                      <FormControl>
                        <Input placeholder="http://etsy.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product/Service Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Wedding Florals, Event"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="vendor@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discoverySource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discovery Source</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="How did you find them?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High Priority</SelectItem>
                            <SelectItem value="Medium">
                              Medium Priority
                            </SelectItem>
                            <SelectItem value="Low">Low Priority</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="estimatedValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Value ($)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="5000.0"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4 items-end">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add a tag... (comma separated)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional notes..."
                          {...field}
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="mt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <LoadingButton
                  isLoading={form.formState.isSubmitting}
                  type="submit"
                  disabled={!watchedName || !watchedPlatform}
                >
                  Add Lead
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
