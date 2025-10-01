import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Shield,
  Camera,
  Mic,
  MicOff,
  Scan,
  Users,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  Smartphone,
  Fingerprint,
  Lock,
  Unlock,
  Key,
  Sparkles,
  Zap,
  Crown,
  Star,
  QrCode,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Download,
  Upload,
  Database,
  Activity,
  TrendingUp,
  AlertCircle,
  Info,
  CheckSquare,
  X
} from "lucide-react";

interface EntryMethod {
  id: string;
  type: 'face' | 'nft' | 'voice' | 'manual';
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  securityLevel: 'low' | 'medium' | 'high' | 'maximum';
  successRate: number;
  avgProcessingTime: number;
  requiresDevice: boolean;
  supportsGroup: boolean;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  avatar: string;
  entryStatus: 'pending' | 'approved' | 'denied' | 'entered' | 'fraud_detected';
  entryMethod: 'face' | 'nft' | 'voice' | 'manual';
  entryTime?: string;
  verificationScore: number;
  fraudRisk: 'low' | 'medium' | 'high';
  nftTokenId?: string;
  faceMatchScore?: number;
  voiceMatchScore?: number;
  deviceInfo: {
    type: string;
    browser: string;
    location: string;
  };
  attempts: number;
  isVIP: boolean;
  groupSize: number;
}

interface FraudAlert {
  id: string;
  guestId: string;
  guestName: string;
  alertType: 'duplicate_face' | 'fake_nft' | 'voice_deepfake' | 'suspicious_device' | 'multiple_attempts';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  confidence: number;
  resolved: boolean;
  action: 'blocked' | 'flagged' | 'reviewed' | 'approved';
}

interface EntryStats {
  totalAttempts: number;
  successfulEntries: number;
  fraudBlocked: number;
  averageProcessingTime: number;
  methodBreakdown: {
    face: { attempts: number; success: number; fraudDetected: number };
    nft: { attempts: number; success: number; fraudDetected: number };
    voice: { attempts: number; success: number; fraudDetected: number };
    manual: { attempts: number; success: number; fraudDetected: number };
  };
  realTimeMetrics: {
    currentQueue: number;
    processingRate: number;
    errorRate: number;
    avgWaitTime: number;
  };
}

interface NFTPass {
  id: string;
  tokenId: string;
  contractAddress: string;
  eventId: string;
  guestId: string;
  tierLevel: 'general' | 'vip' | 'premium' | 'exclusive';
  accessLevel: string[];
  mintedAt: string;
  usedAt?: string;
  transferHistory: Array<{
    from: string;
    to: string;
    timestamp: string;
    verified: boolean;
  }>;
  metadata: {
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

export default function SmartEntryIdentity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State management
  const [activeTab, setActiveTab] = useState("entry-flow");
  const [selectedMethod, setSelectedMethod] = useState<'face' | 'nft' | 'voice' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [nftTokenId, setNftTokenId] = useState("");
  const [voicePassword, setVoicePassword] = useState("");
  const [guestName, setGuestName] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [verificationResults, setVerificationResults] = useState<any>(null);
  const [showFraudAlert, setShowFraudAlert] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [entrySettings, setEntrySettings] = useState({
    faceRecognition: true,
    nftVerification: true,
    voiceAuthentication: true,
    fraudDetection: true,
    realTimeTracking: true,
    groupEntry: true
  });

  // Data queries
  const { data: entryMethods, isLoading: methodsLoading } = useQuery({
    queryKey: ["/api/smart-entry/methods"],
    refetchInterval: 30000,
  });

  const { data: guestQueue, isLoading: queueLoading } = useQuery({
    queryKey: ["/api/smart-entry/queue"],
    refetchInterval: 2000,
  });

  const { data: entryStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/smart-entry/stats"],
    refetchInterval: 5000,
  });

  const { data: fraudAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/smart-entry/fraud-alerts"],
    refetchInterval: 3000,
  });

  const { data: nftPasses, isLoading: nftLoading } = useQuery({
    queryKey: ["/api/smart-entry/nft-passes"],
    refetchInterval: 10000,
  });

  // Mutations
  const startFaceRecognitionMutation = useMutation({
    mutationFn: async (data: { guestName: string; image: string; groupSize: number }) => {
      const response = await apiRequest("POST", "/api/smart-entry/face-recognition", data);
      return response.json();
    },
    onSuccess: (data) => {
      setVerificationResults(data);
      if (data.success) {
        toast({
          title: "Face Recognition Successful",
          description: `Welcome ${data.guestName}! Entry approved.`,
        });
      } else {
        toast({
          title: "Face Recognition Failed",
          description: data.reason || "Unable to verify identity",
          variant: "destructive",
        });
      }
      setIsProcessing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/smart-entry"] });
    },
  });

  const verifyNFTPassMutation = useMutation({
    mutationFn: async (data: { tokenId: string; guestName: string; groupSize: number }) => {
      const response = await apiRequest("POST", "/api/smart-entry/nft-verification", data);
      return response.json();
    },
    onSuccess: (data) => {
      setVerificationResults(data);
      if (data.success) {
        toast({
          title: "NFT Pass Verified",
          description: `${data.tierLevel} access granted for ${data.guestName}`,
        });
      } else {
        toast({
          title: "NFT Verification Failed",
          description: data.reason || "Invalid or used NFT pass",
          variant: "destructive",
        });
      }
      setIsProcessing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/smart-entry"] });
    },
  });

  const voiceAuthenticationMutation = useMutation({
    mutationFn: async (data: { voiceData: string; password: string; guestName: string; groupSize: number }) => {
      const response = await apiRequest("POST", "/api/smart-entry/voice-authentication", data);
      return response.json();
    },
    onSuccess: (data) => {
      setVerificationResults(data);
      if (data.success) {
        toast({
          title: "Voice Authentication Successful",
          description: `Secret phrase verified! Welcome ${data.guestName}`,
        });
      } else {
        toast({
          title: "Voice Authentication Failed",
          description: data.reason || "Voice or password didn't match",
          variant: "destructive",
        });
      }
      setIsProcessing(false);
      setVoiceRecording(false);
      queryClient.invalidateQueries({ queryKey: ["/api/smart-entry"] });
    },
  });

  const manualEntryMutation = useMutation({
    mutationFn: async (data: { guestName: string; reason: string; groupSize: number }) => {
      const response = await apiRequest("POST", "/api/smart-entry/manual-entry", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Manual Entry Processed",
        description: `${data.guestName} has been ${data.approved ? 'approved' : 'denied'} for entry`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/smart-entry"] });
    },
  });

  const resolveFraudAlertMutation = useMutation({
    mutationFn: async (data: { alertId: string; action: 'approve' | 'block' | 'investigate' }) => {
      const response = await apiRequest("POST", `/api/smart-entry/resolve-fraud/${data.alertId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Fraud Alert Resolved",
        description: "Security action has been processed",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/smart-entry/fraud-alerts"] });
    },
  });

  // Helper functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      const video = videoRef.current;
      
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;
      
      context?.drawImage(video, 0, 0);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(imageData);
    }
  };

  const processFaceRecognition = () => {
    if (!capturedImage || !guestName) {
      toast({
        title: "Missing Information",
        description: "Please capture a photo and enter your name",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing steps
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    startFaceRecognitionMutation.mutate({
      guestName,
      image: capturedImage,
      groupSize
    });
  };

  const processNFTVerification = () => {
    if (!nftTokenId || !guestName) {
      toast({
        title: "Missing Information",
        description: "Please enter NFT token ID and your name",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    verifyNFTPassMutation.mutate({
      tokenId: nftTokenId,
      guestName,
      groupSize
    });
  };

  const startVoiceRecording = () => {
    setVoiceRecording(true);
    setMicActive(true);
    
    // Simulate voice recording
    setTimeout(() => {
      processVoiceAuthentication();
    }, 3000);
  };

  const processVoiceAuthentication = () => {
    if (!voicePassword || !guestName) {
      toast({
        title: "Missing Information",
        description: "Please enter the secret phrase and your name",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    voiceAuthenticationMutation.mutate({
      voiceData: "simulated_voice_data",
      password: voicePassword,
      guestName,
      groupSize
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entered': return 'bg-green-500 text-white';
      case 'approved': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'denied': return 'bg-red-500 text-white';
      case 'fraud_detected': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'face': return <Camera className="h-4 w-4" />;
      case 'nft': return <Key className="h-4 w-4" />;
      case 'voice': return <Mic className="h-4 w-4" />;
      case 'manual': return <UserCheck className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Sample data
  const methods: EntryMethod[] = entryMethods || [
    {
      id: "face-recognition",
      type: "face",
      name: "Face Recognition",
      description: "AI-powered facial recognition with anti-spoofing",
      icon: "👤",
      enabled: true,
      securityLevel: "high",
      successRate: 94,
      avgProcessingTime: 2.3,
      requiresDevice: true,
      supportsGroup: false
    },
    {
      id: "nft-pass",
      type: "nft",
      name: "NFT Token Pass",
      description: "Blockchain-verified digital passes",
      icon: "🎫",
      enabled: true,
      securityLevel: "maximum",
      successRate: 99,
      avgProcessingTime: 1.8,
      requiresDevice: false,
      supportsGroup: true
    },
    {
      id: "voice-auth",
      type: "voice",
      name: "Voice Password",
      description: "Voice biometrics with secret phrase",
      icon: "🎤",
      enabled: true,
      securityLevel: "medium",
      successRate: 87,
      avgProcessingTime: 3.1,
      requiresDevice: true,
      supportsGroup: false
    },
    {
      id: "manual-entry",
      type: "manual",
      name: "Manual Verification",
      description: "Staff-assisted entry verification",
      icon: "👥",
      enabled: true,
      securityLevel: "low",
      successRate: 100,
      avgProcessingTime: 15.0,
      requiresDevice: false,
      supportsGroup: true
    }
  ];

  const guests: Guest[] = guestQueue || [
    {
      id: "guest-001",
      name: "Sarah Johnson",
      email: "sarah@email.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150",
      entryStatus: "entered",
      entryMethod: "face",
      entryTime: "2025-07-01T19:15:30Z",
      verificationScore: 96,
      fraudRisk: "low",
      faceMatchScore: 96,
      deviceInfo: {
        type: "iPhone 14",
        browser: "Safari",
        location: "New York, NY"
      },
      attempts: 1,
      isVIP: true,
      groupSize: 1
    },
    {
      id: "guest-002",
      name: "Alex Chen",
      email: "alex@email.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      entryStatus: "approved",
      entryMethod: "nft",
      verificationScore: 100,
      fraudRisk: "low",
      nftTokenId: "0x1234...5678",
      deviceInfo: {
        type: "Android",
        browser: "Chrome",
        location: "Los Angeles, CA"
      },
      attempts: 1,
      isVIP: false,
      groupSize: 2
    },
    {
      id: "guest-003",
      name: "Emma Rodriguez",
      email: "emma@email.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      entryStatus: "pending",
      entryMethod: "voice",
      verificationScore: 0,
      fraudRisk: "medium",
      voiceMatchScore: 83,
      deviceInfo: {
        type: "Desktop",
        browser: "Firefox",
        location: "Chicago, IL"
      },
      attempts: 2,
      isVIP: false,
      groupSize: 1
    },
    {
      id: "guest-004",
      name: "Marcus Thompson",
      email: "marcus@email.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      entryStatus: "fraud_detected",
      entryMethod: "face",
      verificationScore: 0,
      fraudRisk: "high",
      faceMatchScore: 23,
      deviceInfo: {
        type: "Unknown",
        browser: "Unknown",
        location: "VPN - Hidden"
      },
      attempts: 5,
      isVIP: false,
      groupSize: 1
    }
  ];

  const alerts: FraudAlert[] = fraudAlerts || [
    {
      id: "alert-001",
      guestId: "guest-004",
      guestName: "Marcus Thompson",
      alertType: "duplicate_face",
      severity: "high",
      timestamp: "2025-07-01T19:45:00Z",
      description: "Facial features match previously blocked user from different event",
      confidence: 87,
      resolved: false,
      action: "blocked"
    },
    {
      id: "alert-002",
      guestId: "guest-005",
      guestName: "Unknown User",
      alertType: "fake_nft",
      severity: "critical",
      timestamp: "2025-07-01T19:40:00Z",
      description: "NFT token appears to be counterfeit or duplicated",
      confidence: 95,
      resolved: false,
      action: "blocked"
    },
    {
      id: "alert-003",
      guestId: "guest-006",
      guestName: "Jennifer Lee",
      alertType: "voice_deepfake",
      severity: "medium",
      timestamp: "2025-07-01T19:38:00Z",
      description: "Voice pattern analysis suggests artificial generation",
      confidence: 73,
      resolved: true,
      action: "reviewed"
    }
  ];

  const stats: EntryStats = entryStats || {
    totalAttempts: 247,
    successfulEntries: 198,
    fraudBlocked: 23,
    averageProcessingTime: 2.8,
    methodBreakdown: {
      face: { attempts: 89, success: 76, fraudDetected: 8 },
      nft: { attempts: 67, success: 65, fraudDetected: 2 },
      voice: { attempts: 45, success: 31, fraudDetected: 7 },
      manual: { attempts: 46, success: 46, fraudDetected: 0 }
    },
    realTimeMetrics: {
      currentQueue: 12,
      processingRate: 2.1,
      errorRate: 4.2,
      avgWaitTime: 1.8
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Smart Entry & Identity</h1>
                <p className="text-gray-600">Next-generation access control with face recognition, NFT passes, and voice authentication</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="h-4 w-4 mr-1" />
                {stats.realTimeMetrics.currentQueue} in queue
              </Badge>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="entry-flow">Entry Flow</TabsTrigger>
            <TabsTrigger value="guest-queue">Guest Queue</TabsTrigger>
            <TabsTrigger value="fraud-detection">Fraud Detection</TabsTrigger>
            <TabsTrigger value="nft-management">NFT Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Entry Flow Tab */}
          <TabsContent value="entry-flow" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Entry Methods */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scan className="h-5 w-5 mr-2" />
                    Choose Entry Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Method Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {methods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedMethod === method.type
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedMethod(method.type)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{method.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{method.name}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <Badge variant="outline" size="sm">
                                {method.securityLevel} security
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {method.successRate}% success
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Guest Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Guest Name</label>
                      <Input
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Enter your name..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Group Size</label>
                      <Input
                        type="number"
                        value={groupSize}
                        onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>

                  {/* Face Recognition Interface */}
                  {selectedMethod === 'face' && (
                    <div className="space-y-4">
                      <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                        {cameraActive ? (
                          <>
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-full object-cover"
                            />
                            <canvas ref={canvasRef} className="hidden" />
                            <div className="absolute inset-0 border-4 border-blue-500 rounded-lg opacity-50" />
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm">
                              ● LIVE
                            </div>
                          </>
                        ) : capturedImage ? (
                          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center text-white">
                            <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Camera Preview</p>
                            <p className="text-sm opacity-75">Position your face in the frame</p>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        {!cameraActive && !capturedImage && (
                          <Button onClick={startCamera} className="flex-1">
                            <Camera className="h-4 w-4 mr-2" />
                            Start Camera
                          </Button>
                        )}
                        {cameraActive && !capturedImage && (
                          <Button onClick={capturePhoto} className="flex-1">
                            <Scan className="h-4 w-4 mr-2" />
                            Capture Photo
                          </Button>
                        )}
                        {capturedImage && (
                          <>
                            <Button 
                              onClick={() => {
                                setCapturedImage(null);
                                startCamera();
                              }}
                              variant="outline"
                              className="flex-1"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Retake
                            </Button>
                            <Button 
                              onClick={processFaceRecognition}
                              disabled={isProcessing}
                              className="flex-1 bg-green-500 hover:bg-green-600"
                            >
                              {isProcessing ? (
                                <>
                                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Verify Identity
                                </>
                              )}
                            </Button>
                          </>
                        )}
                      </div>

                      {isProcessing && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Processing facial recognition...</span>
                            <span>{processingProgress}%</span>
                          </div>
                          <Progress value={processingProgress} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* NFT Verification Interface */}
                  {selectedMethod === 'nft' && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg border-2 border-dashed border-purple-200">
                        <div className="text-center">
                          <Key className="h-12 w-12 mx-auto text-purple-500 mb-4" />
                          <h3 className="text-lg font-semibold mb-2">NFT Token Pass</h3>
                          <p className="text-gray-600 mb-4">Enter your NFT token ID for blockchain verification</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">NFT Token ID</label>
                            <Input
                              value={nftTokenId}
                              onChange={(e) => setNftTokenId(e.target.value)}
                              placeholder="0x1234567890abcdef..."
                            />
                          </div>
                          
                          <Button 
                            onClick={processNFTVerification}
                            disabled={isProcessing || !nftTokenId}
                            className="w-full bg-purple-500 hover:bg-purple-600"
                          >
                            {isProcessing ? (
                              <>
                                <Activity className="h-4 w-4 mr-2 animate-spin" />
                                Verifying NFT...
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                Verify NFT Pass
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Voice Authentication Interface */}
                  {selectedMethod === 'voice' && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg border-2 border-dashed border-orange-200">
                        <div className="text-center">
                          <Mic className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Voice Authentication</h3>
                          <p className="text-gray-600 mb-4">Speak the secret phrase for voice biometric verification</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Secret Phrase</label>
                            <Input
                              value={voicePassword}
                              onChange={(e) => setVoicePassword(e.target.value)}
                              placeholder="Enter the secret phrase..."
                              type="password"
                            />
                          </div>
                          
                          <div className="text-center">
                            {voiceRecording ? (
                              <div className="space-y-3">
                                <div className="bg-red-500 text-white p-4 rounded-lg">
                                  <Volume2 className="h-6 w-6 mx-auto mb-2 animate-pulse" />
                                  <p>Recording... Speak the phrase now</p>
                                </div>
                                <div className="flex space-x-2 justify-center">
                                  {[1,2,3,4,5].map((i) => (
                                    <div 
                                      key={i}
                                      className="w-2 h-8 bg-red-500 rounded animate-pulse"
                                      style={{ animationDelay: `${i * 0.1}s` }}
                                    />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <Button 
                                onClick={startVoiceRecording}
                                disabled={isProcessing || !voicePassword}
                                className="w-full bg-orange-500 hover:bg-orange-600"
                              >
                                {isProcessing ? (
                                  <>
                                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                                    Processing Voice...
                                  </>
                                ) : (
                                  <>
                                    <Mic className="h-4 w-4 mr-2" />
                                    Start Voice Recording
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Manual Entry Interface */}
                  {selectedMethod === 'manual' && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg border-2 border-dashed border-gray-200">
                        <div className="text-center">
                          <UserCheck className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Manual Verification</h3>
                          <p className="text-gray-600 mb-4">Staff will verify your identity and approve entry</p>
                        </div>
                        
                        <Button 
                          onClick={() => manualEntryMutation.mutate({ 
                            guestName, 
                            reason: "Manual verification requested", 
                            groupSize 
                          })}
                          disabled={!guestName}
                          className="w-full"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Request Manual Verification
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Verification Results */}
                  {verificationResults && (
                    <div className={`p-4 rounded-lg border-2 ${
                      verificationResults.success 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        {verificationResults.success ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500" />
                        )}
                        <div>
                          <h4 className="font-semibold">
                            {verificationResults.success ? 'Entry Approved' : 'Entry Denied'}
                          </h4>
                          <p className="text-sm">{verificationResults.message}</p>
                          {verificationResults.score && (
                            <p className="text-xs mt-1">Confidence: {verificationResults.score}%</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Live Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Live Entry Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{stats.realTimeMetrics.currentQueue}</div>
                      <div className="text-sm text-gray-600">Guests in Queue</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-semibold">{stats.successfulEntries}</div>
                        <div className="text-xs text-gray-600">Entered</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-semibold text-red-600">{stats.fraudBlocked}</div>
                        <div className="text-xs text-gray-600">Blocked</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Success Rate</span>
                        <span>{Math.round((stats.successfulEntries / stats.totalAttempts) * 100)}%</span>
                      </div>
                      <Progress value={(stats.successfulEntries / stats.totalAttempts) * 100} />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Method Performance</h4>
                      {Object.entries(stats.methodBreakdown).map(([method, data]) => (
                        <div key={method} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            {getMethodIcon(method)}
                            <span className="capitalize">{method}</span>
                          </div>
                          <span>{Math.round((data.success / data.attempts) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Guest Queue Tab */}
          <TabsContent value="guest-queue" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Guest Entry Queue
                    </div>
                    <Badge variant="outline">
                      {guests.filter(g => g.entryStatus === 'pending').length} pending
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {guests.map((guest) => (
                        <div 
                          key={guest.id} 
                          className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedGuest(guest.id)}
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={guest.avatar} />
                            <AvatarFallback>{guest.name[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{guest.name}</h3>
                              {guest.isVIP && <Crown className="h-4 w-4 text-yellow-500" />}
                              {guest.groupSize > 1 && (
                                <Badge variant="outline" size="sm">+{guest.groupSize - 1}</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                              <span className="flex items-center">
                                {getMethodIcon(guest.entryMethod)}
                                <span className="ml-1 capitalize">{guest.entryMethod}</span>
                              </span>
                              <span>Score: {guest.verificationScore}%</span>
                              <span>Attempts: {guest.attempts}</span>
                            </div>
                          </div>

                          <div className="text-right space-y-1">
                            <Badge className={getStatusColor(guest.entryStatus)}>
                              {guest.entryStatus.replace('_', ' ')}
                            </Badge>
                            <div className="text-xs text-gray-500">
                              {guest.entryTime ? new Date(guest.entryTime).toLocaleTimeString() : 'Waiting'}
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1">
                            <Badge 
                              variant="outline" 
                              size="sm"
                              className={
                                guest.fraudRisk === 'high' ? 'border-red-500 text-red-600' :
                                guest.fraudRisk === 'medium' ? 'border-yellow-500 text-yellow-600' :
                                'border-green-500 text-green-600'
                              }
                            >
                              {guest.fraudRisk} risk
                            </Badge>
                            {guest.entryStatus === 'pending' && (
                              <div className="flex space-x-1">
                                <Button size="sm" className="h-6 px-2 bg-green-500 hover:bg-green-600">
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-6 px-2">
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fraud Detection Tab */}
          <TabsContent value="fraud-detection" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Active Alerts */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Fraud Alerts
                    </div>
                    <Badge variant="destructive">
                      {alerts.filter(a => !a.resolved).length} active
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {alerts.map((alert) => (
                        <div 
                          key={alert.id}
                          className={`p-4 rounded-lg border-l-4 ${
                            alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                            alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                            alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                            'border-blue-500 bg-blue-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <AlertTriangle className={`h-4 w-4 ${
                                  alert.severity === 'critical' ? 'text-red-600' :
                                  alert.severity === 'high' ? 'text-orange-600' :
                                  alert.severity === 'medium' ? 'text-yellow-600' :
                                  'text-blue-600'
                                }`} />
                                <span className="font-semibold capitalize">
                                  {alert.alertType.replace('_', ' ')}
                                </span>
                                <Badge variant="outline" size="sm">
                                  {alert.severity}
                                </Badge>
                              </div>
                              
                              <h4 className="font-medium">{alert.guestName}</h4>
                              <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                              
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>Confidence: {alert.confidence}%</span>
                                <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                <span className="capitalize">Action: {alert.action}</span>
                              </div>
                            </div>

                            {!alert.resolved && (
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => resolveFraudAlertMutation.mutate({ alertId: alert.id, action: 'approve' })}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => resolveFraudAlertMutation.mutate({ alertId: alert.id, action: 'block' })}
                                >
                                  Block
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Fraud Prevention Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Face Anti-Spoofing</label>
                      <Switch 
                        checked={entrySettings.fraudDetection}
                        onCheckedChange={(checked) => 
                          setEntrySettings(prev => ({ ...prev, fraudDetection: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">NFT Authenticity Check</label>
                      <Switch 
                        checked={entrySettings.nftVerification}
                        onCheckedChange={(checked) => 
                          setEntrySettings(prev => ({ ...prev, nftVerification: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Voice Deepfake Detection</label>
                      <Switch 
                        checked={entrySettings.voiceAuthentication}
                        onCheckedChange={(checked) => 
                          setEntrySettings(prev => ({ ...prev, voiceAuthentication: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Real-time Monitoring</label>
                      <Switch 
                        checked={entrySettings.realTimeTracking}
                        onCheckedChange={(checked) => 
                          setEntrySettings(prev => ({ ...prev, realTimeTracking: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Group Entry Support</label>
                      <Switch 
                        checked={entrySettings.groupEntry}
                        onCheckedChange={(checked) => 
                          setEntrySettings(prev => ({ ...prev, groupEntry: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Threat Levels</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-red-600">Critical</span>
                        <span>Auto-block</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-orange-600">High</span>
                        <span>Manual review</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-yellow-600">Medium</span>
                        <span>Flag for review</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-600">Low</span>
                        <span>Monitor only</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* NFT Management Tab */}
          <TabsContent value="nft-management" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Sample NFT passes would be displayed here */}
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg p-4 text-white">
                      <Crown className="h-8 w-8 mx-auto mb-2" />
                      <h3 className="font-bold">VIP ACCESS</h3>
                      <p className="text-sm opacity-90">Premium Experience</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm"><strong>Token ID:</strong> #1234</div>
                      <div className="text-sm"><strong>Tier:</strong> VIP</div>
                      <div className="text-sm"><strong>Owner:</strong> sarah.eth</div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>

                    <div className="pt-2 space-y-1 text-xs text-gray-600">
                      <div>✓ Priority Entry</div>
                      <div>✓ VIP Lounge Access</div>
                      <div>✓ Complimentary Drinks</div>
                      <div>✓ Meet & Greet</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gold-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-4 text-white">
                      <Star className="h-8 w-8 mx-auto mb-2" />
                      <h3 className="font-bold">PREMIUM</h3>
                      <p className="text-sm opacity-90">Enhanced Access</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm"><strong>Token ID:</strong> #5678</div>
                      <div className="text-sm"><strong>Tier:</strong> Premium</div>
                      <div className="text-sm"><strong>Owner:</strong> alex.eth</div>
                      <Badge className="bg-blue-500">Active</Badge>
                    </div>

                    <div className="pt-2 space-y-1 text-xs text-gray-600">
                      <div>✓ Fast Track Entry</div>
                      <div>✓ Premium Seating</div>
                      <div>✓ Welcome Drink</div>
                      <div>✓ Photo Opportunity</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-br from-gray-500 to-slate-500 rounded-lg p-4 text-white">
                      <Key className="h-8 w-8 mx-auto mb-2" />
                      <h3 className="font-bold">GENERAL</h3>
                      <p className="text-sm opacity-90">Standard Access</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm"><strong>Token ID:</strong> #9012</div>
                      <div className="text-sm"><strong>Tier:</strong> General</div>
                      <div className="text-sm"><strong>Owner:</strong> emma.eth</div>
                      <Badge variant="outline">Pending</Badge>
                    </div>

                    <div className="pt-2 space-y-1 text-xs text-gray-600">
                      <div>✓ Event Entry</div>
                      <div>✓ General Seating</div>
                      <div>✓ Basic Amenities</div>
                      <div>✓ Event Activities</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Key Metrics */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Entries</p>
                      <p className="text-2xl font-bold">{stats.successfulEntries}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">+23%</span>
                    <span className="text-gray-600 ml-1">vs last event</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Fraud Blocked</p>
                      <p className="text-2xl font-bold">{stats.fraudBlocked}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <Shield className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-gray-600">9.3% attempt rate</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Processing</p>
                      <p className="text-2xl font-bold">{stats.averageProcessingTime}s</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <Activity className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-gray-600">Real-time speed</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold">{Math.round((stats.successfulEntries / stats.totalAttempts) * 100)}%</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">High accuracy</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Method Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <Card>
                <CardHeader>
                  <CardTitle>Entry Method Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.methodBreakdown).map(([method, data]) => (
                      <div key={method} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getMethodIcon(method)}
                            <span className="font-medium capitalize">{method}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {Math.round((data.success / data.attempts) * 100)}%
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <div className="text-xs text-gray-600 mb-1">
                              {data.success}/{data.attempts} successful
                            </div>
                            <Progress 
                              value={(data.success / data.attempts) * 100} 
                              className="h-2"
                            />
                          </div>
                          <div className="w-16 text-right">
                            <div className="text-xs text-red-600">
                              {data.fraudDetected} fraud
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Real-time Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.realTimeMetrics.currentQueue}
                      </div>
                      <div className="text-sm text-gray-600">In Queue</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.realTimeMetrics.processingRate}/min
                      </div>
                      <div className="text-sm text-gray-600">Processing Rate</div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {stats.realTimeMetrics.errorRate}%
                      </div>
                      <div className="text-sm text-gray-600">Error Rate</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.realTimeMetrics.avgWaitTime}min
                      </div>
                      <div className="text-sm text-gray-600">Avg Wait</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}