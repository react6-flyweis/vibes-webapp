import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { usePublicVendors } from "@/queries/vendors";
import { useCategoriesQuery } from "@/queries/categories";
import VendorCard from "@/components/vendor-card";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

export default function VendorMarketplace() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Read min and max from URL params on mount
  useEffect(() => {
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    if (min) setMinPrice(parseFloat(min));
    if (max) setMaxPrice(parseFloat(max));

    // Update price range dropdown to reflect URL params
    if (min || max) {
      const minVal = min ? parseFloat(min) : 0;
      const maxVal = max ? parseFloat(max) : Infinity;

      // Try to match with existing ranges
      if (minVal === 0 && maxVal === 500) {
        setPriceRange("0-500");
      } else if (minVal === 500 && maxVal === 1000) {
        setPriceRange("500-1000");
      } else if (minVal === 1000 && maxVal === 2500) {
        setPriceRange("1000-2500");
      } else if (minVal >= 2500 && maxVal === Infinity) {
        setPriceRange("2500+");
      } else {
        // Custom range - set a special value
        setPriceRange("custom");
      }

      // Keep filters open when min/max params are present
      setShowFilters(true);
    }
  }, [searchParams]);
  // booking success dialog moved into each VendorCard

  const { data: vendors = [], isLoading, error } = usePublicVendors();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategoriesQuery();

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
  };

  // Filter vendors based on search and filters
  const vendorsArray = Array.isArray(vendors) ? vendors : [];
  const filteredVendors = vendorsArray.filter((vendor: any) => {
    // Helper to get business name from either flat or nested structure
    const businessName =
      vendor.Basic_information_business_name ||
      vendor.business_information_details?.business_name;

    const businessDescription =
      vendor.Basic_information_Business_Description ||
      vendor.business_information_details
        ?.Basic_information_Business_Description;

    const matchesSearch =
      !searchQuery ||
      businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      businessDescription?.toLowerCase().includes(searchQuery.toLowerCase());

    // Helper to get location info from either flat or nested structure
    const serviceLocation =
      vendor.service_areas_locaiton ||
      vendor.business_information_details?.service_areas_locaiton;

    const businessAddress =
      vendor.Basic_information_BusinessAddress ||
      vendor.business_information_details?.Basic_information_BusinessAddress;

    const pincode =
      vendor.service_areas_pincode ||
      vendor.business_information_details?.service_areas_pincode;

    const matchesLocation =
      !location ||
      serviceLocation?.toLowerCase().includes(location.toLowerCase()) ||
      businessAddress?.toLowerCase().includes(location.toLowerCase()) ||
      pincode?.includes(location);

    // Get categories from either flat service_categories or nested categories_fees_details
    const categories =
      vendor.service_categories ||
      vendor.categories_fees_details?.map((cat: any) => ({
        category_id: cat.category_id,
        category_name: cat.category_details?.category_name,
      })) ||
      [];

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((selectedCat) => {
        return categories.some(
          (serviceCat: any) =>
            String(serviceCat.category_id) === selectedCat ||
            serviceCat.category_name?.toLowerCase() ===
              selectedCat.toLowerCase()
        );
      });

    const matchesPriceRange = (() => {
      // Get prices from either structure
      const prices =
        vendor.service_categories?.map((cat: any) => cat.pricing) ||
        vendor.categories_fees_details?.map((cat: any) => cat.Price) ||
        [];

      if (prices.length === 0) return true;
      const vendorMinPrice = Math.min(...prices);

      // First check URL params (min/max)
      if (minPrice !== null || maxPrice !== null) {
        const aboveMin = minPrice === null || vendorMinPrice >= minPrice;
        const belowMax = maxPrice === null || vendorMinPrice <= maxPrice;
        return aboveMin && belowMax;
      }

      // Fallback to dropdown price range if no URL params
      if (!priceRange || priceRange === "any-price") return true;

      switch (priceRange) {
        case "0-500":
          return vendorMinPrice <= 500;
        case "500-1000":
          return vendorMinPrice >= 500 && vendorMinPrice <= 1000;
        case "1000-2500":
          return vendorMinPrice >= 1000 && vendorMinPrice <= 2500;
        case "2500+":
          return vendorMinPrice >= 2500;
        default:
          return true;
      }
    })();

    return (
      matchesSearch && matchesLocation && matchesCategory && matchesPriceRange
    );
  });

  return (
    <div className="min-h-screen bg-[#0C111F]">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Vendor Marketplace
          </h1>
          <p className="text-xl text-white">
            Discover and book the perfect vendors for your party
          </p>
        </div>

        {/* Booked success dialog moved into individual vendor cards */}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search vendors, services, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Category Multi-Select */}
              <Select onValueChange={(value) => toggleCategory(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category._id}
                      value={String(
                        category.category_id || category.item_category_id
                      )}
                    >
                      {category.category_name || category.categorytxt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-40"
              />

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Selected Categories Display */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">
                Selected:
              </span>
              {selectedCategories.map((categoryId) => {
                const category = categories.find(
                  (cat) =>
                    String(cat.category_id || cat.item_category_id) ===
                    categoryId
                );
                const categoryName =
                  category?.category_name ||
                  category?.categorytxt ||
                  categoryId;

                return (
                  <Badge
                    key={categoryId}
                    variant="secondary"
                    className="flex items-center gap-1 bg-party-coral text-white"
                  >
                    {categoryName}
                    <button
                      onClick={() => removeCategory(categoryId)}
                      className="ml-1 hover:bg-white/20 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategories([])}
                className="text-xs h-6"
              >
                Clear All
              </Button>
            </div>
          )}

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={priceRange}
                onValueChange={(value) => {
                  setPriceRange(value);
                  // Clear URL-based min/max when user manually changes the dropdown
                  if (value !== "custom") {
                    setMinPrice(null);
                    setMaxPrice(null);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Price Range">
                    {priceRange === "custom" &&
                    (minPrice !== null || maxPrice !== null)
                      ? `$${minPrice ?? 0} - ${
                          maxPrice !== null ? `$${maxPrice}` : "∞"
                        }`
                      : priceRange === "any-price"
                      ? "Any Price"
                      : priceRange === "0-500"
                      ? "$0 - $500"
                      : priceRange === "500-1000"
                      ? "$500 - $1,000"
                      : priceRange === "1000-2500"
                      ? "$1,000 - $2,500"
                      : priceRange === "2500+"
                      ? "$2,500+"
                      : "Price Range"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any-price">Any Price</SelectItem>
                  <SelectItem value="0-500">$0 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                  <SelectItem value="2500+">$2,500+</SelectItem>
                  {priceRange === "custom" &&
                    (minPrice !== null || maxPrice !== null) && (
                      <SelectItem value="custom">
                        Custom: ${minPrice ?? 0} -{" "}
                        {maxPrice !== null ? `$${maxPrice}` : "∞"}
                      </SelectItem>
                    )}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Service Days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="holidays">Holidays</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
              <h3 className="font-semibold party-dark mb-4">Categories</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  {categoriesLoading ? (
                    <div className="text-sm text-gray-400">
                      Loading categories...
                    </div>
                  ) : (
                    categories.map((category) => {
                      const categoryId = String(
                        category.category_id || category.item_category_id
                      );
                      const categoryName =
                        category.category_name || category.categorytxt;

                      // Count vendors with this category
                      const count = vendorsArray.filter((vendor: any) => {
                        const categories =
                          vendor.service_categories ||
                          vendor.categories_fees_details?.map((cat: any) => ({
                            category_id: cat.category_id,
                          })) ||
                          [];
                        return categories.some(
                          (cat: any) => String(cat.category_id) === categoryId
                        );
                      }).length;

                      return (
                        <button
                          key={category._id}
                          onClick={() => toggleCategory(categoryId)}
                          className={`flex items-center justify-between text-sm w-full text-left px-3 py-2 rounded transition-colors ${
                            selectedCategories.includes(categoryId)
                              ? "bg-party-coral text-white"
                              : "party-gray hover:bg-gray-100"
                          }`}
                        >
                          <span>{categoryName}</span>
                          <span
                            className={`text-xs ${
                              selectedCategories.includes(categoryId)
                                ? "text-white/80"
                                : "text-gray-400"
                            }`}
                          >
                            ({count})
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm party-gray">
                {isLoading
                  ? "Loading..."
                  : `${filteredVendors.length} vendors found`}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm party-gray">Featured</span>
                <Badge className="bg-party-mint text-white">
                  ⭐ Local Favorites
                </Badge>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 animate-pulse"
                  >
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold party-gray mb-2">
                  No vendors found
                </h3>
                <p className="party-gray">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVendors.map((vendor: any) => (
                  <VendorCard
                    key={vendor._id ?? vendor.user_id ?? vendor.userId}
                    vendor={vendor}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div
          className="bg-linear-to-br from-party-coral to-party-turquoise rounded-xl p-8 mt-12 text-center text-white"
          style={{
            background:
              "linear-gradient(90deg, #9333EA 0%, #DB2777 50%, #F97316 100%)",
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Are you a vendor?</h2>
          <p className="text-lg opacity-90 mb-6">
            Join our marketplace and connect with party planners in your area
          </p>
          <Link to="/vendor-onboarding">
            <Button className="bg-white text-[#3C83F6] hover:bg-gray-100">
              Join as Vendor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
