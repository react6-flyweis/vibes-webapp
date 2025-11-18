import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import { useVendors } from "@/queries/vendors";
import { useCreateEscrowTransaction } from "@/mutations/integrations/escrow";
import {
  EscrowTransactionRequest,
  EscrowTransactionItem,
  EscrowTransactionParty,
} from "@/types/escrow";

type Vendor = {
  id: number | string;
  name: string;
  category?: string;
  email?: string;
};

export default function LegacyEscrowForm() {
  // Fetch vendors internally instead of relying on the parent to pass them in
  const { data: vendors } = useVendors();
  const [newContractData, setNewContractData] = useState({
    vendorId: "",
    amount: "",
    eventDate: "",
    beneficiaryAddress: "",
    milestones: [{ description: "", percentage: 100 }],
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const authUser = useAuthStore((s) => s.user);

  // Helpers to support multiple vendor shape variants in the app
  const getVendorId = (v: any) =>
    String(v?.user_id ?? v?._id ?? v?.Vendor_id ?? v?.vendor_id ?? v?.id ?? "");
  const getVendorDisplayName = (v: any) =>
    v?.name ||
    v?.business_information_details?.business_name ||
    v?.vendor_details?.name ||
    "Vendor";
  const getVendorCategory = (v: any) =>
    v?.business_information_details?.service_categories?.[0]?.category_name ||
    v?.role_details?.name ||
    v?.category ||
    "";

  // Map legacy UI to new Escrow transaction integration using the provider mutation
  const createContractMutation = useCreateEscrowTransaction({
    onSuccess: () => {
      toast({
        title: "Escrow Created",
        description: "Escrow transaction created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/escrow/contracts"] });
      setNewContractData({
        vendorId: "",
        amount: "",
        eventDate: "",
        beneficiaryAddress: "",
        milestones: [{ description: "", percentage: 100 }],
      });
    },
    onError: () => {
      toast({
        title: "Contract Creation Failed",
        description: "Failed to create escrow transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="vendor">Select Vendor</Label>
        <select
          className="w-full p-2 border rounded-lg"
          value={newContractData.vendorId}
          onChange={(e) =>
            setNewContractData((prev) => ({
              ...prev,
              vendorId: e.target.value,
            }))
          }
        >
          <option value="">Choose a vendor...</option>
          {vendors?.map((vendor) => (
            <option key={getVendorId(vendor)} value={getVendorId(vendor)}>
              {/* Support various vendor shapes returned by different vendor queries */}
              {getVendorDisplayName(vendor)} - {getVendorCategory(vendor)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="amount">Contract Amount (USD)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={newContractData.amount}
          onChange={(e) =>
            setNewContractData((prev) => ({
              ...prev,
              amount: e.target.value,
            }))
          }
        />
      </div>

      <div>
        <Label htmlFor="eventDate">Event Date</Label>
        <Input
          id="eventDate"
          type="date"
          value={newContractData.eventDate}
          onChange={(e) =>
            setNewContractData((prev) => ({
              ...prev,
              eventDate: e.target.value,
            }))
          }
        />
      </div>

      <div>
        <Label>Payment Milestones</Label>
        {newContractData.milestones.map((milestone, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              placeholder="Milestone description"
              value={milestone.description}
              onChange={(e) => {
                const updated = [...newContractData.milestones];
                updated[index].description = e.target.value;
                setNewContractData((prev) => ({
                  ...prev,
                  milestones: updated,
                }));
              }}
            />
            <Input
              type="number"
              placeholder="%"
              className="w-20"
              value={milestone.percentage as any}
              onChange={(e) => {
                const updated = [...newContractData.milestones];
                updated[index].percentage = parseInt(e.target.value) || 0;
                setNewContractData((prev) => ({
                  ...prev,
                  milestones: updated,
                }));
              }}
            />
          </div>
        ))}
      </div>

      <div>
        <Button
          onClick={() => {
            // Validate vendor selection and amounts
            const selectedVendor = vendors?.find(
              (v) => getVendorId(v) === String(newContractData.vendorId)
            );
            if (!selectedVendor) {
              toast({
                title: "Validation Error",
                description: "Please select a vendor.",
                variant: "destructive",
              });
              return;
            }

            const price = parseFloat(newContractData.amount || "0");
            if (!price || price <= 0) {
              toast({
                title: "Validation Error",
                description: "Please enter a valid amount.",
                variant: "destructive",
              });
              return;
            }

            // Build simple one-item escrow payload from legacy fields
            const item: EscrowTransactionItem = {
              title: getVendorDisplayName(selectedVendor) || "Vendor Service",
              description: `Escrow for ${getVendorDisplayName(
                selectedVendor
              )} - ${newContractData.milestones
                .map((m) => m.description)
                .filter(Boolean)
                .join(", ")}`,
              quantity: 1,
              price: price,
              type: "service",
              inspection_period: 0,
            };

            // Build parties from authenticated user (buyer) and vendor (seller)
            const buyer: EscrowTransactionParty = {
              role: "buyer",
              customer: {
                email: authUser?.email || undefined,
                name:
                  authUser?.name ||
                  authUser?.firstName ||
                  authUser?.user_id ||
                  undefined,
              },
            };

            // Try to find vendor email/contact
            const vendorEmail =
              (selectedVendor as any).email ||
              (selectedVendor as any).business_information_details
                ?.business_email ||
              (selectedVendor as any).contactInfo ||
              (selectedVendor as any).contactEmail ||
              undefined;

            const seller: EscrowTransactionParty = {
              role: "seller",
              customer: {
                email: vendorEmail,
                name: getVendorDisplayName(selectedVendor),
              },
            };

            const payload: EscrowTransactionRequest = {
              currency: "usd",
              description: `Escrow contract for ${getVendorDisplayName(
                selectedVendor
              )} (Event ${newContractData.eventDate})`,
              items: [item],
              parties: [buyer, seller],
              // optionally pass an 'asCustomer' override — we default to buyer email
              asCustomer: authUser?.email || undefined,
            };

            (createContractMutation as any).mutate(payload);
          }}
          disabled={(createContractMutation as any).isLoading}
          className="w-full bg-party-gradient-2 hover:scale-105 transition-transform"
        >
          {(createContractMutation as any).isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Deploying to Blockchain...
            </div>
          ) : (
            <div className="flex items-center">Create Smart Contract</div>
          )}
        </Button>
      </div>
    </div>
  );
}
