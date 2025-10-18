import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, Gift, Plus, Target, Trash } from "lucide-react";
import { BusinessCategorySelector } from "./BusinessCategorySelector";
import { CampaignTypeSelector } from "./CampaignTypeSelector";
import {
  useCreateVibeFundCampaign,
  VibeFundCampaignPayload,
} from "@/mutations/createVibeFundCampaign";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const steps = [
  "Basic Info",
  "Funding Details",
  "Media & Content",
  "Rewards & Tiers",
  "Milestones",
  "Review",
] as const;

const campaignSchema = z.object({
  title: z.string().min(1, "Title is required").max(80),
  shortDescription: z.string().min(1, "Short description is required").max(200),
  story: z.string().min(1, "Campaign story is required"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Campaign type is required"),
  currency: z.string().default("USD"),
  goal: z.string().min(1, "Funding goal is required"),
  duration: z.string().default("1 Month"),
  fundingModel: z
    .union([z.literal("all-or-nothing"), z.literal("keep-what-you-raise")])
    .default("all-or-nothing"),
  coverImageFile: z.any().optional(),
  coverImageUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  additionalImages: z.array(z.string().optional()).optional(),
  tiers: z.any().optional(),
  milestones: z.array(z.any()).optional(),
});

type CampaignForm = z.infer<typeof campaignSchema>;

export default function CampaignCreator() {
  const [step, setStep] = React.useState<number>(0);
  const createCampaignMutation = useCreateVibeFundCampaign();

  const form = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      story: "",
      category: undefined,
      type: undefined,
      currency: "USD",
      goal: "",
      duration: "1 Month",
      fundingModel: "all-or-nothing",
      coverImageFile: undefined,
      coverImageUrl: undefined,
      videoUrl: undefined,
      additionalImages: ["", "", "", ""],
      tiers: [],
      milestones: [],
    },
  });

  // watch milestones so the UI updates when items are added/removed
  const milestones = form.watch("milestones") || [];
  // watch tiers so the UI updates when reward tiers are added/removed
  const tiers = form.watch("tiers") || [];

  const fieldsByStep: Record<number, (keyof CampaignForm)[]> = {
    0: ["title", "shortDescription", "story", "category", "type"],
    1: ["currency", "goal", "duration", "fundingModel"],
    2: ["coverImageFile", "coverImageUrl", "videoUrl", "additionalImages"],
    3: ["tiers"],
    4: ["milestones"],
  };

  const onNext = async () => {
    const fields = fieldsByStep[step] ?? [];
    const valid = await form.trigger(fields as any);
    if (valid) setStep((s) => s + 1);
  };

  const onPrevious = () => setStep((s) => Math.max(0, s - 1));

  const onLaunch = async () => {
    // Trigger validation for all steps before launching
    const allFields = Object.values(fieldsByStep).flat() as any;
    const valid = await form.trigger(allFields);
    if (!valid) {
      // If validation fails, navigate to first invalid step
      for (const [idxStr, flds] of Object.entries(fieldsByStep)) {
        // @ts-ignore
        const ok = await form.trigger(flds as any);
        if (!ok) {
          setStep(Number(idxStr));
          return;
        }
      }
      return;
    }

    // Prepare payload from form values and map to backend shape
    const values = form.getValues();

    const mapTypeToId = (t: any) => {
      if (!t) return undefined;
      if (typeof t === "number") return t;
      if (t === "reward") return 1;
      if (t === "equity") return 2;
      if (t === "donation") return 3;
      return undefined;
    };

    const parseNumber = (s: any) => {
      if (typeof s === "number") return s;
      if (!s) return 0;
      const num = Number(String(s).replace(/[^0-9.-]+/g, ""));
      return Number.isNaN(num) ? 0 : num;
    };

    const reward_tiers = (values.tiers || []).map((t: any) => {
      if (!t) return "";
      if (typeof t === "string") return t;
      const amount =
        t.amount !== undefined && t.amount !== null ? String(t.amount) : "";
      const title = t.title || "";
      const amountStr =
        amount !== "" ? (amount.startsWith("$") ? amount : `$${amount}`) : "";
      return amountStr ? `${amountStr} - ${title}`.trim() : title;
    });

    const milestonesArr = (values.milestones || []).map((m: any) => {
      if (!m) return "";
      if (typeof m === "string") return m;
      return m.title || String(m) || "";
    });

    const backendPayload: VibeFundCampaignPayload = {
      title: values.title,
      campaign_description: values.shortDescription,
      campaign_story: values.story,
      business_category_id: values.category
        ? Number(values.category)
        : undefined,
      compaign_type_id: mapTypeToId(values.type),
      funding_goal: parseNumber(values.goal),
      campaign_duration: values.duration,
      funding_model:
        values.fundingModel === "all-or-nothing"
          ? "All or Nothing"
          : values.fundingModel === "keep-what-you-raise"
          ? "Keep What You Raise"
          : values.fundingModel,
      cover_image: values.coverImageUrl || undefined,
      campaign_video: values.videoUrl || undefined,
      reward_tiers,
      milestones: milestonesArr,
      approved_status: false,
      emozi: (values as any).emozi || "🚀",
      status: true,
    };

    try {
      // Use mutation if available via react-query - we'll call it directly here
      await createCampaignMutation.mutateAsync(backendPayload);
      // Move to a final success state or show a toast / redirect as required
      setStep((s) => s + 1);
      // Basic user feedback for now
      window.alert("Campaign launched successfully.");
    } catch (err: any) {
      console.error("Failed to launch campaign:", err);
      window.alert(
        "Failed to launch campaign: " + (err?.message || String(err))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-4 overflow-x-auto py-4">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                i === step
                  ? "bg-blue-600 text-white border-blue-600"
                  : i < step
                  ? "bg-white text-gray-600 border-gray-300"
                  : "bg-white text-gray-400 border-gray-200"
              }`}
            >
              {i < step ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-sm">{i + 1}</span>
              )}
            </div>
            <div className="hidden md:block text-sm text-gray-700">{s}</div>
            {i < steps.length - 1 && (
              <div className="w-8 h-[1px] bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      <Form {...form}>
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the compelling campaign title..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of your campaign (appears in search results)..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="story"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Story *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell your full story - why this campaign matters..."
                          {...field}
                          className="h-40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <FormControl>
                          <BusinessCategorySelector
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Type *</FormLabel>
                        <FormControl>
                          <CampaignTypeSelector
                            value={field.value}
                            onChange={(v) => field.onChange(v)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      /* cancel handler */
                    }}
                  >
                    Cancel
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button onClick={onNext}>Next Step →</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Funding Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Goal *</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 mt-2">
                          <select
                            value={form.getValues("currency")}
                            onChange={(e) =>
                              form.setValue("currency", e.target.value)
                            }
                            className="px-3 py-2 border rounded-l-md bg-white"
                          >
                            <option>USD</option>
                            <option>EUR</option>
                            <option>GBP</option>
                          </select>
                          <Input
                            placeholder="Enter funding goal"
                            {...field}
                            className="flex-1 rounded-l-none"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Duration *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full px-3 py-2 border rounded-md mt-2"
                        >
                          <option>1 Month</option>
                          <option>2 Months</option>
                          <option>3 Months</option>
                          <option>6 Months</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="fundingModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funding Model *</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <button
                          type="button"
                          onClick={() => field.onChange("all-or-nothing")}
                          className={`p-4 border rounded-md text-left ${
                            field.value === "all-or-nothing"
                              ? "bg-blue-50 border-blue-500"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="font-medium">All-or-Nothing</div>
                          <div className="text-sm text-gray-500">
                            Only get funds if you reach your goal
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => field.onChange("keep-what-you-raise")}
                          className={`p-4 border rounded-md text-left ${
                            field.value === "keep-what-you-raise"
                              ? "bg-blue-50 border-blue-500"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="font-medium">Keep What You Raise</div>
                          <div className="text-sm text-gray-500">
                            Keep all funds regardless of goal
                          </div>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between mt-6">
                <Button variant="ghost" onClick={onPrevious}>
                  Previous
                </Button>
                <Button onClick={onNext}>Next Step →</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Media & Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Cover Image upload */}
                <div>
                  <FormLabel className="block text-sm font-medium text-gray-700">
                    Cover Image *
                  </FormLabel>
                  <div className="mt-2 border-dashed border-2 border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-gray-400">Upload Cover Image</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Recommended: 1200×630px, max 5MB (JPG, PNG, GIF)
                    </div>
                    <div className="mt-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          form.setValue("coverImageFile", f);
                        }}
                      />
                    </div>
                    <div className="mt-3">Or paste image URL</div>
                    <FormField
                      control={form.control}
                      name="coverImageUrl"
                      render={({ field }) => (
                        <div className="mt-2">
                          <Input placeholder="Or paste image URL" {...field} />
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Campaign Video */}
                <div>
                  <FormLabel className="block text-sm font-medium text-gray-700">
                    Campaign Video (Optional)
                  </FormLabel>
                  <div className="mt-2 border-dashed border-2 border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-gray-400">Add Campaign Video</div>
                    <div className="text-xs text-gray-400 mt-1">
                      YouTube, Vimeo, or direct video URL
                    </div>
                    <div className="mt-3">
                      <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Or paste video URL"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <FormLabel className="block text-sm font-medium text-gray-700">
                    Additional Images (Optional)
                  </FormLabel>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <FormField
                        key={idx}
                        control={form.control}
                        name={`additionalImages.${idx}` as any}
                        render={({ field }) => (
                          <FormItem>
                            <div className="border-dashed border-2 border-gray-200 rounded-lg p-4 text-center">
                              <div className="text-gray-400">Image URL</div>
                              <div className="mt-2">
                                <Input placeholder="Image URL" {...field} />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <Button variant="ghost" onClick={onPrevious}>
                    Previous
                  </Button>
                  <Button onClick={onNext}>Next Step →</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6" />
                <h2 className="text-2xl font-semibold">Rewards & Tiers</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">Reward Tiers</h3>
                  <p className="text-sm text-gray-500">
                    Create up to 10 reward tiers for your backers
                  </p>
                </div>

                <div>
                  <Button
                    onClick={() => {
                      const current = form.getValues("tiers") || [];
                      form.setValue("tiers", [
                        ...current,
                        { title: "", amount: "" },
                      ]);
                    }}
                    className="ml-4"
                  >
                    <Plus className="w-4 h-4" /> Add Tier
                  </Button>
                </div>
              </div>

              {tiers.length === 0 ? (
                <div className="border-dashed border-2 border-gray-200 rounded-md p-12 text-center mt-6">
                  <div className="text-gray-400">
                    <Gift className="w-8 h-8 mx-auto" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-700">
                    No Reward Tiers Yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Add reward tiers to give backers incentives to support your
                    campaign
                  </p>
                  <div className="mt-6">
                    <Button
                      onClick={() => {
                        const current = form.getValues("tiers") || [];
                        form.setValue("tiers", [
                          ...current,
                          { title: "", amount: 0, description: "" },
                        ]);
                      }}
                    >
                      <Plus className="w-4 h-4" /> Add Your First Tier
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mt-6">
                  {tiers.map((t: any, idx: number) => (
                    <div key={idx} className="border rounded-md p-6 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Gift className="w-5 h-5 text-blue-500" />
                          <h4 className="text-lg font-semibold">
                            Tier {idx + 1}
                          </h4>
                        </div>
                        <div>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              const cur = form.getValues("tiers") || [];
                              cur.splice(idx, 1);
                              form.setValue("tiers", cur);
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`tiers.${idx}.amount` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`tiers.${idx}.title` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tier Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Early Bird"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`tiers.${idx}.description` as any}
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Description (optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the rewards included in this tier..."
                                {...field}
                                className="h-24"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        const current = form.getValues("tiers") || [];
                        form.setValue("tiers", [
                          ...current,
                          { title: "", amount: 0, description: "" },
                        ]);
                      }}
                    >
                      <Plus className="w-4 h-4" /> Add Tier
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-6">
                <Button variant="ghost" onClick={onPrevious}>
                  Previous
                </Button>
                <Button onClick={onNext}>Next Step →</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6" />
                <h2 className="text-2xl font-semibold">Milestones</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">Campaign Milestones</h3>
                  <p className="text-sm text-gray-500">
                    Show backers how you'll use the funds at different funding
                    levels
                  </p>
                </div>

                <div>
                  <Button
                    onClick={() => {
                      const cur = form.getValues("milestones") || [];
                      form.setValue("milestones", [
                        ...cur,
                        { title: "", amount: "" },
                      ]);
                    }}
                  >
                    <Plus className="w-4 h-4" /> Add Milestone
                  </Button>
                </div>
              </div>

              {milestones.length === 0 ? (
                <div className="border-dashed border-2 border-gray-200 rounded-md p-12 text-center mt-6">
                  <div className="text-gray-400">
                    <Gift className="w-8 h-8 mx-auto" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-700">
                    No Milestones Yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Add milestones to show backers how you'll use the funds
                  </p>
                  <div className="mt-6">
                    <Button
                      onClick={() => {
                        const cur = form.getValues("milestones") || [];
                        form.setValue("milestones", [
                          ...cur,
                          { title: "", amount: 0, description: "" },
                        ]);
                      }}
                    >
                      <Plus className="w-4 h-4" /> Add Your First Milestone
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mt-6">
                  {milestones.map((m: any, idx: number) => (
                    <div key={idx} className="border rounded-md p-6 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-blue-500" />
                          <h4 className="text-lg font-semibold">
                            Milestone {idx + 1}
                          </h4>
                        </div>
                        <div>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              const cur = form.getValues("milestones") || [];
                              cur.splice(idx, 1);
                              form.setValue("milestones", cur);
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name={`milestones.${idx}.amount` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Amount</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`milestones.${idx}.title` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Milestone Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Early Bird Special"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`milestones.${idx}.description` as any}
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Description *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what will be accomplished at this funding level ..."
                                {...field}
                                className="h-24"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        const cur = form.getValues("milestones") || [];
                        form.setValue("milestones", [
                          ...cur,
                          { title: "", amount: 0, description: "" },
                        ]);
                      }}
                    >
                      <Plus className="w-4 h-4" /> Add Milestone
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-6">
                <Button variant="ghost" onClick={onPrevious}>
                  Previous
                </Button>
                <Button onClick={onNext}>Next Step →</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Launch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" /> Ready to
                    Launch!
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Review your campaign details before submitting for approval
                  </p>

                  <div className="mt-4 border rounded-md p-4 bg-white">
                    <h4 className="font-medium">Campaign Preview</h4>
                    <div className="mt-3 text-sm text-gray-700">
                      <div className="font-semibold">
                        {form.getValues("title") || "(No title)"}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {form.getValues("category") && (
                          <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                            {form.getValues("category")}
                          </div>
                        )}
                        {form.getValues("type") && (
                          <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            {form.getValues("type")}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Goal: {form.getValues("currency")}{" "}
                          {form.getValues("goal") || "0"}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4 text-xs text-gray-600">
                        <div>
                          <div className="text-gray-500">Duration</div>
                          <div className="font-medium mt-1">
                            {form.getValues("duration")}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Funding Model</div>
                          <div className="font-medium mt-1">
                            {form.getValues("fundingModel")}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Reward Tiers</div>
                          <div className="font-medium mt-1">
                            {(form.getValues("tiers") || []).length} Tiers
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-gray-700">
                        <div className="text-gray-500">Milestones</div>
                        <div className="mt-1">
                          {(form.getValues("milestones") || [])
                            .map(
                              (m: any) =>
                                `${m.amount || "$0"} - ${
                                  m.title || "(no title)"
                                }`
                            )
                            .join(", ") || "None"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border rounded-md p-4 bg-white">
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-600" /> Launch
                      Checklist
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1" />{" "}
                        <span>Campaign title and description</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1" />{" "}
                        <span>Cover image or video</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1" />{" "}
                        <span>Funding goal and duration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1" />{" "}
                        <span>Reward tiers (if applicable)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1" />{" "}
                        <span>Campaign story</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={onPrevious}>
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={onLaunch}
                      disabled={createCampaignMutation.isPending}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      {createCampaignMutation.isPending ? (
                        <span>Launching...</span>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="inline w-4 h-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Launch Campaign
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </Form>
    </div>
  );
}
