import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Filter,
  ExternalLink,
  MessageCircle,
  Heart,
  Share2
} from "lucide-react";

const categoryGroups = [
  {
    title: "Beverage & Liquor",
    categories: [
      "liquor-stores", "mobile-bartending", "alcohol-delivery", 
      "beverage-caterers", "specialty-drinks"
    ]
  },
  {
    title: "Food & Catering", 
    categories: [
      "full-service-caterers", "food-trucks", "private-chefs",
      "grazing-tables", "dessert-specialists", "snack-vendors"
    ]
  },
  {
    title: "Entertainment",
    categories: [
      "djs", "live-music", "karaoke-rentals", "av-technicians",
      "party-hosts", "performers"
    ]
  },
  {
    title: "Decor & Rentals",
    categories: [
      "event-decorators", "balloon-artists", "furniture-rentals",
      "tent-rentals", "linen-rentals", "flower-arrangements"
    ]
  },
  {
    title: "Photo & Video",
    categories: [
      "photographers", "videographers", "photo-booth-rentals",
      "content-concierge"
    ]
  },
  {
    title: "Planning & Coordination",
    categories: [
      "event-planners", "themed-designers", "wedding-planners",
      "kids-coordinators", "corporate-managers"
    ]
  },
  {
    title: "Supplies & Favors",
    categories: [
      "party-supply-stores", "favor-boutiques", "eco-suppliers",
      "custom-print-shops"
    ]
  },
  {
    title: "Activities & Games",
    categories: [
      "bounce-house-rentals", "game-rentals", "face-painting",
      "craft-stations"
    ]
  },
  {
    title: "Logistics",
    categories: [
      "valet-parking", "event-security", "cleaning-crews",
      "delivery-drivers", "portable-restrooms"
    ]
  },
  {
    title: "Local & Specialty",
    categories: [
      "boutique-brands", "home-based-chefs", "cultural-services",
      "minority-owned"
    ]
  }
];

const categoryLabels: Record<string, string> = {
  "liquor-stores": "Local Liquor Stores",
  "mobile-bartending": "Mobile Bartending",
  "alcohol-delivery": "Alcohol Delivery",
  "beverage-caterers": "Beverage Caterers",
  "specialty-drinks": "Specialty Drinks",
  "full-service-caterers": "Full-Service Caterers",
  "food-trucks": "Food Trucks",
  "private-chefs": "Private Chefs",
  "grazing-tables": "Grazing Tables",
  "dessert-specialists": "Dessert Specialists",
  "snack-vendors": "Snack Vendors",
  "djs": "DJs & Mobile DJ",
  "live-music": "Live Music",
  "karaoke-rentals": "Karaoke Rentals",
  "av-technicians": "A/V Technicians",
  "party-hosts": "Party Hosts & MCs",
  "performers": "Performers",
  "event-decorators": "Event Decorators",
  "balloon-artists": "Balloon Artists",
  "furniture-rentals": "Furniture Rentals",
  "tent-rentals": "Tent Rentals",
  "linen-rentals": "Linen Rentals",
  "flower-arrangements": "Flower Arrangements",
  "photographers": "Photographers",
  "videographers": "Videographers",
  "photo-booth-rentals": "Photo Booth Rentals",
  "content-concierge": "Content Services",
  "event-planners": "Event Planners",
  "themed-designers": "Themed Designers",
  "wedding-planners": "Wedding Planners",
  "kids-coordinators": "Kids Coordinators",
  "corporate-managers": "Corporate Managers",
  "party-supply-stores": "Party Supply Stores",
  "favor-boutiques": "Favor Boutiques",
  "eco-suppliers": "Eco-Friendly Suppliers",
  "custom-print-shops": "Custom Print Shops",
  "bounce-house-rentals": "Bounce House Rentals",
  "game-rentals": "Game Rentals",
  "face-painting": "Face Painting",
  "craft-stations": "Craft Stations",
  "valet-parking": "Valet & Parking",
  "event-security": "Event Security",
  "cleaning-crews": "Cleaning Crews",
  "delivery-drivers": "Delivery & Runners",
  "portable-restrooms": "Portable Restrooms",
  "boutique-brands": "Boutique Brands",
  "home-based-chefs": "Home-Based Chefs",
  "cultural-services": "Cultural Services",
  "minority-owned": "Minority/Women-Owned"
};

interface VendorCardProps {
  vendor: any;
}

function VendorCard({ vendor }: VendorCardProps) {
  const formatPrice = (cents: number) => `$${(cents / 100).toLocaleString()}`;
  const rating = 4.5 + Math.random() * 0.5; // Simulated rating

  return (
    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {vendor.businessLogo && (
              <img 
                src={vendor.businessLogo} 
                alt={vendor.businessName}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">{vendor.businessName}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-3 h-3 mr-1" />
                  {vendor.serviceLocation}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-sm text-gray-700 dark:text-gray-300">
          {vendor.businessDescription}
        </CardDescription>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {vendor.categories?.slice(0, 3).map((category: string) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {categoryLabels[category]}
            </Badge>
          ))}
          {vendor.categories?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{vendor.categories.length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Pricing */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>
              {formatPrice(vendor.priceRangeMin)} - {formatPrice(vendor.priceRangeMax)}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Min: {formatPrice(vendor.minimumBookingFee)}
          </div>
        </div>
        
        {/* Service Details */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {vendor.serviceDays?.join(", ")}
          </div>
          {vendor.willingToTravel && (
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              Will travel
            </div>
          )}
        </div>
        
        {/* Payment Methods */}
        <div className="flex flex-wrap gap-1">
          {vendor.paymentMethods?.slice(0, 3).map((method: string) => (
            <Badge key={method} variant="outline" className="text-xs capitalize">
              {method}
            </Badge>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button className="flex-1 bg-party-coral hover:bg-red-500 text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact
          </Button>
          <div className="flex space-x-1">
            {vendor.websiteUrl && (
              <Button variant="outline" size="sm">
                <Globe className="w-4 h-4" />
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Reviews Link */}
        {vendor.reviewsLink && (
          <div className="pt-2 border-t">
            <a 
              href={vendor.reviewsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs party-coral hover:underline flex items-center"
            >
              View Reviews <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VendorMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: vendors = [], isLoading, error } = useQuery({
    queryKey: ['/api/marketplace/vendors', selectedCategory],
    retry: false,
  });



  // Filter vendors based on search and filters
  const vendorsArray = Array.isArray(vendors) ? vendors : [];
  const filteredVendors = vendorsArray.filter((vendor: any) => {
    const matchesSearch = !searchQuery || 
      vendor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.businessDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = !location || 
      vendor.serviceLocation?.toLowerCase().includes(location.toLowerCase());
    
    const matchesCategory = !selectedCategory || selectedCategory === "all" ||
      vendor.category === selectedCategory || 
      vendor.categories?.includes(selectedCategory);
      
    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0C111F]">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Vendor Marketplace</h1>
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryGroups.map((group) => (
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
                {categoryGroups.map((group) => (
                  <div key={group.title}>
                    <h4 className="text-sm font-medium party-gray mb-2">{group.title}</h4>
                    <div className="space-y-1 ml-2">
                      {group.categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category === selectedCategory ? "" : category)}
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
                ))}
              </div>
            </div>
          </div>
          
          {/* Vendor Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm party-gray">
                {isLoading ? "Loading..." : `${filteredVendors.length} vendors found`}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm party-gray">Featured</span>
                <Badge className="bg-party-mint text-white">⭐ Local Favorites</Badge>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold party-gray mb-2">No vendors found</h3>
                <p className="party-gray">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVendors.map((vendor: any) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="bg-linear-to-br from-party-coral to-party-turquoise rounded-xl p-8 mt-12 text-center text-white" style={{
          background: "linear-gradient(90deg, #9333EA 0%, #DB2777 50%, #F97316 100%)"

        }}>
          <h2 className="text-2xl font-bold mb-4">Are you a vendor?</h2>
          <p className="text-lg opacity-90 mb-6">
            Join our marketplace and connect with party planners in your area
          </p>
          <Link href="/vendor-onboarding">
            <Button className="bg-white text-[#3C83F6] hover:bg-gray-100">
              Join as Vendor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}