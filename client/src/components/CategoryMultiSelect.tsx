import React, { useState } from "react";
import { useCategoriesQuery } from "@/queries/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateCategory } from "@/mutations/useCreateCategory";

export type CategoryWithPricing = {
  category_id: number;
  category_name: string;
  pricing: number;
  pricing_currency: string;
};

type Props = {
  value: CategoryWithPricing[];
  onChange: (value: CategoryWithPricing[]) => void;
  className?: string;
};

export default function CategoryMultiSelect({
  value,
  onChange,
  className,
}: Props) {
  const { data: categories, isLoading } = useCategoriesQuery();
  const { toast } = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [pricing, setPricing] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const createCategoryMutation = useCreateCategory();

  const handleAddCategory = () => {
    if (!selectedCategoryId || !pricing) {
      toast({
        title: "Missing information",
        description: "Please select a category and enter pricing",
        variant: "destructive",
      });
      return;
    }

    const category = categories?.find(
      (c) => String(c.category_id) === selectedCategoryId
    );

    if (!category) return;

    // Check if category already added
    if (value.some((v) => v.category_id === category.category_id)) {
      toast({
        title: "Already added",
        description: "This category is already in your list",
        variant: "destructive",
      });
      return;
    }

    const newItem: CategoryWithPricing = {
      category_id: category.category_id!,
      category_name: category.category_name || "",
      pricing: parseFloat(pricing),
      pricing_currency: currency,
    };

    onChange([...value, newItem]);
    setSelectedCategoryId("");
    setPricing("");
    setCurrency("USD");
  };

  const handleRemoveCategory = (categoryId: number) => {
    onChange(value.filter((v) => v.category_id !== categoryId));
  };

  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await createCategoryMutation.mutateAsync({
        category_name: newCategoryName.trim(),
        emozi: newCategoryEmoji.trim() || "📦",
        status: true,
      });

      if (result?.success) {
        toast({
          title: "Category created",
          description: `${newCategoryName} has been added successfully`,
        });

        // Close dialog and reset form
        setIsAddingNew(false);
        setNewCategoryName("");
        setNewCategoryEmoji("");

        // Auto-select the newly created category
        setTimeout(() => {
          setSelectedCategoryId(String(result.data.category_id));
        }, 500);
      }
    } catch (error: any) {
      toast({
        title: "Error creating category",
        description:
          error?.message ||
          error?.response?.data?.message ||
          "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Selected Categories Display */}
        {value.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Categories</Label>
            <div className="flex flex-wrap gap-2">
              {value.map((item) => (
                <Badge
                  key={item.category_id}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm"
                >
                  {item.category_name} - {item.pricing_currency}{" "}
                  {item.pricing.toFixed(2)}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(item.category_id)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add Category Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2">
            <Label>Category</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger className="bg-gray-100">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {isLoading && (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                )}
                {categories
                  ?.filter(
                    (c) => !value.some((v) => v.category_id === c.category_id)
                  )
                  .map((c) => (
                    <SelectItem
                      key={c.category_id}
                      value={String(c.category_id)}
                    >
                      {c.emozi ? `${c.emozi} ` : ""}
                      {c.category_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Pricing</Label>
            <div className="flex gap-2">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-gray-100 w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
                className="bg-gray-100"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddCategory}
            className="w-full"
            variant="outline"
          >
            Add
          </Button>
        </div>

        {/* Add New Category Button */}
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new category to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Food & Beverage"
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="category-emoji">Emoji (Optional)</Label>
                <Input
                  id="category-emoji"
                  value={newCategoryEmoji}
                  onChange={(e) => setNewCategoryEmoji(e.target.value)}
                  placeholder="🍔"
                  className="bg-gray-100"
                  maxLength={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingNew(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateNewCategory}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
