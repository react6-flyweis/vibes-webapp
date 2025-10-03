import { useState, useEffect } from "react";
import { Video, Camera, Music, Sparkles, Download, Share2, Trophy, Users, Clock, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useQuery, useMutation } from "@tanstack/react-query";

interface MediaAsset {
  id: string;
  type: "photo" | "video" | "audio";
  url: string;
  thumbnail: string;
  timestamp: string;
  uploader: string;
  uploaderAvatar: string;
  duration?: number;
  size: number;
  tags: string[];
  aiAnalysis: {
    confidence: number;
    people: string[];
    emotions: string[];
    highlights: string[];
    quality: number;
  };
}

interface RecapVideo {
  id: string;
  title: string;
  duration: number;
  status: "generating" | "ready" | "failed";
  progress: number;
  thumbnail: string;
  url?: string;
  style: "energetic" | "cinematic" | "social" | "highlights";
  music: string;
  highlights: string[];
  createdAt: string;
  views: number;
  shares: number;
  nftMinted: boolean;
}

interface PhotoCollection {
  id: string;
  name: string;
  totalPhotos: number;
  bestShots: number;
  aiTagged: number;
  thumbnail: string;
  tags: string[];
  people: string[];
  moments: string[];
  qualityScore: number;
}

interface NFTMemoryAlbum {
  id: string;
  title: string;
  description: string;
  tokenId?: string;
  contractAddress?: string;
  price: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  assets: number;
  minted: boolean;
  mintDate?: string;
  owner?: string;
  metadata: {
    eventName: string;
    eventDate: string;
    totalAssets: number;
    highlights: string[];
    participants: number;
  };
}

export default function AIPartyMediaSuite() {
  const [selectedTab, setSelectedTab] = useState("recap-videos");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [autoEditSettings, setAutoEditSettings] = useState({
    musicSync: true,
    highlightDetection: true,
    faceRecognition: true,
    autoColorCorrection: true,
    stabilization: true
  });

  const { data: mediaAssets } = useQuery({
    queryKey: ["/api/media/assets"],
    refetchInterval: 30000,
  });

  const { data: recapVideos } = useQuery({
    queryKey: ["/api/media/recap-videos"],
    refetchInterval: 15000,
  });

  const { data: photoCollections } = useQuery({
    queryKey: ["/api/media/photo-collections"],
    refetchInterval: 30000,
  });

  const { data: nftAlbums } = useQuery({
    queryKey: ["/api/media/nft-albums"],
    refetchInterval: 60000,
  });

  // Mock data for demonstration
  const assets: MediaAsset[] = mediaAssets || [
    {
      id: "asset-1",
      type: "photo",
      url: "/api/placeholder-image",
      thumbnail: "/api/placeholder-thumb",
      timestamp: "2025-01-26T20:30:00Z",
      uploader: "Alex Chen",
      uploaderAvatar: "AC",
      size: 2.4,
      tags: ["dance", "group", "highlight"],
      aiAnalysis: {
        confidence: 0.95,
        people: ["Alex Chen", "Maya Rodriguez", "Jordan Kim"],
        emotions: ["joy", "excitement", "celebration"],
        highlights: ["perfect_lighting", "group_photo", "dance_moment"],
        quality: 0.92
      }
    },
    {
      id: "asset-2",
      type: "video",
      url: "/api/placeholder-video",
      thumbnail: "/api/placeholder-thumb",
      timestamp: "2025-01-26T21:15:00Z",
      uploader: "Maya Rodriguez",
      uploaderAvatar: "MR",
      duration: 45,
      size: 78.6,
      tags: ["dj", "crowd", "energy"],
      aiAnalysis: {
        confidence: 0.88,
        people: ["DJ Kollective", "Crowd"],
        emotions: ["energy", "excitement", "euphoria"],
        highlights: ["beat_drop", "crowd_reaction", "light_show"],
        quality: 0.89
      }
    },
    {
      id: "asset-3",
      type: "photo",
      url: "/api/placeholder-image",
      thumbnail: "/api/placeholder-thumb",
      timestamp: "2025-01-26T22:00:00Z",
      uploader: "Jordan Kim",
      uploaderAvatar: "JK",
      size: 3.1,
      tags: ["selfie", "friends", "memory"],
      aiAnalysis: {
        confidence: 0.91,
        people: ["Jordan Kim", "Casey Taylor", "Sam Wilson"],
        emotions: ["happiness", "friendship", "nostalgia"],
        highlights: ["perfect_selfie", "golden_hour", "group_bonding"],
        quality: 0.88
      }
    }
  ];

  const videos: RecapVideo[] = recapVideos || [
    {
      id: "recap-1",
      title: "Sunset Collective - Beach Festival Highlights",
      duration: 180,
      status: "ready",
      progress: 100,
      thumbnail: "/api/placeholder-thumb",
      url: "/api/placeholder-video",
      style: "cinematic",
      music: "Tropical House Vibes",
      highlights: ["DJ set opening", "Volleyball tournament", "Sunset moments", "Group celebrations"],
      createdAt: "2025-01-26T23:30:00Z",
      views: 247,
      shares: 34,
      nftMinted: false
    },
    {
      id: "recap-2",
      title: "Epic Dance Floor Moments",
      duration: 90,
      status: "generating",
      progress: 75,
      thumbnail: "/api/placeholder-thumb",
      style: "energetic",
      music: "Electronic Dance Mix",
      highlights: ["Beat drops", "Crowd reactions", "Light shows", "Dance competitions"],
      createdAt: "2025-01-26T23:45:00Z",
      views: 0,
      shares: 0,
      nftMinted: false
    },
    {
      id: "recap-3",
      title: "Behind the Scenes Magic",
      duration: 120,
      status: "ready",
      progress: 100,
      thumbnail: "/api/placeholder-thumb",
      url: "/api/placeholder-video",
      style: "social",
      music: "Chill Vibes Acoustic",
      highlights: ["Setup process", "Guest arrivals", "Vendor spotlights", "Candid moments"],
      createdAt: "2025-01-27T00:15:00Z",
      views: 156,
      shares: 21,
      nftMinted: true
    }
  ];

  const collections: PhotoCollection[] = photoCollections || [
    {
      id: "collection-1",
      name: "Golden Hour Magic",
      totalPhotos: 89,
      bestShots: 23,
      aiTagged: 89,
      thumbnail: "/api/placeholder-thumb",
      tags: ["sunset", "golden_hour", "portraits", "atmosphere"],
      people: ["Alex Chen", "Maya Rodriguez", "Jordan Kim", "Casey Taylor"],
      moments: ["Sunset silhouettes", "Beach portraits", "Group photos", "Candid laughs"],
      qualityScore: 0.94
    },
    {
      id: "collection-2",
      name: "Dance Floor Energy",
      totalPhotos: 156,
      bestShots: 42,
      aiTagged: 156,
      thumbnail: "/api/placeholder-thumb",
      tags: ["dance", "energy", "lights", "movement"],
      people: ["DJ Kollective", "Dance Crew", "Party Guests"],
      moments: ["Epic dance battles", "DJ reactions", "Crowd euphoria", "Light displays"],
      qualityScore: 0.87
    },
    {
      id: "collection-3",
      name: "Food & Friends",
      totalPhotos: 67,
      bestShots: 18,
      aiTagged: 67,
      thumbnail: "/api/placeholder-thumb",
      tags: ["food", "friends", "social", "memories"],
      people: ["Food enthusiasts", "Friend groups", "Vendors"],
      moments: ["Food presentations", "Group dinners", "Vendor interactions", "Taste reactions"],
      qualityScore: 0.82
    }
  ];

  const nftMemoryAlbums: NFTMemoryAlbum[] = nftAlbums || [
    {
      id: "nft-1",
      title: "Sunset Collective Genesis Event",
      description: "Complete digital memory album from our inaugural beach festival with exclusive moments and highlights",
      tokenId: "1001",
      contractAddress: "0x742d4e3c9d12a1b8f7e6c3a9",
      price: 0.15,
      rarity: "legendary",
      assets: 247,
      minted: true,
      mintDate: "2025-01-27T00:30:00Z",
      owner: "0x123abc7f9e8d6c5b4a3f2e1d",
      metadata: {
        eventName: "Sunset Collective Beach Festival",
        eventDate: "2025-01-26",
        totalAssets: 247,
        highlights: ["DJ Kollective set", "Beach volleyball", "Sunset moments", "Community celebrations"],
        participants: 156
      }
    },
    {
      id: "nft-2",
      title: "VIP Experience Collection",
      description: "Exclusive behind-the-scenes content and VIP moments from the event",
      price: 0.08,
      rarity: "epic",
      assets: 89,
      minted: false,
      metadata: {
        eventName: "Sunset Collective Beach Festival",
        eventDate: "2025-01-26",
        totalAssets: 89,
        highlights: ["VIP area access", "Artist meetups", "Exclusive performances", "Behind scenes"],
        participants: 34
      }
    },
    {
      id: "nft-3",
      title: "Dance Floor Chronicles",
      description: "High-energy collection capturing the best dance floor moments and music highlights",
      price: 0.05,
      rarity: "rare",
      assets: 134,
      minted: false,
      metadata: {
        eventName: "Sunset Collective Beach Festival",
        eventDate: "2025-01-26",
        totalAssets: 134,
        highlights: ["Beat drops", "Dance battles", "Crowd energy", "Light shows"],
        participants: 89
      }
    }
  ];

  const generateRecapVideo = (style: string, music: string) => {
    // Handle video generation
  };

  const mintNFTAlbum = (albumId: string) => {
    // Handle NFT minting
  };

  const shareContent = (type: string, id: string) => {
    // Handle content sharing
  };

  const downloadContent = (type: string, id: string) => {
    // Handle content download
  };

  useEffect(() => {
    // Simulate processing progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 10;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3">
            <Video className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">AI Party Media Suite</h1>
            <Sparkles className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Automatically create stunning recap videos, smart photo collections, and exclusive NFT memory albums
          </p>
        </div>

        {/* Processing Status */}
        <Card className="border-blue-500/20 bg-black/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              AI Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-green-900/30 border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">312</div>
                <div className="text-sm text-gray-400">Media Assets Processed</div>
                <div className="text-xs text-green-300 mt-1">✓ AI Analysis Complete</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-900/30 border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-400">3</div>
                <div className="text-sm text-gray-400">Recap Videos Generated</div>
                <div className="text-xs text-blue-300 mt-1">🎬 Auto-edited with music</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-900/30 border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400">1</div>
                <div className="text-sm text-gray-400">NFT Albums Minted</div>
                <div className="text-xs text-purple-300 mt-1">🏆 Legendary rarity</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card className="border-indigo-500/20 bg-black/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              AI Auto-Edit Settings
            </CardTitle>
            <CardDescription className="text-gray-400">
              Configure how AI processes your event media
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white font-medium">Music Sync</label>
                  <Switch 
                    checked={autoEditSettings.musicSync}
                    onCheckedChange={(checked) => setAutoEditSettings({...autoEditSettings, musicSync: checked})}
                  />
                </div>
                <p className="text-xs text-gray-400">Automatically sync video cuts to music beats</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white font-medium">Highlight Detection</label>
                  <Switch 
                    checked={autoEditSettings.highlightDetection}
                    onCheckedChange={(checked) => setAutoEditSettings({...autoEditSettings, highlightDetection: checked})}
                  />
                </div>
                <p className="text-xs text-gray-400">AI identifies best moments and reactions</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white font-medium">Face Recognition</label>
                  <Switch 
                    checked={autoEditSettings.faceRecognition}
                    onCheckedChange={(checked) => setAutoEditSettings({...autoEditSettings, faceRecognition: checked})}
                  />
                </div>
                <p className="text-xs text-gray-400">Smart photo tagging and organization</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white font-medium">Auto Color Correction</label>
                  <Switch 
                    checked={autoEditSettings.autoColorCorrection}
                    onCheckedChange={(checked) => setAutoEditSettings({...autoEditSettings, autoColorCorrection: checked})}
                  />
                </div>
                <p className="text-xs text-gray-400">Enhance lighting and color quality</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white font-medium">Video Stabilization</label>
                  <Switch 
                    checked={autoEditSettings.stabilization}
                    onCheckedChange={(checked) => setAutoEditSettings({...autoEditSettings, stabilization: checked})}
                  />
                </div>
                <p className="text-xs text-gray-400">Reduce shake and smooth footage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 border-purple-500/20">
            <TabsTrigger value="recap-videos" className="data-[state=active]:bg-purple-600">
              <Video className="h-4 w-4 mr-2" />
              Recap Videos
            </TabsTrigger>
            <TabsTrigger value="photo-collections" className="data-[state=active]:bg-blue-600">
              <Camera className="h-4 w-4 mr-2" />
              Photo Collections
            </TabsTrigger>
            <TabsTrigger value="nft-albums" className="data-[state=active]:bg-indigo-600">
              <Trophy className="h-4 w-4 mr-2" />
              NFT Albums
            </TabsTrigger>
            <TabsTrigger value="raw-assets" className="data-[state=active]:bg-green-600">
              <Tag className="h-4 w-4 mr-2" />
              Raw Assets
            </TabsTrigger>
          </TabsList>

          {/* Recap Videos Tab */}
          <TabsContent value="recap-videos" className="space-y-4">
            <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="h-5 w-5 text-purple-400" />
                  Auto-Generated Recap Videos
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI-edited highlight reels with music sync and top moments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <div key={video.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="relative mb-3">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge 
                            variant="outline"
                            className={`${
                              video.status === 'ready' ? 'text-green-400 border-green-400' :
                              video.status === 'generating' ? 'text-yellow-400 border-yellow-400' :
                              'text-red-400 border-red-400'
                            }`}
                          >
                            {video.status}
                          </Badge>
                        </div>
                        {video.status === 'generating' && (
                          <div className="absolute bottom-2 left-2 right-2">
                            <Progress value={video.progress} className="h-2" />
                            <div className="text-xs text-white mt-1">{video.progress}% processed</div>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-white font-bold text-sm mb-2">{video.title}</h3>
                      <p className="text-gray-400 text-xs mb-3">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')} • {video.style} style
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Music className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-blue-300">{video.music}</span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-1">Highlights:</div>
                        <div className="flex flex-wrap gap-1">
                          {video.highlights.slice(0, 2).map((highlight, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                          {video.highlights.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{video.highlights.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {video.status === 'ready' && (
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                          <span>{video.views} views</span>
                          <span>{video.shares} shares</span>
                          {video.nftMinted && <span className="text-purple-400">NFT Minted</span>}
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {video.status === 'ready' ? (
                          <>
                            <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => shareContent('video', video.id)}>
                              <Share2 className="h-3 w-3" />
                            </Button>
                            {!video.nftMinted && (
                              <Button size="sm" variant="outline" onClick={() => mintNFTAlbum(video.id)}>
                                <Trophy className="h-3 w-3" />
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button size="sm" disabled className="flex-1">
                            Processing...
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Video Generation */}
                <div className="mt-6 p-4 rounded-lg bg-gray-800/30 border border-gray-600">
                  <h4 className="text-white font-semibold mb-3">Generate New Recap Video</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Video Style</label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                        <option value="cinematic">Cinematic</option>
                        <option value="energetic">Energetic</option>
                        <option value="social">Social Media</option>
                        <option value="highlights">Highlights Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Music Genre</label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                        <option value="electronic">Electronic</option>
                        <option value="tropical">Tropical House</option>
                        <option value="acoustic">Acoustic</option>
                        <option value="hip-hop">Hip Hop</option>
                      </select>
                    </div>
                  </div>
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => generateRecapVideo("cinematic", "electronic")}>
                    Generate Recap Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photo Collections Tab */}
          <TabsContent value="photo-collections" className="space-y-4">
            <Card className="border-blue-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-400" />
                  Smart Photo Collections
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI-organized photo galleries with smart tagging and best shot selection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collections.map((collection) => (
                    <div key={collection.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex items-start gap-4">
                        <img 
                          src={collection.thumbnail}
                          alt={collection.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-white font-bold">{collection.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-green-400 flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                {Math.round(collection.qualityScore * 100)}%
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-blue-400">{collection.totalPhotos}</div>
                              <div className="text-xs text-gray-400">Total Photos</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-yellow-400">{collection.bestShots}</div>
                              <div className="text-xs text-gray-400">Best Shots</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-green-400">{collection.aiTagged}</div>
                              <div className="text-xs text-gray-400">AI Tagged</div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-xs text-gray-400 mb-1">Tagged People:</div>
                            <div className="flex flex-wrap gap-1">
                              {collection.people.slice(0, 3).map((person, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {person}
                                </Badge>
                              ))}
                              {collection.people.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{collection.people.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-xs text-gray-400 mb-1">Key Moments:</div>
                            <div className="flex flex-wrap gap-1">
                              {collection.moments.slice(0, 2).map((moment, index) => (
                                <Badge key={index} variant="outline" className="text-xs text-blue-300 border-blue-300">
                                  {moment}
                                </Badge>
                              ))}
                              {collection.moments.length > 2 && (
                                <Badge variant="outline" className="text-xs text-blue-300 border-blue-300">
                                  +{collection.moments.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Download className="h-3 w-3 mr-1" />
                              Download Collection
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => shareContent('collection', collection.id)}>
                              <Share2 className="h-3 w-3 mr-1" />
                              Share
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trophy className="h-3 w-3 mr-1" />
                              Create NFT
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFT Albums Tab */}
          <TabsContent value="nft-albums" className="space-y-4">
            <Card className="border-indigo-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-indigo-400" />
                  NFT Memory Albums
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Mint exclusive digital keepsakes with party highlights and memories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nftMemoryAlbums.map((nft) => (
                    <div key={nft.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="mb-3">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-bold text-sm">{nft.title}</h3>
                          <Badge 
                            variant="outline"
                            className={`text-xs ${
                              nft.rarity === 'legendary' ? 'text-yellow-400 border-yellow-400' :
                              nft.rarity === 'epic' ? 'text-purple-400 border-purple-400' :
                              nft.rarity === 'rare' ? 'text-blue-400 border-blue-400' :
                              'text-gray-400 border-gray-400'
                            }`}
                          >
                            {nft.rarity}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-xs mb-3">{nft.description}</p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Assets:</span>
                          <span className="text-white">{nft.assets}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Participants:</span>
                          <span className="text-white">{nft.metadata.participants}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Price:</span>
                          <span className="text-green-400">{nft.price} ETH</span>
                        </div>
                        {nft.minted && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Token ID:</span>
                            <span className="text-purple-400">#{nft.tokenId}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-1">Highlights:</div>
                        <div className="flex flex-wrap gap-1">
                          {nft.metadata.highlights.slice(0, 2).map((highlight, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                          {nft.metadata.highlights.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{nft.metadata.highlights.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {nft.minted ? (
                          <>
                            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                              <Trophy className="h-3 w-3 mr-1" />
                              View on OpenSea
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => mintNFTAlbum(nft.id)}>
                              <Trophy className="h-3 w-3 mr-1" />
                              Mint NFT
                            </Button>
                            <Button size="sm" variant="outline">
                              Preview
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Raw Assets Tab */}
          <TabsContent value="raw-assets" className="space-y-4">
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Tag className="h-5 w-5 text-green-400" />
                  AI-Analyzed Media Assets
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Individual photos and videos with smart tags and quality scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assets.map((asset) => (
                    <div key={asset.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="relative mb-3">
                        <img 
                          src={asset.thumbnail}
                          alt="Media asset"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            {asset.type}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="bg-black/70 rounded px-2 py-1 text-xs text-white">
                            {Math.round(asset.aiAnalysis.quality * 100)}%
                          </div>
                        </div>
                        {asset.duration && (
                          <div className="absolute bottom-2 right-2">
                            <div className="bg-black/70 rounded px-2 py-1 text-xs text-white">
                              {asset.duration}s
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-green-600">
                              {asset.uploaderAvatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white text-sm">{asset.uploader}</span>
                          <span className="text-gray-400 text-xs">{asset.size}MB</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(asset.timestamp).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-1">AI Detected:</div>
                        <div className="flex flex-wrap gap-1">
                          {asset.aiAnalysis.people.slice(0, 2).map((person, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {person}
                            </Badge>
                          ))}
                          {asset.aiAnalysis.people.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{asset.aiAnalysis.people.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-1">Tags:</div>
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-green-300 border-green-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-1">Emotions:</div>
                        <div className="flex flex-wrap gap-1">
                          {asset.aiAnalysis.emotions.slice(0, 3).map((emotion, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-yellow-300 border-yellow-300">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}