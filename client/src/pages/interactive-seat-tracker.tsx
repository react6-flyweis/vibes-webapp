import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, MapPin, Clock, Search, User, CheckCircle, XCircle, AlertCircle, Star, Crown, Briefcase, Heart, Settings, Move, Plus, Info, Trash2, Table, LayoutGrid, Box, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface Seat {
  id: string;
  tableNumber: number;
  seatNumber: number;
  status: 'available' | 'reserved' | 'occupied' | 'vip';
  guestName?: string;
  guestId?: string;
  reservedAt?: Date;
  specialRequests?: string;
  dietaryRestrictions?: string[];
  x: number;
  y: number;
  type: 'round' | 'rectangular' | 'bar' | 'lounge';
}

interface Table {
  id: string;
  number: number;
  capacity: number;
  type: 'round' | 'rectangular' | 'bar' | 'lounge';
  x: number;
  y: number;
  width: number;
  height: number;
  seats: Seat[];
  reservedFor?: string;
  reservationType?: 'vip' | 'family' | 'business' | 'special';
  reservationNotes?: string;
  minimumSpend?: number;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  status: 'invited' | 'confirmed' | 'checked-in' | 'seated';
  tableAssignment?: number;
  seatAssignment?: string;
  arrivalTime?: Date;
  specialRequests?: string;
  plusOnes: number;
}

export default function InteractiveSeatTracker() {
  const [tables, setTables] = useState<Table[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'floor-plan' | 'table-list' | 'guest-list' | '3d-view'>('floor-plan');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [isTableManagementMode, setIsTableManagementMode] = useState(false);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [cameraAngle, setCameraAngle] = useState({ x: 45, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [animationMode, setAnimationMode] = useState<'none' | 'allocation' | 'heatmap' | 'mood'>('none');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [showOptimization, setShowOptimization] = useState(false);
  const [interactionHeatmap, setInteractionHeatmap] = useState<Map<string, number>>(new Map());
  const [moodLighting, setMoodLighting] = useState({ intensity: 0.5, color: 'warm' });

  // Initialize sample data
  useEffect(() => {
    const sampleTables: Table[] = [
      {
        id: 'table-1',
        number: 1,
        capacity: 8,
        type: 'round',
        x: 100,
        y: 100,
        width: 120,
        height: 120,
        seats: Array.from({ length: 8 }, (_, i) => ({
          id: `table-1-seat-${i + 1}`,
          tableNumber: 1,
          seatNumber: i + 1,
          status: i < 3 ? 'occupied' : i < 6 ? 'reserved' : 'available',
          guestName: i < 3 ? `Guest ${i + 1}` : i < 6 ? `Reserved ${i + 1}` : undefined,
          x: 100 + 60 * Math.cos((i * 2 * Math.PI) / 8),
          y: 100 + 60 * Math.sin((i * 2 * Math.PI) / 8),
          type: 'round'
        }))
      },
      {
        id: 'table-2',
        number: 2,
        capacity: 6,
        type: 'rectangular',
        x: 300,
        y: 150,
        width: 150,
        height: 80,
        reservedFor: 'Johnson Family',
        reservationType: 'family',
        reservationNotes: 'Birthday celebration for grandmother, wheelchair accessible needed',
        seats: Array.from({ length: 6 }, (_, i) => ({
          id: `table-2-seat-${i + 1}`,
          tableNumber: 2,
          seatNumber: i + 1,
          status: i < 2 ? 'vip' : i < 4 ? 'reserved' : 'available',
          guestName: i < 2 ? `VIP Guest ${i + 1}` : i < 4 ? `Reserved ${i + 1}` : undefined,
          x: 300 + (i % 3) * 50,
          y: 150 + Math.floor(i / 3) * 40,
          type: 'rectangular'
        }))
      },
      {
        id: 'table-3',
        number: 3,
        capacity: 10,
        type: 'round',
        x: 150,
        y: 320,
        width: 140,
        height: 140,
        seats: Array.from({ length: 10 }, (_, i) => ({
          id: `table-3-seat-${i + 1}`,
          tableNumber: 3,
          seatNumber: i + 1,
          status: 'available',
          x: 150 + 70 * Math.cos((i * 2 * Math.PI) / 10),
          y: 320 + 70 * Math.sin((i * 2 * Math.PI) / 10),
          type: 'round'
        }))
      },
      {
        id: 'bar-1',
        number: 4,
        capacity: 12,
        type: 'bar',
        x: 500,
        y: 100,
        width: 200,
        height: 60,
        seats: Array.from({ length: 12 }, (_, i) => ({
          id: `bar-1-seat-${i + 1}`,
          tableNumber: 4,
          seatNumber: i + 1,
          status: i % 3 === 0 ? 'occupied' : 'available',
          guestName: i % 3 === 0 ? `Bar Guest ${i + 1}` : undefined,
          x: 500 + i * 16,
          y: 100,
          type: 'bar'
        }))
      }
    ];

    const sampleGuests: Guest[] = [
      { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'seated', tableAssignment: 1, seatAssignment: 'table-1-seat-1', arrivalTime: new Date(), plusOnes: 0 },
      { id: '2', name: 'Bob Smith', email: 'bob@example.com', status: 'checked-in', tableAssignment: 1, plusOnes: 1 },
      { id: '3', name: 'Carol Davis', email: 'carol@example.com', status: 'confirmed', tableAssignment: 2, plusOnes: 0 },
      { id: '4', name: 'David Wilson', email: 'david@example.com', status: 'invited', plusOnes: 2 },
      { id: '5', name: 'Eva Brown', email: 'eva@example.com', status: 'seated', tableAssignment: 2, seatAssignment: 'table-2-seat-1', arrivalTime: new Date(), plusOnes: 0 }
    ];

    setTables(sampleTables);
    setGuests(sampleGuests);
  }, []);

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
    setSelectedTable(null);
    // Track interaction for heatmap
    setInteractionHeatmap(prev => new Map(prev.set(seat.id, (prev.get(seat.id) || 0) + 1)));
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setSelectedSeat(null);
    setShowReservationModal(true);
  };

  const handleTableReservation = (tableId: string, reservationData: {
    reservedFor: string;
    reservationType: 'vip' | 'family' | 'business' | 'special';
    reservationNotes?: string;
    minimumSpend?: number;
  }) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, ...reservationData }
        : table
    ));
    setShowReservationModal(false);
  };

  const handleRemoveReservation = (tableId: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { 
            ...table, 
            reservedFor: undefined, 
            reservationType: undefined, 
            reservationNotes: undefined, 
            minimumSpend: undefined 
          }
        : table
    ));
  };

  const handleTableDragStart = (tableId: string, event: React.MouseEvent | React.TouchEvent) => {
    if (!isTableManagementMode) return;
    
    setDraggedTable(tableId);
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    setDragOffset({
      x: clientX - table.x,
      y: clientY - table.y
    });
  };

  const handleTableDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!draggedTable || !isTableManagementMode) return;
    
    event.preventDefault();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const svgRect = (event.currentTarget as Element).getBoundingClientRect();
    const x = ((clientX - svgRect.left) / svgRect.width) * 800;
    const y = ((clientY - svgRect.top) / svgRect.height) * 500;
    
    setTables(prev => prev.map(table => 
      table.id === draggedTable 
        ? { ...table, x: Math.max(50, Math.min(750, x)), y: Math.max(50, Math.min(450, y)) }
        : table
    ));
  };

  const handleTableDragEnd = () => {
    setDraggedTable(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const addNewTable = (tableData: {
    type: 'round' | 'rectangular' | 'bar' | 'lounge';
    capacity: number;
  }) => {
    const newTableNumber = Math.max(...tables.map(t => t.number)) + 1;
    const newTable: Table = {
      id: `table-${Date.now()}`,
      number: newTableNumber,
      capacity: tableData.capacity,
      type: tableData.type,
      x: 150 + (tables.length * 50) % 600,
      y: 150 + Math.floor(tables.length / 12) * 100,
      width: tableData.type === 'round' ? 100 : tableData.type === 'bar' ? 150 : 120,
      height: tableData.type === 'round' ? 100 : tableData.type === 'bar' ? 80 : 80,
      seats: Array.from({ length: tableData.capacity }, (_, i) => ({
        id: `${newTableNumber}-${i + 1}`,
        tableNumber: newTableNumber,
        seatNumber: i + 1,
        status: 'available' as const,
        x: 0,
        y: 0,
        type: tableData.type,
        guestId: null
      }))
    };

    // Position seats around the table
    newTable.seats = newTable.seats.map((seat, index) => {
      const angle = (index / tableData.capacity) * 2 * Math.PI;
      const radius = tableData.type === 'round' ? 60 : 50;
      return {
        ...seat,
        x: newTable.x + Math.cos(angle) * radius,
        y: newTable.y + Math.sin(angle) * radius
      };
    });

    setTables(prev => [...prev, newTable]);
    setShowAddTableModal(false);
  };

  const deleteTable = (tableId: string) => {
    setTables(prev => prev.filter(table => table.id !== tableId));
  };

  const handleSeatAssignment = (guestId: string, seatId: string) => {
    setTables(prev => prev.map(table => ({
      ...table,
      seats: table.seats.map(seat => 
        seat.id === seatId 
          ? { ...seat, status: 'reserved', guestId, guestName: guests.find(g => g.id === guestId)?.name }
          : seat
      )
    })));

    setGuests(prev => prev.map(guest => 
      guest.id === guestId 
        ? { ...guest, seatAssignment: seatId, status: 'confirmed' }
        : guest
    ));
  };

  const handleCheckIn = (guestId: string) => {
    setGuests(prev => prev.map(guest => 
      guest.id === guestId 
        ? { ...guest, status: 'checked-in', arrivalTime: new Date() }
        : guest
    ));

    // Update seat status to occupied
    const guest = guests.find(g => g.id === guestId);
    if (guest?.seatAssignment) {
      setTables(prev => prev.map(table => ({
        ...table,
        seats: table.seats.map(seat => 
          seat.id === guest.seatAssignment 
            ? { ...seat, status: 'occupied' }
            : seat
        )
      })));
    }
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500 hover:bg-green-600';
      case 'reserved': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'occupied': return 'bg-red-500 hover:bg-red-600';
      case 'vip': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'reserved': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'occupied': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'vip': return <User className="w-4 h-4 text-purple-600" />;
      default: return null;
    }
  };



  // Generate AI seating optimization suggestions
  const generateAIOptimization = () => {
    const suggestions = [
      {
        id: 1,
        type: 'group_proximity',
        title: 'Group Similar Interests',
        description: 'Place guests with similar interests at adjacent tables for better networking',
        impact: 'High',
        tables: [1, 2, 3],
        efficiency: 92
      },
      {
        id: 2,
        type: 'social_balance',
        title: 'Balance Introverts/Extroverts',
        description: 'Mix personality types for optimal social dynamics',
        impact: 'Medium',
        tables: [4, 5],
        efficiency: 78
      },
      {
        id: 3,
        type: 'vip_positioning',
        title: 'Optimize VIP Placement',
        description: 'Position VIP guests for maximum visibility and comfort',
        impact: 'High',
        tables: [6],
        efficiency: 95
      },
      {
        id: 4,
        type: 'accessibility',
        title: 'Accessibility Optimization',
        description: 'Ensure accessible seating near entrances and facilities',
        impact: 'High',
        tables: [1, 7],
        efficiency: 88
      }
    ];
    setAiSuggestions(suggestions);
    setShowOptimization(true);
  };

  // Get heatmap intensity for seat interactions
  const getHeatmapIntensity = (seatId: string) => {
    const interactions = interactionHeatmap.get(seatId) || 0;
    const maxInteractions = Math.max(...Array.from(interactionHeatmap.values()), 1);
    return interactions / maxInteractions;
  };

  // Get mood lighting color based on venue atmosphere
  const getMoodLightingStyle = () => {
    const { intensity, color } = moodLighting;
    const colors = {
      warm: `rgba(255, 204, 153, ${intensity})`,
      cool: `rgba(153, 204, 255, ${intensity})`,
      vibrant: `rgba(255, 153, 204, ${intensity})`,
      calm: `rgba(204, 255, 153, ${intensity})`
    };
    return colors[color as keyof typeof colors] || colors.warm;
  };

  // Animation effects for seat allocation preview
  useEffect(() => {
    if (animationMode === 'allocation') {
      const interval = setInterval(() => {
        const availableSeats = tables.flatMap(t => t.seats.filter(s => s.status === 'available'));
        if (availableSeats.length > 0) {
          const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
          // Simulate allocation preview animation
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [animationMode, tables]);

  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSeats = tables.flatMap(table => table.seats).filter(seat => 
    filterStatus === 'all' || seat.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white dark:text-white mb-4 p-6">
            Interactive Seat Tracker
          </h1>
          <p className="text-xl text-white dark:text-gray-300">
            Real-time seating management for seamless party coordination
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <Label htmlFor="search">Search Guests</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Guest name or email..."
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Label>View Mode</Label>
              <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="floor-plan">Floor Plan</SelectItem>
                  <SelectItem value="3d-view">3D View</SelectItem>
                  <SelectItem value="table-list">Table List</SelectItem>
                  <SelectItem value="guest-list">Guest List</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Label>Filter Seats</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seats</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm">VIP</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Floor Plan */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Interactive Floor Plan
                  </div>
                  
                  {/* Table Management Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isTableManagementMode ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIsTableManagementMode(!isTableManagementMode)}
                      className={isTableManagementMode ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    >
                      <Move className="w-4 h-4 mr-2" />
                      {isTableManagementMode ? 'Exit Edit' : 'Edit Tables'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddTableModal(true)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Table
                    </Button>
                  </div>
                </CardTitle>
                
                {isTableManagementMode && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Info className="w-4 h-4" />
                      <span className="text-sm font-medium">Table Edit Mode Active</span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Drag tables to move them around. Click tables to reserve them or delete unwanted tables.
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {viewMode === '3d-view' && (
                  <div className="space-y-4">
                    {/* 3D Controls */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Box className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">3D View Controls</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                          >
                            <ZoomOut className="w-3 h-3" />
                          </Button>
                          <span className="text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                          >
                            <ZoomIn className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCameraAngle({ x: 45, y: 0 });
                              setZoom(1);
                            }}
                          >
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Advanced Animation Controls */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <Button
                          variant={animationMode === 'allocation' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setAnimationMode(animationMode === 'allocation' ? 'none' : 'allocation')}
                          className="text-xs"
                        >
                          Seat Preview
                        </Button>
                        <Button
                          variant={animationMode === 'heatmap' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setAnimationMode(animationMode === 'heatmap' ? 'none' : 'heatmap')}
                          className="text-xs"
                        >
                          Heatmap
                        </Button>
                        <Button
                          variant={animationMode === 'mood' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setAnimationMode(animationMode === 'mood' ? 'none' : 'mood')}
                          className="text-xs"
                        >
                          Mood Lighting
                        </Button>
                        <Button
                          variant={showOptimization ? 'default' : 'outline'}
                          size="sm"
                          onClick={generateAIOptimization}
                          className="text-xs"
                        >
                          AI Optimize
                        </Button>
                      </div>

                      {/* Mood Lighting Controls */}
                      {animationMode === 'mood' && (
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Mood Settings</span>
                            <div className="flex gap-1">
                              {['warm', 'cool', 'vibrant', 'calm'].map(color => (
                                <Button
                                  key={color}
                                  variant={moodLighting.color === color ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setMoodLighting(prev => ({ ...prev, color }))}
                                  className="text-xs capitalize"
                                >
                                  {color}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">Intensity:</span>
                            <input
                              type="range"
                              min="0.1"
                              max="1"
                              step="0.1"
                              value={moodLighting.intensity}
                              onChange={(e) => setMoodLighting(prev => ({ ...prev, intensity: parseFloat(e.target.value) }))}
                              className="flex-1"
                            />
                            <span className="text-xs">{Math.round(moodLighting.intensity * 100)}%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3D Scene */}
                    <div 
                      className="relative bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden h-96"
                      style={{
                        perspective: '1000px',
                        transform: `scale(${zoom})`
                      }}
                      onMouseMove={(e) => {
                        if (e.buttons === 1) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = (e.clientX - rect.left) / rect.width - 0.5;
                          const y = (e.clientY - rect.top) / rect.height - 0.5;
                          setCameraAngle({
                            x: Math.max(-90, Math.min(90, cameraAngle.x + y * 10)),
                            y: cameraAngle.y + x * 10
                          });
                        }
                      }}
                    >
                      {/* Floor */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100 dark:from-amber-900 dark:via-amber-800 dark:to-yellow-800"
                        style={{
                          transform: `rotateX(${90 + cameraAngle.x}deg) rotateY(${cameraAngle.y}deg) translateZ(-50px)`,
                          transformOrigin: 'center center',
                          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(160, 82, 45, 0.1) 0%, transparent 50%)'
                        }}
                      />

                      {/* 3D Tables and Chairs */}
                      {tables.map(table => {
                        const tableX = (table.x / 800) * 100;
                        const tableY = (table.y / 500) * 100;
                        
                        return (
                          <div key={table.id} className="absolute">
                            {/* Table Surface */}
                            <div
                              className={`absolute shadow-lg transition-all duration-300 ${
                                table.reservedFor 
                                  ? 'bg-gradient-to-br from-purple-400 to-purple-600' 
                                  : 'bg-gradient-to-br from-amber-600 to-amber-800'
                              }`}
                              style={{
                                left: `${tableX}%`,
                                top: `${tableY}%`,
                                width: `${(table.width / 800) * 100}%`,
                                height: `${(table.height / 500) * 100}%`,
                                transform: `
                                  translateZ(20px) 
                                  rotateX(${cameraAngle.x}deg) 
                                  rotateY(${cameraAngle.y}deg)
                                  ${table.type === 'round' ? 'border-radius: 50%' : 'border-radius: 8px'}
                                `,
                                transformOrigin: 'center center',
                                border: '3px solid rgba(92, 51, 23, 0.8)',
                                cursor: 'pointer'
                              }}
                              onClick={() => handleTableClick(table)}
                            />

                            {/* Table Legs */}
                            {Array.from({ length: table.type === 'round' ? 1 : 4 }).map((_, legIndex) => {
                              const legPositions = table.type === 'round' 
                                ? [{ x: 0, y: 0 }] 
                                : [
                                    { x: -table.width/4, y: -table.height/4 },
                                    { x: table.width/4, y: -table.height/4 },
                                    { x: -table.width/4, y: table.height/4 },
                                    { x: table.width/4, y: table.height/4 }
                                  ];
                              
                              const legPos = legPositions[legIndex];
                              
                              return (
                                <div
                                  key={legIndex}
                                  className="absolute bg-gradient-to-b from-amber-700 to-amber-900"
                                  style={{
                                    left: `${tableX + (legPos.x / 800) * 100}%`,
                                    top: `${tableY + (legPos.y / 500) * 100}%`,
                                    width: table.type === 'round' ? '6%' : '3%',
                                    height: '20px',
                                    transform: `
                                      translateZ(0px) 
                                      rotateX(${cameraAngle.x}deg) 
                                      rotateY(${cameraAngle.y}deg)
                                    `,
                                    transformOrigin: 'center center',
                                    borderRadius: '2px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                  }}
                                />
                              );
                            })}

                            {/* Chairs */}
                            {table.seats.map((seat, seatIndex) => {
                              const angle = (seatIndex * 2 * Math.PI) / table.seats.length;
                              const chairDistance = table.type === 'round' ? table.width/2 + 30 : Math.max(table.width, table.height)/2 + 25;
                              const chairX = tableX + (Math.cos(angle) * chairDistance / 800) * 100;
                              const chairY = tableY + (Math.sin(angle) * chairDistance / 500) * 100;
                              
                              const heatmapIntensity = animationMode === 'heatmap' ? getHeatmapIntensity(seat.id) : 0;
                              const moodOverlay = animationMode === 'mood' ? getMoodLightingStyle() : 'rgba(0,0,0,0)';
                              
                              const chairColor = animationMode === 'allocation' && seat.status === 'available'
                                ? 'from-blue-400 to-blue-600' // Highlight for allocation preview
                                : animationMode === 'heatmap' && heatmapIntensity > 0.3
                                ? `from-orange-${Math.round(300 + heatmapIntensity * 200)} to-red-${Math.round(400 + heatmapIntensity * 300)}`
                                : seat.status === 'available' 
                                ? 'from-green-500 to-green-700'
                                : seat.status === 'reserved'
                                ? 'from-yellow-500 to-yellow-700'
                                : seat.status === 'occupied'
                                ? 'from-red-500 to-red-700'
                                : 'from-purple-500 to-purple-700';

                              return (
                                <div key={seat.id} className="absolute">
                                  {/* Chair Seat */}
                                  <div
                                    className={`absolute bg-gradient-to-br ${chairColor} shadow-md cursor-pointer transition-all duration-200 hover:scale-110`}
                                    style={{
                                      left: `${chairX}%`,
                                      top: `${chairY}%`,
                                      width: '3%',
                                      height: '3%',
                                      transform: `
                                        translateZ(15px) 
                                        rotateX(${cameraAngle.x}deg) 
                                        rotateY(${cameraAngle.y}deg)
                                        rotate(${angle * 180 / Math.PI}deg)
                                      `,
                                      transformOrigin: 'center center',
                                      borderRadius: '4px',
                                      border: '1px solid rgba(0,0,0,0.2)'
                                    }}
                                    onClick={() => handleSeatClick(seat)}
                                  />

                                  {/* Mood Lighting Effect */}
                                  {animationMode === 'mood' && (
                                    <div
                                      className="absolute pointer-events-none"
                                      style={{
                                        left: `${chairX - 1}%`,
                                        top: `${chairY - 1}%`,
                                        width: '5%',
                                        height: '5%',
                                        background: `radial-gradient(circle, ${moodOverlay} 0%, transparent 70%)`,
                                        transform: `translateZ(5px)`,
                                        borderRadius: '50%'
                                      }}
                                    />
                                  )}

                                  {/* Heatmap Overlay */}
                                  {animationMode === 'heatmap' && heatmapIntensity > 0 && (
                                    <div
                                      className="absolute pointer-events-none"
                                      style={{
                                        left: `${chairX - 0.5}%`,
                                        top: `${chairY - 0.5}%`,
                                        width: '4%',
                                        height: '4%',
                                        background: `radial-gradient(circle, rgba(255, ${255 - heatmapIntensity * 255}, 0, ${heatmapIntensity}) 0%, transparent 80%)`,
                                        transform: `translateZ(10px)`,
                                        borderRadius: '50%',
                                        animation: heatmapIntensity > 0.7 ? 'pulse 2s infinite' : 'none'
                                      }}
                                    />
                                  )}

                                  {/* Chair Back */}
                                  <div
                                    className={`absolute bg-gradient-to-t ${chairColor} shadow-md`}
                                    style={{
                                      left: `${chairX}%`,
                                      top: `${chairY - 1}%`,
                                      width: '3%',
                                      height: '2%',
                                      transform: `
                                        translateZ(25px) 
                                        rotateX(${cameraAngle.x + 10}deg) 
                                        rotateY(${cameraAngle.y}deg)
                                        rotate(${angle * 180 / Math.PI}deg)
                                      `,
                                      transformOrigin: 'center bottom',
                                      borderRadius: '4px 4px 0 0',
                                      border: '1px solid rgba(0,0,0,0.2)'
                                    }}
                                  />

                                  {/* Chair Legs */}
                                  {Array.from({ length: 4 }).map((_, legIndex) => {
                                    const legOffsets = [
                                      { x: -0.5, y: -0.5 },
                                      { x: 0.5, y: -0.5 },
                                      { x: -0.5, y: 0.5 },
                                      { x: 0.5, y: 0.5 }
                                    ];
                                    const offset = legOffsets[legIndex];
                                    
                                    return (
                                      <div
                                        key={legIndex}
                                        className="absolute bg-gradient-to-b from-gray-600 to-gray-800"
                                        style={{
                                          left: `${chairX + offset.x}%`,
                                          top: `${chairY + offset.y}%`,
                                          width: '0.3%',
                                          height: '15px',
                                          transform: `
                                            translateZ(0px) 
                                            rotateX(${cameraAngle.x}deg) 
                                            rotateY(${cameraAngle.y}deg)
                                          `,
                                          transformOrigin: 'center center',
                                          borderRadius: '1px'
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              );
                            })}

                            {/* Table Number Label */}
                            <div
                              className="absolute text-white font-bold text-center pointer-events-none"
                              style={{
                                left: `${tableX}%`,
                                top: `${tableY}%`,
                                width: `${(table.width / 800) * 100}%`,
                                height: `${(table.height / 500) * 100}%`,
                                transform: `
                                  translateZ(25px) 
                                  rotateX(${cameraAngle.x}deg) 
                                  rotateY(${cameraAngle.y}deg)
                                `,
                                transformOrigin: 'center center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                              }}
                            >
                              {table.number}
                            </div>

                            {/* Reservation Badge */}
                            {table.reservedFor && (
                              <div
                                className="absolute bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium shadow-lg"
                                style={{
                                  left: `${tableX}%`,
                                  top: `${tableY - 5}%`,
                                  transform: `
                                    translateZ(30px) 
                                    rotateX(${cameraAngle.x}deg) 
                                    rotateY(${cameraAngle.y}deg)
                                  `,
                                  transformOrigin: 'center center'
                                }}
                              >
                                {table.reservedFor}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Lighting Effects */}
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `
                            radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%),
                            radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)
                          `,
                          transform: `
                            rotateX(${cameraAngle.x}deg) 
                            rotateY(${cameraAngle.y}deg)
                          `
                        }}
                      />
                    </div>

                    {/* 3D Instructions */}
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      <p>Click and drag to rotate • Use zoom controls to get closer • Click tables and chairs to interact</p>
                    </div>
                  </div>
                )}

                {viewMode === 'floor-plan' && (
                  <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-96 overflow-auto">
                    <svg 
                      viewBox="0 0 800 500" 
                      className="w-full h-full"
                      onMouseMove={handleTableDragMove}
                      onMouseUp={handleTableDragEnd}
                      onTouchMove={handleTableDragMove}
                      onTouchEnd={handleTableDragEnd}
                    >
                      {/* Tables */}
                      {tables.map(table => (
                        <g key={table.id}>
                          {/* Table shape */}
                          {table.type === 'round' ? (
                            <circle
                              cx={table.x}
                              cy={table.y}
                              r={table.width / 2}
                              fill={table.reservedFor ? 'rgb(147, 51, 234)' : isTableManagementMode ? 'rgb(59, 130, 246)' : 'rgb(156, 163, 175)'}
                              stroke={table.reservedFor ? 'rgb(126, 34, 206)' : isTableManagementMode ? 'rgb(37, 99, 235)' : 'rgb(107, 114, 128)'}
                              strokeWidth="3"
                              className={`${isTableManagementMode ? 'cursor-move' : 'cursor-pointer'} hover:opacity-80 ${draggedTable === table.id ? 'opacity-70' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isTableManagementMode) {
                                  handleTableClick(table);
                                }
                              }}
                              onMouseDown={(e) => handleTableDragStart(table.id, e)}
                              onTouchStart={(e) => handleTableDragStart(table.id, e)}
                            />
                          ) : (
                            <rect
                              x={table.x - table.width / 2}
                              y={table.y - table.height / 2}
                              width={table.width}
                              height={table.height}
                              fill={table.reservedFor ? 'rgb(147, 51, 234)' : isTableManagementMode ? 'rgb(59, 130, 246)' : 'rgb(156, 163, 175)'}
                              stroke={table.reservedFor ? 'rgb(126, 34, 206)' : isTableManagementMode ? 'rgb(37, 99, 235)' : 'rgb(107, 114, 128)'}
                              strokeWidth="3"
                              rx="8"
                              className={`${isTableManagementMode ? 'cursor-move' : 'cursor-pointer'} hover:opacity-80 ${draggedTable === table.id ? 'opacity-70' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isTableManagementMode) {
                                  handleTableClick(table);
                                }
                              }}
                              onMouseDown={(e) => handleTableDragStart(table.id, e)}
                              onTouchStart={(e) => handleTableDragStart(table.id, e)}
                            />
                          )}

                          {/* Table Management Controls */}
                          {isTableManagementMode && (
                            <g>
                              {/* Delete button */}
                              <circle
                                cx={table.x + table.width / 2 - 10}
                                cy={table.y - table.height / 2 + 10}
                                r="8"
                                fill="rgb(239, 68, 68)"
                                stroke="white"
                                strokeWidth="2"
                                className="cursor-pointer hover:fill-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTable(table.id);
                                }}
                              />
                              <text
                                x={table.x + table.width / 2 - 10}
                                y={table.y - table.height / 2 + 10}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontSize="10"
                                fontWeight="bold"
                                className="pointer-events-none"
                              >
                                ×
                              </text>
                            </g>
                          )}
                          
                          {/* Table number */}
                          <text
                            x={table.x}
                            y={table.y - 8}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            fontSize="14"
                            fontWeight="bold"
                          >
                            {table.number}
                          </text>

                          {/* Reservation indicator */}
                          {table.reservedFor && (
                            <text
                              x={table.x}
                              y={table.y + 8}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill="white"
                              fontSize="10"
                              fontWeight="bold"
                            >
                              RESERVED
                            </text>
                          )}

                          {/* Seats */}
                          {table.seats.map(seat => (
                            <circle
                              key={seat.id}
                              cx={seat.x}
                              cy={seat.y}
                              r="12"
                              fill={seat.status === 'available' ? 'rgb(34, 197, 94)' :
                                   seat.status === 'reserved' ? 'rgb(234, 179, 8)' :
                                   seat.status === 'occupied' ? 'rgb(239, 68, 68)' :
                                   'rgb(147, 51, 234)'}
                              stroke="white"
                              strokeWidth="2"
                              className="cursor-pointer hover:stroke-4"
                              onClick={() => handleSeatClick(seat)}
                            />
                          ))}
                        </g>
                      ))}
                    </svg>
                  </div>
                )}

                {viewMode === 'table-list' && (
                  <div className="space-y-4 max-h-96 overflow-auto">
                    {tables.map(table => (
                      <Card key={table.id} className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              Table {table.number}
                              {table.reservedFor && (
                                <Badge className="bg-purple-600">
                                  {table.reservationType === 'vip' && <Crown className="w-3 h-3 mr-1" />}
                                  {table.reservationType === 'family' && <Heart className="w-3 h-3 mr-1" />}
                                  {table.reservationType === 'business' && <Briefcase className="w-3 h-3 mr-1" />}
                                  {table.reservationType === 'special' && <Star className="w-3 h-3 mr-1" />}
                                  {table.reservationType}
                                </Badge>
                              )}
                            </h3>
                            {table.reservedFor && (
                              <p className="text-sm text-gray-600">Reserved for: {table.reservedFor}</p>
                            )}
                            {table.reservationNotes && (
                              <p className="text-xs text-gray-500 mt-1">{table.reservationNotes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{table.type}</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTableClick(table)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {table.seats.map(seat => (
                            <Button
                              key={seat.id}
                              variant="outline"
                              size="sm"
                              className={`${getSeatColor(seat.status)} text-white`}
                              onClick={() => handleSeatClick(seat)}
                            >
                              {seat.seatNumber}
                            </Button>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {viewMode === 'guest-list' && (
                  <div className="space-y-4 max-h-96 overflow-auto">
                    {filteredGuests.map(guest => (
                      <Card key={guest.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{guest.name}</h3>
                            <p className="text-sm text-gray-600">{guest.email}</p>
                            {guest.tableAssignment && (
                              <p className="text-sm">Table {guest.tableAssignment}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={guest.status === 'seated' ? 'default' : 
                                     guest.status === 'checked-in' ? 'secondary' : 'outline'}
                            >
                              {guest.status}
                            </Badge>
                            {guest.status === 'checked-in' && (
                              <Button
                                size="sm"
                                onClick={() => handleCheckIn(guest.id)}
                              >
                                Mark Seated
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Real-time Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Live Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {tables.flatMap(t => t.seats).filter(s => s.status === 'available').length}
                    </div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {tables.flatMap(t => t.seats).filter(s => s.status === 'reserved').length}
                    </div>
                    <div className="text-sm text-gray-600">Reserved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {tables.flatMap(t => t.seats).filter(s => s.status === 'occupied').length}
                    </div>
                    <div className="text-sm text-gray-600">Occupied</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {tables.flatMap(t => t.seats).filter(s => s.status === 'vip').length}
                    </div>
                    <div className="text-sm text-gray-600">VIP</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Seat Details */}
            {selectedSeat && (
              <Card>
                <CardHeader>
                  <CardTitle>Seat Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span>Table {selectedSeat.tableNumber}, Seat {selectedSeat.seatNumber}</span>
                      {getStatusIcon(selectedSeat.status)}
                    </div>
                    <Badge className="mt-2">{selectedSeat.status}</Badge>
                  </div>
                  
                  {selectedSeat.guestName && (
                    <div>
                      <Label>Guest</Label>
                      <p className="font-medium">{selectedSeat.guestName}</p>
                    </div>
                  )}

                  {selectedSeat.status === 'available' && (
                    <div>
                      <Label>Assign Guest</Label>
                      <Select onValueChange={(guestId) => handleSeatAssignment(guestId, selectedSeat.id)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select guest..." />
                        </SelectTrigger>
                        <SelectContent>
                          {guests.filter(g => !g.seatAssignment).map(guest => (
                            <SelectItem key={guest.id} value={guest.id}>
                              {guest.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guests.filter(g => g.arrivalTime).map(guest => (
                    <div key={guest.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{guest.name} checked in</p>
                        <p className="text-xs text-gray-600">
                          {guest.arrivalTime?.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Table Reservation Modal */}
        <Dialog open={showReservationModal} onOpenChange={setShowReservationModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Table {selectedTable?.number} - Special Guest Reservation
              </DialogTitle>
            </DialogHeader>
            
            {selectedTable && (
              <TableReservationForm
                table={selectedTable}
                onSave={(reservationData) => handleTableReservation(selectedTable.id, reservationData)}
                onRemove={() => handleRemoveReservation(selectedTable.id)}
                onCancel={() => setShowReservationModal(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Table Reservation Form Component
function TableReservationForm({ 
  table, 
  onSave, 
  onRemove, 
  onCancel 
}: {
  table: Table;
  onSave: (data: {
    reservedFor: string;
    reservationType: 'vip' | 'family' | 'business' | 'special';
    reservationNotes?: string;
    minimumSpend?: number;
  }) => void;
  onRemove: () => void;
  onCancel: () => void;
}) {
  const [reservedFor, setReservedFor] = useState(table.reservedFor || '');
  const [reservationType, setReservationType] = useState<'vip' | 'family' | 'business' | 'special'>(
    table.reservationType || 'special'
  );
  const [reservationNotes, setReservationNotes] = useState(table.reservationNotes || '');
  const [minimumSpend, setMinimumSpend] = useState(table.minimumSpend?.toString() || '');

  const handleSave = () => {
    if (!reservedFor.trim()) return;
    
    onSave({
      reservedFor: reservedFor.trim(),
      reservationType,
      reservationNotes: reservationNotes.trim() || undefined,
      minimumSpend: minimumSpend ? parseFloat(minimumSpend) : undefined,
    });
  };

  const getReservationTypeIcon = (type: string) => {
    switch (type) {
      case 'vip': return <Crown className="w-4 h-4" />;
      case 'family': return <Heart className="w-4 h-4" />;
      case 'business': return <Briefcase className="w-4 h-4" />;
      case 'special': return <Star className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Table Info */}
      <Card className="p-4 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Table {table.number}</h3>
            <p className="text-sm text-gray-600">
              {table.capacity} seats • {table.type} table
            </p>
          </div>
          <Badge variant="outline" className="capitalize">
            {table.type}
          </Badge>
        </div>
      </Card>

      {/* Reservation Form */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="reservedFor">Reserved For *</Label>
          <Input
            id="reservedFor"
            value={reservedFor}
            onChange={(e) => setReservedFor(e.target.value)}
            placeholder="Guest name, family name, or organization"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="reservationType">Reservation Type</Label>
          <Select value={reservationType} onValueChange={(value: any) => setReservationType(value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vip">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-purple-600" />
                  VIP - Premium guests with special treatment
                </div>
              </SelectItem>
              <SelectItem value="family">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  Family - Family groups and celebrations
                </div>
              </SelectItem>
              <SelectItem value="business">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Business - Corporate and professional events
                </div>
              </SelectItem>
              <SelectItem value="special">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  Special - Unique occasions and honored guests
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="minimumSpend">Minimum Spend (Optional)</Label>
          <Input
            id="minimumSpend"
            type="number"
            value={minimumSpend}
            onChange={(e) => setMinimumSpend(e.target.value)}
            placeholder="0.00"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="reservationNotes">Special Notes</Label>
          <Textarea
            id="reservationNotes"
            value={reservationNotes}
            onChange={(e) => setReservationNotes(e.target.value)}
            placeholder="Special requests, dietary restrictions, accessibility needs, celebration details..."
            className="mt-1"
            rows={3}
          />
        </div>
      </div>

      {/* Reservation Preview */}
      <Card className="p-4 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-purple-600 text-white rounded-lg">
            {getReservationTypeIcon(reservationType)}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100">
              {reservationType.toUpperCase()} Reservation
            </h4>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
              Table {table.number} reserved for {reservedFor || 'special guests'}
            </p>
            {minimumSpend && (
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                Minimum spend: ${minimumSpend}
              </p>
            )}
            {reservationNotes && (
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                "{reservationNotes}"
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div>
          {table.reservedFor && (
            <Button
              variant="outline"
              onClick={() => {
                onRemove();
                onCancel();
              }}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Remove Reservation
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!reservedFor.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {table.reservedFor ? 'Update Reservation' : 'Reserve Table'}
          </Button>
        </div>
      </div>
    </div>
  );
}

