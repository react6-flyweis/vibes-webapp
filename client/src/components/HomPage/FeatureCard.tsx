import type { FC, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter'; // 🔗 wouter import

// Define the structure for each feature item within a card
interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

// Define the props for the FeatureCard component
interface FeatureCardProps {
  icon: ReactNode;
  tag: {
    text: string;
    bgColor: string;
    textColor: string;
  };
  title: string;
  description: string;
  features: Feature[];
  buttonText: string;
  buttonLink?: string; // 🔗 add optional link
  gradientClasses: string;
  borderClass: string;
  buttonClasses: string;
  iconBgClass: string;
}

const FeatureCard: FC<FeatureCardProps> = ({
  icon,
  tag,
  title,
  description,
  features,
  buttonText,
  buttonLink, // 🔗
  gradientClasses,
  borderClass,
  buttonClasses,
  iconBgClass,
}) => {
  return (
    <div
      className={`box-border flex h-full min-h-[510px] flex-col rounded-xl border p-6 shadow-lg ${gradientClasses} ${borderClass}`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div className="flex-shrink-0">{icon}</div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${tag.bgColor} ${tag.textColor}`}
        >
          {tag.text}
        </span>
      </div>

      {/* Card Title and Description */}
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>

      {/* Features List */}
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div
              className={`mr-4 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${iconBgClass}`}
            >
              {feature.icon}
            </div>
            <div>
              <h4 className="font-bold text-gray-800">{feature.title}</h4>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Action Button as Link */}
      {buttonLink ? (
        <Link
          href={buttonLink}
          className={`mt-auto flex w-full items-center justify-center rounded-lg py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 ${buttonClasses}`}
        >
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      ) : (
        <button
          className={`mt-auto flex w-full items-center justify-center rounded-lg py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 ${buttonClasses}`}
        >
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default FeatureCard;
