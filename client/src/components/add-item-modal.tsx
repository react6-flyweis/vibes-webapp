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
import useCreateMasterMenuItem from "@/mutations/createMasterMenuItem";
import { useToast } from "@/hooks/use-toast";

const addItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional().or(z.literal("")),
  category: z.enum(["drinks", "food", "entertainment", "decorations"]),
  imageUrl: z.string().url().optional().or(z.literal("")),
  price: z.coerce.number().min(0).optional(),
  color: z.string().optional().or(z.literal("")),
  type: z.string().optional().or(z.literal("")),
  brandName: z.string().optional().or(z.literal("")),
  status: z.boolean().optional(),
});

type AddItemForm = z.infer<typeof addItemSchema>;

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string | number;
  defaultCategory?: "drinks" | "food" | "entertainment" | "decorations";
}

export default function AddItemModal({
  isOpen,
  onClose,
  eventId,
  defaultCategory = "drinks",
}: AddItemModalProps) {
  const { toast } = useToast();

  const form = useForm<AddItemForm>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      name: "",
      description: "",
      category: defaultCategory,
      imageUrl: "",
      price: undefined,
      color: "",
      type: "",
      brandName: "",
      status: true,
    },
  });

  const selectedCategory = form.watch("category");
  const showPrice = ["drinks", "food", "entertainment", "decorations"].includes(
    selectedCategory
  );
  const showColor =
    selectedCategory === "drinks" || selectedCategory === "food";
  const showType = ["food", "entertainment", "decorations"].includes(
    selectedCategory
  );
  const showBrand = ["drinks", "food", "entertainment", "decorations"].includes(
    selectedCategory
  );

  const createMasterItem = useCreateMasterMenuItem({
    // keep these empty; we'll handle UI side-effects in the component so
    // the component can invalidate queries tied to the eventId
  });

  const onSubmit = async (data: AddItemForm) => {
    try {
      const payload = { ...(data as any), eventId };
      const res = await createMasterItem.mutateAsync(payload as any);

      toast({
        title: "Success",
        description: "Menu item added successfully!",
      });
      form.reset();
      onClose();
      return res;
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.message || "Failed to add menu item. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="drinks">Drinks</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="entertainment">
                        Entertainment
                      </SelectItem>
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
                  <FormLabel className="party-dark">
                    Image URL (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              {showPrice && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="party-dark">Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {showColor && (
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="party-dark">Color</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Red" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {showType && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="party-dark">Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Italian / Music / Birthday"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {showBrand && (
                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="party-dark">Brand Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

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
                disabled={createMasterItem.isPending}
                className="flex-1 bg-party-coral hover:bg-red-500 text-white"
              >
                {createMasterItem.isPending ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
