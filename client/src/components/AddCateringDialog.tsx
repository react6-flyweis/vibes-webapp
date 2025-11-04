import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CateringCategorySelectId from "@/components/CateringCategorySelectId";
import { useCreateCatering } from "@/mutations/useCreateCatering";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "./ui/loading-button";
import { extractApiErrorMessage } from "@/lib/apiErrors";
import { PlusIcon } from "lucide-react";

export default function AddCateringDialog({
  triggerText = "Add Catering",
}: {
  triggerText?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const createCatering = useCreateCatering();
  const { toast } = useToast();

  const form = useForm<{
    catering_marketplace_category_id: string;
    name: string;
    image?: string;
    address?: string;
    mobile_no?: string;
  }>({
    defaultValues: {
      catering_marketplace_category_id: "",
      name: "",
      image: "",
      address: "",
      mobile_no: "",
    },
  });

  // local image file + preview state (file is not uploaded to backend yet)
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    // revoke object URL on unmount or when imageFile changes
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // derive a value for the id-based select (undefined when not set)
  const rawCategory = form.getValues("catering_marketplace_category_id");
  const categoryValue =
    rawCategory === "" || rawCategory === undefined
      ? undefined
      : Number.isNaN(Number(rawCategory))
      ? rawCategory
      : Number(rawCategory);

  const onSubmit = async (vals: any) => {
    try {
      await createCatering.mutateAsync({ ...vals });
      toast({ title: "Catering created" });
      setOpen(false);
      form.reset();
    } catch (err) {
      const apiErr = extractApiErrorMessage(err);
      form.setError("root", { type: "server", message: apiErr });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-gradient-cta">
          <PlusIcon />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Catering</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="catering_marketplace_category_id"
              render={() => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CateringCategorySelectId
                      className="w-full"
                      value={categoryValue}
                      onChange={(v: string | number) =>
                        form.setValue(
                          "catering_marketplace_category_id",
                          String(v)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Spice Garden Restaurant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => {
                const handleFileChange = (
                  e: React.ChangeEvent<HTMLInputElement>
                ) => {
                  const file = e.target.files?.[0] ?? null;
                  setImageFile(file);
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setPreviewUrl(url);
                    form.setValue("image", file.name);
                  } else {
                    setPreviewUrl(null);
                    form.setValue("image", "");
                  }
                };

                return (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>

                    <div className="mt-2">
                      <label className="text-sm font-medium">
                        Or upload image (optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block mt-2"
                      />

                      {previewUrl && (
                        <div className="mt-2">
                          <img
                            src={previewUrl}
                            alt="preview"
                            className="h-24 w-24 object-cover rounded"
                          />
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground mt-2">
                        Note: file upload isn't connected to the backend yet.
                        The form will send the image field (currently the file
                        name) with the existing mutation.
                      </p>
                    </div>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="123 Main Street, Mumbai"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile No</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm text-red-600">
                {form.formState.errors.root.message}
              </p>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <LoadingButton
                className="bg-gradient-cta"
                type="submit"
                isLoading={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating..." : "Create"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
