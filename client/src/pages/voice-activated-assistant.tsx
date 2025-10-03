import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  Send,
  Settings,
  Headphones,
  Radio,
  Brain,
  Zap,
  Star,
  Users,
  Calendar,
  MapPin,
  Clock,
  Music,
  Camera,
  Search,
  Info,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  Bookmark,
  Heart,
  ThumbsUp,
  RefreshCw,
  Activity,
  Lightbulb,
  HelpCircle
} from "lucide-react";

interface VoiceCommand {
  id: string;
  command: string;
  category: string;
  description: string;
  example: string;
  isActive: boolean;
}

interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioUrl?: string;
  confidence?: number;
}

interface VoiceSettings {
  language: string;
  voice: string;
  speed: number;
  volume: number;
  autoListen: boolean;
  wakeWord: string;
  noiseReduction: boolean;
}

interface AssistantCapability {
  id: string;
  name: string;
  description: string;
  category: string;
  examples: string[];
  isEnabled: boolean;
}

export default function VoiceActivatedAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    language: "en-US",
    voice: "female",
    speed: 1.0,
    volume: 0.8,
    autoListen: true,
    wakeWord: "Hey Vibes",
    noiseReduction: true
  });
  const [audioLevel, setAudioLevel] = useState(0);
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch conversation history
  const { data: conversation, isLoading } = useQuery({
    queryKey: ['/api/voice-assistant/conversation'],
    retry: false,
  });

  // Fetch voice commands
  const { data: voiceCommands } = useQuery({
    queryKey: ['/api/voice-assistant/commands'],
    retry: false,
  });

  // Fetch assistant capabilities
  const { data: capabilities } = useQuery({
    queryKey: ['/api/voice-assistant/capabilities'],
    retry: false,
  });

  // Send voice command mutation
  const sendCommandMutation = useMutation({
    mutationFn: async (data: { command: string; audioData?: string }) => {
      return await apiRequest("POST", "/api/voice-assistant/process", data);
    },
    onSuccess: (response) => {
      if (response.audioResponse) {
        playAudioResponse(response.audioResponse);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/voice-assistant/conversation'] });
    },
  });

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = voiceSettings.language;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (voiceSettings.autoListen && isWakeWordActive) {
            startListening();
          }
        };

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setCurrentMessage(finalTranscript || interimTranscript);

          if (finalTranscript) {
            processVoiceCommand(finalTranscript, event.results[event.results.length - 1][0].confidence);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [voiceSettings.language, voiceSettings.autoListen, isWakeWordActive]);

  // Audio level monitoring
  useEffect(() => {
    let animationFrame: number;

    const updateAudioLevel = () => {
      if (isListening) {
        setAudioLevel(prev => {
          const newLevel = Math.random() * 100;
          return newLevel > prev ? newLevel : prev * 0.95;
        });
      } else {
        setAudioLevel(prev => prev * 0.9);
      }
      animationFrame = requestAnimationFrame(updateAudioLevel);
    };

    animationFrame = requestAnimationFrame(updateAudioLevel);
    return () => cancelAnimationFrame(animationFrame);
  }, [isListening]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const processVoiceCommand = (command: string, confidence: number = 1) => {
    const lowerCommand = command.toLowerCase();
    
    // Check for wake word
    if (lowerCommand.includes(voiceSettings.wakeWord.toLowerCase())) {
      setIsWakeWordActive(true);
      toast({
        title: "Wake word detected",
        description: "Voice assistant is now active and listening.",
      });
      return;
    }

    // Process command if wake word is active or auto-listen is disabled
    if (isWakeWordActive || !voiceSettings.autoListen) {
      sendCommandMutation.mutate({
        command: command,
      });
      setCurrentMessage("");
      if (isWakeWordActive) {
        setIsWakeWordActive(false);
      }
    }
  };

  const playAudioResponse = (audioData: string) => {
    if (synthRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(audioData);
      utterance.lang = voiceSettings.language;
      utterance.rate = voiceSettings.speed;
      utterance.volume = voiceSettings.volume;
      
      const voices = synthRef.current.getVoices();
      const selectedVoice = voices.find(voice => 
        voice.lang.includes(voiceSettings.language.split('-')[0]) &&
        (voiceSettings.voice === 'female' ? voice.name.includes('female') || voice.name.includes('woman') : voice.name.includes('male') || voice.name.includes('man'))
      );
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    }
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      processVoiceCommand(currentMessage, 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl">
              <Mic className="w-12 h-12 text-white" />
            </div>
            <div className="p-4 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <div className="p-4 bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl">
              <Volume2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Voice-Activated Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Control your events with natural voice commands and intelligent conversation
          </p>
        </div>

        <Tabs defaultValue="conversation" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 mx-auto">
            <TabsTrigger value="conversation" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Conversation
            </TabsTrigger>
            <TabsTrigger value="commands" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Commands
            </TabsTrigger>
            <TabsTrigger value="capabilities" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Capabilities
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Conversation Tab */}
          <TabsContent value="conversation" className="space-y-6">
            {/* Voice Control Interface */}
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Main Voice Button */}
                  <div className="relative">
                    <Button
                      size="lg"
                      variant={isListening ? "destructive" : "default"}
                      onClick={isListening ? stopListening : startListening}
                      className={`w-32 h-32 rounded-full text-2xl font-bold transition-all duration-300 ${
                        isListening ? 'animate-pulse shadow-2xl' : ''
                      }`}
                      style={{
                        transform: `scale(${1 + audioLevel / 500})`,
                      }}
                    >
                      {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
                    </Button>
                    
                    {/* Audio Level Indicator */}
                    {isListening && (
                      <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping" />
                    )}
                  </div>

                  {/* Status Display */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-4">
                      <Badge variant={isListening ? "destructive" : "secondary"}>
                        {isListening ? "Listening..." : "Ready to listen"}
                      </Badge>
                      {isSpeaking && (
                        <Badge variant="default" className="animate-pulse">
                          <Volume2 className="w-3 h-3 mr-1" />
                          Speaking
                        </Badge>
                      )}
                      {isWakeWordActive && (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          Wake word active
                        </Badge>
                      )}
                    </div>
                    
                    {currentMessage && (
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="text-lg">{currentMessage}</p>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conversation History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Conversation History
                </CardTitle>
                <CardDescription>Your recent interactions with the voice assistant</CardDescription>
              </CardHeader>
              <CardContent>
                {conversation && Array.isArray(conversation) && conversation.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(conversation as any[]).map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                            {message.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {Math.round(message.confidence * 100)}% confidence
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">Start a Conversation</h3>
                    <p className="text-gray-500">Try saying "Hey Vibes, what events are happening today?"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Text Input Alternative */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message or use voice..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || sendCommandMutation.isPending}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commands Tab */}
          <TabsContent value="commands" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Voice Commands
                </CardTitle>
                <CardDescription>Available voice commands organized by category</CardDescription>
              </CardHeader>
              <CardContent>
                {voiceCommands && Array.isArray(voiceCommands) && voiceCommands.length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(
                      (voiceCommands as any[]).reduce((acc, cmd) => {
                        if (!acc[cmd.category]) acc[cmd.category] = [];
                        acc[cmd.category].push(cmd);
                        return acc;
                      }, {} as Record<string, any[]>)
                    ).map(([category, commands]) => (
                      <div key={category} className="space-y-3">
                        <h3 className="text-lg font-semibold capitalize border-b pb-2">
                          {category.replace('-', ' ')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {commands.map((command) => (
                            <Card key={command.id} className="p-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{command.command}</h4>
                                  <Badge variant={command.isActive ? "default" : "secondary"}>
                                    {command.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {command.description}
                                </p>
                                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm font-mono">
                                  "{command.example}"
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Zap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">No Commands Available</h3>
                    <p className="text-gray-500">Voice commands will be loaded automatically.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Capabilities Tab */}
          <TabsContent value="capabilities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Assistant Capabilities
                </CardTitle>
                <CardDescription>What the voice assistant can help you with</CardDescription>
              </CardHeader>
              <CardContent>
                {capabilities && Array.isArray(capabilities) && capabilities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(capabilities as any[]).map((capability) => (
                      <Card key={capability.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{capability.name}</h3>
                            <Badge variant={capability.isEnabled ? "default" : "secondary"}>
                              {capability.isEnabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {capability.description}
                          </p>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Examples:</h4>
                            <ul className="text-xs space-y-1">
                              {capability.examples.map((example: string, index: number) => (
                                <li key={index} className="p-1 bg-gray-50 dark:bg-gray-800 rounded">
                                  "{example}"
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">Loading Capabilities</h3>
                    <p className="text-gray-500">Assistant capabilities are being initialized.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Voice Settings
                </CardTitle>
                <CardDescription>Customize your voice assistant experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Language</label>
                      <select 
                        className="w-full mt-1 p-2 border rounded-md"
                        value={voiceSettings.language}
                        onChange={(e) => setVoiceSettings(prev => ({ ...prev, language: e.target.value }))}
                      >
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                        <option value="de-DE">German</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Voice Type</label>
                      <select 
                        className="w-full mt-1 p-2 border rounded-md"
                        value={voiceSettings.voice}
                        onChange={(e) => setVoiceSettings(prev => ({ ...prev, voice: e.target.value }))}
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Wake Word</label>
                      <Input
                        value={voiceSettings.wakeWord}
                        onChange={(e) => setVoiceSettings(prev => ({ ...prev, wakeWord: e.target.value }))}
                        placeholder="Hey Vibes"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Speech Speed: {voiceSettings.speed}x</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={voiceSettings.speed}
                        onChange={(e) => setVoiceSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                        className="w-full mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Volume: {Math.round(voiceSettings.volume * 100)}%</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={voiceSettings.volume}
                        onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                        className="w-full mt-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={voiceSettings.autoListen}
                          onChange={(e) => setVoiceSettings(prev => ({ ...prev, autoListen: e.target.checked }))}
                        />
                        <span className="text-sm font-medium">Auto-listen after wake word</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={voiceSettings.noiseReduction}
                          onChange={(e) => setVoiceSettings(prev => ({ ...prev, noiseReduction: e.target.checked }))}
                        />
                        <span className="text-sm font-medium">Noise reduction</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline">Test Voice</Button>
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}