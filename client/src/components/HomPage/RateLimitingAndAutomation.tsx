import React from "react";
import {
  Database,
  RefreshCw,
  Layers,
  Clock,
  Bell,
  Activity,
  Shield,
  TrendingUp,Calendar ,Zap
} from "lucide-react";

const RateLimitingAndAutomation: React.FC = () => {
  return (
    <div className=" p-8">
      <div className="container mx-auto">
        {/* 2 Cards Centered */}
        <div className="grid md:grid-cols-2 gap-6 justify-center">
          {/* Rate Limiting Strategies */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-100 border border-blue-200 shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-900 text-center">
              Rate Limiting Strategies
            </h3>
            <p className="text-gray-600 text-center mt-2">
              Comprehensive API quota management and optimization
            </p>

            <div className="mt-6 space-y-4">
              {/* Smart Caching */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Smart Caching System
                  </h4>
                  <p className="text-sm text-gray-600">
                    85%+ cache hit rate with intelligent TTL management
                  </p>
                </div>
              </div>

              {/* Exponential Backoff */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100">
                  <Clock className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Exponential Backoff
                  </h4>
                  <p className="text-sm text-gray-600">
                    Intelligent retry logic with circuit breakers
                  </p>
                </div>
              </div>

              {/* Efficient Pagination */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Efficient Pagination
                  </h4>
                  <p className="text-sm text-gray-600">
                    Optimized batch processing with token-based streaming
                  </p>
                </div>
              </div>
            </div>

        <button className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2">
  View Rate Limiting Dashboard
    <Shield className="w-5 h-5" />

</button>
          </div>

          {/* Automation & Scheduling */}
          <div className="bg-linear-to-br from-green-50 to-teal-100 border border-green-200 shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-bold text-green-800 text-center">
              Automation & Scheduling
            </h3>
            <p className="text-gray-600 text-center mt-2">
              Intelligent sync scheduling and webhook management
            </p>

            <div className="mt-6 space-y-4">
              {/* Smart Scheduling */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Smart Scheduling
                  </h4>
                  <p className="text-sm text-gray-600">
                    Automated sync jobs with adaptive intervals
                  </p>
                </div>
              </div>

              {/* Webhook Integration */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-100">
                  <Zap className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Webhook Integration
                  </h4>
                  <p className="text-sm text-gray-600">
                    Push-based updates reducing API polling
                  </p>
                </div>
              </div>

              {/* Real-time Monitoring */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-100">
                  <Zap className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Real-time Monitoring
                  </h4>
                  <p className="text-sm text-gray-600">
                    Live performance tracking and alert systems
                  </p>
                </div>
              </div>
            </div>

           <button className="mt-6 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2">
  Monitor Performance

    <TrendingUp className="w-5 h-5" />

</button>
          </div>
        </div>

        {/* Stats Section */}
       <div className="mt-8 bg-linear-to-r from-blue-100 to-indigo-100 rounded-xl p-6 flex flex-wrap justify-between text-center">
  <div>
    <p className="text-3xl font-bold text-blue-700">6</p>
    <p className="text-sm text-gray-600">API Sources</p>
  </div>
  <div>
    <p className="text-3xl font-bold text-indigo-700">98.7%</p>
    <p className="text-sm text-gray-600">Rate Limit Compliance</p>
  </div>
  <div>
    <p className="text-3xl font-bold text-purple-700">87.4%</p>
    <p className="text-sm text-gray-600">Cache Hit Rate</p>
  </div>
  <div>
    <p className="text-3xl font-bold text-teal-700">24</p>
    <p className="text-sm text-gray-600">Scheduled Jobs</p>
  </div>
  <div>
    <p className="text-3xl font-bold text-green-700">12</p>
    <p className="text-sm text-gray-600">Active Webhooks</p>
  </div>
</div>

      </div>
    </div>
  );
};

export default RateLimitingAndAutomation;
