import React from "react";
import { useNavigate } from "react-router";
import { IVendor } from "@/queries/vendors";
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

export default function VendorCard({ vendor }: { vendor: IVendor }) {
  const formatPrice = (cents: number) => `$${(cents / 100).toLocaleString()}`;
  const rating = 4.5 + Math.random() * 0.5; // Simulated rating
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Image: the API's IVendor type does not include a logo/url field in the current shape.
                If you add something like `logo` or `avatar` to IVendor, replace the src below. */}
            <img
              src={""}
              alt={vendor.business_name || vendor.name || "vendor"}
              className="w-12 h-12 rounded-full shadow object-cover"
            />

            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">
                {vendor.business_name || vendor.name}
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
                  {vendor.city_details?.name ||
                    vendor.country_details?.name ||
                    "Unknown Location"}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div> */}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-sm text-gray-700 dark:text-gray-300">
          {/* The IVendor type currently does not include `business_description`.
              Replace the fallback below if/when the API provides a description field. */}
          {"No description available for this vendor."}
        </CardDescription>

        {/* Categories: IVendor has `business_category_details` but not an array of `categories` in the current shape.
            Uncomment and adapt if your API returns a `categories: string[]` field. */}
        <div className="flex flex-wrap gap-1">
          {vendor.business_category_details?.business_category ? (
            <Badge
              variant="secondary"
              className="text-xs bg-gradient-primary text-white"
            >
              {vendor.business_category_details.business_category}
            </Badge>
          ) : (
            // If you expect multiple categories from the API, replace this block with a map over `vendor.categories`
            <></>
          )}
        </div>

        {/* Pricing: the IVendor interface does not currently include price fields like `priceRangeMin`.
            Keep this area commented until the API provides pricing data. */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className="text-xs">Pricing not available</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">&nbsp;</div>
        </div>

        {/* Service Details: serviceDays / willingToTravel are not part of IVendor currently. */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            {/* vendor.serviceDays?.join(", ") */}
            <span>Service days not available</span>
          </div>
          {/* vendor.willingToTravel && (
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              Will travel
            </div>
          ) */}
        </div>

        {/* Payment Methods: absent on IVendor by default. */}
        <div className="flex flex-wrap gap-1">
          {/* Example when API has `paymentMethods`: vendor.paymentMethods?.slice(0,3).map(...) */}
        </div>

        {/* Single action: Book Vendor — opens booking dialog */}
        <div className="pt-2">
          <BookVendorDialog
            vendorId={vendor.user_id ?? vendor._id}
            userId={user?.user_id ?? 0}
            trigger={
              <Button className="w-full bg-gradient-cta">
                <Calendar className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            }
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
