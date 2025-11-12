import React, { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuthStore } from "@/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import StaffBookings from "@/components/staff/StaffBookings";
import VendorBookings from "@/components/vendor/VendorBookings";
import VendorOnboardingDetails from "@/components/vendor/VendorOnboardingDetails";
// import CateringBookings from "@/components/catering/CateringBookings";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import useUpdateProfileMutation from "@/mutations/useUpdateProfile";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";

type ProfileFormValues = {
  name?: string;
  mobile?: string;
  email?: string;
  gender?: string;
  country?: string;
  state?: string;
  postal?: string;
  avatar?: string | null;
};

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  // Staff bookings are rendered by the `StaffBookings` component below

  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    (user as any)?.avatar || null
  );
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const methods = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name || "",
      mobile: user?.mobile || "",
      email: user?.email || "",
      gender: user?.gender || "",
      country: user?.country || "",
      state: user?.state || "",
      postal: user?.postal || "",
    },
  });

  const updateProfileMutation = useUpdateProfileMutation();
  const toast = useToast();

  // keep form in sync when auth store hydrates/changes
  useEffect(() => {
    methods.reset({
      name: user?.name || "",
      mobile: user?.mobile || "",
      email: user?.email || "",
      gender: user?.gender || "",
      country: user?.country || "",
      state: user?.state || "",
      postal: user?.postal || "",
      avatar: (user as any)?.avatar || null,
    });
    // keep preview in sync with store
    setAvatarPreview((user as any)?.avatar || null);
  }, [user]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    // update auth-store user
    // Do not update the auth store from this form.
    // Normalize avatar locally (form value -> preview -> existing) so caller can use it if needed.
    const avatarValue =
      data.avatar || avatarPreview || (user as any)?.avatar || null;

    // Prepare final payload and call mutation to persist
    const payload = {
      id: user?.user_id || "",
      ...(data || {}),
      avatar: avatarValue,
    } as ProfileFormValues & { id: number | string };

    await updateProfileMutation.mutateAsync(payload, {
      onSuccess: () => {
        toast.toast({
          title: "Profile updated",
          description: "Your profile was updated successfully.",
        });
        setIsEditing(false);
      },
      onError: (err: any) => {
        const msg = err?.message || "Failed to update profile";
        toast.toast({ title: "Update failed", description: String(msg) });
      },
    });
  };

  const initials = useMemo(() => {
    // Defensive: user.name may be undefined, null, or non-string. Ensure we handle all cases.
    const rawName = user && typeof user.name === "string" ? user.name : "";
    const parts = rawName.split(" ").filter(Boolean);

    if (parts.length === 0) return "";

    if (parts.length === 1) {
      // Take up to two letters from single-part names (e.g., "Al" -> "AL")
      return parts[0].slice(0, 2).toUpperCase();
    }

    const first = parts[0] && parts[0].length > 0 ? parts[0][0] : "";
    const lastPart = parts[parts.length - 1];
    const last = lastPart && lastPart.length > 0 ? lastPart[0] : "";

    return (first + last).toUpperCase();
  }, [user]);

  return (
    <div className="min-h-screen w-full bg-gradient-primary p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-10 relative">
          <div className="absolute right-6 top-6">
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => methods.reset()}
                >
                  Reset
                </Button>
                <LoadingButton
                  isLoading={methods.formState.isSubmitting}
                  size="sm"
                  className="bg-gradient-cta"
                  onClick={methods.handleSubmit(onSubmit)}
                >
                  Save
                </LoadingButton>
              </div>
            ) : (
              <Button
                size="sm"
                className="bg-gradient-cta w-32"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <Avatar className="size-20">
                  <AvatarImage
                    src={avatarPreview || (user as any)?.avatar || ""}
                    alt={user?.name || "avatar"}
                  />

                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                {/* hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = reader.result as string | null;
                      if (result) {
                        setAvatarPreview(result);
                        methods.setValue("avatar", result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />

                {isEditing && (
                  <div className="absolute -bottom-1 -right-1">
                    <Button
                      size="icon"
                      className="rounded-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Pen />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                {user?.name || "Your Name"}
              </h2>
              <p className="text-sm text-gray-500">
                {user?.email || "your@email.com"}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Form {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Full Name"
                        {...methods.register("name")}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Contact Number"
                        {...methods.register("mobile")}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select
                        disabled={!isEditing}
                        defaultValue={methods.getValues("gender") || undefined}
                        onValueChange={(val) => methods.setValue("gender", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unset">Select</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Select
                        disabled={!isEditing}
                        defaultValue={methods.getValues("country") || undefined}
                        onValueChange={(val) =>
                          methods.setValue("country", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unset">Select</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Select
                        disabled={!isEditing}
                        defaultValue={methods.getValues("state") || undefined}
                        onValueChange={(val) => methods.setValue("state", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unset">Select</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Postal Code"
                        {...methods.register("postal")}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              </form>
            </Form>
          </div>

          {/* Vendor bookings section - only render for vendor users (role_id === 1) */}
          {user?.role_id === 1 && (
            <div className="mt-8">
              <VendorBookings />
            </div>
          )}

          {/* Vendor onboarding details section - only render for vendor users (role_id === 3) */}
          {user?.role_id === 3 && (
            <div className="mt-8">
              <VendorOnboardingDetails vendorId={user?.user_id} />
            </div>
          )}

          {/* Staff bookings section - only render for staff users (role_id === 3) */}
          {user?.role_id === 3 && (
            <div className="mt-8">
              <StaffBookings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
