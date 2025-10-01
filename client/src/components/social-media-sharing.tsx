import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MessageCircle,
  Copy,
  Check,
  Download,
  Sparkles,
  Users,
  Calendar,
  MapPin,
  Clock,
  Music
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialMediaSharingProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

const socialPlatforms = [
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    description: "Share to your timeline or create an event"
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: Twitter,
    color: "bg-sky-500",
    description: "Tweet about your event with hashtags"
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    description: "Create a story or post with event details"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-700",
    description: "Share professional events with your network"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    color: "bg-green-500",
    description: "Send invitation directly to contacts"
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Users,
    color: "bg-black",
    description: "Share your event with video content"
  }
];

export default function SocialMediaSharing({ event, isOpen, onClose }: SocialMediaSharingProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEventImage, setIncludeEventImage] = useState(true);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate default sharing content
  const generateShareContent = (platform: string) => {
    const eventUrl = `${window.location.origin}/events/${event.id}`;
    const eventDate = new Date(event.date || Date.now()).toLocaleDateString();
    
    const baseMessage = customMessage || `🎉 You're invited to ${event.title || 'our amazing event'}!

📅 Date: ${eventDate}
📍 Location: ${event.location || 'Location TBD'}
⏰ Time: ${event.time || '7:00 PM'}

Join us for an unforgettable experience!`;

    const hashtags = includeHashtags ? getHashtagsForEvent() : "";
    
    switch (platform) {
      case "facebook":
        return {
          message: `${baseMessage}\n\nRSVP: ${eventUrl}`,
          url: eventUrl
        };
      case "twitter":
        return {
          message: `${baseMessage} ${hashtags}\n\n${eventUrl}`,
          url: eventUrl
        };
      case "instagram":
        return {
          message: `${baseMessage}\n\nLink in bio or DM for RSVP! ${hashtags}`,
          url: eventUrl
        };
      case "linkedin":
        return {
          message: `${baseMessage}\n\nProfessional networking opportunity.\n\n${eventUrl}`,
          url: eventUrl
        };
      case "whatsapp":
        return {
          message: `${baseMessage}\n\nRSVP here: ${eventUrl}`,
          url: eventUrl
        };
      case "tiktok":
        return {
          message: `🎉 Epic event coming up! ${event.title || 'Amazing party'}\n\n📅 ${eventDate}\n📍 ${event.location || 'Location TBD'}\n\nWho's ready to make memories? ${hashtags}\n\nLink in bio for details! #PartyTime #EventVibes`,
          url: eventUrl
        };
      default:
        return { message: baseMessage, url: eventUrl };
    }
  };

  const getHashtagsForEvent = () => {
    const category = event.category || "party";
    const hashtagMap: Record<string, string> = {
      birthday: "#Birthday #BirthdayParty #Celebration #Party",
      wedding: "#Wedding #WeddingDay #Love #Celebration",
      corporate: "#Corporate #Business #Networking #Event",
      graduation: "#Graduation #Achievement #Celebration #Success",
      baby: "#BabyShower #NewBaby #Celebration #Family",
      anniversary: "#Anniversary #Love #Celebration #Milestone",
      party: "#Party #Fun #Celebration #Event"
    };
    return hashtagMap[category] || "#Event #Party #Celebration #Join";
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleShareToPlatform = (platform: string) => {
    const content = generateShareContent(platform);
    const encodedMessage = encodeURIComponent(content.message);
    const encodedUrl = encodeURIComponent(content.url);
    
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedMessage}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedMessage}`;
        break;
      case "tiktok":
        // TikTok doesn't have direct URL sharing, so we copy the content
        navigator.clipboard.writeText(content.message);
        toast({
          title: "Content Copied!",
          description: "TikTok content copied to clipboard. Use this when creating your video post."
        });
        return;
      case "instagram":
        // Instagram doesn't have direct URL sharing, so we copy the content
        navigator.clipboard.writeText(content.message);
        toast({
          title: "Content Copied!",
          description: "Instagram post content copied to clipboard. Paste it when creating your post."
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      toast({
        title: "Sharing Window Opened",
        description: `Opening ${platform} sharing window...`
      });
    }
  };

  const handleBulkShare = () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No Platforms Selected",
        description: "Please select at least one social media platform to share to.",
        variant: "destructive"
      });
      return;
    }

    selectedPlatforms.forEach((platform, index) => {
      setTimeout(() => {
        handleShareToPlatform(platform);
      }, index * 1000); // Stagger the sharing to avoid popup blockers
    });
  };

  const copyInviteLink = () => {
    const eventUrl = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link Copied",
      description: "Event invitation link copied to clipboard!"
    });
  };

  const generateSharableImage = () => {
    // This would integrate with a service like Canva API or generate images locally
    toast({
      title: "Generating Share Image",
      description: "Creating a beautiful shareable image for your event..."
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Event on Social Media
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Preview */}
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title || "Your Event"}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.date || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.time || "7:00 PM"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location || "Location TBD"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.maxGuests || "All welcome"}</span>
                </div>
              </div>
              <p className="mt-3 text-gray-700">{event.description || "Join us for an amazing event!"}</p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button onClick={copyInviteLink} variant="outline" className="w-full">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Link Copied!" : "Copy Event Link"}
              </Button>
              
              <Button onClick={generateSharableImage} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Share Image
              </Button>
            </div>
          </div>

          {/* Sharing Options */}
          <div className="space-y-6">
            {/* Custom Message */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Custom Share Message</label>
              <Textarea
                placeholder="Customize your sharing message..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
              />
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="rounded"
                  />
                  Include hashtags
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeEventImage}
                    onChange={(e) => setIncludeEventImage(e.target.checked)}
                    className="rounded"
                  />
                  Include event image
                </label>
              </div>
            </div>

            {/* Platform Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Select Platforms</label>
                <Badge variant="secondary">{selectedPlatforms.length} selected</Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatforms.includes(platform.id);
                  
                  return (
                    <div
                      key={platform.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handlePlatformToggle(platform.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg text-white ${platform.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{platform.name}</h4>
                          <p className="text-xs text-gray-500">{platform.description}</p>
                        </div>
                        {isSelected && (
                          <Check className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Share Actions */}
            <div className="space-y-3">
              <Button 
                onClick={handleBulkShare} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={selectedPlatforms.length === 0}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Share to Selected Platforms ({selectedPlatforms.length})
              </Button>
              
              <div className="text-center text-xs text-gray-500">
                Or share to individual platforms:
              </div>
              
              <div className="flex gap-2 justify-center">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <Button
                      key={platform.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareToPlatform(platform.id)}
                      className="p-2"
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}