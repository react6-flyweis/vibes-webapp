import { Link, useNavigate } from "react-router";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { useToast } from "@/hooks/use-toast";
import { extractApiErrorMessage } from "@/lib/apiErrors";
import { useStaffOnboardingMutation } from "@/mutations/useStaffOnboardingMutation";
import { useAuthStore } from "@/store/auth-store";

const steps = [
  "Contact Information",
  "Address Information",
  "KYC Verification",
  "Review & Submit",
];

const schema = z.object({
  mobile: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(1, "Please enter your street address"),
  city_id: z.string().min(1, "Please enter your city"),
  state_id: z.string().min(1, "Please enter your state"),
  zip_code: z.string().min(3, "Please enter a valid zip code"),
  country_id: z.string().min(1, "Please select your country"),
  Authorized_Person_Name: z
    .string()
    .min(1, "Please enter authorized person's full name"),
  DOB: z.string().min(1, "Please enter date of birth"),
  Govt_id_type: z.string().min(1, "Please select government ID type"),
  ID_Number: z.string().min(1, "Please enter ID number"),
});

type FormValues = z.infer<typeof schema>;

export default function StaffOnboarding() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [current, setCurrent] = useState(0);
  const [idDocumentPreview, setIdDocumentPreview] = useState<string | null>(
    null
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [idDocument, setIdDocument] = useState<string | null>(null);
  const [photoVerification, setPhotoVerification] = useState<string | null>(
    null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mobile: "",
      address: "",
      city_id: "",
      state_id: "",
      zip_code: "",
      country_id: "",
      Authorized_Person_Name: "",
      DOB: "",
      Govt_id_type: "",
      ID_Number: "",
    },
  });

  const onboardingMutation = useStaffOnboardingMutation();

  const stepFields = useMemo(
    () => [
      ["mobile"],
      ["address", "city_id", "state_id", "zip_code", "country_id"],
      ["Authorized_Person_Name", "DOB", "Govt_id_type", "ID_Number"],
      [],
    ],
    []
  );

  const next = async () => {
    const fields = stepFields[current] as (keyof FormValues)[];

    if (fields.length) {
      const valid = await form.trigger(fields as any);
      if (!valid) return;
    }

    if (current < steps.length - 1) setCurrent((c) => c + 1);
  };

  const back = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "idDocument" | "photoVerification"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        if (field === "idDocument") {
          setIdDocument(base64String);
          setIdDocumentPreview(base64String);
        } else {
          setPhotoVerification(base64String);
          setPhotoPreview(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const payload = {
      mobile: data.mobile,
      address: data.address,
      country_id: parseInt(data.country_id),
      state_id: parseInt(data.state_id),
      city_id: parseInt(data.city_id),
      zip_code: data.zip_code,
      Authorized_Person_Name: data.Authorized_Person_Name,
      DOB: data.DOB,
      Govt_id_type: data.Govt_id_type,
      ID_Number: data.ID_Number,
      id_proof_owner_img: idDocument || "",
      user_img: photoVerification || "",
    };

    try {
      await onboardingMutation.mutateAsync(payload);

      toast({
        title: "Onboarding Complete!",
        description:
          "Your profile has been updated successfully. You can now log in.",
      });

      navigate("/login");
    } catch (error: any) {
      const errorMessage = extractApiErrorMessage(error);
      toast({
        title: "Onboarding Failed",
        description:
          errorMessage || "Unable to complete onboarding. Please try again.",
        variant: "destructive",
      });
      form.setError("root", {
        type: "manual",
        message: errorMessage || "Unable to complete onboarding",
      });
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
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold">
            Complete Your Staff Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Almost there! Fill in the details below to complete your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-semibold">
              Vibes
            </span>{" "}
            staff onboarding.
          </p>
        </div>

        <Card className="p-6">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="font-medium">Onboarding Progress</div>
              <div className="text-sm">
                {Math.round(((current + 1) / steps.length) * 100)}%
              </div>
            </div>

            <div className="w-full bg-gray-100 h-2 rounded mt-3 overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-pink-500 to-purple-500"
                style={{ width: `${((current + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              {steps.map((s, i) => (
                <div key={s} className="flex-1 text-center">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                      i <= current
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Step 0: Contact Information */}
              {current === 0 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Please provide your contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Phone Number <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="bg-gray-100"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Step 1: Address Information */}
              {current === 1 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Address Information</CardTitle>
                    <CardDescription>
                      Please provide your address details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Street Address{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Main Street, Apt 4B"
                              className="bg-gray-100"
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
                        name="city_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              City ID <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1"
                                className="bg-gray-100"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              State ID <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1"
                                className="bg-gray-100"
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
                        name="zip_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Zip Code <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="10001"
                                className="bg-gray-100"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="country_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Country ID <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1"
                                className="bg-gray-100"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: KYC Verification */}
              {current === 2 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>KYC Verification</CardTitle>
                    <CardDescription>
                      Please provide your identification details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="Authorized_Person_Name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Authorized Person's Full Name{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                className="bg-gray-100"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="DOB"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              D.O.B <span className="text-red-500">*</span>
                            </FormLabel>
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
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Govt_id_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Government ID Type{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full rounded-md border border-gray-200 bg-gray-100 h-10 px-4 text-sm"
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
                        name="ID_Number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              ID Number <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ID123456789"
                                className="bg-gray-100"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="col-span-1 md:col-span-1">
                        <Label className="text-sm">Upload ID Document</Label>
                        <Label
                          htmlFor="idDocument"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 mt-2"
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
                          />
                        </Label>
                      </div>

                      <div className="col-span-1 md:col-span-1">
                        <Label className="text-sm">Photo Verification</Label>
                        <Label
                          htmlFor="photoVerification"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 mt-2"
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
                          />
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Review & Submit */}
              {current === 3 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Review & Submit</CardTitle>
                    <CardDescription>
                      Please review your information before submitting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Contact Information
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {form.getValues("mobile")}
                          </p>
                        </div>

                        <h3 className="text-lg font-semibold mt-6 mb-3">
                          Address Information
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Street:</span>{" "}
                            {form.getValues("address")}
                          </p>
                          <p>
                            <span className="font-medium">City ID:</span>{" "}
                            {form.getValues("city_id")}
                          </p>
                          <p>
                            <span className="font-medium">State ID:</span>{" "}
                            {form.getValues("state_id")}
                          </p>
                          <p>
                            <span className="font-medium">Zip Code:</span>{" "}
                            {form.getValues("zip_code")}
                          </p>
                          <p>
                            <span className="font-medium">Country ID:</span>{" "}
                            {form.getValues("country_id")}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          KYC Verification
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Full Name:</span>{" "}
                            {form.getValues("Authorized_Person_Name")}
                          </p>
                          <p>
                            <span className="font-medium">Date of Birth:</span>{" "}
                            {form.getValues("DOB")}
                          </p>
                          <p>
                            <span className="font-medium">ID Type:</span>{" "}
                            {form.getValues("Govt_id_type")}
                          </p>
                          <p>
                            <span className="font-medium">ID Number:</span>{" "}
                            {form.getValues("ID_Number")}
                          </p>
                          <p>
                            <span className="font-medium">Documents:</span>{" "}
                            {idDocument && photoVerification
                              ? "All documents uploaded"
                              : idDocument || photoVerification
                              ? "Partially uploaded"
                              : "No documents uploaded"}
                          </p>
                        </div>
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
                  {current < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={next}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    >
                      Next
                    </Button>
                  ) : (
                    <LoadingButton
                      type="submit"
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      isLoading={form.formState.isSubmitting}
                    >
                      Complete Onboarding
                    </LoadingButton>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="mt-4 text-sm text-gray-600 text-center">
          Need help?{" "}
          <Link to="/support">
            <Button
              variant="link"
              className="text-purple-600 hover:text-purple-700 p-0"
            >
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
