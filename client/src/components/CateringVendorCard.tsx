import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export type Vendor = {
  _id: string;
  name: string;
  image?: string;
  mobile_no?: string;
  address?: string;
  review_count?: number;
  catering_marketplace_category_id: number;
};

type Props = {
  vendor?: Vendor;
  skeleton?: boolean;
  onBook?: (id: string) => void;
};

export default function CateringVendorCard({
  vendor,
  skeleton,
  onBook,
}: Props) {
  if (skeleton) {
    return (
      <Card className="rounded-lg overflow-hidden shadow-sm">
        <div className="bg-purple-700 h-full flex-1 p-4">
          <Skeleton className="h-8 w-48 rounded-md" />
          <div className="mt-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-28 mt-2" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        </div>
      </Card>
    );
  }

  if (!vendor) return null;

  return (
    <Card className="rounded-lg border-0 overflow-hidden shadow-sm">
      <div className="bg-purple-700 p-6 text-center">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-32 object-cover rounded-md mb-4"
        />

        <h3 className="text-2xl font-bold text-white">{vendor.name}</h3>
        <p className="text-white/90 mt-2">{vendor.mobile_no}</p>
        <p className="text-white/80 mt-2 text-sm">{vendor.address}</p>
        <div className="flex items-center justify-center gap-2 mt-3 text-white">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="font-semibold">{vendor.review_count ?? 0}</span>
        </div>
        <div className="mt-4">
          <Button
            className="bg-blue-500 text-white w-full"
            onClick={() =>
              onBook?.(vendor.catering_marketplace_category_id.toString())
            }
          >
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
}
