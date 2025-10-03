import { useState } from "react";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Palette,
  Music,
  Heart,
  Star,
  Gift,
  Camera,
  Sparkles,
  Crown,
  ArrowRight,
  Edit,
  Eye,
  Download,
  Share2,
  Copy,
  Phone,
  Mail,
  Globe,
  PartyPopper,
  Cake,
  Utensils,
  Briefcase,
  Home,
  GraduationCap,
  Baby,
  TreePine,
  Flower2,
  Sun,
  Moon,
  Check,
  Snowflake,
  Rabbit,
  Leaf,
  Skull,
  Coffee,
  Wine,
  Waves,
  Zap,
} from "lucide-react";

interface EviteTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: string[];
  fonts: string;
  layout: "classic" | "modern" | "elegant" | "playful" | "minimalist";
  features: string[];
  preview: React.ComponentType;
  free: boolean;
  previewImg: string;
}
import theme1 from "../../assests/theme1.png";
import theme2 from "../../assests/theme2.png";
import Pagination from "./Pagination";
// Template Preview Components
const BirthdayClassicPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-pink-100 to-purple-100 p-6 rounded-lg border-4 border-pink-300 relative overflow-hidden">
    {/* <div className="absolute top-2 right-2">
      <PartyPopper className="w-8 h-8 text-pink-600" />
    </div> */}
    {/* <div className="text-center space-y-4">
      <h3 className="text-xl font-bold text-purple-800">You're Invited!</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-center">
          <Cake className="w-6 h-6 text-pink-600 mr-2" />
          <span className="font-semibold">Birthday Celebration</span>
        </div>
        <p className="text-lg font-bold text-pink-700">Sarah's 25th Birthday</p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Saturday, Feb 15th</span>
          </div>
          <div className="flex items-center justify-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>7:00 PM</span>
          </div>
          <div className="flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>The Party Hall</span>
          </div>
        </div>
      </div>
      <div className="bg-white/70 p-3 rounded-lg">
        <p className="text-sm">Join us for an unforgettable evening of celebration, music, and memories!</p>
      </div>
      <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
        RSVP Now
      </Button>
    </div> */}
  </div>
);

// Holiday Template Preview Components
const ChristmasWinterWonderlandPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-red-100 via-green-50 to-white p-6 rounded-lg border-4 border-red-300 relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/20"></div>
    <Snowflake className="absolute top-2 right-2 w-6 h-6 text-blue-300 animate-pulse" />
    <TreePine className="absolute top-4 left-2 w-8 h-8 text-green-600" />
    <div className="relative text-center space-y-4">
      <h3 className="text-xl font-bold text-red-700 font-serif">
        Christmas Celebration
      </h3>
      <div className="space-y-2">
        <p className="text-lg font-bold text-green-700">
          Winter Wonderland Party
        </p>
        <div className="space-y-1 text-sm text-red-600">
          <div className="flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>December 24th, 7:00 PM</span>
          </div>
          <div className="flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>The Winter Lodge</span>
          </div>
        </div>
      </div>
      <div className="bg-red-50/80 p-3 rounded-lg border border-red-200">
        <p className="text-sm text-red-700">
          Join us for a magical Christmas evening with snow, music, and festive
          joy!
        </p>
      </div>
      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
        RSVP for Christmas
      </Button>
    </div>
  </div>
);

const NewYearMidnightGalaPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-black via-purple-900 to-yellow-100 p-6 rounded-lg border-4 border-yellow-400 relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20"></div>
    <Sparkles className="absolute top-2 right-2 w-6 h-6 text-yellow-400 animate-pulse" />
    <Star className="absolute top-4 left-2 w-6 h-6 text-purple-400" />
    <div className="relative text-center space-y-4">
      <h3 className="text-xl font-bold text-yellow-400 font-serif">
        New Year's Eve
      </h3>
      <div className="space-y-2">
        <p className="text-lg font-bold text-white">Midnight Gala 2025</p>
        <div className="space-y-1 text-sm text-yellow-200">
          <div className="flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>December 31st, 9:00 PM</span>
          </div>
          <div className="flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Grand Ballroom</span>
          </div>
        </div>
      </div>
      <div className="bg-black/50 p-3 rounded-lg border border-yellow-300">
        <p className="text-sm text-white">
          Ring in 2025 with elegance, fireworks, and unforgettable memories!
        </p>
      </div>
      <Button
        size="sm"
        className="bg-yellow-600 hover:bg-yellow-700 text-black"
      >
        Join the Celebration
      </Button>
    </div>
  </div>
);

const ValentineRomanticEveningPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-pink-100 via-red-50 to-rose-100 p-6 rounded-lg border-4 border-pink-300 relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-b from-transparent to-pink-50/30"></div>
    <Heart className="absolute top-2 right-2 w-6 h-6 text-red-500 animate-pulse" />
    <Heart className="absolute top-4 left-2 w-4 h-4 text-pink-500" />
    <div className="relative text-center space-y-4">
      <h3 className="text-xl font-bold text-red-700 font-serif">
        Valentine's Day
      </h3>
      <div className="space-y-2">
        <p className="text-lg font-bold text-pink-700">Romantic Evening</p>
        <div className="space-y-1 text-sm text-red-600">
          <div className="flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>February 14th, 7:30 PM</span>
          </div>
          <div className="flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Romantic Restaurant</span>
          </div>
        </div>
      </div>
      <div className="bg-pink-50/80 p-3 rounded-lg border border-pink-200">
        <p className="text-sm text-red-700">
          Celebrate love with an enchanting evening of romance and memories!
        </p>
      </div>
      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
        RSVP with Love
      </Button>
    </div>
  </div>
);

const HalloweenSpookyNightPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-orange-100 via-black to-orange-200 p-6 rounded-lg border-4 border-orange-500 relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/30"></div>
    <Skull className="absolute top-2 right-2 w-6 h-6 text-orange-500 animate-pulse" />
    <Moon className="absolute top-4 left-2 w-6 h-6 text-yellow-400" />
    <div className="relative text-center space-y-4">
      <h3 className="text-xl font-bold text-orange-600 font-serif">
        Halloween Party
      </h3>
      <div className="space-y-2">
        <p className="text-lg font-bold text-white">Spooky Night</p>
        <div className="space-y-1 text-sm text-orange-200">
          <div className="flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>October 31st, 8:00 PM</span>
          </div>
          <div className="flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Haunted Manor</span>
          </div>
        </div>
      </div>
      <div className="bg-black/50 p-3 rounded-lg border border-orange-400">
        <p className="text-sm text-orange-100">
          Join us for a frightfully fun Halloween with costumes, treats, and
          spooky surprises!
        </p>
      </div>
      <Button
        size="sm"
        className="bg-orange-600 hover:bg-orange-700 text-white"
      >
        Join the Spook
      </Button>
    </div>
  </div>
);

const ThanksgivingHarvestFeastPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-orange-100 via-yellow-50 to-amber-100 p-6 rounded-lg border-4 border-orange-400 relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-b from-transparent to-orange-50/30"></div>
    <Leaf className="absolute top-2 right-2 w-6 h-6 text-orange-600 animate-pulse" />
    <Coffee className="absolute top-4 left-2 w-6 h-6 text-amber-600" />
    <div className="relative text-center space-y-4">
      <h3 className="text-xl font-bold text-orange-700 font-serif">
        Thanksgiving
      </h3>
      <div className="space-y-2">
        <p className="text-lg font-bold text-amber-700">Harvest Feast</p>
        <div className="space-y-1 text-sm text-orange-600">
          <div className="flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>November 28th, 3:00 PM</span>
          </div>
          <div className="flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Family Gathering</span>
          </div>
        </div>
      </div>
      <div className="bg-orange-50/80 p-3 rounded-lg border border-orange-300">
        <p className="text-sm text-orange-700">
          Gather with loved ones for a feast of gratitude, tradition, and
          thankfulness!
        </p>
      </div>
      <Button
        size="sm"
        className="bg-orange-600 hover:bg-orange-700 text-white"
      >
        Give Thanks
      </Button>
    </div>
  </div>
);

const EasterSpringCelebrationPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-pink-100 via-green-50 to-yellow-100 p-6 rounded-lg border-4 border-green-300 relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-b from-transparent to-green-50/30"></div>
    <Flower2 className="absolute top-2 right-2 w-6 h-6 text-pink-500 animate-pulse" />
    <Rabbit className="absolute top-4 left-2 w-6 h-6 text-green-600" />
    <div className="relative text-center space-y-4">
      <h3 className="text-xl font-bold text-green-700 font-serif">
        Easter Celebration
      </h3>
      <div className="space-y-2">
        <p className="text-lg font-bold text-pink-700">Spring Festival</p>
        <div className="space-y-1 text-sm text-green-600">
          <div className="flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>April 20th, 11:00 AM</span>
          </div>
          <div className="flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Garden Park</span>
          </div>
        </div>
      </div>
      <div className="bg-green-50/80 p-3 rounded-lg border border-green-300">
        <p className="text-sm text-green-700">
          Celebrate spring with egg hunts, blooming flowers, and joyful
          activities!
        </p>
      </div>
      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
        Join the Hunt
      </Button>
    </div>
  </div>
);

const AnniversaryGoldenMemoriesPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-yellow-100 via-white to-yellow-50 p-6 rounded-lg border-4 border-yellow-400 relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-b from-transparent to-yellow-50/20"></div>
    <Heart className="absolute top-2 right-2 w-6 h-6 text-yellow-600 animate-pulse" />
    <Star className="absolute top-4 left-2 w-6 h-6 text-yellow-500" />
    <div className="relative text-center space-y-4">
      <h3 className="text-xl font-bold text-yellow-700 font-serif">
        Anniversary
      </h3>
      <div className="space-y-2">
        <p className="text-lg font-bold text-yellow-600">Golden Memories</p>
        <div className="space-y-1 text-sm text-yellow-600">
          <div className="flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>June 15th, 6:00 PM</span>
          </div>
          <div className="flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Celebration Hall</span>
          </div>
        </div>
      </div>
      <div className="bg-yellow-50/80 p-3 rounded-lg border border-yellow-300">
        <p className="text-sm text-yellow-700">
          Celebrate years of love, laughter, and beautiful memories together!
        </p>
      </div>
      <Button
        size="sm"
        className="bg-yellow-600 hover:bg-yellow-700 text-white"
      >
        Celebrate Love
      </Button>
    </div>
  </div>
);

const SummerPoolPartyPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-blue-100 via-cyan-50 to-yellow-100 p-6 rounded-lg border-4 border-blue-400 relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-b from-transparent to-blue-50/30"></div>
    <Waves className="absolute top-2 right-2 w-6 h-6 text-blue-500 animate-pulse" />
    <Sun className="absolute top-4 left-2 w-6 h-6 text-yellow-500" />
    <div className="relative text-center space-y-4">
      <h3 className="text-xl font-bold text-blue-700 font-serif">
        Summer Party
      </h3>
      <div className="space-y-2">
        <p className="text-lg font-bold text-cyan-700">Pool Party Fun</p>
        <div className="space-y-1 text-sm text-blue-600">
          <div className="flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>July 20th, 2:00 PM</span>
          </div>
          <div className="flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Backyard Pool</span>
          </div>
        </div>
      </div>
      <div className="bg-blue-50/80 p-3 rounded-lg border border-blue-300">
        <p className="text-sm text-blue-700">
          Dive into summer fun with pool games, BBQ, and sunshine!
        </p>
      </div>
      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
        Make a Splash
      </Button>
    </div>
  </div>
);

const CocktailLoungeNightPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-black via-purple-900 to-pink-900 p-6 rounded-lg border-4 border-pink-400 relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/40"></div>
    <Wine className="absolute top-2 right-2 w-6 h-6 text-pink-400 animate-pulse" />
    <Star className="absolute top-4 left-2 w-6 h-6 text-purple-400" />
    <div className="relative text-center space-y-4">
      <h3 className="text-xl font-bold text-pink-400 font-serif">
        Cocktail Night
      </h3>
      <div className="space-y-2">
        <p className="text-lg font-bold text-white">Lounge Experience</p>
        <div className="space-y-1 text-sm text-pink-200">
          <div className="flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Friday, 8:00 PM</span>
          </div>
          <div className="flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Sky Lounge</span>
          </div>
        </div>
      </div>
      <div className="bg-black/50 p-3 rounded-lg border border-pink-300">
        <p className="text-sm text-pink-100">
          Experience sophisticated cocktails, music, and elegant nightlife!
        </p>
      </div>
      <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white">
        Join the Night
      </Button>
    </div>
  </div>
);

const WeddingElegantPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-cream-50 to-rose-50 p-6 rounded-lg border border-rose-200 relative">
    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-rose-300 to-pink-300"></div>
    <div className="text-center space-y-4">
      <div className="space-y-2">
        <Heart className="w-8 h-8 text-rose-500 mx-auto" />
        <h3 className="text-lg font-serif text-gray-800">
          You Are Cordially Invited
        </h3>
        <div className="text-2xl font-serif font-bold text-rose-700">
          Emma & James
        </div>
        <p className="text-sm text-gray-600 italic">
          Request the pleasure of your company
        </p>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="border-t border-b border-rose-200 py-3">
          <p className="font-semibold">Saturday, June 14th, 2025</p>
          <p>4:00 PM Ceremony</p>
          <p>6:00 PM Reception</p>
        </div>
        <div>
          <p className="font-semibold">Rosewood Garden Estate</p>
          <p>123 Oak Valley Road</p>
          <p>Springfield, CA</p>
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="border-rose-300 text-rose-700 hover:bg-rose-50"
      >
        Kindly RSVP
      </Button>
    </div>
  </div>
);

const CorporateModernPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-blue-50 to-slate-100 p-6 rounded-lg border border-blue-200">
    <div className="space-y-4">
      <div className="text-center">
        <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-slate-800">Corporate Event</h3>
        <p className="text-sm text-slate-600">Annual Team Building Summit</p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-blue-100">
        <div className="space-y-3 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-blue-600 mr-2" />
            <span>Monday, March 10th, 2025</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-blue-600 mr-2" />
            <span>9:00 AM - 5:00 PM</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-blue-600 mr-2" />
            <span>Grand Conference Center</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 text-blue-600 mr-2" />
            <span>All Staff Welcome</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-600 text-center">
        Agenda includes workshops, networking, and team activities
      </div>

      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
        Confirm Attendance
      </Button>
    </div>
  </div>
);

const HousePartyFunPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-orange-100 to-red-100 p-6 rounded-lg border-2 border-dashed border-orange-400 relative">
    <div className="absolute -top-2 -right-2 rotate-12">
      <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
        PARTY TIME!
      </div>
    </div>
    <div className="text-center space-y-4">
      <Home className="w-10 h-10 text-orange-600 mx-auto" />
      <div>
        <h3 className="text-xl font-bold text-orange-800">House Party!</h3>
        <p className="text-orange-700 font-semibold">Mike's Epic Gathering</p>
      </div>

      <div className="bg-white/80 p-3 rounded-lg space-y-2 text-sm">
        <div className="flex items-center justify-center">
          <Calendar className="w-4 h-4 mr-1 text-orange-600" />
          <span>Friday Night</span>
        </div>
        <div className="flex items-center justify-center">
          <Clock className="w-4 h-4 mr-1 text-orange-600" />
          <span>8:00 PM</span>
        </div>
        <div className="flex items-center justify-center">
          <Music className="w-4 h-4 mr-1 text-orange-600" />
          <span>Great Music</span>
        </div>
        <div className="flex items-center justify-center">
          <Utensils className="w-4 h-4 mr-1 text-orange-600" />
          <span>Food & Drinks</span>
        </div>
      </div>

      <p className="text-xs text-orange-700">
        Bring your friends and get ready to party!
      </p>

      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
        I'm Coming! 🎉
      </Button>
    </div>
  </div>
);

const BabyShowerSweetPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-green-50 to-blue-50 p-6 rounded-lg border border-green-200 relative">
    <div className="absolute top-2 left-2">
      <Baby className="w-6 h-6 text-green-600" />
    </div>
    <div className="absolute top-2 right-2">
      <Star className="w-6 h-6 text-yellow-400" />
    </div>
    <div className="text-center space-y-4">
      <div>
        <h3 className="text-lg font-bold text-green-800">Baby Shower</h3>
        <p className="text-green-700">Celebrating Our Little Miracle</p>
      </div>

      <div className="bg-white/90 p-4 rounded-lg space-y-2 text-sm">
        <p className="font-semibold text-green-800">Join us as we welcome</p>
        <p className="text-lg font-bold text-blue-700">Baby Thompson</p>
        <div className="space-y-1">
          <div className="flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-1 text-green-600" />
            <span>Sunday, April 20th</span>
          </div>
          <div className="flex items-center justify-center">
            <Clock className="w-4 h-4 mr-1 text-green-600" />
            <span>2:00 PM</span>
          </div>
          <div className="flex items-center justify-center">
            <Gift className="w-4 h-4 mr-1 text-green-600" />
            <span>Games & Gifts</span>
          </div>
        </div>
      </div>

      <Button size="sm" className="bg-green-600 hover:bg-green-700">
        Can't Wait!
      </Button>
    </div>
  </div>
);

const GraduationProudPreview = () => (
  <div className="aspect-4/5 bg-linear-to-br from-purple-100 to-blue-100 p-6 rounded-lg border-2 border-purple-300">
    <div className="text-center space-y-4">
      <GraduationCap className="w-10 h-10 text-purple-600 mx-auto" />
      <div>
        <h3 className="text-lg font-bold text-purple-800">
          Graduation Celebration
        </h3>
        <p className="text-purple-700 font-semibold">Alexandra's Achievement</p>
      </div>

      <div className="bg-white/90 p-4 rounded-lg">
        <div className="space-y-2 text-sm">
          <p className="font-bold text-purple-800">
            Masters in Computer Science
          </p>
          <p className="text-purple-700">Stanford University</p>
          <div className="border-t border-purple-200 pt-2 mt-2">
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-1 text-purple-600" />
                <span>Saturday, May 18th</span>
              </div>
              <div className="flex items-center justify-center">
                <Clock className="w-4 h-4 mr-1 text-purple-600" />
                <span>6:00 PM</span>
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="w-4 h-4 mr-1 text-purple-600" />
                <span>Family Home</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-purple-700">
        Join us as we celebrate this milestone!
      </p>

      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
        Celebrate With Us
      </Button>
    </div>
  </div>
);

const eviteTemplates: EviteTemplate[] = [
  {
    id: "birthday-classic",
    name: "Birthday Classic",
    category: "Birthday",
    description: "Colorful and festive birthday invitation with party elements",
    colors: ["#ec4899", "#a855f7", "#f97316"],
    fonts: "Playful",
    layout: "playful",
    features: [
      "RSVP Tracking",
      "Gift Registry Link",
      "Photo Sharing",
      "Music Requests",
    ],
    preview: BirthdayClassicPreview,
    free: true,
    previewImg: theme1,
  },
  {
    id: "wedding-elegant",
    name: "Wedding Elegance",
    category: "Wedding",
    description: "Sophisticated and romantic wedding invitation",
    colors: ["#f43f5e", "#fbbf24", "#f3f4f6"],
    fonts: "Elegant Serif",
    layout: "elegant",
    features: [
      "RSVP with Meal Choice",
      "Wedding Website Link",
      "Registry Info",
      "Guest Book",
    ],
    preview: WeddingElegantPreview,
    previewImg: theme2,

    free: false,
  },
  {
    id: "corporate-modern",
    name: "Corporate Professional",
    category: "Business",
    description: "Clean and professional corporate event invitation",
    colors: ["#2563eb", "#64748b", "#f8fafc"],
    fonts: "Modern Sans",
    layout: "modern",
    features: [
      "Professional RSVP",
      "Agenda Preview",
      "Contact Info",
      "Calendar Integration",
    ],
    preview: CorporateModernPreview,
    previewImg: theme1,

    free: true,
  },
  {
    id: "house-party-fun",
    name: "House Party Fun",
    category: "Party",
    description: "Energetic and casual house party invitation",
    colors: ["#ea580c", "#dc2626", "#fbbf24"],
    fonts: "Bold Sans",
    layout: "playful",
    features: [
      "Casual RSVP",
      "Bring Something List",
      "Music Playlist",
      "Party Games",
    ],
    preview: HousePartyFunPreview,
    previewImg: theme2,

    free: true,
  },
  {
    id: "baby-shower-sweet",
    name: "Baby Shower Sweet",
    category: "Baby Shower",
    description: "Adorable and gentle baby shower invitation",
    colors: ["#059669", "#3b82f6", "#fbbf24"],
    fonts: "Gentle Sans",
    layout: "classic",
    features: [
      "Gender Reveal Option",
      "Gift Registry",
      "Games List",
      "Photo Memories",
    ],
    preview: BabyShowerSweetPreview,
    previewImg: theme1,
    free: true,
  },
  {
    id: "graduation-proud",
    name: "Graduation Pride",
    category: "Graduation",
    description: "Celebrating academic achievements with style",
    colors: ["#7c3aed", "#2563eb", "#fbbf24"],
    fonts: "Academic",
    layout: "classic",
    features: [
      "Achievement Display",
      "Photo Timeline",
      "Memory Book",
      "Future Plans",
    ],
    preview: GraduationProudPreview,
    previewImg: theme1,

    free: true,
  },
  // Holiday & Seasonal Templates with Enhanced Visuals
  // {
  //   id: 'christmas-winter-wonderland',
  //   name: 'Christmas Winter Wonderland',
  //   category: 'Christmas',
  //   description: 'Magical Christmas invitation with falling snow animation and festive background',
  //   colors: ['#dc2626', '#059669', '#f8fafc', '#fbbf24'],
  //   fonts: 'Festive Script',
  //   layout: 'elegant',
  //   features: ['Animated Snow', 'Music Player', 'Gift Exchange', 'Photo Booth', 'Menu Planning'],
  //   preview: ChristmasWinterWonderlandPreview,
  //           previewImg: theme1,

  //   free: false

  // },
  // {
  //   id: 'new-year-midnight-gala',
  //   name: 'New Year Midnight Gala',
  //   category: 'New Year',
  //   description: 'Glamorous New Year\'s Eve invitation with countdown timer and fireworks animation',
  //   colors: ['#fbbf24', '#000000', '#ffffff', '#9333ea'],
  //   fonts: 'Glamorous Sans',
  //   layout: 'modern',
  //   features: ['Countdown Timer', 'Fireworks Animation', 'Resolution Sharing', 'Live Streaming', 'Midnight Toast'],
  //   preview: NewYearMidnightGalaPreview,
  //           previewImg: theme1,

  //   free: false
  // },
  // {
  //   id: 'valentine-romantic-evening',
  //   name: 'Valentine\'s Romantic Evening',
  //   category: 'Valentine\'s Day',
  //   description: 'Romantic Valentine\'s Day invitation with floating hearts and photo backgrounds',
  //   colors: ['#dc2626', '#ec4899', '#f8fafc', '#fbbf24'],
  //   fonts: 'Romantic Script',
  //   layout: 'elegant',
  //   features: ['Floating Hearts Animation', 'Photo Background', 'Love Notes', 'Couple Games', 'Memory Lane'],
  //   preview: ValentineRomanticEveningPreview,
  //               previewImg: theme1,

  //   free: false
  // },
  // {
  //   id: 'halloween-spooky-night',
  //   name: 'Halloween Spooky Night',
  //   category: 'Halloween',
  //   description: 'Spooky Halloween invitation with animated ghosts and pumpkin backgrounds',
  //   colors: ['#ea580c', '#000000', '#7c2d12', '#fbbf24'],
  //   fonts: 'Spooky Gothic',
  //   layout: 'playful',
  //   features: ['Ghost Animation', 'Costume Contest', 'Spooky Sounds', 'Trick or Treat Map', 'Photo Effects'],
  //   preview: HalloweenSpookyNightPreview,
  //               previewImg: theme1,

  //   free: true
  // },
  // {
  //   id: 'thanksgiving-harvest-feast',
  //   name: 'Thanksgiving Harvest Feast',
  //   category: 'Thanksgiving',
  //   description: 'Warm Thanksgiving invitation with autumn leaves and gratitude sharing',
  //   colors: ['#ea580c', '#fbbf24', '#059669', '#7c2d12'],
  //   fonts: 'Harvest Serif',
  //   layout: 'classic',
  //   features: ['Autumn Animation', 'Gratitude Wall', 'Recipe Sharing', 'Family Tree', 'Blessing Circle'],
  //   preview: ThanksgivingHarvestFeastPreview,
  //     previewImg: theme1,
  //   free: true
  // },
  // {
  //   id: 'easter-spring-celebration',
  //   name: 'Easter Spring Celebration',
  //   category: 'Easter',
  //   description: 'Cheerful Easter invitation with blooming flowers and egg hunt activities',
  //   colors: ['#ec4899', '#22d3ee', '#84cc16', '#fbbf24'],
  //   fonts: 'Spring Script',
  //   layout: 'playful',
  //   features: ['Flower Bloom Animation', 'Egg Hunt Map', 'Spring Activities', 'Photo Gallery', 'Recipe Exchange'],
  //   preview: EasterSpringCelebrationPreview,
  //           previewImg: theme1,

  //   free: true
  // },
  // {
  //   id: 'anniversary-golden-memories',
  //   name: 'Anniversary Golden Memories',
  //   category: 'Anniversary',
  //   description: 'Elegant anniversary invitation with photo timeline and memory sharing',
  //   colors: ['#fbbf24', '#ffffff', '#dc2626', '#64748b'],
  //   fonts: 'Elegant Script',
  //   layout: 'elegant',
  //   features: ['Photo Timeline', 'Memory Sharing', 'Love Story', 'Guest Messages', 'Anniversary Video'],
  //   preview: AnniversaryGoldenMemoriesPreview,
  //               previewImg: theme1,

  //   free: false
  // },
  // {
  //   id: 'summer-pool-party',
  //   name: 'Summer Pool Party',
  //   category: 'Summer Party',
  //   description: 'Fun summer pool party invitation with wave animations and sunny backgrounds',
  //   colors: ['#22d3ee', '#fbbf24', '#f97316', '#84cc16'],
  //   fonts: 'Summer Sans',
  //   layout: 'playful',
  //   features: ['Wave Animation', 'Weather Updates', 'Pool Games', 'BBQ Menu', 'Playlist Sharing'],
  //   preview: SummerPoolPartyPreview,
  //         previewImg: theme1,
  //   free: true
  // },
  // {
  //   id: 'cocktail-lounge-night',
  //   name: 'Cocktail Lounge Night',
  //   category: 'Cocktail Party',
  //   description: 'Sophisticated cocktail party invitation with animated cocktail glass and neon effects',
  //   colors: ['#000000', '#fbbf24', '#ec4899', '#22d3ee'],
  //   fonts: 'Modern Chic',
  //   layout: 'modern',
  //   features: ['Cocktail Animation', 'Drink Menu', 'Music Playlist', 'Dress Code', 'VIP Access'],
  //   preview: CocktailLoungeNightPreview,
  //         previewImg: theme1,
  //   free: false
  // }
];

const categories = [
  "All",
  "Birthday",
  "Wedding",
  "Business",
  "Party",
  "Baby Shower",
  "Graduation",
  "Christmas",
  "New Year",
  "Valentine's Day",
  "Thanksgiving",
  "Halloween",
  "Easter",
  "Anniversary",
  "Engagement",
  "Retirement",
  "Housewarming",
  "Bridal Shower",
  "Summer Party",
  "Pool Party",
  "Cocktail Party",
];

export default function EviteTemplates() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] =
    useState<EviteTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const filteredTemplates =
    selectedCategory === "All"
      ? eviteTemplates
      : eviteTemplates.filter((t) => t.category === selectedCategory);

  const handleTemplateSelect = (template: EviteTemplate) => {
    setSelectedTemplate(template);
    setPreviewMode(true);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // Navigate to customization with selected template
      window.location.href = `/complete-invite-workflow?template=${selectedTemplate.id}`;
    }
  };

  return (
    <div className="bg-[#0C111F]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">
            Professional Invitation Templates
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto ">
            Choose from our collection of professionally designed,
            Evite-inspired templates. Each template is fully customizable and
            includes interactive features for your guests.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Template Grid */}
        {!previewMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="relative w-[444px] h-[569px] rounded-lg overflow-hidden shadow-md group"
              >
                {/* Background Preview */}
                <img
                  src={template.previewImg} // ✅ dynamic preview
                  alt={template.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay Bottom Section */}
                <div className="absolute bottom-0 left-1/2 h-[290px] -translate-x-1/2 w-[90%] bg-black/40 backdrop-blur-md rounded-lg p-4">
                  {/* Title + Description */}
                  <h3 className="text-white font-bold text-lg">
                    {template.name}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {template.description}
                  </p>

                  {/* Category */}
                  <div className="mt-3 inline-flex border border-gray-300 rounded-full px-3 py-0.5">
                    <span className="text-white text-xs font-semibold">
                      {template.category}
                    </span>
                  </div>

                  {/* Colors */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-300">Colors:</span>
                    <div className="flex gap-2">
                      {template.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <p className="mt-3 text-xs font-medium text-gray-300">
                    Features:
                  </p>
                  <div className="grid grid-cols-2 gap-y-2 mt-1">
                    {template.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-gray-300 text-xs"
                      >
                        <Check className="w-3 h-3 mr-1 text-green-600" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => handleTemplateSelect(template)}
                      className="flex items-center justify-center gap-2 flex-1 h-10 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        handleUseTemplate();
                      }}
                      className="w-12 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition"
                    >
                      <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Template Preview Mode */
          selectedTemplate && (
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  ← Back to Templates
                </Button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-muted-foreground text-white">
                    {selectedTemplate.description}
                  </p>
                </div>
                <Button
                  onClick={handleUseTemplate}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Use This Template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Large Preview */}
                <div className="space-y-4">
                  <div className="">
                    {/* <div className="transform scale-150 origin-top">
                                                        <selectedTemplate.previewImg />

                  </div> */}

                    <img
                      src={selectedTemplate.previewImg}
                      className="h-[900px]"
                    />
                  </div>

                  {/* Template Actions */}
                  {/* <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Preview
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Template
                  </Button>
                  <Button variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div> */}
                </div>

                {/* Template Details */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Palette className="w-5 h-5" />
                        <span>Template Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Category</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedTemplate.category}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Layout Style
                        </Label>
                        <p className="text-sm text-muted-foreground capitalize">
                          {selectedTemplate.layout}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Font Style
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedTemplate.fonts}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Color Palette
                        </Label>
                        <div className="flex space-x-2 mt-1">
                          {selectedTemplate.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-lg border border-gray-200 shadow-xs"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Included Features</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedTemplate.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Star className="w-5 h-5" />
                        <span>Customization Options</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Custom text and messaging</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Color scheme adjustment</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Add personal photos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Custom questions for guests</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Music and mood settings</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Interactive elements</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleUseTemplate}
                    className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                  >
                    Customize This Template
                    <Sparkles className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )
        )}

        {/* Call to Action */}
        {/* {!previewMode && (
        <div className="text-center space-y-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-8 rounded-lg">
          <h3 className="text-xl font-semibold">Need a Custom Design?</h3>
          <p className="text-muted-foreground">
            Our AI-powered design studio can create a unique template just for your event.
          </p>
          <Button asChild variant="outline">
            <Link href="/interactive-design-generator">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Custom Template
            </Link>
          </Button>
        </div>
      )} */}
        <Pagination />
      </div>
    </div>
  );
}
