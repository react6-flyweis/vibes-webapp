import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Heart, Users, Sparkles, UserPlus, Trash2, Video, Calendar, Clock, Globe, UserCheck, MessageSquare, Share2, Download, Settings, BarChart3, Play, Pause, Camera, DollarSign, Shield, Wallet, QrCode, Crown, Gavel, CreditCard, Smartphone, Coins, Receipt, Vote, Lock, AlertTriangle, Target, Award, TrendingUp, Plus, CheckCircle, Zap, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function GuestMatchmaking() {
  const [guests, setGuests] = useState([
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      interests: "photography, hiking, craft beer",
      personality: "creative, adventurous",
      role: "participant",
      status: "confirmed",
      joinedAt: null
    },
    {
      id: 2,
      name: "Mike Rodriguez", 
      email: "mike.rodriguez@example.com",
      interests: "photography, travel, cooking",
      personality: "artistic, outgoing",
      role: "participant",
      status: "pending",
      joinedAt: null
    }
  ]);
  const [matches, setMatches] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [currentMeeting, setCurrentMeeting] = useState<any>(null);
  const [bulkImportText, setBulkImportText] = useState("");
  const [meetingConfig, setMeetingConfig] = useState({
    title: "",
    description: "",
    maxParticipants: 500,
    requireApproval: false,
    enableBreakoutRooms: true,
    recordMeeting: false,
    allowScreenShare: true,
    enableChat: true,
    meetingType: "large-scale"
  });
  const { toast } = useToast();

  const generateMatches = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/ai/guest-matchmaking', 'POST', { guests });
      return response;
    },
    onSuccess: (data) => {
      setMatches(data);
      toast({
        title: "AI Matchmaking Complete",
        description: "Found intelligent connections for your participants."
      });
    },
    onError: () => {
      toast({
        title: "Matchmaking Error",
        description: "Please try again with updated participant information.",
        variant: "destructive"
      });
    }
  });

  const createMeeting = useMutation({
    mutationFn: async (meetingData: any) => {
      const response = await apiRequest('/api/meetings/create', 'POST', meetingData);
      return response;
    },
    onSuccess: (data) => {
      setMeetings(prev => [...prev, data]);
      setCurrentMeeting(data);
      toast({
        title: "Meeting Created",
        description: `Large-scale meeting created for ${guests.length} participants.`
      });
    },
    onError: () => {
      toast({
        title: "Meeting Creation Failed",
        description: "Please check your meeting configuration and try again.",
        variant: "destructive"
      });
    }
  });

  const handleGenerateMatches = () => {
    if (guests.length < 2) {
      toast({
        title: "Add More Participants",
        description: "You need at least 2 participants for AI matchmaking.",
        variant: "destructive"
      });
      return;
    }
    generateMatches.mutate();
  };

  const handleCreateMeeting = () => {
    if (!meetingConfig.title.trim()) {
      toast({
        title: "Meeting Title Required",
        description: "Please enter a title for your meeting.",
        variant: "destructive"
      });
      return;
    }
    if (guests.length === 0) {
      toast({
        title: "No Participants",
        description: "Please add participants to your meeting.",
        variant: "destructive"
      });
      return;
    }
    
    const meetingData = {
      ...meetingConfig,
      participants: guests,
      scheduledFor: new Date().toISOString(),
      status: "scheduled"
    };
    
    createMeeting.mutate(meetingData);
  };

  const addGuest = () => {
    const newId = Math.max(...guests.map(g => g.id || 0)) + 1;
    setGuests([...guests, { 
      id: newId,
      name: "", 
      email: "",
      interests: "", 
      personality: "",
      role: "participant",
      status: "pending",
      joinedAt: null
    }]);
  };

  const updateGuest = (index: number, field: string, value: string) => {
    const updated = [...guests];
    updated[index] = { ...updated[index], [field]: value };
    setGuests(updated);
  };

  const removeGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleBulkImport = () => {
    if (!bulkImportText.trim()) return;
    
    const lines = bulkImportText.split('\n').filter(line => line.trim());
    const newGuests = lines.map((line, index) => {
      const parts = line.split(',').map(p => p.trim());
      const newId = Math.max(...guests.map(g => g.id || 0)) + index + 1;
      
      return {
        id: newId,
        name: parts[0] || `Participant ${newId}`,
        email: parts[1] || "",
        interests: parts[2] || "",
        personality: parts[3] || "",
        role: "participant",
        status: "pending",
        joinedAt: null
      };
    });
    
    setGuests([...guests, ...newGuests]);
    setBulkImportText("");
    toast({
      title: "Participants Imported",
      description: `Added ${newGuests.length} participants to the meeting.`
    });
  };

  const exportParticipants = () => {
    const csvContent = guests.map(g => 
      `${g.name},${g.email},${g.interests},${g.personality},${g.status}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participants.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const updateMeetingConfig = (field: string, value: any) => {
    setMeetingConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Video className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Large-Scale Meeting Management
            </h1>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Host meetings with hundreds of participants. Manage registrations, create breakout groups, and facilitate meaningful connections at scale.
          </p>
        </div>

        <Tabs defaultValue="participants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="participants">Participants ({guests.length})</TabsTrigger>
            <TabsTrigger value="meeting-setup">Meeting Setup</TabsTrigger>
            <TabsTrigger value="matchmaking">AI Matchmaking</TabsTrigger>
            <TabsTrigger value="live-meeting">Live Meeting</TabsTrigger>
            <TabsTrigger value="finance">Finance Hub</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Participants Management Tab */}
          <TabsContent value="participants" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Participant Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {guests.map((guest, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Participant {index + 1}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={guest.status === 'confirmed' ? 'default' : 'secondary'}>
                            {guest.status}
                          </Badge>
                          {guests.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeGuest(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Full name"
                          value={guest.name}
                          onChange={(e) => updateGuest(index, "name", e.target.value)}
                        />
                        <Input
                          placeholder="Email address"
                          type="email"
                          value={guest.email}
                          onChange={(e) => updateGuest(index, "email", e.target.value)}
                        />
                        <Input
                          placeholder="Interests (e.g., music, art, travel)"
                          value={guest.interests}
                          onChange={(e) => updateGuest(index, "interests", e.target.value)}
                        />
                        <Select value={guest.role} onValueChange={(value) => updateGuest(index, "role", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="participant">Participant</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="presenter">Presenter</SelectItem>
                            <SelectItem value="organizer">Organizer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button onClick={addGuest} variant="outline" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add Participant
                    </Button>
                    <Button onClick={exportParticipants} variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export List
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Bulk Import
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste participant data (CSV format):&#10;Name, Email, Interests, Role&#10;John Doe, john@example.com, music tech, participant&#10;Jane Smith, jane@example.com, art design, moderator"
                    value={bulkImportText}
                    onChange={(e) => setBulkImportText(e.target.value)}
                    rows={8}
                  />
                  <Button onClick={handleBulkImport} className="w-full">
                    Import Participants
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Quick Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Participants:</span>
                        <Badge>{guests.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Confirmed:</span>
                        <Badge variant="default">{guests.filter(g => g.status === 'confirmed').length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <Badge variant="secondary">{guests.filter(g => g.status === 'pending').length}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Meeting Setup Tab */}
          <TabsContent value="meeting-setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Meeting Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Meeting Title</label>
                      <Input
                        placeholder="Enter meeting title"
                        value={meetingConfig.title}
                        onChange={(e) => updateMeetingConfig("title", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        placeholder="Describe your meeting objectives and agenda"
                        value={meetingConfig.description}
                        onChange={(e) => updateMeetingConfig("description", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Max Participants</label>
                      <Select value={meetingConfig.maxParticipants.toString()} onValueChange={(value) => updateMeetingConfig("maxParticipants", parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50 participants</SelectItem>
                          <SelectItem value="100">100 participants</SelectItem>
                          <SelectItem value="250">250 participants</SelectItem>
                          <SelectItem value="500">500 participants</SelectItem>
                          <SelectItem value="1000">1000 participants</SelectItem>
                          <SelectItem value="2500">2500 participants</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Meeting Features</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={meetingConfig.enableBreakoutRooms}
                            onChange={(e) => updateMeetingConfig("enableBreakoutRooms", e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">Enable Breakout Rooms</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={meetingConfig.recordMeeting}
                            onChange={(e) => updateMeetingConfig("recordMeeting", e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">Record Meeting</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={meetingConfig.allowScreenShare}
                            onChange={(e) => updateMeetingConfig("allowScreenShare", e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">Allow Screen Sharing</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={meetingConfig.enableChat}
                            onChange={(e) => updateMeetingConfig("enableChat", e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">Enable Chat</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={meetingConfig.requireApproval}
                            onChange={(e) => updateMeetingConfig("requireApproval", e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">Require Host Approval</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button onClick={handleCreateMeeting} disabled={createMeeting.isPending} className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    {createMeeting.isPending ? "Creating Meeting..." : "Create Large-Scale Meeting"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Matchmaking Tab */}
          <TabsContent value="matchmaking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI-Powered Participant Matching
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Button 
                    onClick={handleGenerateMatches} 
                    disabled={generateMatches.isPending || guests.length < 2}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {generateMatches.isPending ? "Analyzing..." : "Generate AI Matches"}
                  </Button>
                  <span className="text-sm text-gray-600">
                    AI will analyze interests, personalities, and roles to suggest optimal connections
                  </span>
                </div>

                {matches.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Suggested Connections</h3>
                    <div className="grid gap-4">
                      {matches.map((match, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-linear-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-4 w-4 text-pink-600" />
                            <span className="font-medium">Connection Match</span>
                            <Badge variant="secondary">AI Suggested</Badge>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>{match.guest1}</strong> and <strong>{match.guest2}</strong>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {match.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Meeting Tab */}
          <TabsContent value="live-meeting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Meeting Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentMeeting ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <h3 className="font-medium text-green-800 dark:text-green-200">Meeting Active</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">{currentMeeting.title}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Pause className="h-4 w-4" />
                          Pause Meeting
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          Start Recording
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Create Breakout Rooms
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No active meeting. Create a meeting to start.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Live Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>12 participants joined</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Breakout rooms created</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Screen sharing started</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Participation Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Registered</span>
                      <Badge>{guests.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Attendance Rate</span>
                      <Badge variant="default">85%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Session Time</span>
                      <Badge variant="secondary">45 min</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Chat Messages</span>
                      <Badge>347</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Screen Shares</span>
                      <Badge variant="default">12</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Breakout Participation</span>
                      <Badge variant="secondary">78%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Global Reach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Countries</span>
                      <Badge>23</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Time Zones</span>
                      <Badge variant="default">8</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Languages</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Finance Hub Tab - VibeLedger Integration */}
          <TabsContent value="finance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                      <Users className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Community Members</p>
                      <p className="text-2xl font-bold">{guests.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
                      <Wallet className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Treasury Balance</p>
                      <p className="text-2xl font-bold">$15,750</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Collection Rate</p>
                      <p className="text-2xl font-bold">94.2%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Vote className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Proposals</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Member Finance Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Member Finance Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {guests.map((guest, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                            {guest.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold">{guest.name}</h3>
                            <p className="text-sm text-gray-600">{guest.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={guest.status === 'confirmed' ? 'default' : 'destructive'}>
                            {guest.status === 'confirmed' ? 'Paid' : 'Pending'}
                          </Badge>
                          <Badge variant="outline">VTC-00{index + 1}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Reputation Score</p>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">9{index}</span>
                            <Award className="h-4 w-4 text-yellow-500" />
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Contributions</p>
                          <span className="font-semibold">${(index + 1) * 500}</span>
                        </div>
                        <div>
                          <p className="text-gray-600">Fines Owed</p>
                          <span className="font-semibold text-green-600">$0</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Gavel className="h-4 w-4 mr-1" />
                          Issue Fine
                        </Button>
                        <Button size="sm" variant="outline">
                          <Crown className="h-4 w-4 mr-1" />
                          View NFT
                        </Button>
                        <Button size="sm" variant="outline">
                          <Receipt className="h-4 w-4 mr-1" />
                          Payment History
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment & Treasury Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payment & Treasury Hub
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <CreditCard className="h-6 w-6 mb-2" />
                      <span>Credit/Debit</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Coins className="h-6 w-6 mb-2" />
                      <span>Crypto Wallet</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Smartphone className="h-6 w-6 mb-2" />
                      <span>Apple Pay</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <QrCode className="h-6 w-6 mb-2" />
                      <span>QR Payment</span>
                    </Button>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Treasury Health</span>
                      <Badge variant="default">Excellent</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Collected</span>
                        <span>$15,750</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pending Payments</span>
                        <span>$3,250</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Monthly Expenses</span>
                        <span>$2,840</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full">
                      <Receipt className="h-4 w-4 mr-2" />
                      Collect Membership Dues
                    </Button>
                    <Button variant="outline" className="w-full">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Send Payment Reminders
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      View Blockchain Records
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Governance & Voting */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5" />
                    Community Governance & Proposals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Increase Event Budget for 2025</h3>
                        <p className="text-sm text-gray-600 mt-1">Allocate additional $5,000 for premium venue bookings and enhanced member experiences</p>
                        <p className="text-xs text-gray-500 mt-2">Proposed by Sarah Chen</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Votes For: 89</span>
                            <span>Votes Against: 23</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '79%' }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span>Quorum: 112/50 members voted</span>
                        <span>Deadline: Dec 20, 2024</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Target className="h-4 w-4 mr-1" />
                          Vote For
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Target className="h-4 w-4 mr-1" />
                          Vote Against
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">New Member Onboarding Fee</h3>
                        <p className="text-sm text-gray-600 mt-1">Implement $100 one-time processing fee for new member registrations</p>
                        <p className="text-xs text-gray-500 mt-2">Proposed by Mike Rodriguez</p>
                      </div>
                      <Badge variant="secondary">Under Review</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Votes For: 45</span>
                            <span>Votes Against: 67</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span>Quorum: 112/50 members voted</span>
                        <span>Deadline: Dec 25, 2024</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Target className="h-4 w-4 mr-1" />
                          Vote For
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Target className="h-4 w-4 mr-1" />
                          Vote Against
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Vote className="h-4 w-4 mr-2" />
                    Create New Proposal
                  </Button>
                </CardContent>
              </Card>

              {/* Attendance & Check-in */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Attendance Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-16 flex-col">
                      <QrCode className="h-6 w-6 mb-1" />
                      <span>QR Code</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col">
                      <Smartphone className="h-6 w-6 mb-1" />
                      <span>NFC Tag</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col">
                      <UserCheck className="h-6 w-6 mb-1" />
                      <span>Manual</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col">
                      <Video className="h-6 w-6 mb-1" />
                      <span>Auto Track</span>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Recent Meeting</span>
                        <Badge variant="default">98% Attendance</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Monthly Tech Talk</span>
                          <span>198/200</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-in Method</span>
                          <span>QR Code</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Blockchain Records</span>
                        <Badge variant="default">Verified</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Sync</span>
                        <span className="text-gray-600">2 min ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics & Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Finance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                      <p className="text-xs text-green-700 dark:text-green-400">Revenue Growth</p>
                      <p className="font-bold text-green-800 dark:text-green-300">+12%</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
                      <p className="text-xs text-blue-700 dark:text-blue-400">Member Satisfaction</p>
                      <p className="font-bold text-blue-800 dark:text-blue-300">94%</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Payment Compliance</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-[94%] h-2 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-sm">94%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Member Engagement</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-[89%] h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <span className="text-sm">89%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-300">AI Insight</span>
                    </div>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      Optimal time to introduce premium membership tier
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Finance Hub Tab - VibeLedger Integration */}
          <TabsContent value="finance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Group Treasury Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-green-600 dark:text-green-400 text-sm font-medium">Total Balance</div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">$12,450</div>
                      <div className="text-xs text-green-600 dark:text-green-400">+$750 this month</div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Active Members</div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{guests.length}</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">Paying members</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Recent Transactions</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {[
                        { type: 'contribution', member: 'Sarah Johnson', amount: '+$50', time: '2 hours ago', status: 'confirmed' },
                        { type: 'expense', description: 'Event Catering', amount: '-$320', time: '1 day ago', status: 'paid' },
                        { type: 'contribution', member: 'Mike Chen', amount: '+$75', time: '2 days ago', status: 'confirmed' },
                        { type: 'fine', member: 'Alex Kim', amount: '-$25', time: '3 days ago', status: 'pending' }
                      ].map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              transaction.type === 'contribution' ? 'bg-green-100 text-green-600' :
                              transaction.type === 'expense' ? 'bg-red-100 text-red-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {transaction.type === 'contribution' ? '+' : 
                               transaction.type === 'expense' ? '-' : '!'}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {transaction.member || transaction.description}
                              </p>
                              <p className="text-xs text-gray-500">{transaction.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount}
                            </p>
                            <Badge variant={transaction.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Request Funds
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Member Finance Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {guests.map((guest, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {guest.name?.charAt(0) || 'G'}
                          </div>
                          <div>
                            <p className="font-medium">{guest.name || `Guest ${index + 1}`}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                Reputation: {Math.floor(Math.random() * 100) + 850}
                              </Badge>
                              {Math.random() > 0.7 && (
                                <Badge variant="default" className="text-xs bg-yellow-500">
                                  NFT Member
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              guest.paymentStatus === 'paid' ? 'bg-green-500' :
                              guest.paymentStatus === 'pending' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            <span className="text-sm font-medium">
                              ${Math.floor(Math.random() * 200) + 50}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {guest.paymentStatus === 'paid' ? 'Up to date' :
                             guest.paymentStatus === 'pending' ? 'Payment due' :
                             'Overdue'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5" />
                    Governance Proposals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { title: 'Increase Event Budget', votes: 12, total: 18, status: 'active' },
                      { title: 'Add New Venue Option', votes: 8, total: 18, status: 'active' },
                      { title: 'Update Payment Terms', votes: 15, total: 18, status: 'passed' }
                    ].map((proposal, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{proposal.title}</h4>
                          <Badge variant={proposal.status === 'passed' ? 'default' : 'secondary'}>
                            {proposal.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{proposal.votes}/{proposal.total} votes</span>
                            <span>{Math.round((proposal.votes / proposal.total) * 100)}%</span>
                          </div>
                          <Progress value={(proposal.votes / proposal.total) * 100} className="h-2" />
                        </div>
                        {proposal.status === 'active' && (
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" className="flex-1">For</Button>
                            <Button size="sm" variant="outline" className="flex-1">Against</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Proposal
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">Credit/Debit Cards</span>
                        <Badge variant="default" className="text-xs">Active</Badge>
                      </div>
                      <p className="text-xs text-gray-600">Visa, Mastercard, American Express</p>
                    </div>
                    
                    <div className="p-3 border rounded-lg bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-sm">Crypto Wallets</span>
                        <Badge variant="outline" className="text-xs">Available</Badge>
                      </div>
                      <p className="text-xs text-gray-600">ETH, BTC, USDC, and more</p>
                    </div>

                    <div className="p-3 border rounded-lg bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Smartphone className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm">Mobile Payments</span>
                        <Badge variant="default" className="text-xs">Active</Badge>
                      </div>
                      <p className="text-xs text-gray-600">Apple Pay, Google Pay, Venmo</p>
                    </div>

                    <div className="p-3 border rounded-lg bg-linear-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <QrCode className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-sm">QR Code Payments</span>
                        <Badge variant="outline" className="text-xs">Setup</Badge>
                      </div>
                      <p className="text-xs text-gray-600">Instant mobile scanning</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Payment Methods
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Blockchain Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm text-green-700 dark:text-green-300">Multi-Sig Wallet</span>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400">3 of 5 signatures required</p>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm text-blue-700 dark:text-blue-300">Smart Contracts</span>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Automated escrow & milestones</p>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-sm text-purple-700 dark:text-purple-300">NFT Memberships</span>
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400">Exclusive access & benefits</p>
                    </div>

                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-sm text-yellow-700 dark:text-yellow-300">Reputation System</span>
                      </div>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">On-chain trust scoring</p>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Blockchain Explorer
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Financial Analytics & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-700 dark:text-blue-300">Monthly Growth</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">+18.5%</div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Compared to last month</p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-700 dark:text-green-300">Average Contribution</span>
                    </div>
                    <div className="text-2xl font-bold text-green-800 dark:text-green-200">$87</div>
                    <p className="text-sm text-green-600 dark:text-green-400">Per member per month</p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-purple-700 dark:text-purple-300">Payment Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">94%</div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">On-time payments</p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-700 dark:text-orange-300">Next Event</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">$2,100</div>
                    <p className="text-sm text-orange-600 dark:text-orange-400">Budget allocated</p>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-4">VibeLedger Integration Status</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-green-600 dark:text-green-400 font-semibold">Treasury</div>
                      <div className="text-green-700 dark:text-green-300">✓ Active</div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-blue-600 dark:text-blue-400 font-semibold">Payments</div>
                      <div className="text-blue-700 dark:text-blue-300">✓ Multi-channel</div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="text-purple-600 dark:text-purple-400 font-semibold">Governance</div>
                      <div className="text-purple-700 dark:text-purple-300">✓ DAO Ready</div>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="text-yellow-600 dark:text-yellow-400 font-semibold">Blockchain</div>
                      <div className="text-yellow-700 dark:text-yellow-300">✓ Secured</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}