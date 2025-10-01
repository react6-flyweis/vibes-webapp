import React from 'react';
import {
  Bot,
  MousePointer2,
  Code2,
  Zap,
  Cloud,
  ShieldAlert,
  Check,
  Globe ,
  Activity ,
  Shield 
} from 'lucide-react';

//----------- Reusable Sub-Components -----------//

type StatItemProps = {
  value: string;
  label: string;
  valueColor: string;
};

const StatItem: React.FC<StatItemProps> = ({ value, label, valueColor }) => (
  <div className="text-center">
    <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    <p className="text-sm text-gray-600 mt-1">{label}</p>
  </div>
);

type ToolCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
};

const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description, className }) => (
  <div className={`p-4 rounded-lg border flex flex-col items-center justify-center text-center h-[110px] ${className}`}>
    {icon}
    <p className="font-bold text-sm text-gray-900 mt-2">{title}</p>
    <p className="text-xs text-gray-600">{description}</p>
  </div>
);

type FeatureItemProps = {
    title: string;
    description: string;
};

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center">
            <Check className="w-5 h-5 text-purple-700" />
        </div>
        <div>
            <h4 className="font-bold text-base text-gray-800">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);


//----------- Main Component -----------//

export const WebScrapingSection: React.FC = () => {
  const toolCards = [
    { icon: <Bot className="w-8 h-8 text-purple-600" />, title: "Scrapy", description: "Python Framework", className: "bg-purple-50 border-purple-200" },
    { icon: <Globe className="w-8 h-8 text-green-600" />, title: "Puppeteer", description: "Chrome Automation", className: "bg-green-50 border-green-200" },
    { icon: <Code2 className="w-8 h-8 text-blue-600" />, title: "BeautifulSoup", description: "HTML Parser", className: "bg-blue-50 border-blue-200" },
    { icon: <Zap className="w-8 h-8 text-orange-700" />, title: "Diffbot", description: "AI Extraction", className: "bg-orange-50 border-orange-200" },
    { icon: <Activity className="w-8 h-8 text-indigo-700" />, title: "Apify", description: "Cloud Automation", className: "bg-indigo-50 border-indigo-200" },
    { icon: <Shield className="w-8 h-8 text-red-600" />, title: "Proxy Pools", description: "Anti-Detection", className: "bg-red-50 border-red-200" },
  ];

  return (
    <div className="font-sans antialiased text-gray-800 p-4 sm:p-8">
      <div className="container mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100">
        
        {/* Top Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <StatItem value="6" label="Platform Integrations" valueColor="text-blue-700" />
          <StatItem value="15,000+" label="Events Imported" valueColor="text-indigo-700" />
          <StatItem value="98.5%" label="Sync Success Rate" valueColor="text-blue-700" />
          <StatItem value="24/7" label="Auto Monitoring" valueColor="text-indigo-700" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Tools */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                🤖 Web Scraping & Automation
              </span>
            </h2>
            <p className="text-base text-gray-600 mt-2 mb-6">
              Advanced scraping tools for platforms without public APIs using intelligent automation and proxy management
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {toolCards.map((card, index) => (
                <ToolCard key={index} {...card} />
              ))}
            </div>
          </div>
          
          {/* Right Column: Smart Web Automation Card */}
          <div className="p-6 rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-100 shadow-sm flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-800 -tracking-wide">Smart Web Automation</h3>
                <p className="text-sm text-purple-600">AI-powered scraping with legal compliance</p>
              </div>
            </div>
            
            <div className="space-y-5">
                <FeatureItem title="Multi-Tool Support" description="5 scraping frameworks with intelligent tool selection" />
                <FeatureItem title="Proxy Management" description="Smart rotation and anti-detection measures" />
                <FeatureItem title="Legal Compliance" description="Robots.txt respect and ToS analysis" />
            </div>

            <button className="w-full bg-purple-600 text-white font-medium py-2.5 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <span>Launch Scraping Hub</span>
                <Bot className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="47" label="Scraping Targets" valueColor="text-purple-700" />
            <StatItem value="8,247" label="Events Extracted" valueColor="text-pink-600" />
            <StatItem value="94.3%" label="Success Rate" valueColor="text-purple-700" />
            <StatItem value="100%" label="Legal Compliance" valueColor="text-pink-600" />
          </div>
        </div>

      </div>
      <div className="text-center mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
 🚀 Rate Limiting & Performance Optimization
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
         Advanced rate limiting strategies to handle API quotas, optimize performance, and
ensure reliable data synchronization across all platforms
          </p>
        </div>
    </div>
  );
};