import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Camera,
  Users,
  MessageCircle,
  Heart,
  Gift,
  Share2,
  Download,
  Settings,
  Monitor,
  Smartphone,
  Eye,
  Volume2,
  Zap,
  TrendingUp,
  Clock,
  DollarSign
} from "lucide-react";

interface LiveStreamMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'chat' | 'reaction' | 'donation' | 'join';
  amount?: number;
}

interface StreamAnalytics {
  viewers: number;
  peakViewers: number;
  totalDonations: number;
  engagementRate: number;
  averageWatchTime: number;
  topReactions: Array<{ emoji: string; count: number }>;
}

interface LivePoll {
  id: string;
  question: string;
  options: Array<{ text: string; votes: number }>;
  isActive: boolean;
  totalVotes: number;
}

export default function LivestreamCompanion() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamMode, setStreamMode] = useState<'virtual' | 'hybrid' | 'behind-scenes'>('virtual');
  const [chatMessages, setChatMessages] = useState<LiveStreamMessage[]>([
    {
      id: '1',
      username: 'PartyLover23',
      message: 'This party looks amazing! 🎉',
      timestamp: new Date(),
      type: 'chat'
    },
    {
      id: '2',
      username: 'EventFan',
      message: 'Love the decorations!',
      timestamp: new Date(),
      type: 'chat'
    },
    {
      id: '3',
      username: 'GenerousGuest',
      message: 'donated $25',
      timestamp: new Date(),
      type: 'donation',
      amount: 25
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [activePoll, setActivePoll] = useState<LivePoll>({
    id: '1',
    question: 'What song should we play next?',
    options: [
      { text: 'Dancing Queen', votes: 12 },
      { text: 'Uptown Funk', votes: 8 },
      { text: 'Can\'t Stop the Feeling', votes: 15 },
      { text: 'Happy', votes: 6 }
    ],
    isActive: true,
    totalVotes: 41
  });
  const [streamAnalytics, setStreamAnalytics] = useState<StreamAnalytics>({
    viewers: 47,
    peakViewers: 52,
    totalDonations: 125,
    engagementRate: 78,
    averageWatchTime: 12.5,
    topReactions: [
      { emoji: '🎉', count: 23 },
      { emoji: '❤️', count: 18 },
      { emoji: '🔥', count: 15 },
      { emoji: '👏', count: 12 }
    ]
  });
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate real-time updates
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        // Update viewer count
        setStreamAnalytics(prev => ({
          ...prev,
          viewers: Math.max(20, prev.viewers + Math.floor(Math.random() * 6 - 2)),
          engagementRate: Math.max(50, Math.min(100, prev.engagementRate + Math.floor(Math.random() * 10 - 5)))
        }));

        // Add random chat messages
        if (Math.random() > 0.7) {
          const randomMessages = [
            'Great party vibes! 🎊',
            'Can we get a tour?',
            'The music is perfect!',
            'Wish I was there!',
            'Amazing decorations! ✨',
            'This is so fun to watch!'
          ];
          const randomUsernames = ['Guest123', 'PartyWatcher', 'EventFan42', 'Celebrator', 'VibeMaster'];
          
          const newMsg: LiveStreamMessage = {
            id: Math.random().toString(36),
            username: randomUsernames[Math.floor(Math.random() * randomUsernames.length)],
            message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
            timestamp: new Date(),
            type: 'chat'
          };
          
          setChatMessages(prev => [...prev.slice(-20), newMsg]);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  const startStream = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: cameraEnabled, 
          audio: micEnabled 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
      setIsStreaming(true);
      toast({
        title: "Stream Started",
        description: "You're now live! Share the link with your guests.",
      });
    } catch (error) {
      toast({
        title: "Camera Access Required",
        description: "Please allow camera access to start streaming.",
        variant: "destructive"
      });
    }
  };

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsStreaming(false);
    toast({
      title: "Stream Ended",
      description: "Your livestream has been stopped.",
    });
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: LiveStreamMessage = {
        id: Math.random().toString(36),
        username: 'Host',
        message: newMessage,
        timestamp: new Date(),
        type: 'chat'
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage("");
    }
  };

  const votePoll = (optionIndex: number) => {
    setActivePoll(prev => ({
      ...prev,
      options: prev.options.map((option, idx) => 
        idx === optionIndex 
          ? { ...option, votes: option.votes + 1 }
          : option
      ),
      totalVotes: prev.totalVotes + 1
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <Video className="inline-block mr-3 h-10 w-10 text-red-600" />
          Livestream Party Companion
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Bring your events to life with interactive livestreaming. Connect virtual and in-person guests, 
          engage with real-time chat, polls, and create memorable shared experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stream Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stream Controls */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Video className="mr-2 h-6 w-6" />
                  Live Stream
                  {isStreaming && <Badge className="ml-2 bg-red-500 text-white animate-pulse">LIVE</Badge>}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {isStreaming ? `${streamAnalytics.viewers} viewers` : 'Not streaming'}
                  </span>
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={streamMode} onValueChange={(value) => setStreamMode(value as any)}>
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="virtual">Virtual Event</TabsTrigger>
                  <TabsTrigger value="hybrid">Hybrid Event</TabsTrigger>
                  <TabsTrigger value="behind-scenes">Behind Scenes</TabsTrigger>
                </TabsList>

                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                  {isStreaming ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center">
                        <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Stream Preview</p>
                        <p className="text-sm opacity-75">Click Start Stream to go live</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Stream Overlay */}
                  {isStreaming && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-end">
                        <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                          <div className="text-sm font-semibold">Jordan's Birthday Party</div>
                          <div className="text-xs opacity-75">{streamAnalytics.viewers} watching</div>
                        </div>
                        <div className="flex gap-2">
                          {streamAnalytics.topReactions.slice(0, 3).map((reaction, idx) => (
                            <div key={idx} className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                              {reaction.emoji} {reaction.count}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={cameraEnabled ? () => setCameraEnabled(false) : () => setCameraEnabled(true)}
                    variant={cameraEnabled ? "default" : "destructive"}
                    size="sm"
                  >
                    {cameraEnabled ? <Camera className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={micEnabled ? () => setMicEnabled(false) : () => setMicEnabled(true)}
                    variant={micEnabled ? "default" : "destructive"}
                    size="sm"
                  >
                    {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={isStreaming ? stopStream : startStream}
                    variant={isStreaming ? "destructive" : "default"}
                    className="px-6"
                  >
                    {isStreaming ? 'Stop Stream' : 'Start Stream'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                <TabsContent value="virtual" className="mt-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <h4 className="font-semibold mb-2">Virtual Event Mode</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Perfect for online-only events. Share your screen, host virtual activities, 
                      and interact with remote guests through chat and polls.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="hybrid" className="mt-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                    <h4 className="font-semibold mb-2">Hybrid Event Mode</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Connect in-person and virtual guests. Stream the live event while 
                      allowing online participants to interact and feel included.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="behind-scenes" className="mt-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                    <h4 className="font-semibold mb-2">Behind the Scenes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Give guests exclusive access to party prep, setup, and candid moments. 
                      Create buzz and excitement before the main event.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Live Poll */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-6 w-6" />
                Live Poll
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">{activePoll.question}</h4>
                <div className="space-y-2">
                  {activePoll.options.map((option, idx) => {
                    const percentage = activePoll.totalVotes > 0 ? (option.votes / activePoll.totalVotes) * 100 : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => votePoll(idx)}
                            className="flex-1 justify-start"
                          >
                            {option.text}
                          </Button>
                          <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                            {option.votes} votes
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total votes: {activePoll.totalVotes}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stream Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Zap className="mr-2 h-5 w-5" />
                Live Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{streamAnalytics.viewers}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Current Viewers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{streamAnalytics.peakViewers}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Peak Viewers</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Engagement Rate</span>
                  <span>{streamAnalytics.engagementRate}%</span>
                </div>
                <Progress value={streamAnalytics.engagementRate} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Avg. Watch Time</span>
                  <span>{streamAnalytics.averageWatchTime} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Donations</span>
                  <span>${streamAnalytics.totalDonations}</span>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">Top Reactions</div>
                <div className="flex gap-2">
                  {streamAnalytics.topReactions.map((reaction, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-lg">{reaction.emoji}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">{reaction.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <Card className="flex flex-col h-96">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <MessageCircle className="mr-2 h-5 w-5" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {message.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate">{message.username}</span>
                        {message.type === 'donation' && (
                          <Badge className="bg-yellow-500 text-white text-xs">
                            <DollarSign className="h-3 w-3 mr-1" />
                            ${message.amount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={sendMessage}>
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="mr-2 h-4 w-4" />
                Share Stream Link
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download Recording
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Heart className="mr-2 h-4 w-4" />
                Send Reaction
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Gift className="mr-2 h-4 w-4" />
                Enable Donations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}