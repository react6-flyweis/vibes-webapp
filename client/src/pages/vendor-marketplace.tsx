import { useState } from "react";
import { Link } from "react-router";
import { usePublicVendors } from "@/queries/vendors";
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
import { useVendorServiceTypes } from "@/queries/vendorServiceTypes";
import { Search, Filter, X } from "lucide-react";

import BookedSuccessDialog from "@/components/BookedSuccessDialog";

export default function VendorMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [bookedOpen, setBookedOpen] = useState(false);
  const [bookedInfo, setBookedInfo] = useState<any | null>(null);

  const { data: vendors = [], isLoading, error } = usePublicVendors();
  const { data: serviceTypes = [] } = useVendorServiceTypes();

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
    const matchesSearch =
      !searchQuery ||
      vendor.Basic_information_business_name?.toLowerCase().includes(
        searchQuery.toLowerCase()
      ) ||
      vendor.Basic_information_Business_Description?.toLowerCase().includes(
        searchQuery.toLowerCase()
      );

    const matchesLocation =
      !location ||
      vendor.service_areas_locaiton
        ?.toLowerCase()
        .includes(location.toLowerCase()) ||
      vendor.Basic_information_BusinessAddress?.toLowerCase().includes(
        location.toLowerCase()
      ) ||
      vendor.service_areas_pincode?.includes(location);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((selectedCat) => {
        // Check if any of the vendor's service_categories match the selected category
        return vendor.service_categories?.some(
          (serviceCat: any) =>
            String(serviceCat.category_id) === selectedCat ||
            serviceCat.category_name?.toLowerCase() ===
              selectedCat.toLowerCase()
        );
      });

    const matchesPriceRange =
      !priceRange ||
      priceRange === "any-price" ||
      (() => {
        const prices =
          vendor.service_categories?.map((cat: any) => cat.pricing) || [];
        if (prices.length === 0) return true;
        const minPrice = Math.min(...prices);

        switch (priceRange) {
          case "0-500":
            return minPrice <= 500;
          case "500-1000":
            return minPrice >= 500 && minPrice <= 1000;
          case "1000-2500":
            return minPrice >= 1000 && minPrice <= 2500;
          case "2500+":
            return minPrice >= 2500;
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

        {/* Booked success dialog (can be triggered by other components) */}
        <BookedSuccessDialog
          open={bookedOpen}
          onOpenChange={setBookedOpen}
          info={bookedInfo}
          onDone={() => setBookedInfo(null)}
        />

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
                  {(() => {
                    const categoryMap = new Map<string, string>();
                    vendorsArray.forEach((vendor: any) => {
                      if (
                        vendor.service_categories &&
                        Array.isArray(vendor.service_categories)
                      ) {
                        vendor.service_categories.forEach((cat: any) => {
                          const id = String(cat.category_id);
                          if (!categoryMap.has(id)) {
                            categoryMap.set(id, cat.category_name);
                          }
                        });
                      }
                    });
                    return Array.from(categoryMap.entries())
                      .sort((a, b) => a[1].localeCompare(b[1]))
                      .map(([id, name]) => (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      ));
                  })()}
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
                // Find category name from vendors' service_categories
                let categoryName = categoryId;
                for (const vendor of vendorsArray) {
                  if (
                    vendor.service_categories &&
                    Array.isArray(vendor.service_categories)
                  ) {
                    const foundCat = vendor.service_categories.find(
                      (cat: any) => String(cat.category_id) === categoryId
                    );
                    if (foundCat) {
                      categoryName = foundCat.category_name;
                      break;
                    }
                  }
                }

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
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any-price">Any Price</SelectItem>
                  <SelectItem value="0-500">$0 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                  <SelectItem value="2500+">$2,500+</SelectItem>
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
                  {/* Extract unique categories from all vendors */}
                  {(() => {
                    const categoryMap = new Map<
                      string,
                      { id: string; name: string; count: number }
                    >();

                    vendorsArray.forEach((vendor: any) => {
                      if (
                        vendor.service_categories &&
                        Array.isArray(vendor.service_categories)
                      ) {
                        vendor.service_categories.forEach((cat: any) => {
                          const id = String(cat.category_id);
                          if (categoryMap.has(id)) {
                            categoryMap.get(id)!.count++;
                          } else {
                            categoryMap.set(id, {
                              id,
                              name: cat.category_name,
                              count: 1,
                            });
                          }
                        });
                      }
                    });

                    const uniqueCategories = Array.from(
                      categoryMap.values()
                    ).sort((a, b) => a.name.localeCompare(b.name));

                    return uniqueCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`flex items-center justify-between text-sm w-full text-left px-3 py-2 rounded transition-colors ${
                          selectedCategories.includes(category.id)
                            ? "bg-party-coral text-white"
                            : "party-gray hover:bg-gray-100"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span
                          className={`text-xs ${
                            selectedCategories.includes(category.id)
                              ? "text-white/80"
                              : "text-gray-400"
                          }`}
                        >
                          ({category.count})
                        </span>
                      </button>
                    ));
                  })()}
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
                    onBooked={(info: any) => {
                      setBookedInfo(info);
                      setBookedOpen(true);
                    }}
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
