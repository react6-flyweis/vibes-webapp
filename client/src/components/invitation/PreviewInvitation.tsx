import React from "react";
import {
  Edit,
  MapPin,
  Calendar,
  Clock,
  Camera,
  Music,
  Gamepad2,
  MinusCircle,
  Megaphone,
  Sparkles,
  Utensils,
  Eye,
} from "lucide-react";
import { InvitationPreview, Guest, StepType } from "@/types/invitation";

// --- Modified Card Wrapper Component ---

interface CardWrapperProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onEdit: () => void; // Added onEdit prop to make the button functional
}

const CardWrapper: React.FC<CardWrapperProps> = ({
  title,
  icon,
  children,
  onEdit,
}) => (
  <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 mb-8 w-full">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        {icon}
        <h2 className="text-2xl font-bold text-gray-800 ml-2">{title}</h2>
      </div>
      {/* The onClick handler now uses the onEdit prop */}
      <button
        onClick={onEdit}
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Edit size={16} className="mr-2" />
        Edit Details
      </button>
    </div>
    {children}
  </div>
);

// --- Prop Types for each card component ---
interface CardComponentProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<StepType>>;
  previewData?: InvitationPreview | null;
  guests?: Guest[];
}

// --- 1. Event Details Card ---
export const EventDetailsCard: React.FC<CardComponentProps> = ({
  setCurrentStep,
  previewData,
}) => (
  <CardWrapper
    title="Event Details"
    icon={<Calendar size={30} className="text-red-500" />}
    onEdit={() => setCurrentStep("event")} // Navigate to the 'event' step on edit
  >
    <form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            defaultValue={previewData?.event?.title}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Venue *
          </label>
          <input
            type="text"
            defaultValue={previewData?.event?.venue ?? "Sky Lounge Rooftop"}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Address
          </label>
          <textarea
            defaultValue={
              previewData?.event?.address ?? "123 Downtown Ave, City"
            }
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Category
          </label>
          <input
            type="text"
            defaultValue={previewData?.event?.category ?? "Birthday Party"}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date *
            </label>
            <div className="relative">
              <input
                type="text"
                defaultValue={previewData?.event?.date ?? "07 / 03 / 2025"}
                className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
              <Calendar
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Time *
            </label>
            <div className="relative">
              <input
                type="text"
                defaultValue={previewData?.event?.time ?? "08 : 30 PM"}
                className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
              <Clock
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  </CardWrapper>
);

// --- 2. Invitation Template Card ---
export const InvitationTemplateCard: React.FC<CardComponentProps> = ({
  setCurrentStep,
  previewData,
}) => (
  <CardWrapper
    title="Invitation Template"
    icon={<Megaphone size={30} className="text-red-500" />}
    onEdit={() => setCurrentStep("template")} // Navigate to the 'template' step on edit
  >
    <div className="flex justify-start">
      <div className="relative bg-white rounded-lg p-3 w-72 shadow-xl border border-purple-400">
        <div className="relative rounded-md overflow-hidden h-48 mb-3">
          <img
            src={
              previewData?.template?.thumbnail ??
              "https://images.unsplash.com/photo-1543886151-3bc2b94adddc?q=80&w=1000&auto=format&fit=crop"
            }
            alt={previewData?.template?.name ?? "Neon Night AR Experience"}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
            {previewData?.template?.isPremium ? "Premium" : "Free"}
          </span>
          {previewData?.template?.category && (
            <span className="absolute top-3 right-3 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
              {previewData.template.category}
            </span>
          )}
        </div>
        <h3 className="font-bold text-lg text-gray-900">
          {previewData?.template?.name ?? "Neon Night AR Experience"}
        </h3>
        <div className="flex flex-wrap text-xs space-x-2 my-2">
          {(
            previewData?.template?.features ?? [
              "3D Neon Animation",
              "AR Party Preview",
            ]
          )
            .slice(0, 3)
            .map((f, i) => (
              <span
                key={i}
                className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
              >
                {f}
              </span>
            ))}
        </div>
        <div className="flex text-xs space-x-2">
          {previewData?.template?.interactiveFeatures
            ?.slice(0, 3)
            .map((f, i) => (
              <span
                key={i}
                className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
              >
                {f}
              </span>
            ))}
        </div>
        <div className="flex justify-between items-center mt-4 text-gray-600">
          <div className="flex space-x-2">
            <Camera size={16} />
            <Music size={16} />
            <Gamepad2 size={16} />
          </div>
          <button className="bg-white border border-gray-300 px-4 py-1 rounded-md text-sm text-gray-800 hover:bg-gray-50">
            Preview
          </button>
        </div>
      </div>
    </div>
  </CardWrapper>
);

// --- 3. Your Invitation Card ---
export const YourInvitationCard: React.FC<CardComponentProps> = ({
  setCurrentStep,
  previewData,
}) => (
  <CardWrapper
    title="Your Invitation"
    icon={<Sparkles size={30} className="text-red-500" />}
    onEdit={() => setCurrentStep("customize")} // Navigate to the 'customize' step on edit
  >
    <div className="flex justify-start">
      <div className="bg-linear-to-br from-indigo-400 to-purple-700 text-white rounded-2xl p-8 w-80 shadow-lg">
        <h3 className="text-3xl font-bold mb-2">
          {previewData?.event?.title ?? "Your Event"}
        </h3>
        <p className="text-indigo-100 mb-6">
          {previewData?.event?.description ?? "Event description here..."}
        </p>
        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <Calendar size={20} className="mr-3 text-indigo-200" />
            <span className="font-semibold text-white">{`${
              previewData?.event?.date ?? ""
            } ${previewData?.event?.time ?? ""}`}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={20} className="mr-3 text-indigo-200" />
            <span className="font-semibold text-white">
              {previewData?.event?.venue ?? ""}
            </span>
          </div>
        </div>
        <button className="w-full bg-white text-indigo-700 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors">
          RSVP Now
        </button>
      </div>
    </div>
  </CardWrapper>
);

export const GuestListCard: React.FC<CardComponentProps> = ({
  setCurrentStep,
  guests,
}) => (
  <CardWrapper
    title="Your Guests List"
    icon={<Utensils size={30} className="text-red-500" />}
    onEdit={() => setCurrentStep("guests")} // Navigate to the 'guests' step on edit
  >
    <div className="space-y-4">
      {guests?.map((guest, index) => (
        <div
          key={guest.id ?? index}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="mb-2 sm:mb-0">
            <p className="font-bold text-gray-800">{guest.name}</p>
            <p className="text-sm text-gray-500">{guest.email}</p>
            <p className="text-sm text-gray-500">{guest.phone}</p>
          </div>
          <button className="flex items-center text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm">
            <MinusCircle size={16} className="mr-2" />
            Remove this Guest
          </button>
        </div>
      ))}
    </div>
  </CardWrapper>
);

// --- Main Preview Invitation Component ---

interface PreviewInvitationProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<StepType>>;
  previewData?: InvitationPreview | null;
  guests?: Guest[];
}

const PreviewInvitation: React.FC<PreviewInvitationProps> = ({
  setCurrentStep,
  previewData,
  guests,
}) => {
  return (
    <div className="bg-white py-6 px-4 sm:px-6 lg:px-8 rounded-lg">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg">
            <Eye className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              Preview Your Invitation
            </h1>
            <p className="text-sm text-gray-600">
              Review all the details below. Click "Edit Details" on any card to
              make changes.
            </p>
          </div>
        </div>

        {/* Cards - Pass the setCurrentStep prop down to each one */}
        <EventDetailsCard
          setCurrentStep={setCurrentStep}
          previewData={previewData ?? null}
        />
        <InvitationTemplateCard
          setCurrentStep={setCurrentStep}
          previewData={previewData ?? null}
        />
        <YourInvitationCard
          setCurrentStep={setCurrentStep}
          previewData={previewData ?? null}
        />
        <GuestListCard setCurrentStep={setCurrentStep} guests={guests} />
      </div>
    </div>
  );
};

export default PreviewInvitation;
