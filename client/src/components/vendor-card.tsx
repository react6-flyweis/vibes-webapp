import React from "react";
import { useNavigate } from "react-router";
import { IVendor, IVendorOnboarding } from "@/queries/vendors";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  MapPin,
  DollarSign,
  Calendar,
  MessageCircle,
  Heart,
  Share2,
  ExternalLink,
  Clock,
} from "lucide-react";
import BookVendorDialog from "@/components/book-vendor-dialog";
import { useAuthStore } from "@/store/auth-store";

function humanizeCategory(key?: string) {
  if (!key) return "";
  return key
    .toString()
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}

export default function VendorCard({
  vendor,
  onBooked,
}: {
  vendor: IVendor | IVendorOnboarding | any;
  onBooked?: (info: any) => void;
}) {
  const formatPrice = (price: number) => `$${price.toLocaleString()}`;
  const rating = 4.5 + Math.random() * 0.5; // Simulated rating
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Helper to check if vendor is from new onboarding API
  const isOnboardingVendor = (v: any): v is IVendorOnboarding => {
    return "Basic_information_business_name" in v;
  };

  // Extract vendor details based on type
  const vendorName = isOnboardingVendor(vendor)
    ? vendor.Basic_information_business_name
    : vendor.business_name || vendor.name;

  const vendorDescription = isOnboardingVendor(vendor)
    ? vendor.Basic_information_Business_Description
    : "No description available for this vendor.";

  const vendorLocation = isOnboardingVendor(vendor)
    ? vendor.service_areas_locaiton
    : vendor.city_details?.name ||
      vendor.country_details?.name ||
      "Unknown Location";

  const vendorId = isOnboardingVendor(vendor)
    ? vendor.Vendor_id
    : vendor.user_id ?? vendor._id;

  const workingHours = isOnboardingVendor(vendor)
    ? vendor.service_areas_workingHoures
    : null;

  return (
    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full shadow bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
              {vendorName?.charAt(0).toUpperCase() || "V"}
            </div>

            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">
                {vendorName}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium ml-1">
                    {rating.toFixed(1)}
                  </span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-3 h-3 mr-1" />
                  {vendorLocation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
          {vendorDescription}
        </CardDescription>

        {/* Service Categories - Now displaying from array */}
        {isOnboardingVendor(vendor) &&
        vendor.service_categories &&
        vendor.service_categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {vendor.service_categories.map((category) => (
              <Badge
                key={category._id}
                variant="secondary"
                className="text-xs bg-gradient-primary text-white"
              >
                {category.category_name}
              </Badge>
            ))}
          </div>
        ) : !isOnboardingVendor(vendor) &&
          vendor.business_category_details?.business_category ? (
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="text-xs bg-gradient-primary text-white"
            >
              {vendor.business_category_details.business_category}
            </Badge>
          </div>
        ) : null}

        {/* Pricing - Now showing from service categories */}
        {isOnboardingVendor(vendor) &&
          vendor.service_categories &&
          vendor.service_categories.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">
                  Starting from{" "}
                  {formatPrice(
                    Math.min(...vendor.service_categories.map((c) => c.pricing))
                  )}
                </span>
              </div>
              {vendor.service_categories.length > 1 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {vendor.service_categories.length} services
                </div>
              )}
            </div>
          )}

        {/* Working Hours */}
        {workingHours && (
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-2" />
            <span>{workingHours}</span>
          </div>
        )}

        {/* Service Areas */}
        {isOnboardingVendor(vendor) &&
          (vendor.service_areas_pincode ||
            vendor.Basic_information_BusinessAddress) && (
            <div className="flex items-start text-xs text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2 mt-0.5" />
              <div className="flex-1">
                {vendor.Basic_information_BusinessAddress && (
                  <div className="line-clamp-1">
                    {vendor.Basic_information_BusinessAddress}
                  </div>
                )}
                {vendor.service_areas_pincode && (
                  <div className="text-gray-500">
                    Pincode: {vendor.service_areas_pincode}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Single action: Book Vendor — opens booking dialog */}
        <div className="pt-2">
          <BookVendorDialog
            vendorId={vendorId}
            userId={user?.user_id ?? 0}
            trigger={
              <Button className="w-full bg-gradient-cta">
                <Calendar className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            }
            onBooked={onBooked}
          />
        </div>

        {/* Reviews Link: commented because IVendor does not include reviewsLink */}
        {/* vendor.reviewsLink && (
          <div className="pt-2 border-t">
            <a href={vendor.reviewsLink} target="_blank" rel="noopener noreferrer" className="text-xs party-coral hover:underline flex items-center">
              View Reviews <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        ) */}
      </CardContent>
    </Card>
  );
}
