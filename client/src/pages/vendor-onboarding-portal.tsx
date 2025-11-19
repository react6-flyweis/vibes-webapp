import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useVendorOnboarding } from "@/mutations/useVendorOnboarding";
import useUpdateVendorOnboardingPortalMutation from "@/mutations/useUpdateVendorOnboardingPortal";
import { useVendorOnboardingPortalList } from "@/queries/vendorOnboardingPortal";
import { useAuthStore } from "@/store/auth-store";
import StepProgress from "@/components/onboarding/StepProgress";
import DocumentUploadItem from "@/components/onboarding/DocumentUploadItem";
import { extractApiErrorMessage } from "@/lib/apiErrors";
import CategoryMultiSelect from "@/components/CategoryMultiSelect";

const steps = [
  "Basic Information",
  "Document Upload",
  "KYC Verification",
  "Service Areas",
  "Payment Setup",
  "Preview & Publish",
];

const schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  legalName: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  categories: z
    .array(
      z.object({
        category_id: z.number(),
        category_name: z.string(),
        Price: z.number().min(0, "Price must be non-negative"),
        pricing_currency: z.string().optional(),
        MinFee: z.number().min(0).max(100).optional(),
      })
    )
    .min(1, "At least one category is required"),
  yearsInBusiness: z.string().optional(),
  numberOfEmployees: z.string().optional(),
  description: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  serviceAreas: z.string().optional(),
  primaryServiceLocation: z.string().optional(),
  optionalRegions: z.string().optional(),
  pinCode: z.string().min(1, "Pin code is required"),
  preferredWorkingHours: z
    .string()
    .min(1, "Preferred working hours are required"),
  // Cancellation charges: percentage value between 0 and 30
  cancellationCharges: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z
      .number()
      .min(0, "Cancellation charges must be at least 0%")
      .max(30, "Maximum cancellation charges is 30%")
      .optional()
  ),
  payoutEmail: z.string().optional(),
  escrowPayment: z.boolean().optional(),
  kycFullName: z.string().min(1, "Authorized person's full name is required"),
  kycDob: z.string().min(1, "Date of birth is required"),
  kycIdType: z.string().min(1, "ID type is required"),
  kycIdNumber: z.string().min(1, "ID number is required"),
  kycPan: z.string().min(1, "PAN is required"),
  kycGst: z.string().min(1, "GST number is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  bankName: z.string().min(1, "Bank name is required"),
  branchName: z.string().min(1, "Branch name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  ifscCode: z.string().min(1, "IFSC code is required"),
  upiId: z.string().optional(),
  termsAccepted: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function VendorOnboardingPortal() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [showValidationDebug, setShowValidationDebug] = useState(false);
  const isDev = import.meta.env.DEV;

  function flattenErrors(errObj: any, prefix = "") {
    const items: string[] = [];
    if (!errObj) return items;
    for (const key of Object.keys(errObj)) {
      const val = errObj[key];
      const path = prefix ? `${prefix}.${key}` : key;
      if (val?.message) {
        items.push(`${path}: ${val.message}`);
      }
      // Arrays: errors like categories[0]
      if (val?.type && val?.message) {
        items.push(`${path}: ${val.message}`);
      }
      if (val?.root && typeof val?.root === "object") {
        items.push(...flattenErrors(val.root, path));
      }
      if (val && typeof val === "object") {
        // dive deeper
        const subKeys = Object.keys(val).filter(
          (k) => k !== "message" && k !== "type"
        );
        if (subKeys.length > 0) {
          items.push(...flattenErrors(val, path));
        }
      }
    }
    return items;
  }
  type DocKey =
    | "businessRegistration"
    | "gst"
    | "pan"
    | "bankBook"
    | "idProof"
    | "optional";

  const [documents, setDocuments] = useState<Record<DocKey, File | null>>({
    businessRegistration: null,
    gst: null,
    pan: null,
    bankBook: null,
    idProof: null,
    optional: null,
  });

  const [kycFiles, setKycFiles] = useState<{
    idDocument: File | null;
    photoVerification: File | null;
  }>({
    idDocument: null,
    photoVerification: null,
  });

  function handleKycFile(
    type: "idDocument" | "photoVerification",
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setKycFiles((k) => ({ ...k, [type]: file }));
  }

  function removeKycFile(type: "idDocument" | "photoVerification") {
    setKycFiles((k) => ({ ...k, [type]: null }));
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: "",
      // contactName removed: using legalName instead
      legalName: "",
      email: "",
      phone: "",
      categories: [],
      yearsInBusiness: "",
      numberOfEmployees: "",
      description: "",
      streetAddress: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      serviceAreas: "",
      primaryServiceLocation: "",
      optionalRegions: "",
      pinCode: "",
      preferredWorkingHours: "",
      payoutEmail: "",
      accountHolderName: "",
      bankName: "",
      branchName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
      escrowPayment: false,
      kycFullName: "",
      kycDob: "",
      kycIdType: "",
      kycIdNumber: "",
      kycPan: "",
      kycGst: "",
      cancellationCharges: 0,
      termsAccepted: false,
    },
  });

  // Get current user (vendor) id so we can fetch existing onboarding portal data
  const currentUser = useAuthStore((s) => s.user);
  const vendorId = currentUser?.user_id;

  const { data: portalListRes } = useVendorOnboardingPortalList(
    { Vendor_id: vendorId, page: 1, limit: 100 },
    !!vendorId
  );

  const existingPortal = portalListRes?.data?.[0] || null;
  const updateMutation = useUpdateVendorOnboardingPortalMutation();

  // When existing portal is available, prefill the form fields
  React.useEffect(() => {
    if (!existingPortal) return;

    const businessInfo = existingPortal.business_information_details;
    const bankInfo = existingPortal.bank_branch_details;

    const mappedCategories: any[] = (
      existingPortal.service_categories ||
      existingPortal.categories_fees_details ||
      []
    ).map((c: any) => ({
      category_id: c.category_id ?? c.category_id,
      category_name: c.category_name ?? c.category_details?.category_name ?? "",
      Price: c.Price ?? c.pricing ?? 0,
      pricing: c.pricing ?? c.Price ?? 0,
      pricing_currency: c.pricing_currency ?? c.pricing_currency ?? "",
      MinFee: c.MinFee ?? c.MinFee ?? (c.MinFee === 0 ? 0 : undefined),
    }));

    form.reset({
      businessName:
        businessInfo?.business_name ||
        existingPortal.Basic_information_business_name ||
        "",
      legalName:
        businessInfo?.Basic_information_LegalName ||
        existingPortal.Basic_information_LegalName ||
        "",
      email:
        businessInfo?.business_email ||
        existingPortal.Basic_information_Email ||
        "",
      phone:
        businessInfo?.business_phone ||
        existingPortal.Basic_information_phone ||
        "",
      description:
        businessInfo?.Basic_information_Business_Description ||
        existingPortal.Basic_information_Business_Description ||
        "",
      streetAddress:
        businessInfo?.Basic_information_BusinessAddress ||
        existingPortal.Basic_information_BusinessAddress ||
        "",
      zip:
        businessInfo?.Basic_information_ZipCode ||
        existingPortal.Basic_information_ZipCode ||
        "",
      primaryServiceLocation:
        businessInfo?.service_areas_locaiton ||
        existingPortal.service_areas_locaiton ||
        "",
      optionalRegions:
        businessInfo?.service_areas_Regions ||
        existingPortal.service_areas_Regions ||
        "",
      pinCode:
        businessInfo?.service_areas_pincode ||
        existingPortal.service_areas_pincode ||
        "",
      preferredWorkingHours:
        businessInfo?.service_areas_workingHoures ||
        existingPortal.service_areas_workingHoures ||
        "",
      categories: mappedCategories || [],
      accountHolderName:
        bankInfo?.holderName || existingPortal.Payment_Setup_HolderName || "",
      bankName: existingPortal.Payment_Setup_BankName || "",
      branchName:
        bankInfo?.bank_branch_name ||
        existingPortal.Payment_Setup_BranchName ||
        "",
      accountNumber:
        bankInfo?.accountNo || existingPortal.Payment_Setup_AccountNo || "",
      ifscCode: bankInfo?.ifsc || existingPortal.Payment_Setup_Ifsc || "",
      upiId: bankInfo?.upi || existingPortal.Payment_Setup_UPI || "",
      kycFullName:
        existingPortal.KYC_fullname || existingPortal.KYC_fullname || "",
      kycDob: existingPortal.KYC_DoB || existingPortal.KYC_DoB || "",
      kycIdType:
        existingPortal.KYC_GovtIdtype || existingPortal.KYC_GovtIdtype || "",
      kycIdNumber: existingPortal.KYC_Idno || existingPortal.KYC_Idno || "",
      kycPan:
        existingPortal.KYC_Business_PanCard ||
        existingPortal.KYC_Business_PanCard ||
        "",
      kycGst: existingPortal.KYC_GSTNo || existingPortal.KYC_GSTNo || "",
      cancellationCharges:
        existingPortal.CancellationCharges !== undefined
          ? existingPortal.CancellationCharges
          : undefined,
      termsAccepted: existingPortal.ifConfirm ?? false,
      escrowPayment: existingPortal.EscrowPayment ?? false,
    });
  }, [existingPortal]);
  const stepFields = useMemo(
    () => [
      // Step 0: Basic information
      [
        "businessName",
        "legalName",
        "email",
        "phone",
        "categories",
        "yearsInBusiness",
        "numberOfEmployees",
        "description",
        "streetAddress",
        "city",
        "state",
        "zip",
        "country",
      ],
      // Step 1: Document upload (files are stored in state, validated in next())
      [],
      // Step 2: KYC fields
      ["kycFullName", "kycDob", "kycIdType", "kycIdNumber", "kycPan", "kycGst"],
      // Step 3: Service Areas
      [
        "primaryServiceLocation",
        "optionalRegions",
        "pinCode",
        "preferredWorkingHours",
      ],
      // Step 4: Payment setup
      [
        "accountHolderName",
        "bankName",
        "branchName",
        "accountNumber",
        "ifscCode",
        "upiId",
        "escrowPayment",
        "payoutEmail",
        "cancellationCharges",
      ],
      // Step 5: Preview & Publish (termsAccepted validated on submit)
      [],
    ],
    []
  );

  const next = async () => {
    const fields = stepFields[current] as (keyof FormValues)[];

    if (fields.length) {
      const valid = await form.trigger(fields as any);
      if (!valid) {
        // collect and show errors for debugging
        const errors = form.formState.errors;
        console.warn("Validation errors on step", current, errors);
        toast({
          title: "Validation errors",
          description:
            "Please fix the errors in the fields before continuing. Open debug to inspect.",
          variant: "destructive",
        });
        // Optionally open debug view so user can inspect (only in dev)
        if (isDev) setShowValidationDebug(true);
        return;
      }
    }

    // // Custom validation for steps that rely on component state (files)
    // if (current === 1) {
    //   const uploaded = Object.values(documents).filter(Boolean).length;
    //   if (uploaded === 0) {
    //     toast({
    //       title: "Please upload at least one document before continuing.",
    //       variant: "destructive",
    //     });
    //     return;
    //   }
    // }

    // if (current === 2) {
    //   // Require both an ID document and a photo verification file
    //   if (!kycFiles.idDocument || !kycFiles.photoVerification) {
    //     toast({
    //       title: "Please upload an ID document and a photo verification.",
    //       variant: "destructive",
    //     });
    //     return;
    //   }
    // }

    if (current < steps.length - 1) setCurrent((c) => c + 1);
  };

  const back = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  function handleFile(
    category: DocKey,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setDocuments((d) => ({ ...d, [category]: file }));
  }

  function removeDocument(category: DocKey) {
    setDocuments((d) => ({ ...d, [category]: null }));
  }

  const onSubmit = async (values: FormValues) => {
    // Enforce terms acceptance only at final submit to keep step flow flexible
    if (!values.termsAccepted) {
      // set a form error so UI shows feedback near the checkbox
      form.setError("termsAccepted", {
        type: "manual",
        message: "You must accept the terms to publish",
      });
      // also show a toast
      toast({
        title: "Please accept terms before publishing.",
        variant: "destructive",
      });
      return;
    }

    const documentsCount = Object.values(documents).filter(Boolean).length;
    const payload = {
      // map form values to API expected keys where reasonably possible
      Vendor_id: undefined,
      Basic_information_business_name: values.businessName,
      Basic_information_LegalName: values.legalName,
      Basic_information_Email: values.email,
      Basic_information_phone: values.phone,
      Basic_information_Business_Description: values.description,
      Basic_information_BusinessAddress: values.streetAddress,
      Basic_information_City_id: undefined,
      Basic_information_State_id: undefined,
      Basic_information_ZipCode: values.zip,
      Basic_information_Country_id: undefined,
      service_categories: values.categories,
      service_areas_locaiton: values.primaryServiceLocation,
      service_areas_Regions: values.optionalRegions,
      service_areas_pincode: values.pinCode,
      service_areas_workingHoures: values.preferredWorkingHours,
      Payment_Setup_HolderName: values.accountHolderName,
      Payment_Setup_BankName: values.bankName,
      Payment_Setup_BranchName: values.branchName,
      Payment_Setup_AccountNo: values.accountNumber,
      Payment_Setup_Ifsc: values.ifscCode,
      Payment_Setup_UPI: values.upiId,
      ifConfirm: !!values.termsAccepted,
      EscrowPayment: !!values.escrowPayment,
      Status: true,
      documentsCount,
      CancellationCharges: values.cancellationCharges,
    };

    // Validate whole form before submit
    const isFormValid = await form.trigger();
    if (!isFormValid) {
      const errors = form.formState.errors;
      console.warn("Validation errors on submit:", errors);
      toast({
        title: "Validation errors",
        description:
          "Please fix the validation errors in the form before submitting.",
        variant: "destructive",
      });
      if (isDev) setShowValidationDebug(true);
      return;
    }

    // trigger the mutation using async API so we can await and catch
    try {
      let res;
      if (existingPortal?.Vendor_Onboarding_Portal_id) {
        // use update mutation
        const updatePayload = {
          ...payload,
          Vendor_Onboarding_Portal_id:
            existingPortal.Vendor_Onboarding_Portal_id,
          Vendor_id: existingPortal.Vendor_id ?? vendorId,
        };
        res = await updateMutation.mutateAsync(updatePayload as any);
      } else {
        res = await vendorOnboardingMutation.mutateAsync(payload);
      }
      // Normalize response shape for success and message
      const anyRes: any = res;
      const normalizedSuccess =
        anyRes?.data?.success ?? anyRes?.success ?? false;
      const normalizedMessage =
        anyRes?.data?.message ??
        anyRes?.message ??
        "Redirecting you to subscription setup";
      toast({
        title: normalizedSuccess ? "Onboarding Completed" : "Submission result",
        description: normalizedMessage,
      });
      setCurrent(steps.length - 1);

      navigate("/vibes-business");
    } catch (err: any) {
      const errorMessage = extractApiErrorMessage(err);
      toast({
        title: "Submission failed",
        description: errorMessage || "Could not submit vendor onboarding",
        variant: "destructive",
      });
      form.setError("root", {
        type: "manual",
        message: errorMessage || "Could not submit vendor onboarding",
      });
    }
  };

  const vendorOnboardingMutation = useVendorOnboarding();

  return (
    <div className="bg-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold">Vendor Onboarding Portal</h1>
          <p className="text-sm text-muted-foreground">
            Join the Vibes marketplace and grow your business
          </p>
        </div>

        <Card className="p-6">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="font-medium">Registration Progress</div>
              <div className="text-sm">
                {Math.round(((current + 1) / steps.length) * 100)}%
              </div>
            </div>

            <div className="w-full bg-gray-100 h-2 rounded mt-3 overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-violet-400 to-violet-700"
                style={{ width: `${((current + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              {steps.map((s, i) => (
                <div key={s} className="flex-1 text-center">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                      i <= current
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      i <= current ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {s}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          {isDev && (
            <>
              <div className="flex justify-end mb-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowValidationDebug((s) => !s)}
                >
                  {showValidationDebug ? "Hide" : "Show"} Validation Debug
                </Button>
              </div>
              {showValidationDebug && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Form Validation Errors (Debug)</CardTitle>
                    <CardDescription>
                      Shows a JSON dump of current validation errors from
                      react-hook-form
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black text-white p-3 rounded overflow-auto text-xs max-h-96">
                      {JSON.stringify(form.formState.errors, null, 2)}
                    </pre>
                    <div className="mt-3">
                      <div className="font-medium">Flattened errors:</div>
                      <ul className="list-disc pl-5 text-sm text-red-600">
                        {flattenErrors(form.formState.errors).length === 0 ? (
                          <li className="text-green-600">
                            No validation errors
                          </li>
                        ) : (
                          flattenErrors(form.formState.errors).map(
                            (err, idx) => <li key={idx}>{err}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      Fields with errors will also show inline messages near the
                      field.
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Step content */}
              {current === 0 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Tell us about your business
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business name</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="Amazing DJ Services"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="legalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Legal Name (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder=""
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                type="email"
                                placeholder="info@company.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="(555) 123-4567"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Business Description</FormLabel>
                          <FormControl>
                            <Textarea
                              className="bg-gray-100"
                              placeholder=""
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Categories with Pricing */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">
                        Service Categories & Pricing
                      </h3>
                      <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">
                              Categories
                            </FormLabel>
                            <FormControl>
                              <CategoryMultiSelect
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Business Address section (matches design) */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">
                        Business Address
                      </h3>

                      <FormField
                        control={form.control}
                        name="streetAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="123 Main St"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-100"
                                  placeholder="City"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-100"
                                  placeholder="State"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip Code</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="bg-gray-100"
                                  placeholder="ZIP"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-gray-100"
                                  placeholder="Country"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {current === 1 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Document Upload</CardTitle>
                    <CardDescription>Upload licenses or IDs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(
                        [
                          {
                            key: "businessRegistration",
                            label: "Business Registration Certificate",
                          },
                          {
                            key: "gst",
                            label: "GST Certificate / Tax Document",
                          },
                          { key: "pan", label: "PAN Card" },
                          { key: "bankBook", label: "Bank Book" },
                          {
                            key: "idProof",
                            label: "Owner/Authorized Signatory ID Proof",
                          },
                          {
                            key: "optional",
                            label:
                              "Optional Document (Insurance Certificate, Trade License)",
                          },
                        ] as { key: DocKey; label: string }[]
                      ).map((item) => (
                        <DocumentUploadItem
                          key={item.key}
                          label={item.label}
                          file={documents[item.key]}
                          onChange={(e) => handleFile(item.key, e)}
                          onRemove={() => removeDocument(item.key)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {current === 2 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>KYC Verification</CardTitle>
                    <CardDescription>
                      Confirm authorized person details and upload ID/photo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="kycFullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Authorized Person's Full Name</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="Full name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="kycDob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>D.O.B</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                max={
                                  new Date(
                                    new Date().setFullYear(
                                      new Date().getFullYear() - 18
                                    )
                                  )
                                    .toISOString()
                                    .split("T")[0]
                                }
                                className="bg-gray-100"
                                placeholder="YYYY-MM-DD"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="kycIdType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Government ID Type</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="e.g., Passport, Driver's License"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="kycIdNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Number</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                className="bg-gray-100"
                                placeholder="ID number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="kycPan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business PAN Card</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="PAN"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="kycGst"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business GST Number</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="GSTIN"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="col-span-1 md:col-span-1">
                        <div className="text-sm mb-2">Upload ID Document</div>
                        <div className="border border-gray-200 rounded p-4 bg-white">
                          {!kycFiles.idDocument ? (
                            <label className="w-full h-28 flex flex-col items-center justify-center cursor-pointer bg-gray-50 rounded">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16v4h10v-4M12 12V4m0 0l-3 3m3-3 3 3"
                                />
                              </svg>
                              <div className="text-xs text-gray-500 mt-2">
                                Click to upload ID
                              </div>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="sr-only"
                                onChange={(e) => handleKycFile("idDocument", e)}
                              />
                            </label>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="text-sm truncate">
                                {kycFiles.idDocument.name}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeKycFile("idDocument")}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-1">
                        <div className="text-sm mb-2">Photo Verification</div>
                        <div className="border border-gray-200 rounded p-4 bg-white">
                          {!kycFiles.photoVerification ? (
                            <label className="w-full h-28 flex flex-col items-center justify-center cursor-pointer bg-gray-50 rounded">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16v4h10v-4M12 12V4m0 0l-3 3m3-3 3 3"
                                />
                              </svg>
                              <div className="text-xs text-gray-500 mt-2">
                                Click to upload photo
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) =>
                                  handleKycFile("photoVerification", e)
                                }
                              />
                            </label>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="text-sm truncate">
                                {kycFiles.photoVerification.name}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeKycFile("photoVerification")
                                }
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {current === 3 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Service Areas</CardTitle>
                    <CardDescription>
                      Where do you provide services?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="primaryServiceLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Service Location</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="Primary location"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="optionalRegions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Optional Regions</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="Other cities or regions (comma separated)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pinCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pin Code</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                className="bg-gray-100"
                                placeholder="Postal code"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredWorkingHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Working Hours</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(v) => field.onChange(v)}
                                value={field.value}
                              >
                                <SelectTrigger className="bg-gray-100">
                                  <SelectValue placeholder="Select hours" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="9am-6pm">
                                    9:00 AM - 6:00 PM
                                  </SelectItem>
                                  <SelectItem value="10am-7pm">
                                    10:00 AM - 7:00 PM
                                  </SelectItem>
                                  <SelectItem value="12pm-9pm">
                                    12:00 PM - 9:00 PM
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {current === 4 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Payment Setup</CardTitle>
                    <CardDescription>Connect a payout method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="accountHolderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Holder Name</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="Name on account"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="Bank"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="branchName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Branch name</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="Branch"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                className="bg-gray-100"
                                placeholder="Account number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ifscCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IFSC Code</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="IFSC"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="upiId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UPI ID (optional)</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100"
                                placeholder="upi@bank"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cancellationCharges"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cancellation Charges (%)</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  min={0}
                                  max={30}
                                  step={0.1}
                                  className="bg-gray-100"
                                  placeholder="e.g., 20"
                                  {...field}
                                />
                                <div className="text-sm text-gray-500">%</div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="escrowPayment"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel>Escrow Payment</FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                                <div className="text-sm text-gray-700">
                                  Accept escrow payments for bookings
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {current === 5 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Preview & Publish</CardTitle>
                    <CardDescription>Review and publish</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                      <div>
                        <h3 className="text-base font-semibold mb-3">
                          Business Info:
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-gray-800">
                          <li>
                            {form.getValues("businessName") ||
                              "(no business name)"}
                            {form.getValues("numberOfEmployees")
                              ? `, ${form.getValues(
                                  "numberOfEmployees"
                                )} Employees`
                              : ""}
                          </li>
                        </ul>

                        <h3 className="text-base font-semibold mt-6 mb-3">
                          Categories & Pricing:
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-gray-800">
                          {form.getValues("categories")?.length > 0 ? (
                            form.getValues("categories").map((cat) => (
                              <li key={cat.category_id}>
                                {cat.category_name} - {cat.pricing_currency}{" "}
                                {cat.Price?.toFixed(2)}
                                {cat.MinFee !== undefined
                                  ? ` (MinFee: ${cat.MinFee}%)`
                                  : ""}
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-500">
                              No categories added
                            </li>
                          )}
                        </ul>

                        <h3 className="text-base font-semibold mt-6 mb-3">
                          KYC:
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-gray-800">
                          <li>
                            {form.getValues("kycFullName")
                              ? `Verified for ${form.getValues("kycFullName")}`
                              : "Not verified"}
                            {form.getValues("kycIdNumber")
                              ? ` (ID ending ${String(
                                  form.getValues("kycIdNumber")
                                ).slice(-4)})`
                              : ""}
                          </li>
                        </ul>

                        <h3 className="text-base font-semibold mt-6 mb-3">
                          Payment Setup:
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-gray-800">
                          <li>
                            {form.getValues("bankName") || "(no bank)"}
                            {form.getValues("accountNumber")
                              ? `, A/C ending ${String(
                                  form.getValues("accountNumber")
                                ).slice(-4)}`
                              : ""}
                          </li>
                        </ul>
                        {form.getValues("cancellationCharges") !==
                          undefined && (
                          <p className="text-sm text-gray-600 mt-2">
                            Cancellation charges:{" "}
                            {form.getValues("cancellationCharges")}%
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          Escrow payments accepted:{" "}
                          {form.getValues("escrowPayment") ? "Yes" : "No"}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-base font-semibold mb-3">
                          Documents:
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-gray-800">
                          {Object.entries(documents)
                            .filter(([, v]) => v)
                            .map(([k, v]) => (
                              <li key={k}>{(v as File).name}</li>
                            ))}
                          {Object.values(documents).filter(Boolean).length ===
                            0 && (
                            <li className="text-gray-500">
                              No documents uploaded
                            </li>
                          )}
                        </ul>

                        <h3 className="text-base font-semibold mt-6 mb-3">
                          Service Areas:
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-gray-800">
                          <li>
                            {form.getValues("primaryServiceLocation") ||
                              "(not set)"}
                            {form.getValues("optionalRegions")
                              ? `, ${form.getValues("optionalRegions")}`
                              : ""}
                          </li>
                        </ul>
                      </div>

                      <div className="col-span-1 md:col-span-2 mt-6">
                        <FormField
                          control={form.control}
                          name="termsAccepted"
                          render={({ field }) => (
                            <FormItem className="flex items-start">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="ml-3 text-sm text-gray-800">
                                I confirm that all information provided is true
                                and accurate.
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {form.formState.errors.root && (
                <div className="text-sm text-red-600 mt-4">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={back}
                  disabled={current === 0}
                >
                  Previous
                </Button>

                <div>
                  {current === 0 ? (
                    <Button
                      type="button"
                      onClick={next}
                      className="bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white"
                    >
                      Continue to Document
                    </Button>
                  ) : current < steps.length - 1 ? (
                    <>
                      <Button type="button" onClick={next} className="mr-3">
                        Next
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center">
                      <LoadingButton
                        type="submit"
                        className="bg-gradient-cta text-white"
                        isLoading={form.formState.isSubmitting}
                      >
                        Publish
                      </LoadingButton>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
