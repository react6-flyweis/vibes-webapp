import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft } from "lucide-react";
import EventDetails from "./invite-steps/EventDetails";
import TemplateSelection from "./invite-steps/TemplateSelection";
import CustomizeStep from "./invite-steps/CustomizeStep";
import SendStep from "./invite-steps/SendStep";
import {
  InvitationEvent,
  InvitationTemplate,
  Guest,
  StepType,
  InvitationPreview,
} from "@/types/invitation";

import image3 from "../../assests/templateImage/3.jpg";

import image4 from "../../assests/templateImage/4.jpg";
import image5 from "../../assests/templateImage/5.jpg";
import GuestManagement from "@/components/invitation/GuestManagement";
import PreviewInvitation from "@/components/invitation/PreviewInvitation";
import PriceConfirmationDialog from "@/components/PriceConfirmationDialog";

// types moved to `@/types/invitation`

export default function CompleteInviteWorkflow() {
  const { toast } = useToast();

  // Core workflow state
  const [currentStep, setCurrentStep] = useState<StepType>("event");
  const [selectedEvent, setSelectedEvent] = useState<InvitationEvent | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<InvitationTemplate | null>(null);
  const [guestList, setGuestList] = useState<Guest[]>([]);
  const [customizations, setCustomizations] = useState<
    InvitationPreview["customizations"]
  >({
    colors: ["#6366f1", "#8b5cf6"],
    fonts: ["Inter", "Playfair Display"],
    animations: true,
    arExperience: false,
    nftPassPreview: false,
    gamificationElements: false,
    culturalElements: [],
    sustainabilityBadges: false,
  });

  // Preview and sending state
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "mobile" | "ar" | "nft"
  >("desktop");

  // Price confirmation dialog state
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [priceEstimate, setPriceEstimate] = useState<number>(0);

  const sampleTemplates: InvitationTemplate[] = [
    {
      id: "template-neon-nights",
      name: "Neon Nights AR Experience",
      category: "ar-enhanced",
      thumbnail: image4,
      previewImages: [image4, image4],
      features: [
        "3D Neon Animations",
        "AR Party Preview",
        "Interactive Elements",
        "Sound Integration",
      ],
      isPremium: true,
      arElements: [
        "Floating Neon Signs",
        "3D Party Scene",
        "Interactive DJ Booth",
        "Virtual Confetti",
      ],
      interactiveFeatures: [
        "Tap to RSVP",
        "AR Venue Tour",
        "Music Preview",
        "Guest Messages",
      ],
      musicIntegration: true,
      gamificationLevel: "advanced",
    },
    {
      id: "template-cultural-celebration",
      name: "Global Cultural Celebration",
      category: "cultural",
      thumbnail: image3,

      previewImages: [image3, image3],
      features: [
        "Multi-language Support",
        "Cultural Elements",
        "Traditional Patterns",
        "Local Customs",
      ],
      isPremium: false,
      culturalRegion: "Global",
      interactiveFeatures: [
        "Cultural Quiz",
        "Traditional Music",
        "Language Selection",
      ],
      gamificationLevel: "medium",
    },
    {
      id: "template-nft-exclusive",
      name: "NFT VIP Experience",
      category: "nft-exclusive",
      thumbnail: image3,
      previewImages: [image3, image5],
      features: [
        "Blockchain Authentication",
        "NFT Pass Generation",
        "Exclusive Access",
        "Digital Collectibles",
      ],
      isPremium: true,
      nftIntegration: true,
      interactiveFeatures: [
        "NFT Minting",
        "Wallet Connect",
        "Token Gating",
        "Exclusive Perks",
      ],
      gamificationLevel: "advanced",
    },
  ];

  const stepProgress = {
    event: 0,
    template: 20,
    customize: 40,
    guests: 60,
    preview: 80,
    send: 100,
  };

  // Open the price dialog automatically when entering the send step
  useEffect(() => {
    if (currentStep === "send") {
      setPriceEstimate(99.99);
      setPriceDialogOpen(true);
    } else {
      setPriceDialogOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, selectedTemplate, guestList]);

  const handleMethodSelect = async (method: number) => {
    // throw error
    throw new Error("Payment method selection not implemented yet.");
  };

  const handleConfirm = (payment: any) => {
    setPriceDialogOpen(false);
    toast({
      title: "Payment confirmed",
      description: "Payment was processed (stub).",
    });
  };

  // Build preview data from selections for the Preview step
  const previewData: InvitationPreview | null =
    selectedEvent && selectedTemplate
      ? {
          template: selectedTemplate,
          event: selectedEvent,
          customizations,
        }
      : null;

  return (
    <div className="min-h-screen bg-[#111827] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white dark:text-white mb-2">
            Complete Invitation Workflow
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Create stunning invitations with AI, AR, NFT, and social features
          </p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <Progress value={stepProgress[currentStep]} className="h-3 mb-4" />
            <div className="flex justify-between text-sm text-gray-500">
              <span
                className={
                  currentStep === "event" ? "text-purple-600 font-medium" : ""
                }
              >
                Event Details
              </span>
              <span
                className={
                  currentStep === "template"
                    ? "text-purple-600 font-medium"
                    : ""
                }
              >
                Choose Template
              </span>
              <span
                className={
                  currentStep === "customize"
                    ? "text-purple-600 font-medium"
                    : ""
                }
              >
                Customize
              </span>
              <span
                className={
                  currentStep === "guests" ? "text-purple-600 font-medium" : ""
                }
              >
                Guest List
              </span>
              <span
                className={
                  currentStep === "preview" ? "text-purple-600 font-medium" : ""
                }
              >
                Preview
              </span>
              <span
                className={
                  currentStep === "send" ? "text-purple-600 font-medium" : ""
                }
              >
                Send
              </span>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[
              "event",
              "template",
              "customize",
              "guests",
              "preview",
              "send",
            ].map((step, index) => (
              <Button
                key={step}
                variant={currentStep === step ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(step as any)}
                className="capitalize"
              >
                {step}
              </Button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {/* Step 1: Event Details */}
          {currentStep === "event" && (
            <EventDetails
              setCurrentStep={setCurrentStep}
              onConfirm={(ev) => {
                setSelectedEvent(ev);
                setCurrentStep("template");
              }}
            />
          )}

          {/* Step 2: Template Selection */}
          {currentStep === "template" && (
            <TemplateSelection
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              sampleTemplates={sampleTemplates}
              setCurrentStep={setCurrentStep}
            />
          )}

          {/* Step 3: Customization */}
          {currentStep === "customize" && selectedTemplate && (
            <CustomizeStep
              selectedTemplate={selectedTemplate}
              selectedEvent={selectedEvent}
              customizations={customizations}
              setCustomizations={setCustomizations}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
            />
          )}

          {currentStep === "guests" && (
            <GuestManagement
              eventId={selectedEvent?.id || ""}
              onGuestsChange={(g) => {
                // g is mapped to the frontend Guest shape in GuestManagement
                setGuestList(g as Guest[]);
              }}
            />
          )}
          {currentStep === "preview" && (
            <PreviewInvitation
              setCurrentStep={setCurrentStep}
              previewData={previewData}
              guests={guestList}
            />
          )}
          {currentStep === "send" && <SendStep />}

          {/* Price confirmation dialog — opens when user reaches `send` step */}
          <PriceConfirmationDialog
            open={priceDialogOpen}
            onOpenChange={(open) => setPriceDialogOpen(open)}
            priceEstimate={priceEstimate}
            onConfirm={handleConfirm}
            onPrevious={() => setCurrentStep("preview")}
            onMethodSelect={handleMethodSelect}
          />

          {/* Navigation Buttons */}
          {currentStep !== "event" && currentStep !== "template" && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  const steps = [
                    "event",
                    "template",
                    "customize",
                    "guests",
                    "preview",
                    "send",
                  ];
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex > 0) {
                    setCurrentStep(steps[currentIndex - 1] as any);
                  }
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => {
                  const steps = [
                    "event",
                    "template",
                    "customize",
                    "guests",
                    "preview",
                    "send",
                  ];
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex < steps.length - 1) {
                    setCurrentStep(steps[currentIndex + 1] as any);
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
