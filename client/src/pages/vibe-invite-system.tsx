import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Plus,
  Calendar,
  MapPin,
  Users,
  Share2,
  Download,
  Eye,
  Heart,
  MessageCircle,
  Settings,
  Edit3,
  Send,
  Clock,
  Music,
  Camera,
  Video,
  Sparkles,
  QrCode,
  Bell,
  TrendingUp,
  BarChart3,
  Gift,
  Palette,
  Zap,
  Star,
  ThumbsUp,
  Reply,
  ImageIcon,
  Volume2,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Crown,
  Shield,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  Coins,
  Gem,
  Award
} from 'lucide-react';

interface Invitation {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  hostName: string;
  theme: string;
  coverImage: string;
  inviteType: 'static' | 'animated' | '3d' | 'video';
  rsvpCount: number;
  viewCount: number;
  shareCount: number;
  isNFTEnabled: boolean;
  isPremium: boolean;
  status: 'draft' | 'sent' | 'active' | 'ended';
}

interface RSVPResponse {
  id: string;
  guestName: string;
  guestEmail: string;
  response: 'yes' | 'no' | 'maybe';
  plusGuests: number;
  dietaryNeeds: string;
  songRequest: string;
  arrivalTime: string;
  emoji: string;
  comment: string;
  timestamp: string;
}

interface EngagementMetrics {
  totalViews: number;
  uniqueViews: number;
  rsvpRate: number;
  shareRate: number;
  peakViewingTime: string;
  avgTimeSpent: number;
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  locationBreakdown: { country: string; percentage: number }[];
}

export default function VibeInviteSystem() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'analytics' | 'preview'>('dashboard');
  const [selectedInvite, setSelectedInvite] = useState<Invitation | null>(null);
  const [newInvite, setNewInvite] = useState<Partial<Invitation>>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    theme: 'gradient-sunset',
    inviteType: 'animated',
    isNFTEnabled: false,
    isPremium: false
  });
  const [rsvpResponses, setRSVPResponses] = useState<RSVPResponse[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Sample invitations data
  const sampleInvitations: Invitation[] = [
    {
      id: 'inv-001',
      title: "Sarah's 25th Birthday Celebration",
      date: '2024-12-28',
      time: '19:00',
      location: 'Downtown Rooftop Lounge, NYC',
      description: 'Join us for an unforgettable night of dancing, drinks, and celebration as Sarah turns 25!',
      hostName: 'Sarah Chen',
      theme: 'gradient-sunset',
      coverImage: '/api/placeholder/600/400',
      inviteType: 'animated',
      rsvpCount: 23,
      viewCount: 156,
      shareCount: 12,
      isNFTEnabled: true,
      isPremium: true,
      status: 'active'
    },
    {
      id: 'inv-002',
      title: 'New Year Corporate Gala 2025',
      date: '2024-12-31',
      time: '20:00',
      location: 'Grand Ballroom, Manhattan Hotel',
      description: 'Ring in the new year with colleagues, networking, and spectacular entertainment.',
      hostName: 'Innovation Corp',
      theme: 'midnight-elegance',
      coverImage: '/api/placeholder/600/400',
      inviteType: '3d',
      rsvpCount: 89,
      viewCount: 234,
      shareCount: 18,
      isNFTEnabled: true,
      isPremium: true,
      status: 'active'
    },
    {
      id: 'inv-003',
      title: 'Michael & Jennifer Wedding',
      date: '2025-01-15',
      time: '16:00',
      location: 'Garden Pavilion, Brooklyn Heights',
      description: 'Witness the union of two hearts in a beautiful garden ceremony followed by reception.',
      hostName: 'The Johnson Family',
      theme: 'classic-elegance',
      coverImage: '/api/placeholder/600/400',
      inviteType: 'video',
      rsvpCount: 67,
      viewCount: 189,
      shareCount: 25,
      isNFTEnabled: false,
      isPremium: true,
      status: 'sent'
    }
  ];

  // Sample RSVP responses
  const sampleRSVPs: RSVPResponse[] = [
    {
      id: 'rsvp-001',
      guestName: 'Emily Rodriguez',
      guestEmail: 'emily@email.com',
      response: 'yes',
      plusGuests: 1,
      dietaryNeeds: 'Vegetarian',
      songRequest: 'Dancing Queen - ABBA',
      arrivalTime: '7:30 PM',
      emoji: '🎉',
      comment: "Can't wait to celebrate with you Sarah! This is going to be amazing!",
      timestamp: '2024-12-15T14:30:00Z'
    },
    {
      id: 'rsvp-002',
      guestName: 'Marcus Johnson',
      guestEmail: 'marcus@email.com',
      response: 'yes',
      plusGuests: 0,
      dietaryNeeds: 'None',
      songRequest: 'Uptown Funk - Bruno Mars',
      arrivalTime: '7:00 PM',
      emoji: '🥳',
      comment: 'Ready to party! Thanks for the invite!',
      timestamp: '2024-12-15T16:45:00Z'
    },
    {
      id: 'rsvp-003',
      guestName: 'Alex Thompson',
      guestEmail: 'alex@email.com',
      response: 'maybe',
      plusGuests: 0,
      dietaryNeeds: 'Gluten-free',
      songRequest: 'Good 4 U - Olivia Rodrigo',
      arrivalTime: '8:00 PM',
      emoji: '🤔',
      comment: 'Still checking my schedule but really hope I can make it!',
      timestamp: '2024-12-16T09:15:00Z'
    }
  ];

  const sampleMetrics: EngagementMetrics = {
    totalViews: 156,
    uniqueViews: 134,
    rsvpRate: 0.72,
    shareRate: 0.08,
    peakViewingTime: '2:30 PM',
    avgTimeSpent: 2.4,
    deviceBreakdown: { mobile: 68, desktop: 24, tablet: 8 },
    locationBreakdown: [
      { country: 'United States', percentage: 78 },
      { country: 'Canada', percentage: 12 },
      { country: 'United Kingdom', percentage: 6 },
      { country: 'Other', percentage: 4 }
    ]
  };

  const themes = [
    { id: 'gradient-sunset', name: 'Sunset Gradient', colors: 'from-orange-400 via-pink-500 to-purple-600' },
    { id: 'midnight-elegance', name: 'Midnight Elegance', colors: 'from-gray-900 via-blue-900 to-black' },
    { id: 'classic-elegance', name: 'Classic Elegance', colors: 'from-gray-100 via-white to-gray-200' },
    { id: 'tropical-vibes', name: 'Tropical Vibes', colors: 'from-green-400 via-blue-500 to-purple-600' },
    { id: 'neon-party', name: 'Neon Party', colors: 'from-pink-500 via-red-500 to-yellow-500' }
  ];

  const aiSuggestions = [
    "Join us for an unforgettable celebration filled with joy, laughter, and amazing memories!",
    "You're invited to an exclusive event that promises to be the highlight of your social calendar.",
    "Let's come together for a night of music, dancing, and pure excitement!",
    "Mark your calendar for an extraordinary gathering you won't want to miss.",
    "Prepare for an evening of elegance, entertainment, and exceptional company."
  ];

  useEffect(() => {
    setRSVPResponses(sampleRSVPs);
  }, []);

  const createInvitation = () => {
    const invitation: Invitation = {
      id: `inv-${Date.now()}`,
      title: newInvite.title || 'Untitled Event',
      date: newInvite.date || '',
      time: newInvite.time || '',
      location: newInvite.location || '',
      description: newInvite.description || '',
      hostName: 'Current User',
      theme: newInvite.theme || 'gradient-sunset',
      coverImage: '/api/placeholder/600/400',
      inviteType: newInvite.inviteType || 'animated',
      rsvpCount: 0,
      viewCount: 0,
      shareCount: 0,
      isNFTEnabled: newInvite.isNFTEnabled || false,
      isPremium: newInvite.isPremium || false,
      status: 'draft'
    };
    
    setSelectedInvite(invitation);
    setCurrentView('preview');
  };

  const InvitationPreview = ({ invite }: { invite: Invitation }) => {
    const theme = themes.find(t => t.id === invite.theme);
    
    return (
      <div className="max-w-md mx-auto">
        <Card className="overflow-hidden border-0 shadow-2xl">
          <div className={`h-64 bg-gradient-to-br ${theme?.colors} relative`}>
            {invite.isNFTEnabled && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-yellow-500 text-black">
                  <Gem className="w-3 h-3 mr-1" />
                  NFT
                </Badge>
              </div>
            )}
            
            <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{invite.title}</h1>
                <p className="text-lg opacity-90">Hosted by {invite.hostName}</p>
              </div>
            </div>
            
            {invite.inviteType === 'animated' && (
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Play className="w-4 h-4" />
                  <span>Animated</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{new Date(invite.date).toLocaleDateString()} at {invite.time}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{invite.location}</span>
            </div>
            
            <p className="text-gray-700">{invite.description}</p>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-2" />
                  Yes, I'll be there!
                </Button>
                <Button variant="outline" className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  Can't make it
                </Button>
              </div>
              
              <Button variant="outline" className="w-full">
                <AlertCircle className="w-4 h-4 mr-2" />
                Maybe
              </Button>
            </div>
            
            <div className="border-t pt-4">
              <Label className="text-sm font-medium">Additional Questions</Label>
              <div className="space-y-3 mt-2">
                <div>
                  <Label className="text-xs text-gray-600">Dietary restrictions?</Label>
                  <Input placeholder="e.g., Vegetarian, Gluten-free" className="mt-1" />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-600">Song request?</Label>
                  <Input placeholder="What song gets you dancing?" className="mt-1" />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-600">Expected arrival time?</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early">30 minutes early</SelectItem>
                      <SelectItem value="ontime">Right on time</SelectItem>
                      <SelectItem value="fashionably">Fashionably late</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <Textarea 
                placeholder="Leave a comment or message for the host..."
                className="min-h-20"
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <div className="text-sm text-gray-500">
                {invite.viewCount} views • {invite.rsvpCount} RSVPs
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">VibeInvite</h1>
              <p className="text-gray-600">Modern e-invitation system powered by AI</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setCurrentView('dashboard')}
                className={currentView === 'dashboard' ? 'bg-blue-50' : ''}
              >
                Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentView('create')}
                className={currentView === 'create' ? 'bg-blue-50' : ''}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invite
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentView('analytics')}
                className={currentView === 'analytics' ? 'bg-blue-50' : ''}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Invites</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Send className="w-8 h-8 text-blue-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total RSVPs</p>
                    <p className="text-2xl font-bold">179</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Response Rate</p>
                    <p className="text-2xl font-bold">72%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Premium Events</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <Crown className="w-8 h-8 text-yellow-500" />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {sampleInvitations.map((invite) => (
                <Card key={invite.id} className="overflow-hidden">
                  <div className={`h-32 bg-gradient-to-br ${themes.find(t => t.id === invite.theme)?.colors} relative`}>
                    {invite.isPremium && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {invite.isNFTEnabled && (
                      <Badge className="absolute top-2 right-2 bg-purple-500">
                        <Gem className="w-3 h-3 mr-1" />
                        NFT
                      </Badge>
                    )}
                    <div className="absolute bottom-2 left-3 text-white">
                      <h3 className="font-semibold">{invite.title}</h3>
                      <p className="text-sm opacity-90">{new Date(invite.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Users className="w-4 h-4" />
                      <span>{invite.rsvpCount} RSVPs</span>
                      <Eye className="w-4 h-4 ml-2" />
                      <span>{invite.viewCount} views</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedInvite(invite);
                          setCurrentView('preview');
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Create Invite View */}
        {currentView === 'create' && (
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="basics" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="rsvp">RSVP</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="basics" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter event title"
                        value={newInvite.title}
                        onChange={(e) => setNewInvite({...newInvite, title: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newInvite.date}
                        onChange={(e) => setNewInvite({...newInvite, date: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newInvite.time}
                        onChange={(e) => setNewInvite({...newInvite, time: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Enter event location"
                        value={newInvite.location}
                        onChange={(e) => setNewInvite({...newInvite, location: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your event..."
                      value={newInvite.description}
                      onChange={(e) => setNewInvite({...newInvite, description: e.target.value})}
                      className="min-h-20"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <Label>AI-Suggested Copy</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-left justify-start h-auto p-3"
                          onClick={() => setNewInvite({...newInvite, description: suggestion})}
                        >
                          <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Visual Design</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <Label>Invitation Type</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {[
                          { id: 'static', name: 'Static', icon: ImageIcon },
                          { id: 'animated', name: 'Animated', icon: Play },
                          { id: '3d', name: '3D Effect', icon: Sparkles },
                          { id: 'video', name: 'Video', icon: Video }
                        ].map((type) => (
                          <Button
                            key={type.id}
                            variant={newInvite.inviteType === type.id ? 'default' : 'outline'}
                            className="h-20 flex-col"
                            onClick={() => setNewInvite({...newInvite, inviteType: type.id as any})}
                          >
                            <type.icon className="w-6 h-6 mb-2" />
                            <span className="text-sm">{type.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Theme</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                        {themes.map((theme) => (
                          <Button
                            key={theme.id}
                            variant={newInvite.theme === theme.id ? 'default' : 'outline'}
                            className="h-16 relative overflow-hidden"
                            onClick={() => setNewInvite({...newInvite, theme: theme.id})}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${theme.colors} opacity-20`} />
                            <span className="relative z-10">{theme.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Add Background Music</Label>
                        <p className="text-sm text-gray-600">Upload or select mood music</p>
                      </div>
                      <Button variant="outline">
                        <Music className="w-4 h-4 mr-2" />
                        Add Music
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Custom Graphics</Label>
                        <p className="text-sm text-gray-600">Upload custom images or logos</p>
                      </div>
                      <Button variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="rsvp" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">RSVP Configuration</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Plus Guests</Label>
                        <p className="text-sm text-gray-600">Let guests bring additional people</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Emoji Reactions</Label>
                        <p className="text-sm text-gray-600">Enable emoji/GIF responses</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div>
                      <Label>Custom Questions</Label>
                      <div className="space-y-3 mt-2">
                        <div className="flex gap-2">
                          <Input placeholder="e.g., Dietary restrictions?" className="flex-1" />
                          <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Input placeholder="e.g., Song requests?" className="flex-1" />
                          <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Reminder Settings</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="email-reminder" defaultChecked />
                          <Label htmlFor="email-reminder" className="text-sm">Email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="sms-reminder" />
                          <Label htmlFor="sms-reminder" className="text-sm">SMS</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="push-reminder" defaultChecked />
                          <Label htmlFor="push-reminder" className="text-sm">Push</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Advanced Features</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          Premium Features
                        </Label>
                        <p className="text-sm text-gray-600">Enable advanced customization and analytics</p>
                      </div>
                      <Switch 
                        checked={newInvite.isPremium}
                        onCheckedChange={(checked) => setNewInvite({...newInvite, isPremium: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="flex items-center gap-2">
                          <Gem className="w-4 h-4 text-purple-500" />
                          NFT Digital Pass
                        </Label>
                        <p className="text-sm text-gray-600">Create blockchain-verified invitations</p>
                      </div>
                      <Switch 
                        checked={newInvite.isNFTEnabled}
                        onCheckedChange={(checked) => setNewInvite({...newInvite, isNFTEnabled: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>AR Experience</Label>
                        <p className="text-sm text-gray-600">Add augmented reality filters</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Live Countdown</Label>
                        <p className="text-sm text-gray-600">Show real-time countdown to event</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Guest Polls</Label>
                        <p className="text-sm text-gray-600">Enable voting on music, games, etc.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Vendor Integration</Label>
                        <p className="text-sm text-gray-600">Connect with caterers and decorators</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="preview">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Invitation Preview</h3>
                    <div className="flex gap-2">
                      <Button onClick={createInvitation}>
                        <Send className="w-4 h-4 mr-2" />
                        Send Invitation
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Save Draft
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <InvitationPreview invite={{
                        id: 'preview',
                        title: newInvite.title || 'Your Event Title',
                        date: newInvite.date || '2024-12-31',
                        time: newInvite.time || '19:00',
                        location: newInvite.location || 'Event Location',
                        description: newInvite.description || 'Event description will appear here...',
                        hostName: 'You',
                        theme: newInvite.theme || 'gradient-sunset',
                        coverImage: '',
                        inviteType: newInvite.inviteType || 'animated',
                        rsvpCount: 0,
                        viewCount: 0,
                        shareCount: 0,
                        isNFTEnabled: newInvite.isNFTEnabled || false,
                        isPremium: newInvite.isPremium || false,
                        status: 'draft'
                      }} />
                    </div>
                    
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h4 className="font-semibold mb-3">Sharing Options</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm">
                            <Instagram className="w-4 h-4 mr-2" />
                            Instagram
                          </Button>
                          <Button variant="outline" size="sm">
                            <Facebook className="w-4 h-4 mr-2" />
                            Facebook
                          </Button>
                          <Button variant="outline" size="sm">
                            <Twitter className="w-4 h-4 mr-2" />
                            Twitter
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4 mr-2" />
                            SMS
                          </Button>
                          <Button variant="outline" size="sm">
                            <QrCode className="w-4 h-4 mr-2" />
                            QR Code
                          </Button>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <h4 className="font-semibold mb-3">Features Enabled</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm">Smart RSVP Options</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm">Social Sharing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm">Guest Comments</span>
                          </div>
                          {newInvite.isPremium && (
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">Premium Analytics</span>
                            </div>
                          )}
                          {newInvite.isNFTEnabled && (
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-purple-500" />
                              <span className="text-sm">NFT Digital Pass</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Analytics View */}
        {currentView === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold">{sampleMetrics.totalViews}</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">RSVP Rate</p>
                    <p className="text-2xl font-bold">{Math.round(sampleMetrics.rsvpRate * 100)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Time Spent</p>
                    <p className="text-2xl font-bold">{sampleMetrics.avgTimeSpent}m</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Share Rate</p>
                    <p className="text-2xl font-bold">{Math.round(sampleMetrics.shareRate * 100)}%</p>
                  </div>
                  <Share2 className="w-8 h-8 text-orange-500" />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Mobile</span>
                    <span className="font-medium">{sampleMetrics.deviceBreakdown.mobile}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${sampleMetrics.deviceBreakdown.mobile}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Desktop</span>
                    <span className="font-medium">{sampleMetrics.deviceBreakdown.desktop}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${sampleMetrics.deviceBreakdown.desktop}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Tablet</span>
                    <span className="font-medium">{sampleMetrics.deviceBreakdown.tablet}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${sampleMetrics.deviceBreakdown.tablet}%` }}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">RSVP Responses</h3>
                <div className="space-y-4">
                  {rsvpResponses.slice(0, 3).map((rsvp) => (
                    <div key={rsvp.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {rsvp.guestName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{rsvp.guestName}</span>
                          <Badge variant={rsvp.response === 'yes' ? 'default' : rsvp.response === 'no' ? 'destructive' : 'secondary'}>
                            {rsvp.response}
                          </Badge>
                          <span className="text-lg">{rsvp.emoji}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{rsvp.comment}</p>
                        {rsvp.songRequest && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Music className="w-3 h-3" />
                            <span>{rsvp.songRequest}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Preview View */}
        {currentView === 'preview' && selectedInvite && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('dashboard')}
              >
                ← Back to Dashboard
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
            
            <InvitationPreview invite={selectedInvite} />
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {rsvpResponses.map((rsvp) => (
                  <div key={rsvp.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium">
                      {rsvp.guestName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rsvp.guestName}</span>
                        <span className="text-sm text-gray-500">responded</span>
                        <Badge variant={rsvp.response === 'yes' ? 'default' : rsvp.response === 'no' ? 'destructive' : 'secondary'}>
                          {rsvp.response}
                        </Badge>
                        <span className="text-lg">{rsvp.emoji}</span>
                      </div>
                      {rsvp.comment && (
                        <p className="text-sm text-gray-600 mt-1">"{rsvp.comment}"</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(rsvp.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}