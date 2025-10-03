import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Users,
  Video,
  DollarSign,
  BarChart3,
  Settings,
  UserCheck,
  Clock,
  TrendingUp,
  Award,
  CreditCard,
  Bell,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Share2,
  Filter,
  Play,
  Pause,
  Camera,
  Shield,
  Coins,
  Smartphone,
  QrCode,
  Vote,
  Gavel,
  Wallet,
  Zap,
  Target,
  Lock,
  Brain,
  Palette,
  Heart,
  Lightbulb,
  Mic,
  MicOff,
  ScreenShare,
  Monitor,
  Headphones,
  UserPlus,
  Crown,
  ClipboardList,
  Calendar as CalendarIcon,
  Hash,
  Layers,
  Star,
  UserMinus,
  Smile,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  Activity,
  PieChart,
  LineChart,
  BarChart2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function VirtualMeetingPlatform() {
  const { toast } = useToast();

  // Subgroup management state
  const [showCreateSubgroup, setShowCreateSubgroup] = useState(false);
  const [showSubgroupManagement, setShowSubgroupManagement] = useState(false);
  const [subgroups, setSubgroups] = useState([]);
  const [selectedSubgroup, setSelectedSubgroup] = useState(null);

  // New features state
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [userEngagementScore, setUserEngagementScore] = useState(85);
  const [teamPerformanceData, setTeamPerformanceData] = useState({
    productivity: 92,
    collaboration: 88,
    attendance: 94,
    satisfaction: 86,
  });
  const [availableMembers, setAvailableMembers] = useState([
    { id: 1, name: "Sarah Chen", email: "sarah@example.com", role: "member" },
    { id: 2, name: "Mike Johnson", email: "mike@example.com", role: "member" },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@example.com",
      role: "moderator",
    },
    { id: 4, name: "David Wilson", email: "david@example.com", role: "member" },
    {
      id: 5,
      name: "Lisa Martinez",
      email: "lisa@example.com",
      role: "treasurer",
    },
  ]);
  const [newSubgroup, setNewSubgroup] = useState({
    name: "",
    description: "",
    purpose: "general",
    color: "#3B82F6",
    icon: "Users",
    permissions: {
      canCreateMeetings: false,
      canManageFinances: false,
    },
  });

  // Fetch subgroups
  const { data: subgroupsData, isLoading: subgroupsLoading } = useQuery({
    queryKey: ["/api/subgroups"],
    enabled: showSubgroupManagement,
  });

  useEffect(() => {
    if (subgroupsData) {
      setSubgroups(subgroupsData);
    }
  }, [subgroupsData]);

  // Create subgroup
  const handleCreateSubgroup = async () => {
    try {
      const response = await apiRequest("POST", "/api/subgroups", newSubgroup);
      toast({
        title: "Subgroup Created",
        description: `${newSubgroup.name} has been successfully created.`,
      });
      setShowCreateSubgroup(false);
      setNewSubgroup({
        name: "",
        description: "",
        purpose: "general",
        color: "#3B82F6",
        icon: "Users",
        permissions: {
          canCreateMeetings: false,
          canManageFinances: false,
        },
      });
      // Refresh subgroups list
      if (showSubgroupManagement) {
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subgroup. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add member to subgroup
  const handleAddMemberToSubgroup = async (
    subgroupId: number,
    userId: number,
    role: string = "member"
  ) => {
    try {
      await apiRequest("POST", `/api/subgroups/${subgroupId}/members`, {
        userId,
        role,
      });
      toast({
        title: "Member Added",
        description: "Member has been successfully added to the subgroup.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subgroups"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member to subgroup.",
        variant: "destructive",
      });
    }
  };

  // Remove member from subgroup
  const handleRemoveMemberFromSubgroup = async (
    subgroupId: number,
    userId: number
  ) => {
    try {
      await apiRequest(
        "DELETE",
        `/api/subgroups/${subgroupId}/members/${userId}`
      );
      toast({
        title: "Member Removed",
        description: "Member has been successfully removed from the subgroup.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subgroups"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member from subgroup.",
        variant: "destructive",
      });
    }
  };

  const handleCreateElection = async () => {
    try {
      const response = await apiRequest("POST", "/api/elections", newElection);
      toast({
        title: "Election Created",
        description:
          "The election has been successfully created and added to the blockchain.",
      });
      setShowCreateElection(false);
      setNewElection({
        title: "",
        description: "",
        type: "leadership",
        deadline: "",
        options: [""],
        requiredVotes: 35,
        category: "general",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create election. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addElectionOption = () => {
    setNewElection((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeElectionOption = (index: number) => {
    setNewElection((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const updateElectionOption = (index: number, value: string) => {
    setNewElection((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => (i === index ? value : option)),
    }));
  };
  const queryClient = useQueryClient();

  // Platform state
  const [currentMeeting, setCurrentMeeting] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isLive, setIsLive] = useState(false);
  const [attendanceMode, setAttendanceMode] = useState(false);
  const [showCreateElection, setShowCreateElection] = useState(false);
  const [newElection, setNewElection] = useState({
    title: "",
    description: "",
    type: "leadership",
    deadline: "",
    options: [""],
    requiredVotes: 35,
    category: "general",
  });

  // AI-powered meeting assistance states
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [currentMood, setCurrentMood] = useState("neutral");
  const [backgroundTheme, setBackgroundTheme] = useState("professional");
  const [meetingInsights, setMeetingInsights] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Data for new features
  const emojiReactions = [
    { emoji: "👍", label: "Like", count: 0 },
    { emoji: "❤️", label: "Love", count: 0 },
    { emoji: "😊", label: "Happy", count: 0 },
    { emoji: "👏", label: "Clap", count: 0 },
    { emoji: "🎉", label: "Celebrate", count: 0 },
    { emoji: "🤔", label: "Think", count: 0 },
  ];

  const meetingSuggestions = [
    {
      id: 1,
      title: "Weekly Team Sync",
      description: "Regular team synchronization meeting",
      suggestedTime: "Every Monday 10:00 AM",
      duration: "30 minutes",
      priority: "high",
      participants: 8,
    },
    {
      id: 2,
      title: "Project Review",
      description: "Monthly project progress review",
      suggestedTime: "First Friday 2:00 PM",
      duration: "60 minutes",
      priority: "medium",
      participants: 12,
    },
    {
      id: 3,
      title: "Budget Planning",
      description: "Quarterly budget planning session",
      suggestedTime: "Next Tuesday 3:00 PM",
      duration: "90 minutes",
      priority: "high",
      participants: 6,
    },
  ];

  // Helper functions for new features
  const handleEmojiReaction = (emoji: string) => {
    toast({
      title: "Reaction Added",
      description: `You reacted with ${emoji}`,
    });
    setShowEmojiSelector(false);
  };

  const nextSuggestion = () => {
    setCurrentSuggestionIndex((prev) =>
      prev >= meetingSuggestions.length - 1 ? 0 : prev + 1
    );
  };

  const prevSuggestion = () => {
    setCurrentSuggestionIndex((prev) =>
      prev <= 0 ? meetingSuggestions.length - 1 : prev - 1
    );
  };

  const getEngagementBadge = (score: number) => {
    if (score >= 90)
      return {
        label: "Expert Participant",
        color: "bg-purple-500",
        icon: Crown,
      };
    if (score >= 80)
      return { label: "Active Contributor", color: "bg-blue-500", icon: Star };
    if (score >= 70)
      return {
        label: "Regular Attendee",
        color: "bg-green-500",
        icon: CheckCircle,
      };
    if (score >= 60)
      return {
        label: "Occasional Participant",
        color: "bg-yellow-500",
        icon: Clock,
      };
    return { label: "New Member", color: "bg-gray-500", icon: Users };
  };

  // Sample meeting members with comprehensive account data
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      avatar: "SJ",
      role: "Team Lead",
      status: "active",
      joinedDate: "2024-01-15",
      totalDues: 120.0,
      paidDues: 100.0,
      outstandingDues: 20.0,
      participationRate: 92,
      meetingsAttended: 11,
      totalMeetings: 12,
      lastAttendance: "2025-01-15",
      contributions: 8,
      reputation: 950,
      membershipTier: "Premium",
      paymentMethod: "Credit Card",
      autoPayEnabled: true,
      notifications: true,
      documentsAccess: ["all"],
      votingPower: 10,
      achievements: [
        "Perfect Attendance",
        "Top Contributor",
        "Meeting Champion",
      ],
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      avatar: "MC",
      role: "Developer",
      status: "active",
      joinedDate: "2024-02-01",
      totalDues: 100.0,
      paidDues: 80.0,
      outstandingDues: 20.0,
      participationRate: 83,
      meetingsAttended: 10,
      totalMeetings: 12,
      lastAttendance: "2025-01-10",
      contributions: 6,
      reputation: 875,
      membershipTier: "Standard",
      paymentMethod: "Bank Transfer",
      autoPayEnabled: false,
      notifications: true,
      documentsAccess: ["standard"],
      votingPower: 8,
      achievements: ["Consistent Member", "Good Contributor"],
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      avatar: "ER",
      role: "Designer",
      status: "warning",
      joinedDate: "2024-03-10",
      totalDues: 90.0,
      paidDues: 50.0,
      outstandingDues: 40.0,
      participationRate: 67,
      meetingsAttended: 8,
      totalMeetings: 12,
      lastAttendance: "2024-12-20",
      contributions: 4,
      reputation: 720,
      membershipTier: "Standard",
      paymentMethod: "PayPal",
      autoPayEnabled: true,
      notifications: false,
      documentsAccess: ["limited"],
      votingPower: 6,
      achievements: ["Creative Contributor"],
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@company.com",
      avatar: "DK",
      role: "Manager",
      status: "inactive",
      joinedDate: "2024-01-05",
      totalDues: 120.0,
      paidDues: 40.0,
      outstandingDues: 80.0,
      participationRate: 25,
      meetingsAttended: 3,
      totalMeetings: 12,
      lastAttendance: "2024-11-15",
      contributions: 1,
      reputation: 450,
      membershipTier: "Basic",
      paymentMethod: "None",
      autoPayEnabled: false,
      notifications: false,
      documentsAccess: ["none"],
      votingPower: 3,
      achievements: [],
    },
  ]);

  // Monthly meetings data
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "January 2025 Monthly Meeting",
      date: "2025-01-20",
      time: "10:00 AM",
      duration: 120,
      status: "completed",
      attendees: 11,
      agenda: "Q4 Review, Budget Planning, New Initiatives",
      meetingLink: "https://meet.example.com/jan2025",
      recordingUrl: "https://storage.example.com/recordings/jan2025.mp4",
      minutes: "Meeting minutes available",
      decisions: ["Approved budget increase", "New project timeline set"],
    },
    {
      id: 2,
      title: "February 2025 Monthly Meeting",
      date: "2025-02-17",
      time: "10:00 AM",
      duration: 120,
      status: "scheduled",
      attendees: 0,
      agenda: "Progress Updates, Team Building, Resource Allocation",
      meetingLink: "https://meet.example.com/feb2025",
      recordingUrl: null,
      minutes: null,
      decisions: [],
    },
  ]);

  // Member account mutations
  const updateMemberMutation = useMutation({
    mutationFn: async (memberData: any) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return memberData;
    },
    onSuccess: (data) => {
      setMembers((prev) =>
        prev.map((m) => (m.id === data.id ? { ...m, ...data } : m))
      );
      toast({
        title: "Member Updated",
        description: "Member account has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update member account.",
        variant: "destructive",
      });
    },
  });

  const recordAttendanceMutation = useMutation({
    mutationFn: async ({ meetingId, memberId, status }: any) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { meetingId, memberId, status };
    },
    onSuccess: () => {
      toast({
        title: "Attendance Recorded",
        description: "Attendance has been successfully recorded.",
      });
    },
  });

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "inactive":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Premium":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Standard":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Basic":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateFinancialMetrics = () => {
    const total = members.reduce((sum, m) => sum + m.totalDues, 0);
    const paid = members.reduce((sum, m) => sum + m.paidDues, 0);
    const outstanding = members.reduce((sum, m) => sum + m.outstandingDues, 0);
    const avgParticipation =
      members.reduce((sum, m) => sum + m.participationRate, 0) / members.length;

    return { total, paid, outstanding, avgParticipation };
  };

  const metrics = calculateFinancialMetrics();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Video className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Virtual Meeting Platform
            </h1>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive monthly meeting management with individual member
            accounts, financial tracking, and participation analytics.
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="members">Member Accounts</TabsTrigger>
            <TabsTrigger value="subgroups">Subgroups</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="finances">Financial Management</TabsTrigger>
            <TabsTrigger value="vibeledger">VibeLedger</TabsTrigger>
            <TabsTrigger value="elections">Elections & Ballots</TabsTrigger>
            <TabsTrigger value="live-meeting">Live Meeting</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* New Features Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
              {/* Feature 1: Dynamic Team Performance Visualization */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Dynamic Team Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Productivity
                        </span>
                        <span className="text-sm text-blue-600 font-bold">
                          {teamPerformanceData.productivity}%
                        </span>
                      </div>
                      <Progress
                        value={teamPerformanceData.productivity}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Collaboration
                        </span>
                        <span className="text-sm text-green-600 font-bold">
                          {teamPerformanceData.collaboration}%
                        </span>
                      </div>
                      <Progress
                        value={teamPerformanceData.collaboration}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Attendance</span>
                        <span className="text-sm text-purple-600 font-bold">
                          {teamPerformanceData.attendance}%
                        </span>
                      </div>
                      <Progress
                        value={teamPerformanceData.attendance}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Satisfaction
                        </span>
                        <span className="text-sm text-orange-600 font-bold">
                          {teamPerformanceData.satisfaction}%
                        </span>
                      </div>
                      <Progress
                        value={teamPerformanceData.satisfaction}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feature 2: Personalized Meeting Engagement Reward Badge */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Your Engagement Badge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const badge = getEngagementBadge(userEngagementScore);
                    const IconComponent = badge.icon;
                    return (
                      <div className="text-center space-y-3">
                        <div
                          className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center mx-auto`}
                        >
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">
                            {badge.label}
                          </div>
                          <div className="text-2xl font-bold text-purple-600">
                            {userEngagementScore}%
                          </div>
                          <div className="text-xs text-gray-500">
                            Engagement Score
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Feature 3: One Click Emoji Reaction Selector */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="h-5 w-5 text-yellow-600" />
                    Quick Reactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {emojiReactions.map((reaction, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-12 flex flex-col items-center justify-center p-1"
                        onClick={() => handleEmojiReaction(reaction.emoji)}
                      >
                        <span className="text-lg">{reaction.emoji}</span>
                        <span className="text-xs text-gray-500">
                          {reaction.count}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature 4: Smart Meeting Suggestion Carousel */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-600" />
                  Smart Meeting Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevSuggestion}
                      className="absolute left-0 z-10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="mx-12 flex-1">
                      {meetingSuggestions.map((suggestion, index) => (
                        <div
                          key={suggestion.id}
                          className={`${
                            index === currentSuggestionIndex
                              ? "block"
                              : "hidden"
                          } p-4 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">
                              {suggestion.title}
                            </h3>
                            <Badge
                              variant={
                                suggestion.priority === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {suggestion.priority} priority
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">
                            {suggestion.description}
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span>{suggestion.suggestedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Video className="h-4 w-4 text-green-500" />
                              <span>{suggestion.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-purple-500" />
                              <span>
                                {suggestion.participants} participants
                              </span>
                            </div>
                          </div>
                          <Button className="w-full mt-4" size="sm">
                            Schedule This Meeting
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextSuggestion}
                      className="absolute right-0 z-10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex justify-center mt-4 space-x-2">
                    {meetingSuggestions.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentSuggestionIndex
                            ? "bg-indigo-600"
                            : "bg-gray-300"
                        }`}
                        onClick={() => setCurrentSuggestionIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{members.length}</div>
                  <p className="text-xs text-gray-500">
                    {members.filter((m) => m.status === "active").length} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Participation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(metrics.avgParticipation)}%
                  </div>
                  <p className="text-xs text-gray-500">Across all members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${metrics.paid.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500">
                    ${metrics.outstanding.toFixed(2)} outstanding
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Next Meeting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">Feb 17</div>
                  <p className="text-xs text-gray-500">10:00 AM EST</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Meetings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {meetings
                    .filter((m) => m.status === "scheduled")
                    .map((meeting) => (
                      <div key={meeting.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{meeting.title}</h4>
                          <Badge variant="outline">{meeting.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {meeting.agenda}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {meeting.date} at {meeting.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {meeting.duration} min
                          </span>
                        </div>
                        <Button className="w-full mt-3" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                        </Button>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Member Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {members.filter((m) => m.status === "active").length}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          Active
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {members.filter((m) => m.status === "warning").length}
                        </div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-300">
                          Warning
                        </div>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {
                            members.filter((m) => m.status === "inactive")
                              .length
                          }
                        </div>
                        <div className="text-sm text-red-700 dark:text-red-300">
                          Inactive
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-semibold">Recent Activity</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            Sarah Johnson completed payment
                          </span>
                          <span className="text-xs text-gray-500 ml-auto">
                            2h ago
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">
                            Emily Rodriguez missed deadline
                          </span>
                          <span className="text-xs text-gray-500 ml-auto">
                            1d ago
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">
                            Michael Chen joined meeting
                          </span>
                          <span className="text-xs text-gray-500 ml-auto">
                            3d ago
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Member Accounts Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Member Account Management</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Member Directory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer"
                          onClick={() => setSelectedMember(member)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                {member.avatar}
                              </div>
                              <div>
                                <h4 className="font-semibold">{member.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {member.role}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div
                                    className={`w-2 h-2 rounded-full ${getStatusColor(
                                      member.status
                                    )}`}
                                  />
                                  <span className="text-xs capitalize">
                                    {member.status}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${getTierColor(
                                      member.membershipTier
                                    )}`}
                                  >
                                    {member.membershipTier}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                ${member.paidDues}/{member.totalDues}
                              </div>
                              <div className="text-sm text-gray-500">
                                {member.participationRate}% participation
                              </div>
                              {member.outstandingDues > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs mt-1"
                                >
                                  ${member.outstandingDues} due
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                {selectedMember ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5" />
                        Account Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
                          {selectedMember.avatar}
                        </div>
                        <h3 className="font-bold">{selectedMember.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedMember.email}
                        </p>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${getTierColor(
                            selectedMember.membershipTier
                          )}`}
                        >
                          {selectedMember.membershipTier} Member
                        </Badge>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Status:</span>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor(
                                selectedMember.status
                              )}`}
                            />
                            <span className="text-sm capitalize">
                              {selectedMember.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Joined:</span>
                          <span className="text-sm">
                            {selectedMember.joinedDate}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            Reputation:
                          </span>
                          <span className="text-sm font-semibold">
                            {selectedMember.reputation}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            Voting Power:
                          </span>
                          <span className="text-sm">
                            {selectedMember.votingPower}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-semibold">Financial Status</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Total Dues:</span>
                            <span className="font-semibold">
                              ${selectedMember.totalDues}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Paid:</span>
                            <span className="text-green-600">
                              ${selectedMember.paidDues}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Outstanding:</span>
                            <span className="text-red-600">
                              ${selectedMember.outstandingDues}
                            </span>
                          </div>
                          <Progress
                            value={
                              (selectedMember.paidDues /
                                selectedMember.totalDues) *
                              100
                            }
                            className="h-2 mt-2"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-semibold">Participation</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Meetings Attended:</span>
                            <span>
                              {selectedMember.meetingsAttended}/
                              {selectedMember.totalMeetings}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Participation Rate:</span>
                            <span className="font-semibold">
                              {selectedMember.participationRate}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Contributions:</span>
                            <span>{selectedMember.contributions}</span>
                          </div>
                          <Progress
                            value={selectedMember.participationRate}
                            className="h-2 mt-2"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-semibold">Achievements</h4>
                        <div className="space-y-1">
                          {selectedMember.achievements.length > 0 ? (
                            selectedMember.achievements.map(
                              (achievement, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs mr-1 mb-1"
                                >
                                  <Award className="h-3 w-3 mr-1" />
                                  {achievement}
                                </Badge>
                              )
                            )
                          ) : (
                            <p className="text-sm text-gray-500">
                              No achievements yet
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Select a member to view account details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Subgroups Tab */}
          <TabsContent value="subgroups" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Member Subgroups</h2>
              <Button
                onClick={() => setShowCreateSubgroup(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Subgroup
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  name: "Finance Committee",
                  description:
                    "Manages community finances and budget oversight",
                  purpose: "financial",
                  color: "#10B981",
                  icon: "DollarSign",
                  memberCount: 5,
                  permissions: {
                    canCreateMeetings: true,
                    canManageFinances: true,
                  },
                  status: "active",
                },
                {
                  id: 2,
                  name: "Event Planning Team",
                  description:
                    "Organizes community events and social activities",
                  purpose: "events",
                  color: "#8B5CF6",
                  icon: "Calendar",
                  memberCount: 8,
                  permissions: {
                    canCreateMeetings: true,
                    canManageFinances: false,
                  },
                  status: "active",
                },
                {
                  id: 3,
                  name: "Technology Board",
                  description:
                    "Oversees technical infrastructure and digital initiatives",
                  purpose: "technical",
                  color: "#3B82F6",
                  icon: "Settings",
                  memberCount: 4,
                  permissions: {
                    canCreateMeetings: true,
                    canManageFinances: false,
                  },
                  status: "active",
                },
                {
                  id: 4,
                  name: "Communication Team",
                  description: "Handles internal and external communications",
                  purpose: "communication",
                  color: "#F59E0B",
                  icon: "MessageSquare",
                  memberCount: 6,
                  permissions: {
                    canCreateMeetings: false,
                    canManageFinances: false,
                  },
                  status: "active",
                },
              ].map((subgroup) => (
                <Card
                  key={subgroup.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: subgroup.color }}
                      >
                        {subgroup.icon === "DollarSign" && (
                          <DollarSign className="h-5 w-5" />
                        )}
                        {subgroup.icon === "Calendar" && (
                          <Calendar className="h-5 w-5" />
                        )}
                        {subgroup.icon === "Settings" && (
                          <Settings className="h-5 w-5" />
                        )}
                        {subgroup.icon === "MessageSquare" && (
                          <MessageSquare className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{subgroup.name}</div>
                        <div className="text-sm text-gray-500 font-normal">
                          {subgroup.memberCount} members
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {subgroup.description}
                    </p>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Permissions
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {subgroup.permissions.canCreateMeetings && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            Create Meetings
                          </span>
                        )}
                        {subgroup.permissions.canManageFinances && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full">
                            Manage Finances
                          </span>
                        )}
                        {!subgroup.permissions.canCreateMeetings &&
                          !subgroup.permissions.canManageFinances && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                              Standard Access
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedSubgroup(subgroup)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Members
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Subgroup Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">4</div>
                      <div className="text-sm text-gray-600">
                        Active Subgroups
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">23</div>
                      <div className="text-sm text-gray-600">Total Members</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-8 w-8 text-yellow-600" />
                    <div>
                      <div className="text-2xl font-bold">95%</div>
                      <div className="text-sm text-gray-600">
                        Engagement Rate
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold">5.8</div>
                      <div className="text-sm text-gray-600">Avg per Group</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Create Subgroup Dialog */}
            <Dialog
              open={showCreateSubgroup}
              onOpenChange={setShowCreateSubgroup}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Create New Subgroup
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="subgroup-name"
                        className="text-sm font-medium"
                      >
                        Subgroup Name
                      </label>
                      <Input
                        id="subgroup-name"
                        placeholder="e.g., Finance Committee"
                        value={newSubgroup.name}
                        onChange={(e) =>
                          setNewSubgroup((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="subgroup-purpose"
                        className="text-sm font-medium"
                      >
                        Purpose
                      </label>
                      <Select
                        value={newSubgroup.purpose}
                        onValueChange={(value) =>
                          setNewSubgroup((prev) => ({
                            ...prev,
                            purpose: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="communication">
                            Communication
                          </SelectItem>
                          <SelectItem value="governance">Governance</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subgroup-description"
                      className="text-sm font-medium"
                    >
                      Description
                    </label>
                    <Textarea
                      id="subgroup-description"
                      placeholder="Describe the purpose and responsibilities of this subgroup..."
                      value={newSubgroup.description}
                      onChange={(e) =>
                        setNewSubgroup((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="subgroup-color"
                        className="text-sm font-medium"
                      >
                        Color
                      </label>
                      <Input
                        id="subgroup-color"
                        type="color"
                        value={newSubgroup.color}
                        onChange={(e) =>
                          setNewSubgroup((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="subgroup-icon"
                        className="text-sm font-medium"
                      >
                        Icon
                      </label>
                      <Select
                        value={newSubgroup.icon}
                        onValueChange={(value) =>
                          setNewSubgroup((prev) => ({ ...prev, icon: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Users">Users</SelectItem>
                          <SelectItem value="DollarSign">
                            Dollar Sign
                          </SelectItem>
                          <SelectItem value="Calendar">Calendar</SelectItem>
                          <SelectItem value="Settings">Settings</SelectItem>
                          <SelectItem value="MessageSquare">Message</SelectItem>
                          <SelectItem value="Crown">Crown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Permissions</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newSubgroup.permissions.canCreateMeetings}
                          onChange={(e) =>
                            setNewSubgroup((prev) => ({
                              ...prev,
                              permissions: {
                                ...prev.permissions,
                                canCreateMeetings: e.target.checked,
                              },
                            }))
                          }
                          className="rounded"
                        />
                        <span className="text-sm">Can create meetings</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newSubgroup.permissions.canManageFinances}
                          onChange={(e) =>
                            setNewSubgroup((prev) => ({
                              ...prev,
                              permissions: {
                                ...prev.permissions,
                                canManageFinances: e.target.checked,
                              },
                            }))
                          }
                          className="rounded"
                        />
                        <span className="text-sm">Can manage finances</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleCreateSubgroup} className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Subgroup
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateSubgroup(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Member Management Dialog */}
            {selectedSubgroup && (
              <Dialog
                open={!!selectedSubgroup}
                onOpenChange={() => setSelectedSubgroup(null)}
              >
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Manage {selectedSubgroup.name} Members
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Current Members */}
                      <div>
                        <h3 className="font-semibold mb-4">
                          Current Members ({selectedSubgroup.memberCount})
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {availableMembers
                            .slice(0, selectedSubgroup.memberCount)
                            .map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {member.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {member.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {member.role}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveMemberFromSubgroup(
                                      selectedSubgroup.id,
                                      member.id
                                    )
                                  }
                                >
                                  <UserMinus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Available Members */}
                      <div>
                        <h3 className="font-semibold mb-4">
                          Available Members
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {availableMembers
                            .slice(selectedSubgroup.memberCount)
                            .map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-linear-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {member.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {member.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {member.role}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleAddMemberToSubgroup(
                                      selectedSubgroup.id,
                                      member.id
                                    )
                                  }
                                >
                                  <UserPlus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Meeting Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {meetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {meeting.title}
                      </span>
                      <Badge
                        variant={
                          meeting.status === "completed" ? "default" : "outline"
                        }
                      >
                        {meeting.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Date:</span>
                        <p>{meeting.date}</p>
                      </div>
                      <div>
                        <span className="font-medium">Time:</span>
                        <p>{meeting.time}</p>
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>
                        <p>{meeting.duration} minutes</p>
                      </div>
                      <div>
                        <span className="font-medium">Attendees:</span>
                        <p>{meeting.attendees} registered</p>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-sm">Agenda:</span>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {meeting.agenda}
                      </p>
                    </div>

                    {meeting.status === "completed" && (
                      <div className="space-y-2">
                        <span className="font-medium text-sm">
                          Decisions Made:
                        </span>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                          {meeting.decisions.map((decision, index) => (
                            <li key={index}>{decision}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {meeting.status === "scheduled" ? (
                        <Button className="flex-1">
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Recording
                        </Button>
                      )}
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Minutes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Financial Management Tab */}
          <TabsContent value="finances" className="space-y-6">
            <h2 className="text-2xl font-bold">Financial Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${metrics.paid.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500">From member dues</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Outstanding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    ${metrics.outstanding.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500">Pending payments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Collection Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((metrics.paid / metrics.total) * 100)}%
                  </div>
                  <p className="text-xs text-gray-500">Payment efficiency</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payment Status by Member
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-gray-500">
                              {member.membershipTier}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              ${member.paidDues}/${member.totalDues}
                            </span>
                            {member.outstandingDues > 0 ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          {member.outstandingDues > 0 && (
                            <p className="text-xs text-red-600">
                              ${member.outstandingDues} overdue
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods & Automation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Auto-Pay Members</h4>
                        <Badge variant="default">
                          {members.filter((m) => m.autoPayEnabled).length}/
                          {members.length}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Members with automatic payment enabled
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Payment Methods</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                          <span className="font-medium">Credit Card:</span>{" "}
                          {
                            members.filter(
                              (m) => m.paymentMethod === "Credit Card"
                            ).length
                          }
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
                          <span className="font-medium">Bank Transfer:</span>{" "}
                          {
                            members.filter(
                              (m) => m.paymentMethod === "Bank Transfer"
                            ).length
                          }
                        </div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded">
                          <span className="font-medium">PayPal:</span>{" "}
                          {
                            members.filter((m) => m.paymentMethod === "PayPal")
                              .length
                          }
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-950/20 rounded">
                          <span className="font-medium">None Set:</span>{" "}
                          {
                            members.filter((m) => m.paymentMethod === "None")
                              .length
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Send Payment Reminders
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* VibeLedger Tab - Blockchain Financial Management */}
          <TabsContent value="vibeledger" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                VibeLedger - Blockchain Treasury
              </h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Audit
                </Button>
                <Button>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Multi-Sig Treasury
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    $45,280
                  </div>
                  <p className="text-xs text-purple-500">
                    3 of 5 signatures required
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600">Secured</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Smart Contracts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <p className="text-xs text-blue-500">Active contracts</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-600">
                      Auto-executing
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    DAO Governance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">95%</div>
                  <p className="text-xs text-orange-500">Participation rate</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Vote className="h-4 w-4 text-orange-500" />
                    <span className="text-xs text-orange-600">
                      Active voting
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Blockchain Treasury Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border">
                    <h4 className="font-semibold mb-3">
                      Multi-Signature Wallet
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Wallet Address:</span>
                        <span className="font-mono text-xs">0x742d...8f2e</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Required Signatures:</span>
                        <span>3 of 5</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Gas Optimization:</span>
                        <span className="text-green-600">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">
                      Recent Blockchain Transactions
                    </h4>
                    <div className="space-y-2">
                      {[
                        {
                          type: "payment",
                          hash: "0xabc...123",
                          amount: "$150",
                          status: "confirmed",
                          gas: "0.005 ETH",
                        },
                        {
                          type: "contract",
                          hash: "0xdef...456",
                          amount: "$500",
                          status: "pending",
                          gas: "0.012 ETH",
                        },
                        {
                          type: "governance",
                          hash: "0x789...abc",
                          amount: "$0",
                          status: "confirmed",
                          gas: "0.003 ETH",
                        },
                      ].map((tx, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                tx.type === "payment"
                                  ? "bg-green-100 text-green-600"
                                  : tx.type === "contract"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-purple-100 text-purple-600"
                              }`}
                            >
                              {tx.type === "payment"
                                ? "$"
                                : tx.type === "contract"
                                ? "⚡"
                                : "🗳️"}
                            </div>
                            <div>
                              <p className="font-medium text-sm capitalize">
                                {tx.type}
                              </p>
                              <p className="text-xs text-gray-500 font-mono">
                                {tx.hash}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">{tx.amount}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                Gas: {tx.gas}
                              </span>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  tx.status === "confirmed"
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Blockchain Explorer
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5" />
                    DAO Governance & Voting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Active Proposals</h4>
                    {[
                      {
                        id: 1,
                        title: "Treasury Budget Allocation 2025",
                        votes: 42,
                        total: 50,
                        status: "active",
                        deadline: "2 days",
                      },
                      {
                        id: 2,
                        title: "Meeting Fee Structure Update",
                        votes: 38,
                        total: 50,
                        status: "active",
                        deadline: "5 days",
                      },
                      {
                        id: 3,
                        title: "Smart Contract Upgrade",
                        votes: 45,
                        total: 50,
                        status: "passed",
                        deadline: "completed",
                      },
                    ].map((proposal) => (
                      <div key={proposal.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">
                            {proposal.title}
                          </h5>
                          <Badge
                            variant={
                              proposal.status === "passed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {proposal.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>
                              {proposal.votes}/{proposal.total} votes (
                              {Math.round(
                                (proposal.votes / proposal.total) * 100
                              )}
                              %)
                            </span>
                            <span>Deadline: {proposal.deadline}</span>
                          </div>
                          <Progress
                            value={(proposal.votes / proposal.total) * 100}
                            className="h-2"
                          />
                        </div>
                        {proposal.status === "active" && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <Vote className="h-3 w-3 mr-1" />
                              For
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Against
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Proposal
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5" />
                    Token Economics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-linear-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-sm">VIBE Token</span>
                      </div>
                      <div className="text-lg font-bold">15,420 VIBE</div>
                      <p className="text-xs text-gray-600">Current supply</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">
                        Token Distribution
                      </h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Treasury (40%)</span>
                          <span>6,168 VIBE</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Members (45%)</span>
                          <span>6,939 VIBE</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Rewards (15%)</span>
                          <span>2,313 VIBE</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Staking Rewards</h4>
                      <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
                        <div className="text-sm font-medium text-green-700 dark:text-green-300">
                          12.5% APY
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          for active participants
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Stake VIBE Tokens
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Smart Contract Escrow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Active Escrows</h4>
                    {[
                      {
                        id: 1,
                        purpose: "Meeting Venue Payment",
                        amount: "$2,500",
                        status: "locked",
                        progress: 75,
                      },
                      {
                        id: 2,
                        purpose: "Guest Speaker Fee",
                        amount: "$800",
                        status: "pending",
                        progress: 25,
                      },
                      {
                        id: 3,
                        purpose: "Technology Setup",
                        amount: "$1,200",
                        status: "released",
                        progress: 100,
                      },
                    ].map((escrow) => (
                      <div key={escrow.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">
                            {escrow.purpose}
                          </h5>
                          <Badge
                            variant={
                              escrow.status === "released"
                                ? "default"
                                : escrow.status === "locked"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {escrow.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Amount: {escrow.amount}</span>
                            <span>{escrow.progress}% complete</span>
                          </div>
                          <Progress value={escrow.progress} className="h-2" />
                        </div>
                        {escrow.status === "locked" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-2"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Release Milestone
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Escrow
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Payment Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">
                          Crypto Payments
                        </span>
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        ETH, BTC, USDC, VIBE
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm">
                          Traditional Banking
                        </span>
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        Cards, ACH, Wire transfers
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg bg-linear-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <QrCode className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-sm">
                          QR Code Payments
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Setup Required
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        Mobile instant payments
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-sm">
                          Cross-chain Bridge
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Advanced
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        Multi-blockchain support
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Channels
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  VibeLedger Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-linear-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-purple-700 dark:text-purple-300">
                        Treasury Growth
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                      +24.3%
                    </div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Last quarter
                    </p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-700 dark:text-green-300">
                        Transaction Speed
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                      2.1s
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Average confirmation
                    </p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-700 dark:text-blue-300">
                        Security Score
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                      98.7%
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Audit compliance
                    </p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Vote className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-700 dark:text-orange-300">
                        DAO Participation
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                      87%
                    </div>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Member engagement
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-4">
                    VibeLedger Integration Status
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-green-600 dark:text-green-400 font-semibold">
                        Blockchain
                      </div>
                      <div className="text-green-700 dark:text-green-300">
                        ✓ Connected
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-blue-600 dark:text-blue-400 font-semibold">
                        Smart Contracts
                      </div>
                      <div className="text-blue-700 dark:text-blue-300">
                        ✓ Deployed
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="text-purple-600 dark:text-purple-400 font-semibold">
                        DAO Governance
                      </div>
                      <div className="text-purple-700 dark:text-purple-300">
                        ✓ Active
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="text-yellow-600 dark:text-yellow-400 font-semibold">
                        Token Economy
                      </div>
                      <div className="text-yellow-700 dark:text-yellow-300">
                        ✓ Live
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Elections & Ballots Tab */}
          <TabsContent value="elections" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Elections & Ballots</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Election History
                </Button>
                <Button onClick={() => setShowCreateElection(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Election
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Elections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <p className="text-xs text-blue-500">Voting in progress</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Vote className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-600">
                      72% participation
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Voting Power
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    1,250
                  </div>
                  <p className="text-xs text-purple-500">VIBE tokens</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Coins className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-purple-600">
                      Top 15% voter
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Blockchain Integrity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <p className="text-xs text-green-500">Votes verified</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600">Immutable</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Elections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5" />
                    Active Elections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      id: 1,
                      title: "Monthly Meeting Chair Election",
                      type: "Leadership",
                      candidates: ["Sarah Johnson", "Mike Chen", "Emma Davis"],
                      deadline: "2 days",
                      totalVotes: 28,
                      requiredVotes: 35,
                      status: "active",
                      description:
                        "Election for the February 2025 meeting chair position",
                    },
                    {
                      id: 2,
                      title: "Budget Allocation Proposal",
                      type: "Financial",
                      options: [
                        "Marketing 40%",
                        "Development 35%",
                        "Operations 25%",
                      ],
                      deadline: "5 days",
                      totalVotes: 42,
                      requiredVotes: 35,
                      status: "active",
                      description: "Q1 2025 budget distribution voting",
                    },
                    {
                      id: 3,
                      title: "Meeting Time Change",
                      type: "Operational",
                      options: [
                        "Keep current",
                        "Move to Saturdays",
                        "Bi-weekly format",
                      ],
                      deadline: "1 week",
                      totalVotes: 15,
                      requiredVotes: 35,
                      status: "active",
                      description: "Adjusting monthly meeting schedule",
                    },
                  ].map((election) => (
                    <div key={election.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-sm">
                            {election.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {election.description}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {election.type}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                          <span>
                            Progress: {election.totalVotes}/
                            {election.requiredVotes} votes
                          </span>
                          <span>Deadline: {election.deadline}</span>
                        </div>
                        <Progress
                          value={
                            (election.totalVotes / election.requiredVotes) * 100
                          }
                          className="h-2"
                        />

                        <div className="space-y-2">
                          <h5 className="text-xs font-medium">Options:</h5>
                          {(election.candidates || election.options)?.map(
                            (option: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                              >
                                <span className="text-xs">{option}</span>
                                <Button size="sm" variant="outline">
                                  <Vote className="h-3 w-3 mr-1" />
                                  Vote
                                </Button>
                              </div>
                            )
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Verify
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Blockchain Voting Dashboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Blockchain Voting Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
                    <h4 className="font-semibold mb-3">Voting Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          185
                        </div>
                        <p className="text-xs text-gray-600">
                          Total Votes Cast
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">
                          98.2%
                        </div>
                        <p className="text-xs text-gray-600">
                          Verification Rate
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          12
                        </div>
                        <p className="text-xs text-gray-600">
                          Completed Elections
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">
                          2.3s
                        </div>
                        <p className="text-xs text-gray-600">Avg Vote Time</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">
                      Recent Blockchain Transactions
                    </h4>
                    <div className="space-y-2">
                      {[
                        {
                          hash: "0x4f2a...9b1c",
                          type: "Vote Cast",
                          candidate: "Sarah Johnson",
                          gasUsed: "0.008 ETH",
                          timestamp: "2 min ago",
                        },
                        {
                          hash: "0x8d3e...7a4f",
                          type: "Election Created",
                          candidate: "Budget Proposal",
                          gasUsed: "0.025 ETH",
                          timestamp: "1 hour ago",
                        },
                        {
                          hash: "0x1a5c...3e8d",
                          type: "Vote Verified",
                          candidate: "Mike Chen",
                          gasUsed: "0.005 ETH",
                          timestamp: "3 hours ago",
                        },
                      ].map((tx, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                              <Hash className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{tx.type}</p>
                              <p className="text-xs text-gray-500">
                                {tx.candidate}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-mono">{tx.hash}</p>
                            <p className="text-xs text-gray-500">
                              {tx.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Blockchain Explorer
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Election Management */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Leadership Elections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-linear-to-r from-gold-50 to-yellow-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-sm">
                          Current Leadership
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Chair:</span>
                          <span className="font-medium">Alex Rodriguez</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Vice Chair:</span>
                          <span className="font-medium">Maria Santos</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Secretary:</span>
                          <span className="font-medium">David Kim</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Treasurer:</span>
                          <span className="font-medium">Lisa Chen</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">
                        Upcoming Leadership Elections
                      </h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Monthly Chair</span>
                          <span className="text-blue-600">In Progress</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Quarterly Secretary</span>
                          <span className="text-gray-500">March 2025</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Annual Treasurer</span>
                          <span className="text-gray-500">December 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nominate Candidate
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Election Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Upcoming Elections</h4>
                    {[
                      {
                        date: "Feb 15, 2025",
                        title: "Meeting Chair Election",
                        type: "leadership",
                        status: "active",
                      },
                      {
                        date: "Feb 20, 2025",
                        title: "Budget Allocation Vote",
                        type: "financial",
                        status: "scheduled",
                      },
                      {
                        date: "Mar 1, 2025",
                        title: "Policy Amendment",
                        type: "governance",
                        status: "draft",
                      },
                      {
                        date: "Mar 15, 2025",
                        title: "Quarterly Review",
                        type: "operational",
                        status: "draft",
                      },
                    ].map((election, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">
                            {election.title}
                          </h5>
                          <Badge
                            variant={
                              election.status === "active"
                                ? "default"
                                : election.status === "scheduled"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {election.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{election.date}</span>
                          <span className="capitalize">{election.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Election
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Voting Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm text-green-700 dark:text-green-300">
                          Security Status
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Encryption:</span>
                          <span className="text-green-600">AES-256</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Blockchain:</span>
                          <span className="text-green-600">Ethereum</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Multi-sig:</span>
                          <span className="text-green-600">3 of 5</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Audit Score:</span>
                          <span className="text-green-600">98.7%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">
                        Security Features
                      </h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Anonymous voting</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Immutable records</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Real-time verification</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Fraud prevention</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Security Audit
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Election Analytics & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-700 dark:text-blue-300">
                        Participation Rate
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                      84.3%
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Last 6 months
                    </p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Vote className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-purple-700 dark:text-purple-300">
                        Avg Voting Time
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                      1.8m
                    </div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Per election
                    </p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-700 dark:text-green-300">
                        Success Rate
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                      100%
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      No failed elections
                    </p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-700 dark:text-orange-300">
                        Gas Efficiency
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                      0.008
                    </div>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      ETH per vote
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-4">
                    Election System Integration Status
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-green-600 dark:text-green-400 font-semibold">
                        Blockchain
                      </div>
                      <div className="text-green-700 dark:text-green-300">
                        ✓ Connected
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-blue-600 dark:text-blue-400 font-semibold">
                        Smart Voting
                      </div>
                      <div className="text-blue-700 dark:text-blue-300">
                        ✓ Active
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="text-purple-600 dark:text-purple-400 font-semibold">
                        DAO Integration
                      </div>
                      <div className="text-purple-700 dark:text-purple-300">
                        ✓ Synced
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="text-yellow-600 dark:text-yellow-400 font-semibold">
                        Token Voting
                      </div>
                      <div className="text-yellow-700 dark:text-yellow-300">
                        ✓ Live
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Create Election Dialog */}
            <Dialog
              open={showCreateElection}
              onOpenChange={setShowCreateElection}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5" />
                    Create New Election
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="election-title"
                        className="text-sm font-medium"
                      >
                        Election Title
                      </label>
                      <Input
                        id="election-title"
                        placeholder="e.g., Monthly Meeting Chair Election"
                        value={newElection.title}
                        onChange={(e) =>
                          setNewElection((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="election-type"
                        className="text-sm font-medium"
                      >
                        Election Type
                      </label>
                      <Select
                        value={newElection.type}
                        onValueChange={(value) =>
                          setNewElection((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select election type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leadership">Leadership</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="operational">
                            Operational
                          </SelectItem>
                          <SelectItem value="governance">Governance</SelectItem>
                          <SelectItem value="policy">Policy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="election-description"
                      className="text-sm font-medium"
                    >
                      Description
                    </label>
                    <Textarea
                      id="election-description"
                      placeholder="Provide details about this election and what members are voting on..."
                      value={newElection.description}
                      onChange={(e) =>
                        setNewElection((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="election-deadline"
                        className="text-sm font-medium"
                      >
                        Voting Deadline
                      </label>
                      <Input
                        id="election-deadline"
                        type="datetime-local"
                        value={newElection.deadline}
                        onChange={(e) =>
                          setNewElection((prev) => ({
                            ...prev,
                            deadline: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="required-votes"
                        className="text-sm font-medium"
                      >
                        Required Votes
                      </label>
                      <Input
                        id="required-votes"
                        type="number"
                        placeholder="35"
                        value={newElection.requiredVotes}
                        onChange={(e) =>
                          setNewElection((prev) => ({
                            ...prev,
                            requiredVotes: parseInt(e.target.value) || 35,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Voting Options / Candidates
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addElectionOption}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Option
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {newElection.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder={`Option ${
                              index + 1
                            } (e.g., Sarah Johnson or Yes)`}
                            value={option}
                            onChange={(e) =>
                              updateElectionOption(index, e.target.value)
                            }
                          />
                          {newElection.options.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeElectionOption(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                      Blockchain Integration
                    </h4>
                    <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                      <p>
                        • This election will be recorded on the Ethereum
                        blockchain for transparency
                      </p>
                      <p>
                        • All votes will be cryptographically secured and
                        immutable
                      </p>
                      <p>
                        • Gas fees will be optimized for cost-effective voting
                      </p>
                      <p>
                        • Real-time verification will be available for all
                        participants
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowCreateElection(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleCreateElection}
                      disabled={
                        !newElection.title ||
                        !newElection.description ||
                        newElection.options.some((opt) => !opt.trim())
                      }
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Create Election
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Live Meeting Tab */}
          <TabsContent value="live-meeting" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Live Meeting Control</h2>
              <div className="flex gap-2">
                <Button
                  variant={isLive ? "destructive" : "default"}
                  onClick={() => setIsLive(!isLive)}
                >
                  {isLive ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      End Meeting
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Meeting
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAttendanceMode(!attendanceMode)}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  {attendanceMode ? "Exit Attendance" : "Take Attendance"}
                </Button>
              </div>
            </div>

            {isLive && (
              <div className="space-y-6">
                {/* AI-Powered Meeting Control Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-red-500" />
                      AI-Enhanced Meeting In Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-linear-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4 rounded-lg mb-4">
                      <p className="text-center text-lg font-semibold">
                        February 2025 Monthly Meeting
                      </p>
                      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                        Started at 10:00 AM • Duration: 45 minutes
                      </p>
                    </div>

                    {/* Meeting Controls */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <Button
                        variant={isMuted ? "destructive" : "outline"}
                        onClick={() => setIsMuted(!isMuted)}
                        className="flex items-center gap-2"
                      >
                        {isMuted ? (
                          <MicOff className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                        {isMuted ? "Unmute" : "Mute"}
                      </Button>

                      <Button
                        variant={isRecording ? "destructive" : "outline"}
                        onClick={() => setIsRecording(!isRecording)}
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        {isRecording ? "Stop Rec" : "Record"}
                      </Button>

                      <Button
                        variant={isScreenSharing ? "default" : "outline"}
                        onClick={() => setIsScreenSharing(!isScreenSharing)}
                        className="flex items-center gap-2"
                      >
                        <ScreenShare className="h-4 w-4" />
                        {isScreenSharing ? "Stop Share" : "Share"}
                      </Button>

                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Headphones className="h-4 w-4" />
                        Audio
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Smart Suggestions Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      AI Meeting Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Smart Suggestions */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          Smart Suggestions
                        </h4>
                        <div className="space-y-2">
                          {[
                            {
                              type: "action",
                              text: "Consider taking a 5-minute break - meeting has been running for 40 minutes",
                              priority: "medium",
                            },
                            {
                              type: "topic",
                              text: "Suggest moving to budget discussion based on member engagement",
                              priority: "high",
                            },
                            {
                              type: "participation",
                              text: "Sarah and Mike haven't spoken - consider asking for their input",
                              priority: "low",
                            },
                          ].map((suggestion, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border-l-4 ${
                                suggestion.priority === "high"
                                  ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                                  : suggestion.priority === "medium"
                                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                                  : "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full mt-2 ${
                                    suggestion.priority === "high"
                                      ? "bg-red-500"
                                      : suggestion.priority === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                                  }`}
                                />
                                <p className="text-sm">{suggestion.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Mood Tracker */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Heart className="h-4 w-4 text-pink-500" />
                          Meeting Mood Tracker
                        </h4>
                        <div className="p-4 bg-linear-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg">
                          <div className="text-center mb-3">
                            <div className="text-2xl mb-2">
                              {currentMood === "positive"
                                ? "😊"
                                : currentMood === "neutral"
                                ? "😐"
                                : "😟"}
                            </div>
                            <p className="text-sm font-medium capitalize">
                              {currentMood} Energy
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {["positive", "neutral", "negative"].map((mood) => (
                              <Button
                                key={mood}
                                size="sm"
                                variant={
                                  currentMood === mood ? "default" : "outline"
                                }
                                onClick={() => setCurrentMood(mood)}
                                className="flex-1"
                              >
                                {mood === "positive"
                                  ? "😊"
                                  : mood === "neutral"
                                  ? "😐"
                                  : "😟"}
                              </Button>
                            ))}
                          </div>
                          <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                            AI analysis:{" "}
                            {currentMood === "positive"
                              ? "High engagement, productive discussion"
                              : currentMood === "neutral"
                              ? "Steady progress, consider energizing activities"
                              : "Low energy detected, suggest break or topic change"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contextual Virtual Background Generator */}
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Palette className="h-4 w-4 text-indigo-500" />
                        AI Background Generator
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          {
                            name: "Professional Office",
                            theme: "professional",
                            preview: "🏢",
                          },
                          {
                            name: "Cozy Library",
                            theme: "cozy",
                            preview: "📚",
                          },
                          {
                            name: "Modern Workspace",
                            theme: "modern",
                            preview: "💻",
                          },
                          {
                            name: "Nature Zen",
                            theme: "nature",
                            preview: "🌿",
                          },
                        ].map((bg) => (
                          <div
                            key={bg.theme}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              backgroundTheme === bg.theme
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                                : "hover:border-gray-400"
                            }`}
                            onClick={() => setBackgroundTheme(bg.theme)}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-1">{bg.preview}</div>
                              <p className="text-xs font-medium">{bg.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full">
                        <Palette className="h-4 w-4 mr-2" />
                        Generate Custom Background
                      </Button>
                    </div>

                    {/* One-Click Meeting Insights */}
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-green-500" />
                        Meeting Insights Summary
                      </h4>
                      <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              45m
                            </div>
                            <p className="text-xs text-gray-600">Duration</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">
                              18
                            </div>
                            <p className="text-xs text-gray-600">
                              Participants
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">
                              7
                            </div>
                            <p className="text-xs text-gray-600">Key Topics</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-600">
                              12
                            </div>
                            <p className="text-xs text-gray-600">
                              Action Items
                            </p>
                          </div>
                        </div>
                        <Button className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Generate AI Summary Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {attendanceMode && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Mark Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {member.avatar}
                              </div>
                              <span className="font-medium">{member.name}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  recordAttendanceMutation.mutate({
                                    meetingId: 2,
                                    memberId: member.id,
                                    status: "present",
                                  })
                                }
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  recordAttendanceMutation.mutate({
                                    meetingId: 2,
                                    memberId: member.id,
                                    status: "absent",
                                  })
                                }
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Meeting Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Camera className="h-6 w-6 mb-2" />
                    Recording
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Share2 className="h-6 w-6 mb-2" />
                    Screen Share
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    Chat
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Minutes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports & Analytics Tab */}
          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Attendance Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <Progress value={87} className="h-2 mt-2" />
                  <p className="text-xs text-gray-500 mt-1">Last 6 months</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Member Retention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94%</div>
                  <Progress value={94} className="h-2 mt-2" />
                  <p className="text-xs text-gray-500 mt-1">12 month rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Payment Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <Progress value={78} className="h-2 mt-2" />
                  <p className="text-xs text-gray-500 mt-1">On-time payments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Engagement Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.2</div>
                  <Progress value={82} className="h-2 mt-2" />
                  <p className="text-xs text-gray-500 mt-1">Out of 10</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Member Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div key={member.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {member.avatar}
                            </div>
                            <span className="text-sm font-medium">
                              {member.name}
                            </span>
                          </div>
                          <span className="text-sm">
                            {member.participationRate}%
                          </span>
                        </div>
                        <Progress
                          value={member.participationRate}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Member Directory Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Attendance Analytics
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Financial Summary
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Meeting History
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Export Format</h4>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
