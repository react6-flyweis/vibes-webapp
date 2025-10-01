import React from "react";
import { Globe, Ticket, Users, Music, Sparkles } from "lucide-react";
import { FaFacebookF } from "react-icons/fa6";

interface IntegrationCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bgColor: string;
  borderColor: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  icon,
  title,
  subtitle,
  bgColor,
  borderColor,
}) => {
  return (
    <div
      className={`h-[110px] w-full sm:w-[280px] md:w-[320px] lg:w-[340px] rounded-lg border flex flex-col items-center justify-center text-center px-4`}
      style={{ background: bgColor, borderColor: borderColor }}
    >
      <div className="mb-2">{icon}</div>
      <h3 className="font-bold text-sm sm:text-base text-gray-900">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600">{subtitle}</p>
    </div>
  );
};

const EventIntegrations: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mx-auto container">
      {/* Heading */}
      <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-3 flex items-center gap-2 text-center sm:text-left justify-center sm:justify-start">
        🌐 Event Platform Integrations
      </h2>
      <p className="text-white text-base sm:text-lg md:text-xl mb-8 max-w-5xl text-center sm:text-left mx-auto sm:mx-0">
        Automatically import paid events from major platforms with AI-powered
        categorization and duplicate detection
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl ">
        <IntegrationCard
          icon={<Ticket className="text-orange-600 w-7 h-7 sm:w-8 sm:h-8" />}
          title="Eventbrite"
          subtitle="Official API"
          bgColor="#FFF7ED"
          borderColor="#FED7AA"
        />
        <IntegrationCard
          icon={<Users className="text-red-600 w-7 h-7 sm:w-8 sm:h-8" />}
          title="Meetup"
          subtitle="Real-time Sync"
          bgColor="#FEF2F2"
          borderColor="#FECACA"
        />
        <IntegrationCard
          icon={<Music className="text-blue-600 w-7 h-7 sm:w-8 sm:h-8" />}
          title="Ticketmaster"
          subtitle="Event Discovery"
          bgColor="#EFF6FF"
          borderColor="#BFDBFE"
        />
        <IntegrationCard
          icon={<Sparkles className="text-purple-600 w-7 h-7 sm:w-8 sm:h-8" />}
          title="Universe"
          subtitle="Party Events"
          bgColor="#FAF5FF"
          borderColor="#E9D5FF"
        />
        <IntegrationCard
          icon={<Globe className="text-green-600 w-7 h-7 sm:w-8 sm:h-8" />}
          title="AllEvents.in"
          subtitle="Global Coverage"
          bgColor="#F0FDF4"
          borderColor="#BBF7D0"
        />
        <IntegrationCard
          icon={<FaFacebookF className="text-blue-700 w-7 h-7 sm:w-8 sm:h-8" />}
          title="Facebook"
          subtitle="Social Events"
          bgColor="#EFF6FF"
          borderColor="#BFDBFE"
        />
      </div>
    </section>
  );
};

export default EventIntegrations;
