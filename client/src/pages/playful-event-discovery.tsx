import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  Shuffle,
  Filter,
  Sparkles,
  Zap,
  Music,
  Camera,
  PartyPopper,
  Gift,
  Palette,
  Volume2,
  Share2,
  DollarSign,
  Bot,
  Smile,
  Eye,
  Download,
} from "lucide-react";

export default function PlayfulEventDiscovery() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState("bounce");
  const [showConfetti, setShowConfetti] = useState(false);
  const [discoveryMode, setDiscoveryMode] = useState("grid");
  const [selectedMoodColor, setSelectedMoodColor] = useState("#8b5cf6");
  const [budgetRange, setBudgetRange] = useState([500]);
  const [showSharePreview, setShowSharePreview] = useState(false);
  const [selectedEventForShare, setSelectedEventForShare] = useState(null);
  const [mascotMessage, setMascotMessage] = useState(
    "Hey! I'm Vibe Bot 🎉 Let me help you find the perfect event!"
  );

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events/discover"],
  });

  const categories = [
    { id: "all", name: "All Events", icon: Sparkles, color: "bg-purple-500" },
    { id: "party-bus", name: "Party Bus", icon: Music, color: "bg-pink-500" },
    { id: "cruise", name: "Cruise", icon: Users, color: "bg-blue-500" },
    { id: "yacht", name: "Yacht", icon: Star, color: "bg-indigo-500" },
    { id: "rooftop", name: "Rooftop", icon: Zap, color: "bg-amber-500" },
    { id: "warehouse", name: "Warehouse", icon: Volume2, color: "bg-red-500" },
    { id: "beach", name: "Beach", icon: PartyPopper, color: "bg-orange-500" },
  ];

  const animationModes = [
    { id: "bounce", name: "Bounce", icon: PartyPopper },
    { id: "slide", name: "Slide", icon: Zap },
    { id: "fade", name: "Fade", icon: Sparkles },
    { id: "flip", name: "Flip", icon: Gift },
    { id: "scale", name: "Scale", icon: Camera },
  ];

  const moodColors = [
    { name: "Energetic Purple", color: "#8b5cf6", mood: "High Energy" },
    { name: "Sunset Orange", color: "#f97316", mood: "Warm & Fun" },
    { name: "Ocean Blue", color: "#0ea5e9", mood: "Cool & Calm" },
    { name: "Party Pink", color: "#ec4899", mood: "Playful" },
    { name: "Electric Green", color: "#22c55e", mood: "Fresh & Vibrant" },
    { name: "Golden Yellow", color: "#eab308", mood: "Bright & Happy" },
    { name: "Midnight Black", color: "#1f2937", mood: "Elegant & Chic" },
    { name: "Fire Red", color: "#ef4444", mood: "Bold & Passionate" },
  ];

  const filteredEvents = events.filter((event: any) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleLike = (eventId: string) => {
    setLikedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
  };

  const shuffleEvents = () => {
    setCurrentAnimation("shuffle");
    setTimeout(() => setCurrentAnimation("bounce"), 500);
  };

  const getCardAnimation = (index: number) => {
    const animations = {
      bounce: {
        initial: { scale: 0, rotate: -180 },
        animate: { scale: 1, rotate: 0 },
        transition: {
          delay: index * 0.1,
          type: "spring",
          stiffness: 260,
          damping: 20,
        },
      },
      slide: {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { delay: index * 0.1, duration: 0.5 },
      },
      fade: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: index * 0.15, duration: 0.6 },
      },
      flip: {
        initial: { rotateY: -90, opacity: 0 },
        animate: { rotateY: 0, opacity: 1 },
        transition: { delay: index * 0.1, duration: 0.8 },
      },
      scale: {
        initial: { scale: 0.3, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: {
          delay: index * 0.1,
          type: "spring",
          stiffness: 300,
          damping: 15,
        },
      },
      shuffle: {
        animate: { rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] },
        transition: { duration: 0.5 },
      },
    };
    return (
      animations[currentAnimation as keyof typeof animations] ||
      animations.bounce
    );
  };

  const getRandomEmoji = () => {
    const emojis = ["🎉", "🎊", "✨", "🎈", "🎁", "💫", "🌟", "🎭", "🎪", "🎨"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const generateSharePreview = (event: any) => {
    setSelectedEventForShare(event);
    setShowSharePreview(true);
  };

  const updateMascotMessage = () => {
    const messages = [
      `Found ${filteredEvents.length} amazing events for you! 🎪`,
      "Try adjusting your budget to discover more options! 💰",
      "That color choice gives me great vibes! ✨",
      "Don't forget to check out those highly rated events! ⭐",
      "Ready to party? Let's find your perfect event! 🎉",
    ];
    setMascotMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  const getBudgetForecast = (budget: number) => {
    const eventCount = filteredEvents.filter((event: any) => {
      const price =
        typeof event.price === "object" ? event.price.min : event.price;
      return price <= budget;
    }).length;

    return {
      availableEvents: eventCount,
      recommendation:
        budget < 300
          ? "Consider increasing budget for more options"
          : budget > 1000
          ? "You have access to premium events!"
          : "Great budget range for quality events",
      mood: budget < 300 ? "limited" : budget > 1000 ? "premium" : "balanced",
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomCard = document.querySelector(
          ".event-card:nth-child(" + (Math.floor(Math.random() * 6) + 1) + ")"
        );
        if (randomCard) {
          randomCard.classList.add("pulse-glow");
          setTimeout(() => randomCard.classList.remove("pulse-glow"), 2000);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 100,
                  scale: [0, 1, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                }}
              >
                {getRandomEmoji()}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              className="p-3 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <motion.h1
              className="text-5xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Discover Amazing Events
            </motion.h1>
          </div>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Find your perfect event with our playful discovery experience
          </motion.p>
        </motion.div>

        {/* Enhanced Controls */}
        <motion.div
          className="space-y-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Main Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for amazing events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-purple-200 focus:border-purple-500 rounded-xl"
              />
            </div>

            {/* Animation Mode Selector */}
            <div className="flex items-center gap-2">
              {animationModes.map((mode) => (
                <Button
                  key={mode.id}
                  variant={currentAnimation === mode.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentAnimation(mode.id)}
                  className={`${
                    currentAnimation === mode.id ? "bg-purple-600" : ""
                  } rounded-xl`}
                >
                  <mode.icon className="h-4 w-4 mr-1" />
                  {mode.name}
                </Button>
              ))}
            </div>

            {/* Shuffle Button */}
            <Button
              onClick={shuffleEvents}
              className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle
            </Button>
          </div>

          {/* Enhanced Features Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mood Color Palette */}
            <Card className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Event Mood</h3>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {moodColors.map((color) => (
                  <motion.button
                    key={color.color}
                    onClick={() => setSelectedMoodColor(color.color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedMoodColor === color.color
                        ? "border-gray-900 dark:border-white scale-110"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.color }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={`${color.name} - ${color.mood}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {moodColors.find((c) => c.color === selectedMoodColor)?.mood ||
                  "Select a mood"}
              </p>
            </Card>

            {/* Budget Forecast Slider */}
            <Card className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Budget Range</h3>
              </div>
              <Slider
                value={budgetRange}
                onValueChange={setBudgetRange}
                max={2000}
                min={100}
                step={50}
                className="mb-2"
              />
              <div className="text-sm space-y-1">
                <p className="font-medium">${budgetRange[0]} maximum</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {getBudgetForecast(budgetRange[0]).availableEvents} events
                  available
                </p>
                <p className="text-xs text-purple-600">
                  {getBudgetForecast(budgetRange[0]).recommendation}
                </p>
              </div>
            </Card>

            {/* Recommendation Mascot */}
            <Card className="p-4 bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
              <div className="flex items-start gap-3">
                <motion.div
                  className="p-2 bg-purple-600 rounded-full"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Bot className="h-5 w-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                    Vibe Bot
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                    {mascotMessage}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={updateMascotMessage}
                    className="mt-2 text-purple-600 hover:text-purple-700 p-0 h-auto"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    New tip
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8 justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                selectedCategory === category.id
                  ? `${category.color} text-white shadow-lg scale-110`
                  : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:shadow-md"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className="h-64 bg-white dark:bg-slate-800 rounded-2xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event: any, index: number) => (
                <motion.div
                  key={event.id}
                  className="event-card"
                  {...getCardAnimation(index)}
                  layout
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs rounded-2xl overflow-hidden relative group cursor-pointer">
                    {/* Like Button */}
                    <motion.button
                      className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-slate-800/80 rounded-full backdrop-blur-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(event.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          likedEvents.includes(event.id)
                            ? "text-red-500 fill-current"
                            : "text-gray-400"
                        }`}
                      />
                    </motion.button>

                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

                      {/* Category Badge */}
                      <Badge className="absolute top-4 left-4 bg-linear-to-r from-purple-600 to-pink-600 text-white border-0">
                        {event.category?.replace("-", " ").toUpperCase()}
                      </Badge>

                      {/* Price */}
                      <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs rounded-lg px-3 py-1">
                        <span className="font-bold text-purple-600">
                          From $
                          {typeof event.price === "object"
                            ? event.price.min
                            : event.price}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                          {event.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                          {event.description}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.city}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{event.attendees || 0} attending</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">
                              {event.rating || 4.5}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-xl border-purple-200 hover:bg-purple-50"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log(
                                "View Details clicked for event:",
                                event.id
                              );
                              setLocation(`/enhanced-event/${event.id}`);
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log(
                                "Book Now clicked for event:",
                                event.id
                              );
                              setLocation(`/party-booking/${event.id}`);
                            }}
                          >
                            Book Now
                          </Button>

                          {/* Share Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("Share clicked for event:", event.id);
                              setSelectedEventForShare(event);
                              setShowSharePreview(true);
                            }}
                            className="px-3 rounded-xl border-purple-200"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-purple-600/0 via-pink-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-blue-600/10 transition-all duration-300 rounded-2xl" />
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No Results */}
        {!isLoading && filteredEvents.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or category filters
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-linear-to-r from-purple-600 to-pink-600 rounded-xl"
            >
              Reset Filters
            </Button>
          </motion.div>
        )}

        {/* Social Media Share Preview Modal */}
        <AnimatePresence>
          {showSharePreview && selectedEventForShare && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSharePreview(false)}
            >
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Share Event</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSharePreview(false)}
                    className="h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>

                {/* Share Preview */}
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 mb-4"
                  style={{ borderColor: selectedMoodColor }}
                >
                  <div className="flex gap-3">
                    <img
                      src={selectedEventForShare.image}
                      alt={selectedEventForShare.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        {selectedEventForShare.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {selectedEventForShare.description?.slice(0, 80)}...
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <Badge
                          style={{
                            backgroundColor: selectedMoodColor,
                            color: "white",
                          }}
                        >
                          {selectedEventForShare.category
                            ?.replace("-", " ")
                            .toUpperCase()}
                        </Badge>
                        <span className="text-gray-500">
                          {selectedEventForShare.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share Options */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { name: "Facebook", color: "#1877f2", icon: "📘" },
                    { name: "Twitter", color: "#1da1f2", icon: "🐦" },
                    { name: "Instagram", color: "#e4405f", icon: "📷" },
                    { name: "WhatsApp", color: "#25d366", icon: "💬" },
                  ].map((platform) => (
                    <Button
                      key={platform.name}
                      variant="outline"
                      className="flex flex-col items-center gap-1 h-auto py-3 rounded-xl"
                      style={{ borderColor: platform.color }}
                      onClick={() => {
                        // Simulate sharing
                        setShowConfetti(true);
                        setTimeout(() => {
                          setShowSharePreview(false);
                          setShowConfetti(false);
                        }, 1000);
                      }}
                    >
                      <span className="text-lg">{platform.icon}</span>
                      <span className="text-xs">{platform.name}</span>
                    </Button>
                  ))}
                </div>

                {/* Copy Link */}
                <div className="flex gap-2">
                  <Input
                    value={`https://vibes.com/events/${selectedEventForShare.id}`}
                    readOnly
                    className="flex-1 text-xs"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://vibes.com/events/${selectedEventForShare.id}`
                      );
                      setShowConfetti(true);
                      setTimeout(() => setShowConfetti(false), 1000);
                    }}
                    className="bg-linear-to-r from-purple-600 to-pink-600"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom CSS for pulse glow effect */}
      <style>{`
        .pulse-glow {
          animation: pulseGlow 2s ease-in-out;
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(168, 85, 247, 0); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.6); }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
