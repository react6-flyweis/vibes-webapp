import FeatureCard from './FeatureCard';
import {
  FileText, ShieldCheck, MapPin, CheckCircle, UserCog,
  BookUser, TrendingUp, MessageSquare, BarChart, Lock, UserCheck,
  Zap, Gift, Bot, LineChart, Cpu, Brain, Smartphone, Building2, Shield,
} from 'lucide-react';
import type { ReactNode } from 'react';

// Helper function to create icon components with consistent styling
const createIcon = (IconComponent: any, colorClass: string): ReactNode => (
  <IconComponent className={`h-5 w-5 ${colorClass}`} />
);

const createMainIcon = (IconComponent: any, colorClass: string): ReactNode => (
  <IconComponent className={`h-12 w-12 ${colorClass}`} />
);

const cardsData = [
  // Card 1: Professional Vendor Onboarding
  {
    icon: createMainIcon(Building2, 'text-purple-600'),
    tag: { text: 'New', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    title: 'Professional Vendor Onboarding',
    description: 'Complete self-service registration with AI-powered document processing.',
    features: [
      {
        icon: createIcon(FileText, 'text-purple-600'),
        title: 'AI-Powered OCR Processing',
        description: 'Automatic document extraction with 95%+ accuracy.',
      },
      {
        icon: createIcon(UserCheck, 'text-purple-600'),
        title: 'Multi-Provider KYC Verification',
        description: 'Integrated with Jumio, Smile Identity, and ShuftiPro.',
      },
      {
        icon: createIcon(MapPin, 'text-purple-600'),
        title: 'Service Area Management',
        description: 'Define coverage areas with geospatial mapping.',
      },
    ],
    buttonText: 'Start Vendor Registration',
    buttonLink: '/vendor-onboarding', // 🔗 added route
    gradientClasses: 'bg-linear-to-br from-purple-50 to-pink-50',
    borderClass: 'border-purple-200',
    buttonClasses: 'bg-purple-600',
    iconBgClass: 'bg-purple-100',
  },
  // Card 2: Vendor Mobile Dashboard
  {
    icon: createMainIcon(Smartphone, 'text-blue-600'),
    tag: { text: 'Mobile', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    title: 'Vendor Mobile Dashboard',
    description: 'Manage your business anywhere with our React Native mobile experience.',
    features: [
      {
        icon: createIcon(BookUser, 'text-blue-600'),
        title: 'Bookings Manager',
        description: 'Accept, decline, and manage all your event bookings.',
      },
      {
        icon: createIcon(TrendingUp, 'text-blue-600'),
        title: 'Earnings Dashboard',
        description: 'Track payments, view transaction history, and monitor revenue.',
      },
      {
        icon: createIcon(MessageSquare, 'text-blue-600'),
        title: 'Live Chat & Notifications',
        description: 'Instant messaging with customers and real-time push notifications.',
      },
    ],
    buttonText: 'Access Mobile Dashboard',
    buttonLink: '/mobile-dashboard', // 🔗
    gradientClasses: 'bg-linear-to-br from-blue-50 to-indigo-50',
    borderClass: 'border-blue-200',
    buttonClasses: 'bg-blue-600',
    iconBgClass: 'bg-blue-100',
  },
  // Card 3: AI Risk Engine & Automation
  {
    icon: createMainIcon(Brain, 'text-orange-600'),
    tag: { text: 'AI-Powered', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    title: 'AI Risk Engine & Automation',
    description: 'MODULE 3: Intelligent vendor monitoring with predictive analytics.',
    features: [
      {
        icon: createIcon(CheckCircle, 'text-orange-600'),
        title: 'AI Profile Completeness Scoring',
        description: 'Intelligent profile analysis with section-by-section recommendations.',
      },
      {
        icon: createIcon(BarChart, 'text-orange-600'),
        title: 'Smart Tiering System',
        description: 'Automated Gold/Silver/Bronze classification based on KYC & SLA.',
      },
      {
        icon: createIcon(TrendingUp, 'text-orange-600'),
        title: 'Risk Monitoring & Sentiment Analysis',
        description: 'Real-time churn prediction and review sentiment tracking.',
      },
    ],
    buttonText: 'Access Risk Engine Dashboard',
    buttonLink: '/risk-engine', // 🔗
    gradientClasses: 'bg-linear-to-br from-orange-50 to-red-50',
    borderClass: 'border-orange-200',
    buttonClasses: 'bg-orange-600',
    iconBgClass: 'bg-orange-100',
  },
  // Card 4: Analytics & Admin Oversight
  {
    icon: createMainIcon(Shield, 'text-red-600'),
    tag: { text: 'Admin', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    title: 'Analytics & Admin Oversight',
    description: 'MODULE 5: Comprehensive admin controls and vendor performance monitoring.',
    features: [
      {
        icon: createIcon(UserCog, 'text-red-600'),
        title: 'Admin Moderation Panel',
        description: 'Approve/reject profiles, review flagged content, and monitor KYC logs.',
      },
      {
        icon: createIcon(LineChart, 'text-red-600'),
        title: 'Performance Analytics',
        description: 'Track SLA compliance, review ratings, booking rates, and revenue.',
      },
      {
        icon: createIcon(Zap, 'text-red-600'),
        title: 'Automated Alerts & Deactivation',
        description: 'Email/SMS nudges, renewal reminders, and auto-suspension rules.',
      },
    ],
    buttonText: 'Access Admin Dashboard',
    buttonLink: '/admin-dashboard', // 🔗
    gradientClasses: 'bg-linear-to-br from-red-50 to-orange-50',
    borderClass: 'border-red-200',
    buttonClasses: 'bg-red-600',
    iconBgClass: 'bg-red-100',
  },
  // Card 5: Security & Compliance
  {
    icon: createMainIcon(Lock, 'text-indigo-600'),
    tag: { text: 'Secure', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    title: 'Security & Compliance',
    description: 'MODULE 6: Enterprise-grade security with GDPR/NDPR compliance.',
    features: [
      {
        icon: createIcon(UserCheck, 'text-indigo-600'),
        title: 'Role-Based Access Control',
        description: 'Admin, Vendor, Super Admin, and Support roles with permissions.',
      },
      {
        icon: createIcon(FileText, 'text-indigo-600'),
        title: 'GDPR/NDPR Compliance',
        description: 'Consent management and secure document storage.',
      },
      {
        icon: createIcon(Lock, 'text-indigo-600'),
        title: 'Advanced Security Features',
        description: '2FA authentication, audit logs, and email verification layers.',
      },
    ],
    buttonText: 'Access Security Dashboard',
    buttonLink: '/security-dashboard', // 🔗
    gradientClasses: 'bg-linear-to-br from-indigo-50 to-purple-50',
    borderClass: 'border-indigo-200',
    buttonClasses: 'bg-indigo-600',
    iconBgClass: 'bg-indigo-100',
  },
  // Card 6: Innovation Hub
  {
    icon: createMainIcon(Zap, 'text-purple-600'),
    tag: { text: 'AI-Powered', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    title: 'Innovation Hub',
    description: 'MODULE 7: Next-gen vendor onboarding innovations.',
    features: [
      {
        icon: createIcon(Gift, 'text-purple-600'),
        title: 'Vendor Referral System',
        description: 'Track referrals with auto-bonuses for successful signups.',
      },
      {
        icon: createIcon(Bot, 'text-purple-600'),
        title: 'AI Chatbot & Smart Tools',
        description: 'GPT guide, QR instant signup, social sync, ERP integration.',
      },
      {
        icon: createIcon(LineChart, 'text-purple-600'),
        title: 'Innovation Analytics',
        description: 'Track referrals, chatbot stats, QR conversions, and sync rates.',
      },
    ],
    buttonText: 'Explore Innovations',
    buttonLink: '/innovation-hub', // 🔗
    gradientClasses: 'bg-linear-to-br from-purple-50 to-pink-50',
    borderClass: 'border-purple-200',
    buttonClasses: 'bg-purple-600',
    iconBgClass: 'bg-purple-100',
  },
];

const FeatureGrid = () => {
  return (
    <section className=" p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cardsData.map((card, index) => (
            <FeatureCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
