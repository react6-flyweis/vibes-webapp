import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Box,
  ShoppingCart,
  Star,
  Eye,
  Smartphone,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ARItem {
  id: number;
  name: string;
  category: string;
  price: string;
  vendor: string;
  rating: number;
  arModelUrl: string;
  purchaseLink: string;
  description: string;
  inStock: boolean;
  previewImage: string;
}

const mockARItems: ARItem[] = [
  {
    id: 1,
    name: "LED String Light Canopy",
    category: "lighting",
    price: "$89.99",
    vendor: "Ambient Events Co.",
    rating: 4.8,
    arModelUrl: "/ar-models/led-canopy.glb",
    purchaseLink: "https://amazon.com/led-string-lights",
    description:
      "Transform your space with warm, twinkling overhead lighting that creates magical ambiance",
    inStock: true,
    previewImage: "🌟",
  },
  {
    id: 2,
    name: "Vintage Cocktail Bar Setup",
    category: "furniture",
    price: "$299.99",
    vendor: "Retro Rentals",
    rating: 4.9,
    arModelUrl: "/ar-models/cocktail-bar.glb",
    purchaseLink: "https://eventrentals.com/cocktail-bar",
    description:
      "Complete mobile bar unit with brass fixtures and vintage styling",
    inStock: true,
    previewImage: "🍸",
  },
  {
    id: 3,
    name: "Boho Lounge Seating Set",
    category: "furniture",
    price: "$199.99",
    vendor: "Cozy Corners",
    rating: 4.7,
    arModelUrl: "/ar-models/boho-seating.glb",
    purchaseLink: "https://bohostyle.com/lounge-set",
    description:
      "Low-profile seating with colorful cushions and natural textures",
    inStock: true,
    previewImage: "🪑",
  },
  {
    id: 4,
    name: "Neon Sign Custom Display",
    category: "decor",
    price: "$159.99",
    vendor: "Glow Signs Studio",
    rating: 5.0,
    arModelUrl: "/ar-models/neon-sign.glb",
    purchaseLink: "https://customneon.com/party-signs",
    description: "Personalized LED neon sign with custom text and colors",
    inStock: false,
    previewImage: "✨",
  },
  {
    id: 5,
    name: "Flower Wall Backdrop",
    category: "decor",
    price: "$349.99",
    vendor: "Bloom & Beauty",
    rating: 4.6,
    arModelUrl: "/ar-models/flower-wall.glb",
    purchaseLink: "https://flowerwall.com/backdrops",
    description: "Stunning 8x8 artificial flower wall perfect for photos",
    inStock: true,
    previewImage: "🌸",
  },
  {
    id: 6,
    name: "DJ Booth with LED Panels",
    category: "entertainment",
    price: "$499.99",
    vendor: "Sound & Vision",
    rating: 4.8,
    arModelUrl: "/ar-models/dj-booth.glb",
    purchaseLink: "https://djequipment.com/led-booth",
    description:
      "Professional DJ setup with reactive LED panels and sound system",
    inStock: true,
    previewImage: "🎧",
  },
];

export default function ARPreview() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [arItems, setArItems] = useState<ARItem[]>(mockARItems);
  const [isARActive, setIsARActive] = useState(false);
  const [placedItems, setPlacedItems] = useState<ARItem[]>([]);
  const { toast } = useToast();

  const categories = ["all", "lighting", "furniture", "decor", "entertainment"];

  const startARPreview = () => {
    // In production, this would initialize WebXR or AR.js
    setIsARActive(true);
    toast({
      title: "📱 AR Camera Activated!",
      description: "Point your camera around to place items in your space!",
    });
  };

  const placeItem = (item: ARItem) => {
    setPlacedItems([...placedItems, item]);
    toast({
      title: `📍 ${item.name} Placed!`,
      description: "Item positioned in your space. Tap to adjust placement.",
    });
  };

  const removeItem = (itemId: number) => {
    setPlacedItems(placedItems.filter((item) => item.id !== itemId));
    toast({
      title: "🗑️ Item Removed",
      description: "Item removed from your AR space.",
    });
  };

  const saveConfiguration = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/ar-previews", {
        method: "POST",
        body: JSON.stringify({
          eventId: 1,
          placedItems: placedItems.map((item) => ({
            itemName: item.name,
            category: item.category,
            arModelUrl: item.arModelUrl,
            purchaseLink: item.purchaseLink,
            price: parseInt(item.price.replace(/[^0-9]/g, "")),
            vendor: item.vendor,
            placementData: JSON.stringify({ x: 0, y: 0, z: 0, rotation: 0 }),
          })),
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "💾 Configuration Saved!",
        description: "Your AR room setup has been saved to your event plan!",
      });
    },
  });

  const filteredItems =
    selectedCategory === "all"
      ? arItems
      : arItems.filter((item) => item.category === selectedCategory);

  const getTotalPrice = () => {
    return placedItems.reduce((total, item) => {
      return total + parseInt(item.price.replace(/[^0-9]/g, ""));
    }, 0);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AR Space Preview
            </h1>
            <Box className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Visualize decorations and furniture in your real space using
            augmented reality before you buy or rent!
          </p>
        </div>

        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="catalog">Item Catalog</TabsTrigger>
            <TabsTrigger value="ar-view">AR Preview</TabsTrigger>
            <TabsTrigger value="shopping-list">Shopping Cart</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Browse AR-Ready Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <Card
                      key={item.id}
                      className={`${!item.inStock ? "opacity-60" : ""}`}
                    >
                      <CardContent className="p-4">
                        <div className="text-center mb-4">
                          <div className="text-6xl mb-2">
                            {item.previewImage}
                          </div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg text-green-600">
                              {item.price}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm">{item.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {item.vendor}
                          </p>
                          <Badge
                            variant={item.inStock ? "default" : "secondary"}
                          >
                            {item.inStock ? "In Stock" : "Pre-order"}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <Button
                            onClick={() => placeItem(item)}
                            disabled={!item.inStock}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <Box className="h-4 w-4 mr-2" />
                            Preview in AR
                          </Button>
                          <Button variant="outline" className="w-full" asChild>
                            <a
                              href={item.purchaseLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              View Details
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ar-view" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Augmented Reality View
                  </span>
                  <Button
                    onClick={startARPreview}
                    className={`${
                      isARActive
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isARActive ? (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        AR Active
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Start AR Camera
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isARActive ? (
                  <div className="text-center py-12">
                    <Camera className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Ready for AR Preview
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Click "Start AR Camera" to begin visualizing items in your
                      space
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg max-w-md mx-auto">
                      <h4 className="font-semibold mb-2">How it works:</h4>
                      <ol className="text-sm text-left space-y-1">
                        <li>1. Allow camera access when prompted</li>
                        <li>2. Point camera at your event space</li>
                        <li>3. Tap items from catalog to place them</li>
                        <li>4. Move around to see items from all angles</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-linear-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">AR Camera Active</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your camera is now detecting surfaces. Select items from
                        the catalog to place them in your space.
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 dark:bg-blue-950 min-h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📱</div>
                        <p className="text-lg font-semibold">AR Camera View</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          In production, this would show your live camera feed
                          with 3D items overlaid
                        </p>
                      </div>
                    </div>

                    {placedItems.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Placed Items:</h4>
                        <div className="grid gap-2">
                          {placedItems.map((item, index) => (
                            <div
                              key={`${item.id}-${index}`}
                              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                  {item.previewImage}
                                </span>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.price}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeItem(item.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shopping-list" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Your AR Shopping List
                  </span>
                  <Button
                    onClick={() => saveConfiguration.mutate()}
                    disabled={
                      placedItems.length === 0 || saveConfiguration.isPending
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Save Configuration
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {placedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No items selected yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Use AR preview to place items in your space, then they'll
                      appear here!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-linear-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            Total Estimated Cost
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {placedItems.length} items selected
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            ${(getTotalPrice() / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {placedItems.map((item, index) => (
                        <Card key={`${item.id}-${index}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">
                                  {item.previewImage}
                                </span>
                                <div>
                                  <h4 className="font-semibold">{item.name}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.vendor}
                                  </p>
                                  <Badge variant="outline" className="mt-1">
                                    {item.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">
                                  {item.price}
                                </p>
                                <Button size="sm" variant="outline" asChild>
                                  <a
                                    href={item.purchaseLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Purchase
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
