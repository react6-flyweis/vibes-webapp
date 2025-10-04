import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChefHat,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  Users,
  Utensils,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CateringMenu {
  id: string;
  name: string;
  chef: string;
  cuisine: string;
  category: string;
  pricePerPerson: number;
  minOrder: number;
  servings: string[];
  description: string;
  items: string[];
  dietary: string[];
  rating: number;
  reviews: number;
  availability: string[];
  preparationTime: string;
  location: string;
  image: string;
  featured: boolean;
}

export default function CateringMarketplace() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<CateringMenu | null>(null);
  const [orderDetails, setOrderDetails] = useState({
    eventDate: "",
    guestCount: "",
    servingType: "",
    dietaryRequests: "",
    deliveryAddress: "",
    specialInstructions: "",
  });

  const { data: cateringMenus = [], isLoading } = useQuery<CateringMenu[]>({
    queryKey: [
      "/api/catering/menus",
      selectedCategory,
      selectedCuisine,
      searchQuery,
    ],
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/catering/categories"],
  });

  const { data: cuisines = [] } = useQuery<any[]>({
    queryKey: ["/api/catering/cuisines"],
  });

  const orderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/catering/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully",
        description: "The caterer will confirm your order within 24 hours.",
      });
      setSelectedMenu(null);
      queryClient.invalidateQueries({ queryKey: ["/api/catering/orders"] });
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredMenus = cateringMenus.filter((menu: CateringMenu) => {
    const matchesCategory =
      selectedCategory === "all" || menu.category === selectedCategory;
    const matchesCuisine =
      selectedCuisine === "all" || menu.cuisine === selectedCuisine;
    const matchesSearch =
      menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.chef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.items.some((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesCuisine && matchesSearch;
  });

  const handleOrder = () => {
    if (!selectedMenu) return;

    orderMutation.mutate({
      menuId: selectedMenu.id,
      ...orderDetails,
      totalCost: calculateOrderCost(),
    });
  };

  const calculateOrderCost = () => {
    if (!selectedMenu || !orderDetails.guestCount) return 0;

    const guestCount = parseInt(orderDetails.guestCount);
    const subtotal = guestCount * selectedMenu.pricePerPerson;
    const platformFee = subtotal * 0.15; // 15% platform fee for catering

    return subtotal + platformFee;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "appetizers":
        return <Utensils className="h-4 w-4" />;
      case "main-course":
        return <ChefHat className="h-4 w-4" />;
      case "desserts":
        return <ShoppingCart className="h-4 w-4" />;
      default:
        return <Utensils className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Catering Marketplace
          </h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Discover amazing catering menus from top chefs. From intimate
            dinners to grand celebrations.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 max-w-5xl mx-auto">
          <Card className="bg-white backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 " />
                    <Input
                      placeholder="Search menus, chefs, or dishes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10  "
                    />
                  </div>
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48 ">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedCuisine}
                  onValueChange={setSelectedCuisine}
                >
                  <SelectTrigger className="w-48 ">
                    <SelectValue placeholder="Cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cuisines</SelectItem>
                    {cuisines.map((cuisine: any) => (
                      <SelectItem key={cuisine.id} value={cuisine.id}>
                        {cuisine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Menus */}
        {filteredMenus.filter((menu: CateringMenu) => menu.featured).length >
          0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Featured This Week
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenus
                .filter((menu: CateringMenu) => menu.featured)
                .slice(0, 3)
                .map((menu: CateringMenu) => (
                  <Card
                    key={menu.id}
                    className="bg-linear-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border-yellow-300/30"
                  >
                    <CardHeader className="pb-3">
                      <Badge className="w-fit bg-yellow-500/20 text-yellow-200 border-yellow-300">
                        Featured
                      </Badge>
                      <CardTitle className="text-white text-lg">
                        {menu.name}
                      </CardTitle>
                      <p className="text-orange-200">by Chef {menu.chef}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant="outline"
                            className="text-xs border-orange-300 text-orange-200"
                          >
                            {menu.cuisine}
                          </Badge>
                          {menu.dietary.slice(0, 2).map((diet, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-green-300 text-green-200"
                            >
                              {diet}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-orange-100 text-sm line-clamp-2">
                          {menu.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-white font-semibold">
                            <DollarSign className="h-4 w-4" />$
                            {menu.pricePerPerson}/person
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-white">{menu.rating}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => setSelectedMenu(menu)}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Order Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Menus Grid */}
        <div className="mb-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            All Catering Menus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenus.map((menu: CateringMenu) => (
              <Card
                key={menu.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">
                        {menu.name}
                      </CardTitle>
                      <p className="text-orange-200">by Chef {menu.chef}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getCategoryIcon(menu.category)}
                        <span className="text-orange-200 text-sm">
                          {menu.cuisine}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">
                          {menu.rating}
                        </span>
                      </div>
                      <div className="text-orange-200 text-sm">
                        {menu.reviews} reviews
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {menu.dietary.slice(0, 3).map((diet, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-green-300 text-green-200"
                        >
                          {diet}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-orange-100 text-sm line-clamp-2">
                      {menu.description}
                    </p>

                    <div className="flex items-center gap-2 text-orange-200 text-sm">
                      <MapPin className="h-4 w-4" />
                      {menu.location}
                    </div>

                    <div className="flex items-center gap-2 text-orange-200 text-sm">
                      <Clock className="h-4 w-4" />
                      {menu.preparationTime} prep time
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-white font-semibold">
                        <DollarSign className="h-4 w-4" />${menu.pricePerPerson}
                        /person
                      </div>
                      <div className="text-orange-200 text-sm">
                        Min {menu.minOrder} people
                      </div>
                    </div>

                    <Button
                      onClick={() => setSelectedMenu(menu)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Order Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Modal */}
        {selectedMenu && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-white text-xl">
                  Order {selectedMenu.name}
                </CardTitle>
                <p className="text-orange-200">
                  by Chef {selectedMenu.chef} • ${selectedMenu.pricePerPerson}
                  /person
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Menu Items</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedMenu.items.map((item, index) => (
                      <div key={index} className="text-orange-200 text-sm">
                        • {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-orange-100 text-sm font-medium">
                      Event Date
                    </label>
                    <Input
                      type="date"
                      value={orderDetails.eventDate}
                      onChange={(e) =>
                        setOrderDetails((prev) => ({
                          ...prev,
                          eventDate: e.target.value,
                        }))
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-orange-100 text-sm font-medium">
                      Number of Guests
                    </label>
                    <Input
                      type="number"
                      placeholder={`Minimum ${selectedMenu.minOrder}`}
                      value={orderDetails.guestCount}
                      onChange={(e) =>
                        setOrderDetails((prev) => ({
                          ...prev,
                          guestCount: e.target.value,
                        }))
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-orange-200"
                    />
                  </div>

                  <div>
                    <label className="text-orange-100 text-sm font-medium">
                      Serving Style
                    </label>
                    <Select
                      value={orderDetails.servingType}
                      onValueChange={(value) =>
                        setOrderDetails((prev) => ({
                          ...prev,
                          servingType: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select serving style" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedMenu.servings.map((serving) => (
                          <SelectItem key={serving} value={serving}>
                            {serving}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-orange-100 text-sm font-medium">
                      Delivery Address
                    </label>
                    <Input
                      placeholder="Event venue address"
                      value={orderDetails.deliveryAddress}
                      onChange={(e) =>
                        setOrderDetails((prev) => ({
                          ...prev,
                          deliveryAddress: e.target.value,
                        }))
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-orange-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-orange-100 text-sm font-medium">
                    Dietary Restrictions
                  </label>
                  <Input
                    placeholder="Any allergies or dietary requirements..."
                    value={orderDetails.dietaryRequests}
                    onChange={(e) =>
                      setOrderDetails((prev) => ({
                        ...prev,
                        dietaryRequests: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-orange-200"
                  />
                </div>

                <div>
                  <label className="text-orange-100 text-sm font-medium">
                    Special Instructions
                  </label>
                  <textarea
                    placeholder="Any special requests or setup instructions..."
                    value={orderDetails.specialInstructions}
                    onChange={(e) =>
                      setOrderDetails((prev) => ({
                        ...prev,
                        specialInstructions: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-orange-200 resize-none h-20"
                  />
                </div>

                {orderDetails.guestCount &&
                  parseInt(orderDetails.guestCount) >=
                    selectedMenu.minOrder && (
                    <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-300/30">
                      <div className="space-y-2">
                        <div className="flex justify-between text-white">
                          <span>
                            Subtotal ({orderDetails.guestCount} guests):
                          </span>
                          <span>
                            $
                            {(
                              parseInt(orderDetails.guestCount) *
                              selectedMenu.pricePerPerson
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-orange-200">
                          <span>Platform fee (15%):</span>
                          <span>
                            $
                            {(
                              parseInt(orderDetails.guestCount) *
                              selectedMenu.pricePerPerson *
                              0.15
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-white font-semibold border-t border-orange-300/30 pt-2">
                          <span>Total:</span>
                          <span>${calculateOrderCost().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMenu(null)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleOrder}
                    disabled={
                      orderMutation.isPending ||
                      !orderDetails.guestCount ||
                      parseInt(orderDetails.guestCount) < selectedMenu.minOrder
                    }
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {orderMutation.isPending
                      ? "Placing Order..."
                      : "Place Order"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
