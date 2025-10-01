import React, { useEffect, useState } from "react";
import { Sparkles, Users, Crown, ArrowRight } from "lucide-react";

const cardData = [
  {
    id: 1,
    title: "Elegant Wedding Planning",
    description:
      "Create magical wedding moments with beautiful venues and unforgettable celebrations",
    icon: Sparkles,
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: 2,
    title: "Perfect Guest Experience",
    description:
      "Design beautiful moments where wedding guests celebrate and create lasting memories together",
    icon: Users,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Beautiful Venue Selection",
    description:
      "Discover stunning ballrooms and elegant spaces perfect for your dream wedding celebration",
    icon: Crown,
    gradient: "from-pink-500 to-red-500",
  },
];

const VibesWeddingUI = () => {



  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);



  return (
    <div className=" relative overflow-hidden ">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-yellow-300/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-300/15 rounded-full blur-md"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-16">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to{" "}
            <span className="text-yellow-300 drop-shadow-lg">Vibes</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto mb-8 lg:mb-12 leading-relaxed px-4">
            Create magical wedding moments where couples dance surrounded by
            loved ones in breathtaking venues, crafting memories that last a
            lifetime.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="inline-flex items-center gap-2 text-gray-900 font-semibold px-6 py-3 rounded-md shadow-md transition"
              style={{
                background: "linear-gradient(90deg, #F59E0B 0%, #EAB308 100%)",


              }}>
              <Sparkles className="w-5 h-5" />
              Plan Your Wedding Celebration
              <ArrowRight className="w-5 h-5" />
            </button>

            <button className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-md shadow-md transition">
              <Crown className="w-5 h-5" />
              Elegant Packages
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8  mx-auto">
          {cardData.map(({ id, title, description, icon: Icon, gradient }) => (
            <div
              key={id}
              className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-xl hover:shadow-2xl transform transition-all duration-500 border border-white/20"
            >
              <div className="mb-6 flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {/* Interactive Wedding Technology Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Interactive Wedding Technology
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
            Experience the future of wedding planning with AI-powered features,
            real-time moments capture, and immersive celebration tools designed
            for modern couples.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VibesWeddingUI;
