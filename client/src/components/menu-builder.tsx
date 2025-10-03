import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Martini, Utensils, Music, Palette, Plus } from "lucide-react";

interface MenuBuilderProps {
  eventId: number;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onAddItem: () => void;
}

const categoryIcons = {
  drinks: Martini,
  food: Utensils,
  entertainment: Music,
  decorations: Palette,
};

const categoryColors = {
  drinks: "bg-party-coral",
  food: "bg-party-turquoise",
  entertainment: "bg-party-blue",
  decorations: "bg-party-mint",
};

export default function MenuBuilder({
  eventId,
  activeCategory,
  onCategoryChange,
  onAddItem,
}: MenuBuilderProps) {
  const queryClient = useQueryClient();

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: [`/api/events/${eventId}/menu-items?category=${activeCategory}`],
  });

  const claimMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await apiRequest(
        "PATCH",
        `/api/menu-items/${itemId}/claim`,
        { userId: 2 }
      ); // Using user 2 as current user for demo
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/events/${eventId}/menu-items`],
      });
      queryClient.invalidateQueries({
        queryKey: [`/api/events/${eventId}/stats`],
      });
    },
  });

  const categories = [
    { id: "drinks", label: "Drinks", icon: Martini },
    { id: "food", label: "Food", icon: Utensils },
    { id: "entertainment", label: "Entertainment", icon: Music },
    { id: "decorations", label: "Decorations", icon: Palette },
  ];

  const filteredItems = menuItems.filter(
    (item: any) => item.category === activeCategory
  );

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          return (
            <Button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              variant={isActive ? "default" : "outline"}
              className={
                isActive
                  ? `${
                      categoryColors[category.id as keyof typeof categoryColors]
                    } text-white hover:opacity-90`
                  : "bg-gray-100 party-gray hover:bg-party-turquoise hover:text-white"
              }
            >
              <Icon className="mr-2 h-4 w-4" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Add New Item */}
      <div
        onClick={onAddItem}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6 hover:border-party-coral transition-colors cursor-pointer"
      >
        <div className="text-center">
          <Plus className="mx-auto party-coral text-2xl mb-2 h-8 w-8" />
          <p className="party-gray font-medium">
            Add new {activeCategory.slice(0, -1)} item
          </p>
          <p className="text-sm text-gray-500">
            Click to contribute to the menu
          </p>
        </div>
      </div>

      {/* Menu Items List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-party-gray">Loading menu items...</div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-party-gray">
            No {activeCategory} items yet. Be the first to add one!
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item: any) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold party-dark">{item.name}</h4>
                    <p className="text-sm party-gray">{item.description}</p>
                    {item.contributor && (
                      <p className="text-xs text-gray-500">
                        Added by{" "}
                        <span className="font-medium">
                          {item.contributor.name}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.status === "claimed" ? (
                    <>
                      <Badge className="bg-party-mint text-white">
                        Claimed
                      </Badge>
                      {item.claimedBy && (
                        <div className="flex -space-x-2">
                          <img
                            className="w-6 h-6 rounded-full border-2 border-white"
                            src={
                              item.claimedBy.avatar ||
                              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=24&h=24"
                            }
                            alt="Claimed by"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <Button
                      onClick={() => claimMutation.mutate(item.id)}
                      disabled={claimMutation.isPending}
                      className="bg-party-coral hover:bg-red-500 text-white text-xs px-3 py-1 rounded-full"
                      size="sm"
                    >
                      {claimMutation.isPending
                        ? "Claiming..."
                        : "I'll bring this"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
