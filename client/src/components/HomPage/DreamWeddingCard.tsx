import React from "react";
import { Sparkles, Crown, Lock } from "lucide-react";
import { Link } from "wouter";

const DreamWeddingCard: React.FC = () => {
  return (
    <div className="w-full flex justify-center py-8 px-4">
      <div className="container h-auto md:h-[258px] rounded-lg border border-gray-200 shadow-2xl bg-linear-to-r from-amber-700 via-yellow-500 to-orange-500 flex flex-col items-center justify-center text-center px-4 md:px-6 py-8">
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
          Create Your Dream Wedding
        </h2>

        {/* Sub Text */}
        <p className="text-sm sm:text-base md:text-lg text-white opacity-95 max-w-2xl md:max-w-4xl mb-6">
          Plan the perfect wedding celebration where couples dance surrounded by loved ones in breathtaking venues that tell your love story.
        </p>

        {/* Buttons Group */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
          
          {/* Button 1 */}
          <button className="flex items-center justify-center gap-2 bg-white text-amber-700 font-medium px-4 sm:px-6 py-2 rounded-md shadow-lg hover:scale-105 transition text-sm sm:text-base">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
            Start Your Wedding Journey
          </button>

          {/* Button 2 */}
          <button className="flex items-center justify-center gap-2 border border-white/50 bg-white/20 text-white px-4 sm:px-6 py-2 rounded-md backdrop-blur-xs hover:bg-white/30 transition text-sm sm:text-base">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            Explore Elegant Venues
          </button>
<Link href="/vendor-onboarding">
  <button className="flex items-center justify-center gap-2 border border-white/50 bg-white/20 text-white px-4 sm:px-6 py-2 rounded-md backdrop-blur-xs hover:bg-white/30 transition text-sm sm:text-base">
    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
    Become a Vendor
  </button>
</Link>
        </div>
      </div>
    </div>
  );
};

export default DreamWeddingCard;
