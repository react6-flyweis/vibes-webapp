import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useDrinksQuery,
  useFoodQuery,
  useEntertainmentQuery,
  useDecorationsQuery,
  IDrink,
  IFood,
  IDecorations,
  IEntertainment,
} from "@/queries/menus";
import { Martini, Utensils, Music, Palette, Plus } from "lucide-react";
import AddItemModal from "@/components/add-item-modal";
import { PlanEventMapData } from "@/queries/planEventMaps";
import {
  useCreatePlanEventMap,
  useUpdatePlanEventMap,
} from "@/mutations/planEventMap";

const categoryColors = {
  drinks: "bg-party-coral",
  food: "bg-party-turquoise",
  entertainment: "bg-party-blue",
  decorations: "bg-party-mint",
};

interface NormalizedItem {
  id: string | number;
  name: string;
  price: number;
  color: string;
  brand_name: string;
  status: boolean;
  // imageUrl?: string;
  raw: IDrink | IFood | IDecorations | IEntertainment;
}

const normalizeMasterItem = (
  item: IDrink | IFood | IDecorations | IEntertainment,
  category: string
): NormalizedItem => {
  switch (category) {
    case "drinks":
      const drinkItem = item as IDrink;
      return {
        id: drinkItem.drinks_id,
        name: drinkItem.drinks_name,
        price: drinkItem.drinks_price,
        color: drinkItem.drinks_color,
        brand_name: drinkItem.brand_name,
        status: drinkItem.status,
        // imageUrl: drinkItem.imageUrl,
        raw: drinkItem,
      };
    case "food":
      const foodItem = item as IFood;
      return {
        id: foodItem.food_id ?? foodItem._id,
        name: foodItem.food_name,
        price: foodItem.food_price,
        color: foodItem.food_color,
        brand_name: foodItem.brand_name,
        status: foodItem.status,
        // imageUrl: foodItem.imageUrl,
        raw: foodItem,
      };
    case "entertainment":
      const entertainmentItem = item as IEntertainment;
      return {
        id: entertainmentItem.entertainment_id ?? entertainmentItem._id,
        name: entertainmentItem.entertainment_name,
        price: entertainmentItem.entertainment_price,
        color: entertainmentItem.entertainment_type,
        brand_name: entertainmentItem.brand_name,
        status: entertainmentItem.status,
        // imageUrl: entertainmentItem.imageUrl,
        raw: entertainmentItem,
      };
    case "decorations":
      const decorationsItem = item as IDecorations;
      return {
        id: decorationsItem.decorations_id ?? decorationsItem._id,
        name: decorationsItem.decorations_name,
        price: decorationsItem.decorations_price,
        color: decorationsItem.decorations_type,
        brand_name: decorationsItem.brand_name,
        status: decorationsItem.status,
        // imageUrl: decorationsItem.imageUrl,
        raw: decorationsItem,
      };
    default:
      return item as unknown as NormalizedItem;
  }
};

const categories = [
  { id: "drinks", label: "Drinks", icon: Martini },
  { id: "food", label: "Food", icon: Utensils },
  { id: "entertainment", label: "Entertainment", icon: Music },
  { id: "decorations", label: "Decorations", icon: Palette },
] as const;

interface MenuBuilderProps {
  eventId: string;
  planMap?: PlanEventMapData;
}

export default function MenuBuilder({ eventId, planMap }: MenuBuilderProps) {
  const [activeCategory, setActiveCategory] = useState<
    "drinks" | "food" | "entertainment" | "decorations"
  >("drinks");
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // For drinks we call the master drinks endpoint, otherwise fall back to event menu-items
  const drinksQuery = useDrinksQuery();
  const foodQuery = useFoodQuery();
  const entertainmentQuery = useEntertainmentQuery();
  const decorationsQuery = useDecorationsQuery();

  const masterItemsByCategory: Record<string, any[]> = {
    drinks: drinksQuery.data?.data || [],
    food: foodQuery.data?.data || [],
    entertainment: entertainmentQuery.data?.data || [],
    decorations: decorationsQuery.data?.data || [],
  };

  const effectiveItems = masterItemsByCategory[activeCategory].map((it) =>
    normalizeMasterItem(it, activeCategory)
  );

  // Helper to determine whether an item is already claimed/added to the plan
  const isItemClaimed = (itemId: string | number, category: string) => {
    if (!planMap) return false;
    const mapKeys: Record<string, keyof typeof planMap | string> = {
      drinks: "menu_drinks",
      food: "menu_food",
      entertainment: "menu_entertainment",
      decorations: "menu_decorations",
    };
    const key = mapKeys[category];
    // @ts-ignore - planMap shape can be flexible at runtime
    const arr = (planMap as any)?.[key] ?? [];
    if (!Array.isArray(arr)) return false;
    return arr.some((el: any) => {
      // direct primitive id match
      if (el === itemId) return true;
      // if element is an object, try common id fields or any nested value match
      if (el && typeof el === "object") {
        // common backend shapes: { guest_id: 1 } or { drinks_id: 1 } or { _id: '...' }
        const possibleIdFields = [
          `${category.slice(0, -1)}_id`, // e.g. drinks -> drink_id (fallback)
          `${category}_id`, // e.g. drinks_id
          `_id`,
        ];
        for (const f of possibleIdFields) {
          if (el[f] === itemId) return true;
        }
        // lastly, check any value equality inside the object
        return Object.values(el).some((v) => v === itemId);
      }
      return false;
    });
  };

  const masterQueriesByCategory: Record<string, any> = {
    drinks: drinksQuery,
    food: foodQuery,
    entertainment: entertainmentQuery,
    decorations: decorationsQuery,
  };

  const loading = masterQueriesByCategory[activeCategory]?.isLoading;

  const createPlanMapMutation = useCreatePlanEventMap({
    onError: (err) => {
      console.error("Failed to create plan event map:", err);
    },
  });

  const updatePlanMapMutation = useUpdatePlanEventMap({
    onError: (err) => {
      console.error("Failed to update plan event map:", err);
    },
  });

  const handleClaimItem = async (itemId: string | number, category: string) => {
    const keyMap: Record<string, string> = {
      drinks: "menu_drinks",
      food: "menu_food",
      entertainment: "menu_entertainment",
      decorations: "menu_decorations",
    };

    const key = keyMap[category];

    // If there is an existing planMap, update it. Otherwise, create a new one.
    if (planMap) {
      // Build a payload by copying existing planMap arrays and appending the id (if not present)
      const payload: any = {
        id: planMap.plan_event_id,
        event_id: planMap.event_id,
        menu_drinks: planMap.menu_drinks?.slice?.() || [],
        menu_food: planMap.menu_food?.slice?.() || [],
        menu_entertainment: planMap.menu_entertainment?.slice?.() || [],
        menu_decorations: planMap.menu_decorations?.slice?.() || [],
      };

      const arr = payload[key] as Array<any>;
      if (!arr.some((v) => v === itemId)) arr.push(itemId);

      setIsClaiming(true);
      try {
        await updatePlanMapMutation.mutateAsync(payload);
      } catch (err) {
        // error handled by hook's onError
      } finally {
        setIsClaiming(false);
      }

      return;
    }

    // No plan map exists yet -> create one with the claimed item in the right array
    const createPayload: any = {
      event_id: eventId,
      menu_drinks: [],
      menu_food: [],
      menu_entertainment: [],
      menu_decorations: [],
      tasks: [],
      chat: [],
      budget_items_id: [],
      event_gallery: [],
      guests_id: [],
      venue_management: { venue_details: eventId },
      status: true,
    };

    // append to the relevant array
    if (!createPayload[key]) createPayload[key] = [];
    createPayload[key].push(itemId);

    setIsClaiming(true);
    try {
      await createPlanMapMutation.mutateAsync(createPayload);
    } catch (err) {
      // error handled by hook's onError
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={isActive ? "default" : "outline"}
                className={
                  isActive
                    ? `${
                        categoryColors[
                          category.id as keyof typeof categoryColors
                        ]
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
          onClick={() => setIsAddItemModalOpen(true)}
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
        {loading ? (
          <div className="text-center py-8">
            <div className="text-party-gray">Loading menu items...</div>
          </div>
        ) : effectiveItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-party-gray">
              No {activeCategory} items yet. Be the first to add one!
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {effectiveItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )} */}
                    <div>
                      <h4 className="font-semibold party-dark">{item.name}</h4>
                      <p className="text-sm party-gray">{item.color}</p>
                      <div className="mt-1 flex items-center gap-3">
                        {typeof item.price !== "undefined" && (
                          <Badge className="bg-party-coral text-white">
                            ${item.price}
                          </Badge>
                        )}
                        {item.brand_name && (
                          <span className="text-xs text-gray-500">
                            {item.brand_name}
                          </span>
                        )}
                        {/* {item.contributor && (
                          <p className="text-xs text-gray-500">
                            Added by{" "}
                            <span className="font-medium">
                              {item.contributor.name}
                            </span>
                          </p>
                        )} */}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isItemClaimed(item.id, activeCategory) ? (
                      <Badge className="bg-party-mint text-white">
                        Claimed
                      </Badge>
                    ) : item.status ? (
                      <Badge className="bg-party-mint text-white">
                        Available
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-300 text-gray-700">
                        Unavailable
                      </Badge>
                    )}
                    {/* <>
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
                      </> */}
                    {!isItemClaimed(item.id, activeCategory) && (
                      <Button
                        onClick={() => handleClaimItem(item.id, activeCategory)}
                        disabled={isClaiming}
                        className="bg-party-coral hover:bg-red-500 text-white text-xs px-3 py-1 rounded-full"
                        size="sm"
                      >
                        {isClaiming ? "Claiming..." : "I'll bring this"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        eventId={eventId}
        defaultCategory={activeCategory}
      />
      ;
    </>
  );
}
