import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { extractApiErrorMessage } from "@/lib/apiErrors";
import { useNavigate } from "react-router";
import { axiosInstance } from "@/lib/queryClient";

const onboardingSchema = z.object({
  // Contact Information
  phone: z.string().min(10, "Please enter a valid phone number"),

  // Address Information
  streetAddress: z.string().min(1, "Please enter your street address"),
  city: z.string().min(1, "Please enter your city"),
  state: z.string().min(1, "Please enter your state"),
  zipCode: z.string().min(3, "Please enter a valid zip code"),
  country: z.string().min(1, "Please select your country"),

  // KYC Information from image
  authorizedPersonFullName: z
    .string()
    .min(1, "Please enter authorized person's full name"),
  dateOfBirth: z.string().min(1, "Please enter date of birth"),
  governmentIdType: z.string().min(1, "Please select government ID type"),
  idNumber: z.string().min(1, "Please enter ID number"),

  // Document uploads (we'll handle these as base64 or file paths)
  idDocument: z.any().optional(),
  photoVerification: z.any().optional(),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

interface StaffOnboardingFormProps {
  userId: string | number;
}

export function StaffOnboardingForm({ userId }: StaffOnboardingFormProps) {
  const [idDocumentPreview, setIdDocumentPreview] = useState<string | null>(
    null
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      authorizedPersonFullName: "",
      dateOfBirth: "",
      governmentIdType: "",
      idNumber: "",
    },
  });

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "idDocument" | "photoVerification"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        form.setValue(field, base64String);

        if (field === "idDocument") {
          setIdDocumentPreview(base64String);
        } else {
          setPhotoPreview(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: OnboardingForm) => {
    setIsSubmitting(true);

    // Map onboarding form fields to API payload
    const payload = {
      phone: data.phone,
      street_address: data.streetAddress,
      city: data.city,
      state: data.state,
      zip_code: data.zipCode,
      country: data.country,
      authorized_person_full_name: data.authorizedPersonFullName,
      date_of_birth: data.dateOfBirth,
      government_id_type: data.governmentIdType,
      id_number: data.idNumber,
      id_document: data.idDocument,
      photo_verification: data.photoVerification,
    };

    try {
      await axiosInstance.put(`/api/users/updateUserById/${userId}`, payload);

      toast({
        title: "Onboarding Complete!",
        description:
          "Your profile has been updated successfully. You can now log in.",
      });

      navigate("/login");
    } catch (error: any) {
      console.error("Staff onboarding error:", error);
      const message = extractApiErrorMessage(error);
      toast({
        title: "Onboarding Failed",
        description:
          message || "Unable to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const idTypes = [
    "Passport",
    "Driver's License",
    "National ID Card",
    "State ID",
    "Other Government ID",
  ];

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "India",
    "Other",
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-2xl"
      >
        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Contact Information
          </h2>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  Phone Number <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...field}
                    disabled={isSubmitting}
                    className="rounded-xl border-gray-200 h-10 px-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address Information Section */}
        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-xl font-semibold text-gray-900">
            Address Information
          </h2>

          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  Street Address <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="123 Main Street, Apt 4B"
                    {...field}
                    disabled={isSubmitting}
                    className="rounded-xl border-gray-200 h-10 px-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-600">
                    City <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="New York"
                      {...field}
                      disabled={isSubmitting}
                      className="rounded-xl border-gray-200 h-10 px-4"
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
                  <FormLabel className="text-sm text-gray-600">
                    State/Province <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="NY"
                      {...field}
                      disabled={isSubmitting}
                      className="rounded-xl border-gray-200 h-10 px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-600">
                    Zip Code <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="10001"
                      {...field}
                      disabled={isSubmitting}
                      className="rounded-xl border-gray-200 h-10 px-4"
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
                  <FormLabel className="text-sm text-gray-600">
                    Country <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-gray-200 h-10 px-4 text-sm"
                    >
                      <option value="">Select a country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* KYC Verification Section */}
        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-xl font-semibold text-gray-900">
            KYC Verification
          </h2>

          <FormField
            control={form.control}
            name="authorizedPersonFullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  Authorized Person's Full Name{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={isSubmitting}
                    className="rounded-xl border-gray-200 h-10 px-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  D.O.B <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isSubmitting}
                    className="rounded-xl border-gray-200 h-10 px-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="governmentIdType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-600">
                    Government ID Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-gray-200 h-10 px-4 text-sm"
                    >
                      <option value="">Select ID type</option>
                      {idTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-600">
                    ID Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ID123456789"
                      {...field}
                      disabled={isSubmitting}
                      className="rounded-xl border-gray-200 h-10 px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Document Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="idDocument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-600">
                    Upload ID Document
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Label
                        htmlFor="idDocument"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        {idDocumentPreview ? (
                          <img
                            src={idDocumentPreview}
                            alt="ID Preview"
                            className="h-full w-full object-contain rounded-xl"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="text-xs text-gray-500">
                              Click to upload ID
                            </p>
                          </div>
                        )}
                        <input
                          id="idDocument"
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload(e, "idDocument")}
                          disabled={isSubmitting}
                        />
                      </Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photoVerification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-600">
                    Photo Verification
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Label
                        htmlFor="photoVerification"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Photo Preview"
                            className="h-full w-full object-contain rounded-xl"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="text-xs text-gray-500">
                              Click to upload photo
                            </p>
                          </div>
                        )}
                        <input
                          id="photoVerification"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, "photoVerification")
                          }
                          disabled={isSubmitting}
                        />
                      </Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <LoadingButton
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg py-3 shadow-lg hover:shadow-xl transition-all"
          isLoading={isSubmitting}
        >
          Complete Onboarding
        </LoadingButton>
      </form>
    </Form>
  );
}
