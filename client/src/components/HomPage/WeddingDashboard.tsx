import React, { useState, useEffect } from 'react';
import { Camera, Music, Users, Heart, Sparkles, ChevronDown, Play, Volume2, Info ,Plus} from 'lucide-react';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Moment {
  id: number;
  name: string;
  time: string;
  photos: number;
  likes: number;
  color: string;
  icon: string;
}

interface KeyFactor {
  name: string;
  level: string;
  percentage: string;
  color: string;
}

interface FABAction {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const WeddingDashboard: React.FC = () => {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [musicPlaying, setMusicPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(75);
  const [selectedMusic, setSelectedMusic] = useState<string>("Romantic Waltz");
  const [fabOpen, setFabOpen] = useState<boolean>(false);

  // Wedding date - March 15, 2025 at 6:00 PM
  const weddingDate: Date = new Date('2025-03-15T18:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  const moments: Moment[] = [
    { id: 1, name: "First Dance", time: "7:30 PM", photos: 45, likes: 28, color: "bg-blue-100", icon: "bg-blue-500" },
    { id: 2, name: "Vow Exchange", time: "6:15 PM", photos: 67, likes: 52, color: "bg-purple-100", icon: "bg-purple-500" },
    { id: 3, name: "Ring Ceremony", time: "6:05 PM", photos: 67, likes: 41, color: "bg-blue-100", icon: "bg-blue-500" },
    { id: 4, name: "Reception Toast", time: "8:00 PM", photos: 58, likes: 35, color: "bg-purple-100", icon: "bg-purple-500" },
        { id: 2, name: "Vow Exchange", time: "6:15 PM", photos: 67, likes: 52, color: "bg-purple-100", icon: "bg-purple-500" },
    { id: 3, name: "Ring Ceremony", time: "6:05 PM", photos: 67, likes: 41, color: "bg-blue-100", icon: "bg-blue-500" },
    { id: 4, name: "Reception Toast", time: "8:00 PM", photos: 58, likes: 35, color: "bg-purple-100", icon: "bg-purple-500" }
  ];

  const keyFactors: KeyFactor[] = [
    { name: "Music Selection", level: "high", percentage: "95%", color: "bg-blue-500" },
    { name: "Venue Atmosphere", level: "high", percentage: "90%", color: "bg-blue-500" },
    { name: "Guest Interactions", level: "medium", percentage: "88%", color: "bg-gray-400" },
    { name: "Food & Drinks", level: "high", percentage: "94%", color: "bg-blue-500" },
    { name: "Entertainment", level: "medium", percentage: "89%", color: "bg-gray-400" }
  ];

  const recommendations: string[] = [
    "Consider adding more upbeat songs during dinner",
    "Increase lighting during photo sessions",
    "Schedule group activities between courses"
  ];

  const fabActions: FABAction[] = [
    { name: "Capture Moment", icon: Camera, color: "bg-pink-500" },
    { name: "Change Music", icon: Music, color: "bg-purple-500" },
    { name: "Guest Check-in", icon: Users, color: "bg-blue-500" },
    { name: "Send Love Note", icon: Heart, color: "bg-red-500" },
    { name: "Add Effect", icon: Sparkles, color: "bg-yellow-500" }
  ];

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  const handleMusicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMusic(event.target.value);
  };

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
  };

  const toggleFAB = () => {
    setFabOpen(!fabOpen);
  };

  return (
    <div className="min-h-screen ">
      <div className="  container mx-auto px-4 py-8 lg:py-16">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Wedding Moment Capture Gallery */}
          <div className="bg-white/95 backdrop-blur-xs border border-white/20 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Camera className="w-5 h-5 text-pink-500" />
              <h2 className="text-xl font-bold text-gray-800">Wedding Moment Capture Gallery</h2>
            </div>
            
            <button className="w-full bg-pink-500 text-white py-3 px-4 rounded-md font-medium mb-6 flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors">
              <Camera className="w-4 h-4" />
              Capture This Moment
            </button>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {moments.map((moment) => (
                <div key={moment.id} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                  <div className={`w-8 h-8 ${moment.color} rounded-full flex items-center justify-center`}>
                    <Camera className={`w-4 h-4 ${moment.icon.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{moment.name}</div>
                    <div className="text-xs text-gray-500">{moment.time}</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      {moment.photos}
                    </span>
                    <span className="border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {moment.likes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ambient Music Selector */}
          <div className="bg-white/95 backdrop-blur-xs border border-white/20 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Music className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-800">Ambient Music Selector</h2>
            </div>
            
            <div className="relative mb-4">
              <select 
                className="w-full p-3 border border-gray-300 rounded-md bg-white appearance-none pr-10"
                value={selectedMusic}
                onChange={handleMusicChange}
              >
                <option value="Romantic Waltz">Romantic Waltz</option>
                <option value="Jazz Ensemble">Jazz Ensemble</option>
                <option value="Classical Symphony">Classical Symphony</option>
                <option value="Modern Acoustic">Modern Acoustic</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            {/* UPDATED VOLUME SLIDER SECTION */}
            <div className="flex items-center gap-4 mb-4">
              <button 
                onClick={toggleMusic}
                className="bg-white border border-gray-300 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Play className="w-4 h-4" />
                {musicPlaying ? 'Pause' : 'Play'}
              </button>
              <Volume2 className="w-4 h-4 text-gray-400" />
              <div className="flex-1 relative flex items-center">
                {/* This is the new container for the slider */}
                <div className="slider-container">
                  
                  {/* This is the background fill bar, its width is controlled by the 'volume' state */}
                  <div 
                    className="slider-background-fill" 
                    style={{ width: `${volume}%` }}
                  ></div>

                  {/* Your slider input with a transparent track */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider-transparent"
                  />
                </div>
              </div>
              <span className="text-sm text-gray-500">{volume}%</span>
            </div>
            {/* END OF UPDATED SECTION */}
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="font-medium text-sm text-gray-900">{selectedMusic}</div>
              <div className="text-xs text-gray-500">3:45 • Intimate</div>
              <div className="w-3 h-3 bg-gray-300 rounded-full ml-auto"></div>
            </div>
          </div>

          {/* AI Wedding Experience Predictor */}
          <div className="bg-white/95 backdrop-blur-xs border border-white/20 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800">AI Wedding Experience Predictor</h2>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600 mb-1">92%</div>
              <div className="text-sm text-gray-600">Expected Guest Satisfaction</div>
            </div>
            
            <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md font-medium mb-6 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
              <Sparkles className="w-4 h-4" />
              Analyze Guest Experience
            </button>
            
            <div className="space-y-3 mb-6">
              <div className="text-sm font-medium text-gray-700">Key Factors</div>
              {keyFactors.map((factor, index) => (
                <div key={index} className="bg-gray-50 rounded p-3 flex items-center justify-between">
                  <span className="text-sm text-gray-900">{factor.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`${factor.color} text-white text-xs px-2 py-1 rounded-full font-bold`}>
                      {factor.level}
                    </span>
                    <span className="text-sm font-medium">{factor.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">AI Recommendations</div>
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-blue-50 rounded p-3 flex items-start gap-2">
                  <Info className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-gray-900">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/95 backdrop-blur-xs border border-white/20 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-5 text-yellow-500">⏱️</div>
              <h2 className="text-xl font-bold text-gray-800">Wedding Countdown</h2>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-xs text-gray-500 mb-6">
              <span>📅 March 15, 2025</span>
              <span>🕕 6:00 PM</span>
              <span>🏰 Grand Ballroom</span>
            </div>
            
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.minutes },
                { label: 'Seconds', value: countdown.seconds }
              ].map((item, index) => (
                <div key={index} className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-yellow-600">{item.value}</div>
                  <div className="text-xs text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
            
            <div className="relative mb-4">
              <select className="w-full p-3 border border-gray-300 rounded-md bg-white appearance-none pr-10">
                <option>Elegant Fade</option>
                <option>Romantic Glow</option>
                <option>Classic Transition</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            <div className="text-center">
              <div className="font-medium text-gray-700 mb-1">Until "I Do"</div>
              <div className="text-xs text-pink-500 flex items-center justify-center gap-2">
                <Heart className="w-3 h-3" />
                Every moment counts
                <Heart className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-5 h-5 text-pink-500" />
              <h2 className="text-xl font-bold text-gray-800">Quick Wedding Actions</h2>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Access instant wedding management tools with our elegant floating action button. 
              Capture moments, adjust music, check in guests, and add magical effects with a single tap.
            </p>
            
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-3">Available Actions:</div>
              <div className="space-y-2">
                {fabActions.map((action, index) => (
                  <div key={index} className="flex items-center gap-3 text-xs">
                    <action.icon className="w-3 h-3 text-pink-400" />
                    <span className="text-gray-900">{action.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
<div className="text-center mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
Vendor Excellence Platform

          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
           Join the Vibes marketplace with our comprehensive vendor onboarding system,
manage your business on-the-go with our mobile dashboard, leverage AI-powered risk
monitoring, and benefit from our comprehensive admin oversight system.
          </p>
        </div>
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <div className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 ${fabOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          {fabActions.map((action, index) => (
            <div key={index} className={`${action.color} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 whitespace-nowrap cursor-pointer hover:shadow-xl transition-shadow`}>
              <action.icon className="w-5 h-5" />
              <span className="font-medium">{action.name}</span>
            </div>
          ))}
        </div>
        
        <button
          onClick={toggleFAB}
          className="w-16 h-14 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow relative"
        >
          <Plus className="w-4 h-4" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            3
          </div>
        </button>
      </div>
    </div>
  );
};

export default WeddingDashboard;