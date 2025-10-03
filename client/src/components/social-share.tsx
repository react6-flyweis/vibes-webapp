import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Share2, 
  Copy, 
  Facebook, 
  Twitter, 
  Instagram, 
  MessageCircle,
  Mail,
  Linkedin,
  Check,
  ExternalLink
} from "lucide-react";
import { 
  SiFacebook, 
  SiX, 
  SiInstagram, 
  SiWhatsapp, 
  SiLinkedin,
  SiTelegram,
  SiDiscord,
  SiReddit
} from "react-icons/si";

interface SocialShareProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venue?: string;
    city: string;
    image: string;
    category: string;
    price?: any;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function SocialShare({ event, isOpen, onClose }: SocialShareProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [shareStats, setShareStats] = useState({
    facebook: 0,
    twitter: 0,
    instagram: 0,
    whatsapp: 0,
    linkedin: 0,
    telegram: 0,
    discord: 0,
    reddit: 0
  });

  if (!isOpen) return null;

  const eventUrl = `${window.location.origin}/events/booking/${event.id}`;
  const shareText = `🎉 Check out this amazing ${event.category} event: ${event.title} in ${event.city} on ${event.date}! Join me for an unforgettable experience.`;
  const hashTags = ["VibesEvent", "PartyTime", event.category.replace('-', ''), event.city.replace(' ', '')];

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}&hashtags=${hashTags.join(',')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}&summary=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${eventUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(shareText)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(eventUrl)}&title=${encodeURIComponent(event.title)}`,
    discord: `https://discord.com/channels/@me`,
    instagram: `https://www.instagram.com/`
  };

  const handleShare = async (platform: keyof typeof shareLinks) => {
    try {
      if (platform === 'instagram' || platform === 'discord') {
        // Copy to clipboard for platforms that don't support direct sharing
        await navigator.clipboard.writeText(`${shareText} ${eventUrl}`);
        toast({
          title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Share`,
          description: "Event details copied to clipboard! Paste in your post.",
        });
      } else {
        window.open(shareLinks[platform], '_blank', 'width=600,height=400');
      }
      
      // Update share stats
      setShareStats(prev => ({
        ...prev,
        [platform]: prev[platform] + 1
      }));

      // Track share analytics
      fetch('/api/events/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          platform,
          timestamp: new Date().toISOString()
        })
      });

      toast({
        title: "Event Shared!",
        description: `Successfully shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to share event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${eventUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Event link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const socialPlatforms = [
    { 
      name: 'Facebook', 
      key: 'facebook' as const, 
      icon: SiFacebook, 
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Share with friends'
    },
    { 
      name: 'X (Twitter)', 
      key: 'twitter' as const, 
      icon: SiX, 
      color: 'bg-sky-500 hover:bg-sky-600',
      description: 'Tweet about it'
    },
    { 
      name: 'Instagram', 
      key: 'instagram' as const, 
      icon: SiInstagram, 
      color: 'bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      description: 'Post to stories'
    },
    { 
      name: 'WhatsApp', 
      key: 'whatsapp' as const, 
      icon: SiWhatsapp, 
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Send to chat'
    },
    { 
      name: 'LinkedIn', 
      key: 'linkedin' as const, 
      icon: SiLinkedin, 
      color: 'bg-blue-700 hover:bg-blue-800',
      description: 'Professional network'
    },
    { 
      name: 'Telegram', 
      key: 'telegram' as const, 
      icon: SiTelegram, 
      color: 'bg-sky-600 hover:bg-sky-700',
      description: 'Send to channel'
    },
    { 
      name: 'Discord', 
      key: 'discord' as const, 
      icon: SiDiscord, 
      color: 'bg-indigo-600 hover:bg-indigo-700',
      description: 'Share with community'
    },
    { 
      name: 'Reddit', 
      key: 'reddit' as const, 
      icon: SiReddit, 
      color: 'bg-orange-600 hover:bg-orange-700',
      description: 'Post to subreddit'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-sm border-white/20 max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Share2 className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Share Event</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              ✕
            </Button>
          </div>

          {/* Event Preview */}
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{event.title}</h3>
                  <p className="text-purple-200 text-sm mb-2">{event.city} • {event.date} at {event.time}</p>
                  <Badge className="bg-purple-600/90 text-white text-xs">
                    {event.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Copy */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Quick Copy</h3>
            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                variant="outline"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Event Link
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  navigator.share({
                    title: event.title,
                    text: shareText,
                    url: eventUrl
                  }).catch(() => {
                    // Fallback to copy if Web Share API not supported
                    copyToClipboard();
                  });
                }}
                className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Native Share
              </Button>
            </div>
          </div>

          {/* Social Platforms Grid */}
          <div>
            <h3 className="text-white font-semibold mb-3">Share on Social Media</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <Button
                    key={platform.key}
                    onClick={() => handleShare(platform.key)}
                    className={`${platform.color} text-white p-4 h-auto flex flex-col items-center gap-2 transition-all duration-200 transform hover:scale-105`}
                  >
                    <IconComponent className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold text-sm">{platform.name}</div>
                      <div className="text-xs opacity-90">{platform.description}</div>
                      {shareStats[platform.key] > 0 && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {shareStats[platform.key]} shares
                        </Badge>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Share Analytics */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <h4 className="text-white font-semibold mb-2">Share Analytics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {Object.values(shareStats).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-purple-200 text-sm">Total Shares</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {shareStats.facebook + shareStats.twitter + shareStats.linkedin}
                </div>
                <div className="text-purple-200 text-sm">Social Media</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {shareStats.whatsapp + shareStats.telegram}
                </div>
                <div className="text-purple-200 text-sm">Messaging</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {shareStats.discord + shareStats.reddit}
                </div>
                <div className="text-purple-200 text-sm">Communities</div>
              </div>
            </div>
          </div>

          {/* Custom Message */}
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-2">Custom Share Message</h4>
            <div className="p-3 bg-white/5 rounded-lg text-purple-200 text-sm font-mono">
              {shareText}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}