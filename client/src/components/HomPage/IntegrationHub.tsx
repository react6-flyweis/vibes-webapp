import React from 'react';
import { Zap, Brain, RefreshCw, TrendingUp, ArrowRight } from 'lucide-react';

// --- Feature Item Props Type ---
interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// --- Feature Item Component ---
const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

// --- Main Integration Hub Component ---
const IntegrationHub: React.FC = () => {
  return (
    <div className="font-sans p-4 sm:p-8 md:p-12 flex items-center justify-center">
      <div className="w-full container mx-auto bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-md rounded-xl p-6 sm:p-8">
        <div className="space-y-8">
          
          {/* Header Section */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-800 tracking-tight">
                Integration Hub
              </h1>
              <p className="text-sm text-gray-600">
                AI-Powered Event Import System
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-6 pl-2">
            <FeatureItem
              icon={<Brain className="w-4 h-4 text-blue-600" />}
              title="AI Categorization"
              description="Smart event category mapping with 95% accuracy"
            />
            <FeatureItem
              icon={<RefreshCw className="w-4 h-4 text-blue-600" />}
              title="Real-time Sync"
              description="Automatic imports with duplicate detection"
            />
            <FeatureItem
              icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
              title="Analytics Dashboard"
              description="Monitor sync performance and import metrics"
            />
          </div>

          {/* Action Button */}
          <button className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
            <span>Launch Integration Hub</span>
            <Zap className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;
