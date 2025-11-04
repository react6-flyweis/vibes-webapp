import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface PersonalInfo {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface Props {
  personalInfo: PersonalInfo;
  setPersonalInfo: (p: PersonalInfo) => void;
  promoCode: string;
  setPromoCode: (s: string) => void;
  // onApplyPromo: (code: string) => void;
  usePoints: boolean;
  setUsePoints: (b: boolean) => void;
  onBack: () => void;
  onComplete: () => void;
  isLoading?: boolean;
}

export default function CheckoutForm({
  personalInfo,
  setPersonalInfo,
  promoCode,
  setPromoCode,
  // onApplyPromo,
  // usePoints,
  // setUsePoints,
  onBack,
  onComplete,
  isLoading,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-white mb-4">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-blue-100">
              First Name
            </Label>
            <Input
              id="firstName"
              value={personalInfo.firstName}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, firstName: e.target.value })
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-blue-100">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={personalInfo.lastName}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, lastName: e.target.value })
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-blue-100">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, email: e.target.value })
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-blue-100">
              Phone
            </Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, phone: e.target.value })
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-white mb-4">Promo Code</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
          />
          <Button
            // onClick={() => onApplyPromo(promoCode)}
            disabled={!promoCode}
            variant="outline"
            className="bg-white/20 text-white hover:bg-white/10"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* {userProfile?.loyaltyPoints && userProfile.loyaltyPoints > 0 && (
        <div>
          <h3 className="font-semibold text-white mb-4">Loyalty Points</h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="usePoints"
              checked={usePoints}
              onChange={(e) => setUsePoints(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="usePoints" className="text-blue-100">
              Use {userProfile.loyaltyPoints} loyalty points ($
              {(userProfile.loyaltyPoints * 0.01).toFixed(2)} value)
            </label>
          </div>
        </div>
      )} */}

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="bg-white/20 text-white hover:bg-white/10"
        >
          Back to Seats
        </Button>
        <Button
          onClick={onComplete}
          disabled={!personalInfo.email || !personalInfo.firstName}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Complete Booking
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
