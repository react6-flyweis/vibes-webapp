import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Camera, 
  Upload, 
  Move3D, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Save,
  Share2,
  Eye,
  Users,
  Lightbulb,
  Sofa,
  Music,
  Utensils,
  Palette,
  Grid3X3,
  Download,
  Smartphone,
  Monitor
} from "lucide-react";

interface SpaceItem {
  id: string;
  type: 'table' | 'chair' | 'stage' | 'bar' | 'decoration' | 'lighting';
  name: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  color: string;
}

interface GuestFlowData {
  entrancePoints: Array<{ x: number; y: number; traffic: number }>;
  danceFloorActivity: number;
  barTraffic: number;
  seatingUtilization: number;
  bottlenecks: Array<{ x: number; y: number; severity: 'low' | 'medium' | 'high' }>;
}

export default function ARSpacePlanner() {
  const [spaceMode, setSpaceMode] = useState<'upload' | 'virtual' | 'ar'>('virtual');
  const [selectedSpace, setSelectedSpace] = useState('living-room');
  const [spaceItems, setSpaceItems] = useState<SpaceItem[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('table');
  const [roomDimensions, setRoomDimensions] = useState({ width: 20, height: 15 });
  const [guestCount, setGuestCount] = useState(20);
  const [showGuestFlow, setShowGuestFlow] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const virtualSpaces = [
    { id: 'living-room', name: 'Living Room', dimensions: '20x15 ft' },
    { id: 'backyard', name: 'Backyard', dimensions: '30x25 ft' },
    { id: 'event-hall', name: 'Event Hall', dimensions: '40x30 ft' },
    { id: 'restaurant', name: 'Restaurant Space', dimensions: '35x20 ft' },
    { id: 'outdoor-park', name: 'Outdoor Park', dimensions: '50x40 ft' }
  ];

  const planningTools = [
    { id: 'table', name: 'Table', icon: Grid3X3, color: '#8B4513' },
    { id: 'chair', name: 'Chair', icon: Sofa, color: '#654321' },
    { id: 'stage', name: 'Stage/DJ Area', icon: Music, color: '#4A90E2' },
    { id: 'bar', name: 'Bar/Food Station', icon: Utensils, color: '#E74C3C' },
    { id: 'decoration', name: 'Decoration', icon: Palette, color: '#9B59B6' },
    { id: 'lighting', name: 'Lighting', icon: Lightbulb, color: '#F39C12' }
  ];

  const generateGuestFlow = (): GuestFlowData => {
    return {
      entrancePoints: [
        { x: 2, y: 7, traffic: 85 },
        { x: 18, y: 2, traffic: 15 }
      ],
      danceFloorActivity: Math.random() * 100,
      barTraffic: Math.random() * 100,
      seatingUtilization: Math.random() * 100,
      bottlenecks: [
        { x: 10, y: 8, severity: 'medium' as const },
        { x: 15, y: 12, severity: 'low' as const }
      ]
    };
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setSpaceMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const addItemToSpace = (type: string) => {
    const newItem: SpaceItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: type as SpaceItem['type'],
      name: planningTools.find(t => t.id === type)?.name || type,
      x: Math.random() * (roomDimensions.width - 2) + 1,
      y: Math.random() * (roomDimensions.height - 2) + 1,
      rotation: 0,
      width: type === 'table' ? 4 : type === 'stage' ? 6 : 2,
      height: type === 'table' ? 4 : type === 'stage' ? 4 : 2,
      color: planningTools.find(t => t.id === type)?.color || '#666666'
    };
    setSpaceItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setSpaceItems(prev => prev.filter(item => item.id !== id));
  };

  const guestFlowData = generateGuestFlow();

  return (
    <div className="min-h-screen bg-[#111827]  ">
      <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8 max-w-7xl text-white">
        <h1 className="text-4xl font-bold text-white dark:text-white mb-4 p-6">
          <Move3D className="inline-block mr-3 h-10 w-10 text-blue-600" />
          3D/AR Space Planner
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Design your event space in 3D. Upload your venue photos or choose virtual rooms, then drag and drop furniture, decorations, and plan the perfect layout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Space Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Camera className="mr-2 h-5 w-5" />
                Choose Your Space
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={spaceMode} onValueChange={(value) => setSpaceMode(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="virtual">Virtual</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="ar">AR View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="virtual" className="space-y-3">
                  <Label>Select Virtual Space</Label>
                  <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {virtualSpaces.map(space => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.name} ({space.dimensions})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>
                
                <TabsContent value="upload" className="space-y-3">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline" 
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Venue Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploadedImage && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Photo uploaded successfully
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="ar" className="space-y-3">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <Smartphone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm">AR features work best on mobile devices</p>
                    <Button className="mt-2 w-full" size="sm">
                      Open on Mobile
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Room Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Room Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Room Width (ft)</Label>
                <Slider
                  value={[roomDimensions.width]}
                  onValueChange={(value) => setRoomDimensions(prev => ({ ...prev, width: value[0] }))}
                  max={50}
                  min={10}
                  step={1}
                  className="mt-2"
                />
                <div className="text-sm text-gray-600 dark:text-gray-300">{roomDimensions.width} ft</div>
              </div>
              <div>
                <Label>Room Height (ft)</Label>
                <Slider
                  value={[roomDimensions.height]}
                  onValueChange={(value) => setRoomDimensions(prev => ({ ...prev, height: value[0] }))}
                  max={40}
                  min={8}
                  step={1}
                  className="mt-2"
                />
                <div className="text-sm text-gray-600 dark:text-gray-300">{roomDimensions.height} ft</div>
              </div>
              <div>
                <Label>Expected Guests</Label>
                <Input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Planning Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Planning Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {planningTools.map(tool => {
                  const IconComponent = tool.icon;
                  return (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedTool(tool.id);
                        addItemToSpace(tool.id);
                      }}
                      className="flex flex-col h-16 p-2"
                    >
                      <IconComponent className="h-5 w-5 mb-1" />
                      <span className="text-xs">{tool.name}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Guest Flow Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Guest Flow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setShowGuestFlow(!showGuestFlow)}
                variant={showGuestFlow ? "default" : "outline"}
                className="w-full"
              >
                <Users className="mr-2 h-4 w-4" />
                {showGuestFlow ? 'Hide' : 'Show'} Guest Flow
              </Button>
              
              {showGuestFlow && (
                <div className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Dance Floor Activity:</span>
                      <Badge variant="secondary">{Math.round(guestFlowData.danceFloorActivity)}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Bar Traffic:</span>
                      <Badge variant="secondary">{Math.round(guestFlowData.barTraffic)}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Seating Usage:</span>
                      <Badge variant="secondary">{Math.round(guestFlowData.seatingUtilization)}%</Badge>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    Red areas indicate potential bottlenecks
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Planning Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Monitor className="mr-2 h-5 w-5" />
                3D Space Designer
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800 rounded-b-lg overflow-hidden">
                {/* Background Image or Virtual Space */}
                {spaceMode === 'upload' && uploadedImage ? (
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded venue" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-600">
                    <div className="absolute inset-4 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg">
                      <div className="absolute top-2 left-2 text-sm text-gray-500 dark:text-gray-400">
                        {virtualSpaces.find(s => s.id === selectedSpace)?.name} - 
                        {roomDimensions.width}x{roomDimensions.height} ft
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#666" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Placed Items */}
                {spaceItems.map(item => (
                  <div
                    key={item.id}
                    className="absolute cursor-move border-2 border-gray-400 rounded shadow-lg flex items-center justify-center text-white text-xs font-semibold hover:border-blue-500 transition-colors"
                    style={{
                      left: `${(item.x / roomDimensions.width) * 100}%`,
                      top: `${(item.y / roomDimensions.height) * 100}%`,
                      width: `${(item.width / roomDimensions.width) * 100}%`,
                      height: `${(item.height / roomDimensions.height) * 100}%`,
                      backgroundColor: item.color,
                      transform: `rotate(${item.rotation}deg)`
                    }}
                    onClick={() => removeItem(item.id)}
                    title={`Click to remove ${item.name}`}
                  >
                    {item.name}
                  </div>
                ))}

                {/* Guest Flow Overlay */}
                {showGuestFlow && (
                  <>
                    {/* Entrance Points */}
                    {guestFlowData.entrancePoints.map((point, idx) => (
                      <div
                        key={`entrance-${idx}`}
                        className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"
                        style={{
                          left: `${(point.x / roomDimensions.width) * 100}%`,
                          top: `${(point.y / roomDimensions.height) * 100}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        title={`Entrance - ${point.traffic}% of traffic`}
                      />
                    ))}

                    {/* Bottlenecks */}
                    {guestFlowData.bottlenecks.map((bottleneck, idx) => (
                      <div
                        key={`bottleneck-${idx}`}
                        className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                          bottleneck.severity === 'high' ? 'bg-red-500' :
                          bottleneck.severity === 'medium' ? 'bg-yellow-500' : 'bg-orange-500'
                        }`}
                        style={{
                          left: `${(bottleneck.x / roomDimensions.width) * 100}%`,
                          top: `${(bottleneck.y / roomDimensions.height) * 100}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        title={`${bottleneck.severity} congestion area`}
                      />
                    ))}

                    {/* Heat Map Areas */}
                    <div 
                      className="absolute bg-red-300 opacity-30 rounded-full"
                      style={{
                        left: '60%',
                        top: '40%',
                        width: '20%',
                        height: '25%',
                        transform: 'translate(-50%, -50%)'
                      }}
                      title="High activity dance floor area"
                    />
                  </>
                )}

                {/* Instructions */}
                {spaceItems.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                      <Move3D className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Start Planning Your Space</h3>
                      <p className="text-sm">Click the tools on the left to add tables, chairs, and decorations.</p>
                      <p className="text-xs mt-2">Click on placed items to remove them.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <Button className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save Layout
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share with Team
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export 3D View
            </Button>
          </div>
        </div>
      </div>

      {/* Space Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{spaceItems.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Items Placed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((spaceItems.length / guestCount) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Space Utilization</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {roomDimensions.width * roomDimensions.height}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Sq Ft</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((roomDimensions.width * roomDimensions.height) / guestCount)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Sq Ft per Guest</div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}