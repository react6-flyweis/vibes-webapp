import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Lightbulb,
  Thermometer,
  Waves,
  Volume2,
  Activity,
  Users,
  Gauge,
  Zap,
  Home,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdaptiveEnvironment = () => {
  const [activeTab, setActiveTab] = useState("controls");
  const [currentMood, setCurrentMood] = useState("energetic");
  const [energyLevel, setEnergyLevel] = useState(75);
  const [guestCount, setGuestCount] = useState(24);
  const [isAutoMode, setIsAutoMode] = useState(true);

  const [environmentSettings, setEnvironmentSettings] = useState({
    lighting: {
      brightness: 70,
      color: "#4F46E5",
      warmth: 60,
      autoAdapt: true,
    },
    temperature: {
      current: 72,
      target: 74,
      autoAdjust: true,
    },
    scent: {
      intensity: 40,
      profile: "citrus-fresh",
      diffusionActive: true,
    },
    audio: {
      ambientLevel: 30,
      bassBoost: 50,
      spatialAudio: true,
    },
  });

  const { toast } = useToast();

  const moodProfiles = [
    {
      name: "energetic",
      color: "#EF4444",
      description: "High energy, vibrant atmosphere",
    },
    { name: "chill", color: "#3B82F6", description: "Relaxed, ambient vibes" },
    {
      name: "romantic",
      color: "#EC4899",
      description: "Intimate, warm lighting",
    },
    {
      name: "party",
      color: "#F59E0B",
      description: "Dynamic, colorful environment",
    },
  ];

  const scentProfiles = [
    {
      id: "citrus-fresh",
      name: "Citrus Fresh",
      description: "Energizing lemon and lime",
    },
    {
      id: "lavender-calm",
      name: "Lavender Calm",
      description: "Relaxing floral blend",
    },
    {
      id: "vanilla-warm",
      name: "Vanilla Warm",
      description: "Cozy and inviting",
    },
    {
      id: "eucalyptus-zen",
      name: "Eucalyptus Zen",
      description: "Clear and refreshing",
    },
  ];

  const updateEnvironment = (category: string, setting: string, value: any) => {
    setEnvironmentSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));

    toast({
      title: "Environment Updated",
      description: `${category} ${setting} adjusted based on current vibe.`,
    });
  };

  const adaptToMood = (mood: string) => {
    setCurrentMood(mood);

    // Simulate real-time adaptation based on mood
    switch (mood) {
      case "energetic":
        updateEnvironment("lighting", "brightness", 85);
        updateEnvironment("lighting", "color", "#EF4444");
        updateEnvironment("temperature", "target", 70);
        break;
      case "chill":
        updateEnvironment("lighting", "brightness", 45);
        updateEnvironment("lighting", "color", "#3B82F6");
        updateEnvironment("temperature", "target", 75);
        break;
      case "romantic":
        updateEnvironment("lighting", "brightness", 30);
        updateEnvironment("lighting", "color", "#EC4899");
        updateEnvironment("temperature", "target", 76);
        break;
      case "party":
        updateEnvironment("lighting", "brightness", 95);
        updateEnvironment("lighting", "color", "#F59E0B");
        updateEnvironment("temperature", "target", 68);
        break;
    }

    toast({
      title: "Mood Adaptation Complete",
      description: `Environment adapted to ${mood} vibes.`,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <Zap className="w-10 h-10 text-indigo-600 mr-4" />
                Adaptive Environment Control
              </h1>
              <p className="text-gray-600 mt-2">
                Smart venue integration that responds to crowd energy and music
              </p>
            </div>
            <div className="text-right">
              <Badge
                className={`px-4 py-2 mb-2 ${
                  isAutoMode ? "bg-green-600" : "bg-gray-600"
                } text-white`}
              >
                <Activity className="w-4 h-4 mr-2" />
                {isAutoMode ? "Auto-Adaptive Mode" : "Manual Control"}
              </Badge>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-600">Auto Mode</span>
                <Switch checked={isAutoMode} onCheckedChange={setIsAutoMode} />
              </div>
            </div>
          </div>

          {/* Live Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  Crowd Energy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {energyLevel}%
                </div>
                <p className="text-sm text-gray-600">Real-time analysis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Guest Count
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {guestCount}
                </div>
                <p className="text-sm text-gray-600">Currently present</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Thermometer className="w-5 h-5 mr-2 text-orange-600" />
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {environmentSettings.temperature.current}°F
                </div>
                <p className="text-sm text-gray-600">
                  Target: {environmentSettings.temperature.target}°F
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Gauge className="w-5 h-5 mr-2 text-purple-600" />
                  Current Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-purple-600 capitalize">
                  {currentMood}
                </div>
                <p className="text-sm text-gray-600">AI detected</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="controls" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Controls
            </TabsTrigger>
            <TabsTrigger value="lighting" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Lighting
            </TabsTrigger>
            <TabsTrigger value="climate" className="flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Climate
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* Main Controls */}
          <TabsContent value="controls" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mood Profiles</CardTitle>
                  <CardDescription>
                    Quick environment presets based on party vibe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {moodProfiles.map((mood) => (
                      <Button
                        key={mood.name}
                        variant={
                          currentMood === mood.name ? "default" : "outline"
                        }
                        className="h-auto p-4 flex flex-col items-start"
                        onClick={() => adaptToMood(mood.name)}
                      >
                        <div
                          className="w-4 h-4 rounded-full mb-2"
                          style={{ backgroundColor: mood.color }}
                        />
                        <span className="font-semibold capitalize">
                          {mood.name}
                        </span>
                        <span className="text-xs text-left opacity-75">
                          {mood.description}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Energy Response</CardTitle>
                  <CardDescription>
                    How environment adapts to crowd energy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Energy Sensitivity
                      </label>
                      <Slider
                        value={[75]}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        How quickly environment responds to energy changes
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Response Speed
                      </label>
                      <Slider
                        value={[60]}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Delay before adapting to new energy levels
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Music Sync</label>
                        <p className="text-sm text-gray-600">
                          Sync lighting to music beats
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Scent Diffusion</CardTitle>
                <CardDescription>
                  Automated scent control based on party atmosphere
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Scent Profile
                    </label>
                    <div className="space-y-2">
                      {scentProfiles.map((scent) => (
                        <Button
                          key={scent.id}
                          variant={
                            environmentSettings.scent.profile === scent.id
                              ? "default"
                              : "outline"
                          }
                          className="w-full justify-start h-auto p-3"
                          onClick={() =>
                            updateEnvironment("scent", "profile", scent.id)
                          }
                        >
                          <div className="text-left">
                            <div className="font-semibold">{scent.name}</div>
                            <div className="text-sm opacity-75">
                              {scent.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Intensity
                      </label>
                      <Slider
                        value={[environmentSettings.scent.intensity]}
                        max={100}
                        step={1}
                        className="w-full"
                        onValueChange={(value) =>
                          updateEnvironment("scent", "intensity", value[0])
                        }
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Current: {environmentSettings.scent.intensity}%
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Auto Diffusion</label>
                        <p className="text-sm text-gray-600">
                          Adjust intensity automatically
                        </p>
                      </div>
                      <Switch
                        checked={environmentSettings.scent.diffusionActive}
                        onCheckedChange={(checked) =>
                          updateEnvironment("scent", "diffusionActive", checked)
                        }
                      />
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Waves className="w-5 h-5 text-blue-600 mb-2" />
                      <p className="text-sm font-medium text-blue-800">
                        Diffusion Active
                      </p>
                      <p className="text-xs text-blue-600">
                        Current profile:{" "}
                        {
                          scentProfiles.find(
                            (s) => s.id === environmentSettings.scent.profile
                          )?.name
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lighting Controls */}
          <TabsContent value="lighting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dynamic Lighting</CardTitle>
                  <CardDescription>
                    Real-time lighting adaptation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Brightness
                    </label>
                    <Slider
                      value={[environmentSettings.lighting.brightness]}
                      max={100}
                      step={1}
                      className="w-full"
                      onValueChange={(value) =>
                        updateEnvironment("lighting", "brightness", value[0])
                      }
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      {environmentSettings.lighting.brightness}%
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Color Temperature
                    </label>
                    <Slider
                      value={[environmentSettings.lighting.warmth]}
                      max={100}
                      step={1}
                      className="w-full"
                      onValueChange={(value) =>
                        updateEnvironment("lighting", "warmth", value[0])
                      }
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      {environmentSettings.lighting.warmth < 30
                        ? "Cool"
                        : environmentSettings.lighting.warmth < 70
                        ? "Neutral"
                        : "Warm"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">
                        Auto Color Adaptation
                      </label>
                      <p className="text-sm text-gray-600">
                        Match music and energy
                      </p>
                    </div>
                    <Switch
                      checked={environmentSettings.lighting.autoAdapt}
                      onCheckedChange={(checked) =>
                        updateEnvironment("lighting", "autoAdapt", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Color Preview</CardTitle>
                  <CardDescription>Current lighting atmosphere</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="aspect-square rounded-lg mb-4 flex items-center justify-center"
                    style={{
                      backgroundColor: environmentSettings.lighting.color,
                      opacity: environmentSettings.lighting.brightness / 100,
                    }}
                  >
                    <Lightbulb className="w-16 h-16 text-white" />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      "#EF4444",
                      "#3B82F6",
                      "#EC4899",
                      "#F59E0B",
                      "#10B981",
                      "#8B5CF6",
                      "#F97316",
                      "#06B6D4",
                    ].map((color) => (
                      <button
                        key={color}
                        className="w-full aspect-square rounded-md border-2 border-gray-200 hover:border-gray-400"
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          updateEnvironment("lighting", "color", color)
                        }
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Climate Controls */}
          <TabsContent value="climate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Temperature Control</CardTitle>
                  <CardDescription>
                    Smart climate adjustment based on crowd
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Target Temperature
                    </label>
                    <Slider
                      value={[environmentSettings.temperature.target]}
                      min={65}
                      max={80}
                      step={1}
                      className="w-full"
                      onValueChange={(value) =>
                        updateEnvironment("temperature", "target", value[0])
                      }
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      {environmentSettings.temperature.target}°F
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">
                        Auto-Adjust for Crowd
                      </label>
                      <p className="text-sm text-gray-600">
                        Lower temp as more guests arrive
                      </p>
                    </div>
                    <Switch
                      checked={environmentSettings.temperature.autoAdjust}
                      onCheckedChange={(checked) =>
                        updateEnvironment("temperature", "autoAdjust", checked)
                      }
                    />
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <Thermometer className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-sm font-medium text-green-800">
                      Climate Status
                    </p>
                    <p className="text-xs text-green-600">
                      Currently {environmentSettings.temperature.current}°F,
                      adjusting to {environmentSettings.temperature.target}°F
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audio Environment</CardTitle>
                  <CardDescription>
                    Sound-responsive environmental controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ambient Audio Level
                    </label>
                    <Slider
                      value={[environmentSettings.audio.ambientLevel]}
                      max={100}
                      step={1}
                      className="w-full"
                      onValueChange={(value) =>
                        updateEnvironment("audio", "ambientLevel", value[0])
                      }
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      {environmentSettings.audio.ambientLevel}%
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bass Response
                    </label>
                    <Slider
                      value={[environmentSettings.audio.bassBoost]}
                      max={100}
                      step={1}
                      className="w-full"
                      onValueChange={(value) =>
                        updateEnvironment("audio", "bassBoost", value[0])
                      }
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      How lighting responds to bass drops
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Spatial Audio</label>
                      <p className="text-sm text-gray-600">
                        3D environmental sound
                      </p>
                    </div>
                    <Switch
                      checked={environmentSettings.audio.spatialAudio}
                      onCheckedChange={(checked) =>
                        updateEnvironment("audio", "spatialAudio", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Smart Home Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Home Platforms</CardTitle>
                  <CardDescription>
                    Connect with your existing smart home setup
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Home className="w-4 h-4 mr-2" />
                    Connect Philips Hue
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Home className="w-4 h-4 mr-2" />
                    Link Nest Thermostat
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Home className="w-4 h-4 mr-2" />
                    Add LIFX Bulbs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Home className="w-4 h-4 mr-2" />
                    Connect Sonos System
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Venue Integration</CardTitle>
                  <CardDescription>
                    Professional venue management systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Zap className="w-4 h-4 mr-2" />
                    DMX Lighting Controller
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Thermometer className="w-4 h-4 mr-2" />
                    HVAC Management System
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Waves className="w-4 h-4 mr-2" />
                    Scent Diffusion Network
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Professional Audio System
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdaptiveEnvironment;
