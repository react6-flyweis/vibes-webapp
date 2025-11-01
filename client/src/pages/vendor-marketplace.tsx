import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useVendors } from "@/queries/vendors";
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
import { Search, Filter } from "lucide-react";

// simple helper to make category keys readable when we don't have a label map
function humanizeCategory(key?: string) {
  if (!key) return "";
  return key
    .toString()
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}

export default function VendorMarketplace() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: vendors = [], isLoading, error } = useVendors(3);
  const { data: serviceTypes = [] } = useVendorServiceTypes();

  // Filter vendors based on search and filters
  const vendorsArray = Array.isArray(vendors) ? vendors : [];
  const filteredVendors = vendorsArray.filter((vendor: any) => {
    const matchesSearch =
      !searchQuery ||
      vendor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.businessDescription
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesLocation =
      !location ||
      vendor.serviceLocation?.toLowerCase().includes(location.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "all" ||
      // match by string category key
      vendor.category === selectedCategory ||
      vendor.categories?.includes(selectedCategory) ||
      // match by business_category_id (numeric selection) or business_category_details name
      vendor.business_category_id === Number(selectedCategory) ||
      vendor.business_category_details?.business_category === selectedCategory;

    return matchesSearch && matchesLocation && matchesCategory;
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
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {serviceTypes.map((st) => (
                    <SelectItem
                      key={st.vendor_service_type_id}
                      value={String(st.vendor_service_type_id)}
                    >
                      {st.name}
                    </SelectItem>
                  ))}
                  {/* {categoryGroups.map((group) => (
                    <div key={group.title}>
                      <div className="font-semibold text-xs text-gray-500 px-2 py-1">
                        {group.title}
                      </div>
                      {group.categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {categoryLabels[category]}
                        </SelectItem>
                      ))}
                    </div>
                  ))} */}
                </SelectContent>
              </Select>

              <Input
                placeholder="Location..."
                onChange={(e) => navigate(e.target.value)}
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
                {/* {categoryGroups.map((group) => (
                  <div key={group.title}>
                    <h4 className="text-sm font-medium party-gray mb-2">
                      {group.title}
                    </h4>
                    <div className="space-y-1 ml-2">
                      {serviceTypes.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs font-medium party-gray mb-1">Service Types</div>
                          {serviceTypes.map((st) => (
                            <button
                              key={st.vendor_service_type_id}
                              onClick={() =>
                                setSelectedCategory(String(st.vendor_service_type_id))
                              }
                              className={`block text-sm w-full text-left px-2 py-1 rounded transition-colors ${
                                selectedCategory === String(st.vendor_service_type_id)
                                  ? "bg-party-coral text-white"
                                  : "party-gray hover:bg-gray-100"
                              }`}
                            >
                              {st.name}
                            </button>
                          ))}
                        </div>
                      )}
                      {group.categories.map((category) => (
                        <button
                          key={category}
                          onClick={() =>
                            setSelectedCategory(
                              category === selectedCategory ? "" : category
                            )
                          }
                          className={`block text-sm w-full text-left px-2 py-1 rounded transition-colors ${
                            selectedCategory === category
                              ? "bg-party-coral text-white"
                              : "party-gray hover:bg-gray-100"
                          }`}
                        >
                          {categoryLabels[category]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))} */}
                <div className="space-y-1 ml-2">
                  {serviceTypes?.map((st) => (
                    <button
                      key={st.vendor_service_type_id}
                      onClick={() =>
                        setSelectedCategory(String(st.vendor_service_type_id))
                      }
                      className={`block text-sm w-full text-left px-2 py-1 rounded transition-colors ${
                        selectedCategory === String(st.vendor_service_type_id)
                          ? "bg-party-coral text-white"
                          : "party-gray hover:bg-gray-100"
                      }`}
                    >
                      {st.name}
                    </button>
                  ))}
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
