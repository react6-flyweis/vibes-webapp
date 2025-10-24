import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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

  // Guest management state
  const [bulkGuestInput, setBulkGuestInput] = useState("");
  const [singleGuest, setSingleGuest] = useState({
    name: "",
    email: "",
    phone: "",
    tier: "general" as const,
  });

  // Preview and sending state
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "mobile" | "ar" | "nft"
  >("desktop");
  const [sendingMethod, setSendingMethod] = useState<
    "email" | "sms" | "social" | "qr" | "nfc"
  >("email");
  const [scheduledSend, setScheduledSend] = useState("");
  const [personalizedMessages, setPersonalizedMessages] = useState<
    Record<string, string>
  >({});

  const generateInvitationMutation = useMutation({
    mutationFn: async (data: {
      eventId: string;
      templateId: string;
      customizations: any;
      guests: Guest[];
    }) => {
      const response = await apiRequest(
        "POST",
        "/api/invitations/generate",
        data
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Invitations Generated",
        description: "Your personalized invitations are ready to send",
      });
      setCurrentStep("send");
    },
  });

  const sendInvitationsMutation = useMutation({
    mutationFn: async (data: {
      invitationId: string;
      method: string;
      recipients: Guest[];
      scheduledTime?: string;
      personalizations?: Record<string, string>;
    }) => {
      const response = await apiRequest("POST", "/api/invitations/send", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Invitations Sent",
        description: `Successfully sent ${data.sentCount} invitations`,
      });
    },
  });

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

  const handleCreateEvent = () => {
    // Deprecated - event creation now handled inside EventDetails
  };

  const handleAddGuest = () => {
    if (!singleGuest.name || !singleGuest.email) {
      toast({
        title: "Missing Information",
        description: "Please provide name and email",
        variant: "destructive",
      });
      return;
    }

    const newGuest: Guest = {
      id: `guest-${Date.now()}`,
      ...singleGuest,
      rsvpStatus: "pending",
      accessLevel: "full",
    };

    setGuestList((prev) => [...prev, newGuest]);
    setSingleGuest({ name: "", email: "", phone: "", tier: "general" });

    toast({
      title: "Guest Added",
      description: `${newGuest.name} has been added to the guest list`,
    });
  };

  const handleBulkImport = () => {
    if (!bulkGuestInput.trim()) return;

    const lines = bulkGuestInput.split("\n").filter((line) => line.trim());
    const newGuests: Guest[] = lines.map((line, index) => {
      const [name, email, phone] = line.split(",").map((s) => s.trim());
      return {
        id: `guest-bulk-${Date.now()}-${index}`,
        name: name || `Guest ${index + 1}`,
        email: email || `guest${index + 1}@example.com`,
        phone: phone || "",
        tier: "general" as const,
        rsvpStatus: "pending" as const,
        accessLevel: "full" as const,
      };
    });

    setGuestList((prev) => [...prev, ...newGuests]);
    setBulkGuestInput("");

    toast({
      title: "Guests Imported",
      description: `Added ${newGuests.length} guests to the list`,
    });
  };

  const handleGenerateInvitations = () => {
    if (!selectedEvent || !selectedTemplate || guestList.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please complete all steps before generating invitations",
        variant: "destructive",
      });
      return;
    }

    generateInvitationMutation.mutate({
      eventId: selectedEvent.id,
      templateId: selectedTemplate.id,
      customizations,
      guests: guestList,
    });
  };

  const handleSendInvitations = () => {
    if (!selectedEvent || guestList.length === 0) return;

    sendInvitationsMutation.mutate({
      invitationId: `invitation-${selectedEvent.id}`,
      method: sendingMethod,
      recipients: guestList,
      scheduledTime: scheduledSend || undefined,
      personalizations: personalizedMessages,
    });
  };

  const stepProgress = {
    event: 0,
    template: 20,
    customize: 40,
    guests: 60,
    preview: 80,
    send: 100,
  };

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

          {currentStep === "guests" && <GuestManagement />}
          {currentStep === "preview" && (
            <PreviewInvitation setCurrentStep={setCurrentStep} />
          )}
          {currentStep === "send" && <SendStep />}

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
