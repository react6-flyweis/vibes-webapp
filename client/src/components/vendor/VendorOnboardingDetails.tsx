import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/auth-store";
import {
  useVendorOnboardingPortalList,
  type VendorOnboardingPortal,
} from "@/queries/vendorOnboardingPortal";
import useUpdateVendorOnboardingPortalMutation from "@/mutations/useUpdateVendorOnboardingPortal";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Building2, MapPin, CreditCard, FileText } from "lucide-react";

type VendorOnboardingFormValues = {
  Vendor_Onboarding_Portal_id: number;

  // Business Information
  Basic_information_business_name?: string;
  Basic_information_LegalName?: string;
  Basic_information_Email?: string;
  Basic_information_phone?: string;
  Basic_information_Business_Description?: string;
  Basic_information_BusinessAddress?: string;
  Basic_information_ZipCode?: string;

  // Service Areas
  service_areas_locaiton?: string;
  service_areas_Regions?: string;
  service_areas_pincode?: string;
  service_areas_workingHoures?: string;

  // Payment Setup
  Payment_Setup_HolderName?: string;
  Payment_Setup_BankName?: string;
  Payment_Setup_BranchName?: string;
  Payment_Setup_AccountNo?: string;
  Payment_Setup_Ifsc?: string;
  Payment_Setup_UPI?: string;

  // KYC Information
  KYC_fullname?: string;
  KYC_DoB?: string;
  KYC_GovtIdtype?: string;
  KYC_Idno?: string;
  KYC_Business_PanCard?: string;
  KYC_GSTNo?: string;

  // Status fields
  initial_payment_required?: boolean;
  ifConfirm?: boolean;
  Status?: boolean;
};

interface VendorOnboardingDetailsProps {
  vendorId?: number;
  onboardingPortalId?: number;
}

export default function VendorOnboardingDetails({
  vendorId,
  onboardingPortalId,
}: VendorOnboardingDetailsProps) {
  const user = useAuthStore((s) => s.user);
  const currentVendorId = vendorId || user?.user_id;

  const [isEditing, setIsEditing] = useState(false);
  const [selectedPortal, setSelectedPortal] =
    useState<VendorOnboardingPortal | null>(null);

  const { toast } = useToast();
  const updateMutation = useUpdateVendorOnboardingPortalMutation();

  // Fetch all onboarding portals for the vendor
  const { data: portalData, isLoading } = useVendorOnboardingPortalList(
    {
      Vendor_id: currentVendorId,
      page: 1,
      limit: 100,
    },
    !!currentVendorId
  );

  const methods = useForm<VendorOnboardingFormValues>();

  // Get the list of portals
  const portals: VendorOnboardingPortal[] = useMemo(() => {
    return portalData?.data || [];
  }, [portalData]);

  // Set the selected portal based on prop or default to first portal
  useEffect(() => {
    if (portals.length > 0) {
      if (onboardingPortalId) {
        const portal = portals.find(
          (p) => p.Vendor_Onboarding_Portal_id === onboardingPortalId
        );
        setSelectedPortal(portal || portals[0]);
      } else {
        // Default to first portal
        setSelectedPortal(portals[0]);
      }
    }
  }, [portals, onboardingPortalId]);

  // Populate form when portal is selected
  useEffect(() => {
    if (selectedPortal) {
      const businessInfo = selectedPortal.business_information_details;
      const bankInfo = selectedPortal.bank_branch_details;

      methods.reset({
        Vendor_Onboarding_Portal_id: selectedPortal.Vendor_Onboarding_Portal_id,

        // Business Information (prefer new structure, fallback to legacy)
        Basic_information_business_name:
          businessInfo?.business_name ||
          selectedPortal.Basic_information_business_name ||
          "",
        Basic_information_LegalName:
          businessInfo?.Basic_information_LegalName ||
          selectedPortal.Basic_information_LegalName ||
          "",
        Basic_information_Email:
          businessInfo?.business_email ||
          selectedPortal.Basic_information_Email ||
          "",
        Basic_information_phone:
          businessInfo?.business_phone ||
          selectedPortal.Basic_information_phone ||
          "",
        Basic_information_Business_Description:
          businessInfo?.Basic_information_Business_Description ||
          selectedPortal.Basic_information_Business_Description ||
          "",
        Basic_information_BusinessAddress:
          businessInfo?.Basic_information_BusinessAddress ||
          selectedPortal.Basic_information_BusinessAddress ||
          "",
        Basic_information_ZipCode:
          businessInfo?.Basic_information_ZipCode ||
          selectedPortal.Basic_information_ZipCode ||
          "",

        // Service Areas
        service_areas_locaiton:
          businessInfo?.service_areas_locaiton ||
          selectedPortal.service_areas_locaiton ||
          "",
        service_areas_Regions:
          businessInfo?.service_areas_Regions ||
          selectedPortal.service_areas_Regions ||
          "",
        service_areas_pincode:
          businessInfo?.service_areas_pincode ||
          selectedPortal.service_areas_pincode ||
          "",
        service_areas_workingHoures:
          businessInfo?.service_areas_workingHoures ||
          selectedPortal.service_areas_workingHoures ||
          "",

        // Payment Setup
        Payment_Setup_HolderName:
          bankInfo?.holderName || selectedPortal.Payment_Setup_HolderName || "",
        Payment_Setup_BankName: selectedPortal.Payment_Setup_BankName || "",
        Payment_Setup_BranchName:
          bankInfo?.bank_branch_name ||
          selectedPortal.Payment_Setup_BranchName ||
          "",
        Payment_Setup_AccountNo:
          bankInfo?.accountNo || selectedPortal.Payment_Setup_AccountNo || "",
        Payment_Setup_Ifsc:
          bankInfo?.ifsc || selectedPortal.Payment_Setup_Ifsc || "",
        Payment_Setup_UPI:
          bankInfo?.upi || selectedPortal.Payment_Setup_UPI || "",

        // KYC Information
        KYC_fullname:
          businessInfo?.KYC_fullname || selectedPortal.KYC_fullname || "",
        KYC_DoB: businessInfo?.KYC_DoB
          ? businessInfo.KYC_DoB.split("T")[0]
          : selectedPortal.KYC_DoB?.split("T")[0] || "",
        KYC_GovtIdtype:
          businessInfo?.KYC_GovtIdtype || selectedPortal.KYC_GovtIdtype || "",
        KYC_Idno: businessInfo?.KYC_Idno || selectedPortal.KYC_Idno || "",
        KYC_Business_PanCard:
          businessInfo?.KYC_Business_PanCard ||
          selectedPortal.KYC_Business_PanCard ||
          "",
        KYC_GSTNo: businessInfo?.KYC_GSTNo || selectedPortal.KYC_GSTNo || "",

        // Status
        initial_payment_required: selectedPortal.initial_payment_required,
        ifConfirm: selectedPortal.ifConfirm,
        Status: selectedPortal.Status,
      });
    }
  }, [selectedPortal, methods]);

  const onSubmit = async (data: VendorOnboardingFormValues) => {
    try {
      // Clean up the data before sending - remove empty strings for optional fields
      const cleanedData = { ...data };

      // Handle date fields - if empty, remove them or set to null
      if (cleanedData.KYC_DoB === "" || !cleanedData.KYC_DoB) {
        delete cleanedData.KYC_DoB;
      }

      // Remove other empty optional fields to avoid validation errors
      Object.keys(cleanedData).forEach((key) => {
        if (cleanedData[key as keyof VendorOnboardingFormValues] === "") {
          delete cleanedData[key as keyof VendorOnboardingFormValues];
        }
      });

      await updateMutation.mutateAsync(cleanedData, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Vendor onboarding details updated successfully.",
          });
          setIsEditing(false);
        },
        onError: (err: any) => {
          // Handle validation errors with detailed field information
          const errors = err?.response?.data?.errors;
          let msg =
            err?.response?.data?.message || err?.message || "Failed to update";

          if (errors && Array.isArray(errors) && errors.length > 0) {
            const errorMessages = errors
              .map((e: any) => `${e.field}: ${e.message}`)
              .join(", ");
            msg = `${msg}: ${errorMessages}`;
          }

          toast({
            title: "Update failed",
            description: String(msg),
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!portals.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No onboarding portal entries found for this vendor.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Form */}
      {selectedPortal && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Vendor Onboarding Details</CardTitle>
              <div className="flex gap-2 mt-2">
                {selectedPortal.ifConfirm && (
                  <Badge variant="default">Confirmed</Badge>
                )}
                {selectedPortal.Status ? (
                  <Badge variant="default">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      methods.reset();
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    isLoading={methods.formState.isSubmitting}
                    size="sm"
                    className="bg-gradient-cta"
                    onClick={methods.handleSubmit(onSubmit)}
                  >
                    Save Changes
                  </LoadingButton>
                </>
              ) : (
                <Button
                  size="sm"
                  className="bg-gradient-cta"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Details
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Form {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Business Information Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">
                      Business Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Business Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register(
                            "Basic_information_business_name"
                          )}
                          disabled={!isEditing}
                          placeholder="Enter business name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Legal Name</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("Basic_information_LegalName")}
                          disabled={!isEditing}
                          placeholder="Enter legal name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Business Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...methods.register("Basic_information_Email")}
                          disabled={!isEditing}
                          placeholder="business@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Business Phone *</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("Basic_information_phone")}
                          disabled={!isEditing}
                          placeholder="+1234567890"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem className="md:col-span-2">
                      <FormLabel>Business Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...methods.register(
                            "Basic_information_Business_Description"
                          )}
                          disabled={!isEditing}
                          placeholder="Describe your business"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem className="md:col-span-2">
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea
                          {...methods.register(
                            "Basic_information_BusinessAddress"
                          )}
                          disabled={!isEditing}
                          placeholder="Enter complete business address"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("Basic_information_ZipCode")}
                          disabled={!isEditing}
                          placeholder="100001"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </div>

                <Separator />

                {/* Service Areas Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Service Areas</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Service Location</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("service_areas_locaiton")}
                          disabled={!isEditing}
                          placeholder="e.g., Los Angeles, New York"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Service Regions</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("service_areas_Regions")}
                          disabled={!isEditing}
                          placeholder="e.g., Western USA, Eastern USA"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Service Pincode</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("service_areas_pincode")}
                          disabled={!isEditing}
                          placeholder="e.g., 90001, 10001"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Working Hours</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("service_areas_workingHoures")}
                          disabled={!isEditing}
                          placeholder="e.g., Mon-Fri: 9AM-6PM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </div>

                <Separator />

                {/* Payment Setup Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Payment Setup</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("Payment_Setup_HolderName")}
                          disabled={!isEditing}
                          placeholder="Account holder name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("Payment_Setup_BankName")}
                          disabled={!isEditing}
                          placeholder="Bank name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Branch Name</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("Payment_Setup_BranchName")}
                          disabled={!isEditing}
                          placeholder="Branch name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("Payment_Setup_AccountNo")}
                          disabled={!isEditing}
                          placeholder="1234567890"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>IFSC Code</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("Payment_Setup_Ifsc")}
                          disabled={!isEditing}
                          placeholder="IFSC code"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>UPI ID</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("Payment_Setup_UPI")}
                          disabled={!isEditing}
                          placeholder="example@upi"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </div>

                <Separator />

                {/* KYC Information Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">KYC Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("KYC_fullname")}
                          disabled={!isEditing}
                          placeholder="Full name as per ID"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...methods.register("KYC_DoB")}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Government ID Type</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("KYC_GovtIdtype")}
                          disabled={!isEditing}
                          placeholder="e.g., Aadhar Card, Passport"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("KYC_Idno")}
                          disabled={!isEditing}
                          placeholder="ID number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>PAN Card Number</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("KYC_Business_PanCard")}
                          disabled={!isEditing}
                          placeholder="ABCDE1234F"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>GST Number</FormLabel>
                      <FormControl>
                        <Input
                          {...methods.register("KYC_GSTNo")}
                          disabled={!isEditing}
                          placeholder="27ABCDE1234F1Z5"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </div>

                {/* Categories & Fees Display (Read-only) */}
                {selectedPortal.categories_fees_details &&
                  selectedPortal.categories_fees_details.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Service Categories & Fees
                        </h3>
                        <div className="space-y-3">
                          {selectedPortal.categories_fees_details.map((fee) => (
                            <Card key={fee._id} className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {fee.category_details?.emozi}{" "}
                                    {fee.category_details?.category_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Platform Fee: {fee.PlatformFee}%
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">
                                    {fee.pricing_currency}{" "}
                                    {fee.Price.toLocaleString()}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Min: {fee.pricing_currency}{" "}
                                    {fee.MinFee.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
