import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Share2, 
  Download, 
  Palette,
  Sparkles,
  Gift,
  Music,
  Camera,
  Copy,
  Check,
  Image as ImageIcon,
  UserCircle,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface InvitationCardGeneratorProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

const cardTemplates = {
  birthday: [
    {
      id: "birthday1",
      name: "Birthday Celebration",
      background: "linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f8b500 100%)",
      textColor: "white",
      accentColor: "#fff"
    },
    {
      id: "birthday2",
      name: "Sweet Birthday",
      background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
      textColor: "#333",
      accentColor: "#ff6b9d"
    },
    {
      id: "birthday3",
      name: "Golden Birthday",
      background: "linear-gradient(135deg, #f7971e 0%, #ffd200 50%, #ffb347 100%)",
      textColor: "white",
      accentColor: "#fff"
    },
    {
      id: "birthday4",
      name: "Rainbow Birthday",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "birthday5",
      name: "Balloon Festival",
      background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      textColor: "#2d3436",
      accentColor: "#fd79a8"
    },
    {
      id: "birthday6",
      name: "Candy Dreams",
      background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      textColor: "#2d3436",
      accentColor: "#e84393"
    },
    {
      id: "birthday7",
      name: "Cosmic Celebration",
      background: "linear-gradient(135deg, #2d3436 0%, #636e72 50%, #74b9ff 100%)",
      textColor: "#ffffff",
      accentColor: "#00b894"
    },
    {
      id: "birthday8",
      name: "Sunshine Party",
      background: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)",
      textColor: "#2d3436",
      accentColor: "#e17055"
    },
    {
      id: "birthday9",
      name: "Magical Moments",
      background: "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 50%, #fd79a8 100%)",
      textColor: "#ffffff",
      accentColor: "#00cec9"
    },
    {
      id: "birthday10",
      name: "Ocean Breeze",
      background: "linear-gradient(135deg, #00cec9 0%, #55a3ff 50%, #74b9ff 100%)",
      textColor: "#ffffff",
      accentColor: "#ffeaa7"
    }
  ],
  wedding: [
    {
      id: "wedding1",
      name: "Classic Romance",
      background: "linear-gradient(135deg, #d4af37 0%, #f4e4c1 50%, #fef5e7 100%)",
      textColor: "#8b4513",
      accentColor: "#b8860b"
    },
    {
      id: "wedding2",
      name: "Elegant White",
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)",
      textColor: "#333",
      accentColor: "#d4af37"
    },
    {
      id: "wedding3",
      name: "Rose Gold Romance",
      background: "linear-gradient(135deg, #e8b4b8 0%, #f4c2c2 50%, #fae3e3 100%)",
      textColor: "#8b4513",
      accentColor: "#c9ada7"
    },
    {
      id: "wedding4",
      name: "Vintage Charm",
      background: "linear-gradient(135deg, #c7a17a 0%, #f2d7b6 50%, #fff8e7 100%)",
      textColor: "#5d4037",
      accentColor: "#8d6e63"
    },
    {
      id: "wedding5",
      name: "Blush Romance",
      background: "linear-gradient(135deg, #ffd1dc 0%, #ffb6c1 50%, #ffc0cb 100%)",
      textColor: "#8b4513",
      accentColor: "#c9ada7"
    },
    {
      id: "wedding6",
      name: "Ivory Dreams",
      background: "linear-gradient(135deg, #fffff0 0%, #fdf5e6 50%, #f5f5dc 100%)",
      textColor: "#8b4513",
      accentColor: "#d4af37"
    },
    {
      id: "wedding7",
      name: "Garden Party",
      background: "linear-gradient(135deg, #98fb98 0%, #f0fff0 50%, #e6ffe6 100%)",
      textColor: "#2d5016",
      accentColor: "#32cd32"
    },
    {
      id: "wedding8",
      name: "Midnight Romance",
      background: "linear-gradient(135deg, #191970 0%, #483d8b 50%, #6a5acd 100%)",
      textColor: "#ffffff",
      accentColor: "#ffd700"
    },
    {
      id: "wedding9",
      name: "Coral Sunset",
      background: "linear-gradient(135deg, #ff7f50 0%, #ffa07a 50%, #ffb07a 100%)",
      textColor: "#ffffff",
      accentColor: "#fff8dc"
    },
    {
      id: "wedding10",
      name: "Royal Elegance",
      background: "linear-gradient(135deg, #4b0082 0%, #6a0dad 50%, #9370db 100%)",
      textColor: "#ffffff",
      accentColor: "#ffd700"
    }
  ],
  corporate: [
    {
      id: "corporate1",
      name: "Executive",
      background: "linear-gradient(135deg, #0c2461 0%, #1e3799 50%, #3c6382 100%)",
      textColor: "white",
      accentColor: "#00d2d3"
    },
    {
      id: "corporate2",
      name: "Professional Blue",
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      textColor: "white",
      accentColor: "#00d4ff"
    },
    {
      id: "corporate3",
      name: "Modern Business",
      background: "linear-gradient(135deg, #434343 0%, #000000 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "corporate4",
      name: "Tech Summit",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      textColor: "white",
      accentColor: "#00ff88"
    },
    {
      id: "corporate5",
      name: "Silver Excellence",
      background: "linear-gradient(135deg, #c0c0c0 0%, #808080 50%, #696969 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "corporate6",
      name: "Innovation Green",
      background: "linear-gradient(135deg, #2d7d32 0%, #388e3c 50%, #4caf50 100%)",
      textColor: "white",
      accentColor: "#ffffff"
    },
    {
      id: "corporate7",
      name: "Executive Red",
      background: "linear-gradient(135deg, #8b0000 0%, #b71c1c 50%, #d32f2f 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "corporate8",
      name: "Premium Purple",
      background: "linear-gradient(135deg, #4a148c 0%, #6a1b9a 50%, #8e24aa 100%)",
      textColor: "white",
      accentColor: "#ffffff"
    },
    {
      id: "corporate9",
      name: "Corporate Teal",
      background: "linear-gradient(135deg, #004d40 0%, #00695c 50%, #00796b 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "corporate10",
      name: "Business Orange",
      background: "linear-gradient(135deg, #e65100 0%, #f57c00 50%, #ff9800 100%)",
      textColor: "white",
      accentColor: "#ffffff"
    }
  ],
  graduation: [
    {
      id: "graduation1",
      name: "Academic Achievement",
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #ffd700 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "graduation2",
      name: "Scholar's Pride",
      background: "linear-gradient(135deg, #8b0000 0%, #dc143c 50%, #ffd700 100%)",
      textColor: "white",
      accentColor: "#fff"
    },
    {
      id: "graduation3",
      name: "Future Bright",
      background: "linear-gradient(135deg, #000080 0%, #4169e1 50%, #87ceeb 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "graduation4",
      name: "Emerald Achievement",
      background: "linear-gradient(135deg, #006400 0%, #228b22 50%, #32cd32 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "graduation5",
      name: "Purple Pride",
      background: "linear-gradient(135deg, #4b0082 0%, #663399 50%, #9966cc 100%)",
      textColor: "white",
      accentColor: "#ffffff"
    },
    {
      id: "graduation6",
      name: "Celebration Sunset",
      background: "linear-gradient(135deg, #ff4500 0%, #ff6347 50%, #ffa500 100%)",
      textColor: "white",
      accentColor: "#fff8dc"
    },
    {
      id: "graduation7",
      name: "Distinguished Black",
      background: "linear-gradient(135deg, #000000 0%, #333333 50%, #666666 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "graduation8",
      name: "Honor Roll",
      background: "linear-gradient(135deg, #8b0000 0%, #a0522d 50%, #cd853f 100%)",
      textColor: "white",
      accentColor: "#fff"
    }
  ],
  baby: [
    {
      id: "baby1",
      name: "Baby Blue",
      background: "linear-gradient(135deg, #a8e6cf 0%, #88d8c0 50%, #78c6a3 100%)",
      textColor: "#333",
      accentColor: "#ff6b6b"
    },
    {
      id: "baby2",
      name: "Sweet Pink",
      background: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #fd79a8 100%)",
      textColor: "white",
      accentColor: "#fff"
    },
    {
      id: "baby3",
      name: "Gender Neutral",
      background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      textColor: "#333",
      accentColor: "#ff6b6b"
    },
    {
      id: "baby4",
      name: "Lavender Dreams",
      background: "linear-gradient(135deg, #e6e6fa 0%, #dda0dd 50%, #d8bfd8 100%)",
      textColor: "#333",
      accentColor: "#9370db"
    },
    {
      id: "baby5",
      name: "Sunshine Yellow",
      background: "linear-gradient(135deg, #fff8dc 0%, #ffeaa7 50%, #fdcb6e 100%)",
      textColor: "#333",
      accentColor: "#e17055"
    },
    {
      id: "baby6",
      name: "Mint Green",
      background: "linear-gradient(135deg, #f0fff0 0%, #98fb98 50%, #90ee90 100%)",
      textColor: "#333",
      accentColor: "#228b22"
    },
    {
      id: "baby7",
      name: "Peach Blossom",
      background: "linear-gradient(135deg, #ffe4e1 0%, #ffd1dc 50%, #ffb6c1 100%)",
      textColor: "#333",
      accentColor: "#cd5c5c"
    },
    {
      id: "baby8",
      name: "Sky Blue",
      background: "linear-gradient(135deg, #e0f6ff 0%, #87ceeb 50%, #87cefa 100%)",
      textColor: "#333",
      accentColor: "#4169e1"
    }
  ],
  holiday: [
    {
      id: "christmas",
      name: "Christmas Magic",
      background: "linear-gradient(135deg, #c41e3a 0%, #228b22 50%, #ffd700 100%)",
      textColor: "white",
      accentColor: "#fff"
    },
    {
      id: "newyear",
      name: "New Year Sparkle",
      background: "linear-gradient(135deg, #000000 0%, #ffd700 50%, #ffffff 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "halloween",
      name: "Halloween Night",
      background: "linear-gradient(135deg, #ff6600 0%, #000000 50%, #660066 100%)",
      textColor: "white",
      accentColor: "#ff6600"
    },
    {
      id: "valentine",
      name: "Valentine's Love",
      background: "linear-gradient(135deg, #ff1744 0%, #e91e63 50%, #ad1457 100%)",
      textColor: "white",
      accentColor: "#fff"
    },
    {
      id: "thanksgiving",
      name: "Thanksgiving Warmth",
      background: "linear-gradient(135deg, #d2691e 0%, #cd853f 50%, #daa520 100%)",
      textColor: "white",
      accentColor: "#fff8dc"
    },
    {
      id: "easter",
      name: "Easter Spring",
      background: "linear-gradient(135deg, #98fb98 0%, #ffb6c1 50%, #ffd700 100%)",
      textColor: "#333",
      accentColor: "#8b4513"
    },
    {
      id: "independence",
      name: "Independence Day",
      background: "linear-gradient(135deg, #dc143c 0%, #ffffff 50%, #000080 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "stpatrick",
      name: "St. Patrick's Day",
      background: "linear-gradient(135deg, #228b22 0%, #32cd32 50%, #adff2f 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "hanukkah",
      name: "Hanukkah Festival",
      background: "linear-gradient(135deg, #000080 0%, #4169e1 50%, #ffffff 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    }
  ],
  anniversary: [
    {
      id: "anniversary1",
      name: "Golden Years",
      background: "linear-gradient(135deg, #ffd700 0%, #ffecb3 50%, #fff8e1 100%)",
      textColor: "#333",
      accentColor: "#b8860b"
    },
    {
      id: "anniversary2",
      name: "Silver Celebration",
      background: "linear-gradient(135deg, #c0c0c0 0%, #e8eaf6 50%, #f3e5f5 100%)",
      textColor: "#333",
      accentColor: "#9e9e9e"
    },
    {
      id: "anniversary3",
      name: "Ruby Love",
      background: "linear-gradient(135deg, #e91e63 0%, #f8bbd9 50%, #fce4ec 100%)",
      textColor: "#333",
      accentColor: "#c2185b"
    },
    {
      id: "anniversary4",
      name: "Diamond Celebration",
      background: "linear-gradient(135deg, #e8f5e8 0%, #f5f5f5 50%, #ffffff 100%)",
      textColor: "#333",
      accentColor: "#0d47a1"
    },
    {
      id: "anniversary5",
      name: "Pearl Anniversary",
      background: "linear-gradient(135deg, #f8f8ff 0%, #fffacd 50%, #fff8dc 100%)",
      textColor: "#333",
      accentColor: "#8b4513"
    },
    {
      id: "anniversary6",
      name: "Emerald Years",
      background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 50%, #a5d6a7 100%)",
      textColor: "#333",
      accentColor: "#1b5e20"
    },
    {
      id: "anniversary7",
      name: "Sapphire Milestone",
      background: "linear-gradient(135deg, #e3f2fd 0%, #90caf9 50%, #42a5f5 100%)",
      textColor: "white",
      accentColor: "#ffffff"
    },
    {
      id: "anniversary8",
      name: "Crystal Clear Love",
      background: "linear-gradient(135deg, #fafafa 0%, #f0f0f0 50%, #e0e0e0 100%)",
      textColor: "#333",
      accentColor: "#6a1b9a"
    }
  ],
  elegant: [
    {
      id: "elegant1",
      name: "Royal Elegance",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "elegant2",
      name: "Midnight Glamour",
      background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      textColor: "white",
      accentColor: "#e74c3c"
    },
    {
      id: "elegant3",
      name: "Luxury Gold",
      background: "linear-gradient(135deg, #434343 0%, #000000 50%, #ffd700 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    }
  ],
  party: [
    {
      id: "party1",
      name: "Vibrant Luxe",
      background: "linear-gradient(135deg, #ee5a24 0%, #ee5a6f 50%, #c44569 100%)",
      textColor: "white",
      accentColor: "#feca57"
    },
    {
      id: "party2",
      name: "Neon Night",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      textColor: "white",
      accentColor: "#fff200"
    },
    {
      id: "party3",
      name: "Disco Fever",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    }
  ],
  nature: [
    {
      id: "nature1",
      name: "Enchanted Garden",
      background: "linear-gradient(135deg, #218c74 0%, #33d9b2 50%, #7bed9f 100%)",
      textColor: "white",
      accentColor: "#ff6348"
    },
    {
      id: "nature2",
      name: "Forest Serenity",
      background: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)",
      textColor: "white",
      accentColor: "#ff6b35"
    },
    {
      id: "nature3",
      name: "Ocean Breeze",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #84fab0 100%)",
      textColor: "white",
      accentColor: "#fff"
    }
  ],
  christmas: [
    {
      id: "christmas1",
      name: "Christmas Magic",
      background: "linear-gradient(135deg, #c41e3a 0%, #228b22 50%, #ffd700 100%)",
      textColor: "white",
      accentColor: "#fff"
    },
    {
      id: "christmas2",
      name: "Winter Wonderland",
      background: "linear-gradient(135deg, #e8f5e8 0%, #c1e1c1 50%, #a4d3a4 100%)",
      textColor: "#2d5016",
      accentColor: "#c41e3a"
    },
    {
      id: "christmas3",
      name: "Holiday Sparkle",
      background: "linear-gradient(135deg, #8b0000 0%, #dc143c 50%, #ffd700 100%)",
      textColor: "white",
      accentColor: "#fff"
    }
  ],
  valentine: [
    {
      id: "valentine1",
      name: "Romantic Rose",
      background: "linear-gradient(135deg, #ff1744 0%, #f8bbd9 50%, #ffcdd2 100%)",
      textColor: "#881337",
      accentColor: "#fff"
    },
    {
      id: "valentine2",
      name: "Love Affair",
      background: "linear-gradient(135deg, #e91e63 0%, #ad1457 50%, #880e4f 100%)",
      textColor: "white",
      accentColor: "#ffc107"
    },
    {
      id: "valentine3",
      name: "Sweet Hearts",
      background: "linear-gradient(135deg, #ffcdd2 0%, #f8bbd9 50%, #e1bee7 100%)",
      textColor: "#4a148c",
      accentColor: "#d81b60"
    }
  ],
  newyear: [
    {
      id: "newyear1",
      name: "Midnight Celebration",
      background: "linear-gradient(135deg, #000051 0%, #1a237e 50%, #ffd700 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "newyear2",
      name: "Golden Countdown",
      background: "linear-gradient(135deg, #212121 0%, #424242 50%, #ffc107 100%)",
      textColor: "white",
      accentColor: "#fff"
    },
    {
      id: "newyear3",
      name: "Fireworks Fantasy",
      background: "linear-gradient(135deg, #1a237e 0%, #3f51b5 50%, #e91e63 100%)",
      textColor: "white",
      accentColor: "#ffeb3b"
    }
  ],
  halloween: [
    {
      id: "halloween1",
      name: "Spooky Night",
      background: "linear-gradient(135deg, #212121 0%, #ff6f00 50%, #212121 100%)",
      textColor: "white",
      accentColor: "#ff6f00"
    },
    {
      id: "halloween2",
      name: "Pumpkin Patch",
      background: "linear-gradient(135deg, #ff6f00 0%, #ff8f00 50%, #ffab00 100%)",
      textColor: "#212121",
      accentColor: "#4a148c"
    },
    {
      id: "halloween3",
      name: "Haunted Mansion",
      background: "linear-gradient(135deg, #4a148c 0%, #212121 50%, #6a1b9a 100%)",
      textColor: "white",
      accentColor: "#ff6f00"
    }
  ],
  thanksgiving: [
    {
      id: "thanksgiving1",
      name: "Autumn Harvest",
      background: "linear-gradient(135deg, #ff6f00 0%, #ff8f00 50%, #d84315 100%)",
      textColor: "white",
      accentColor: "#fff8e1"
    },
    {
      id: "thanksgiving2",
      name: "Grateful Hearts",
      background: "linear-gradient(135deg, #8d6e63 0%, #a1887f 50%, #bcaaa4 100%)",
      textColor: "white",
      accentColor: "#ff8f00"
    },
    {
      id: "thanksgiving3",
      name: "Turkey Day",
      background: "linear-gradient(135deg, #5d4037 0%, #8d6e63 50%, #ff8f00 100%)",
      textColor: "white",
      accentColor: "#fff"
    }
  ],
  easter: [
    {
      id: "easter1",
      name: "Spring Bloom",
      background: "linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 50%, #81d4fa 100%)",
      textColor: "#01579b",
      accentColor: "#ff4081"
    },
    {
      id: "easter2",
      name: "Easter Bunny",
      background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 50%, #ce93d8 100%)",
      textColor: "#4a148c",
      accentColor: "#4caf50"
    },
    {
      id: "easter3",
      name: "Egg Hunt",
      background: "linear-gradient(135deg, #fff9c4 0%, #fff59d 50%, #fff176 100%)",
      textColor: "#f57f17",
      accentColor: "#e91e63"
    }
  ],
  mothersday: [
    {
      id: "mothersday1",
      name: "Mother's Love",
      background: "linear-gradient(135deg, #f8bbd9 0%, #f48fb1 50%, #f06292 100%)",
      textColor: "white",
      accentColor: "#fff"
    },
    {
      id: "mothersday2",
      name: "Garden of Love",
      background: "linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 50%, #81c784 100%)",
      textColor: "#1b5e20",
      accentColor: "#e91e63"
    },
    {
      id: "mothersday3",
      name: "Elegant Mom",
      background: "linear-gradient(135deg, #e1bee7 0%, #d1c4e9 50%, #c5cae9 100%)",
      textColor: "#4a148c",
      accentColor: "#ff4081"
    }
  ],
  fathersday: [
    {
      id: "fathersday1",
      name: "Dad's Day",
      background: "linear-gradient(135deg, #455a64 0%, #607d8b 50%, #78909c 100%)",
      textColor: "white",
      accentColor: "#ff6f00"
    },
    {
      id: "fathersday2",
      name: "Strong & Steady",
      background: "linear-gradient(135deg, #37474f 0%, #546e7a 50%, #78909c 100%)",
      textColor: "white",
      accentColor: "#4caf50"
    },
    {
      id: "fathersday3",
      name: "Hero Dad",
      background: "linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #1e88e5 100%)",
      textColor: "white",
      accentColor: "#ffc107"
    }
  ],
  housewarming: [
    {
      id: "housewarming1",
      name: "New Home",
      background: "linear-gradient(135deg, #8bc34a 0%, #cddc39 50%, #ffeb3b 100%)",
      textColor: "#33691e",
      accentColor: "#e65100"
    },
    {
      id: "housewarming2",
      name: "Cozy Welcome",
      background: "linear-gradient(135deg, #d7ccc8 0%, #bcaaa4 50%, #a1887f 100%)",
      textColor: "#3e2723",
      accentColor: "#ff5722"
    },
    {
      id: "housewarming3",
      name: "Dream Home",
      background: "linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 50%, #80cbc4 100%)",
      textColor: "#004d40",
      accentColor: "#ff4081"
    }
  ],
  retirement: [
    {
      id: "retirement1",
      name: "Golden Years",
      background: "linear-gradient(135deg, #fff176 0%, #ffc107 50%, #ff8f00 100%)",
      textColor: "#e65100",
      accentColor: "#1976d2"
    },
    {
      id: "retirement2",
      name: "New Chapter",
      background: "linear-gradient(135deg, #c5e1a5 0%, #aed581 50%, #9ccc65 100%)",
      textColor: "#33691e",
      accentColor: "#795548"
    },
    {
      id: "retirement3",
      name: "Well Deserved",
      background: "linear-gradient(135deg, #b39ddb 0%, #9575cd 50%, #7e57c2 100%)",
      textColor: "white",
      accentColor: "#ffc107"
    }
  ],
  engagement: [
    {
      id: "engagement1",
      name: "Forever Love",
      background: "linear-gradient(135deg, #f8bbd9 0%, #f48fb1 50%, #f06292 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "engagement2",
      name: "Diamond Dreams",
      background: "linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 50%, #81d4fa 100%)",
      textColor: "#01579b",
      accentColor: "#e91e63"
    },
    {
      id: "engagement3",
      name: "Ring of Love",
      background: "linear-gradient(135deg, #fff9c4 0%, #fff59d 50%, #fff176 100%)",
      textColor: "#f57f17",
      accentColor: "#e91e63"
    }
  ],
  bridal: [
    {
      id: "bridal1",
      name: "Bridal Bliss",
      background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd9 50%, #f48fb1 100%)",
      textColor: "#880e4f",
      accentColor: "#fff"
    },
    {
      id: "bridal2",
      name: "Wedding Bells",
      background: "linear-gradient(135deg, #fff9c4 0%, #fff59d 50%, #fff176 100%)",
      textColor: "#f57f17",
      accentColor: "#e91e63"
    },
    {
      id: "bridal3",
      name: "Elegant Bride",
      background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 50%, #ce93d8 100%)",
      textColor: "#4a148c",
      accentColor: "#fff"
    }
  ],
  quinceañera: [
    {
      id: "quinceanera1",
      name: "Princess Dreams",
      background: "linear-gradient(135deg, #f8bbd9 0%, #f48fb1 50%, #f06292 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "quinceanera2",
      name: "Royal Celebration",
      background: "linear-gradient(135deg, #b39ddb 0%, #9575cd 50%, #7e57c2 100%)",
      textColor: "white",
      accentColor: "#ffc107"
    },
    {
      id: "quinceanera3",
      name: "Fifteen Roses",
      background: "linear-gradient(135deg, #ffcdd2 0%, #f8bbd9 50%, #e1bee7 100%)",
      textColor: "#4a148c",
      accentColor: "#d81b60"
    }
  ],
  sweet16: [
    {
      id: "sweet16_1",
      name: "Sweet Sixteen",
      background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
      textColor: "#333",
      accentColor: "#ff6b9d"
    },
    {
      id: "sweet16_2",
      name: "Glamour Night",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    },
    {
      id: "sweet16_3",
      name: "Sparkle & Shine",
      background: "linear-gradient(135deg, #ffd700 0%, #ffecb3 50%, #fff8e1 100%)",
      textColor: "#333",
      accentColor: "#e91e63"
    }
  ],
  reunion: [
    {
      id: "reunion1",
      name: "Family Reunion",
      background: "linear-gradient(135deg, #8bc34a 0%, #cddc39 50%, #ffeb3b 100%)",
      textColor: "#33691e",
      accentColor: "#795548"
    },
    {
      id: "reunion2",
      name: "Together Again",
      background: "linear-gradient(135deg, #81c784 0%, #aed581 50%, #c5e1a5 100%)",
      textColor: "#1b5e20",
      accentColor: "#ff5722"
    },
    {
      id: "reunion3",
      name: "Memory Lane",
      background: "linear-gradient(135deg, #b39ddb 0%, #9575cd 50%, #7e57c2 100%)",
      textColor: "white",
      accentColor: "#ffc107"
    }
  ],
  memorial: [
    {
      id: "memorial1",
      name: "In Loving Memory",
      background: "linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 50%, #9e9e9e 100%)",
      textColor: "#212121",
      accentColor: "#3f51b5"
    },
    {
      id: "memorial2",
      name: "Eternal Peace",
      background: "linear-gradient(135deg, #e8f5e8 0%, #c1e1c1 50%, #a4d3a4 100%)",
      textColor: "#1b5e20",
      accentColor: "#607d8b"
    },
    {
      id: "memorial3",
      name: "Heavenly Light",
      background: "linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 50%, #81d4fa 100%)",
      textColor: "#01579b",
      accentColor: "#78909c"
    }
  ],
  charity: [
    {
      id: "charity1",
      name: "Hearts of Gold",
      background: "linear-gradient(135deg, #4caf50 0%, #8bc34a 50%, #cddc39 100%)",
      textColor: "white",
      accentColor: "#ff9800"
    },
    {
      id: "charity2",
      name: "Hope & Healing",
      background: "linear-gradient(135deg, #2196f3 0%, #03a9f4 50%, #00bcd4 100%)",
      textColor: "white",
      accentColor: "#ffeb3b"
    },
    {
      id: "charity3",
      name: "Community Care",
      background: "linear-gradient(135deg, #e91e63 0%, #f06292 50%, #f48fb1 100%)",
      textColor: "white",
      accentColor: "#fff"
    }
  ],
  awards: [
    {
      id: "awards1",
      name: "Excellence Award",
      background: "linear-gradient(135deg, #ffd700 0%, #ffecb3 50%, #fff8e1 100%)",
      textColor: "#333",
      accentColor: "#1976d2"
    },
    {
      id: "awards2",
      name: "Achievement Night",
      background: "linear-gradient(135deg, #1976d2 0%, #1e88e5 50%, #2196f3 100%)",
      textColor: "white",
      accentColor: "#ffc107"
    },
    {
      id: "awards3",
      name: "Hall of Fame",
      background: "linear-gradient(135deg, #212121 0%, #424242 50%, #616161 100%)",
      textColor: "white",
      accentColor: "#ffd700"
    }
  ],
  fundraiser: [
    {
      id: "fundraiser1",
      name: "Giving Back",
      background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 50%, #81c784 100%)",
      textColor: "white",
      accentColor: "#ff9800"
    },
    {
      id: "fundraiser2",
      name: "Make a Difference",
      background: "linear-gradient(135deg, #ff9800 0%, #ffb74d 50%, #ffcc02 100%)",
      textColor: "white",
      accentColor: "#2196f3"
    },
    {
      id: "fundraiser3",
      name: "Together We Can",
      background: "linear-gradient(135deg, #9c27b0 0%, #ba68c8 50%, #ce93d8 100%)",
      textColor: "white",
      accentColor: "#4caf50"
    }
  ],
  conference: [
    {
      id: "conference1",
      name: "Professional Summit",
      background: "linear-gradient(135deg, #1976d2 0%, #1e88e5 50%, #2196f3 100%)",
      textColor: "white",
      accentColor: "#ffc107"
    },
    {
      id: "conference2",
      name: "Innovation Hub",
      background: "linear-gradient(135deg, #607d8b 0%, #78909c 50%, #90a4ae 100%)",
      textColor: "white",
      accentColor: "#ff5722"
    },
    {
      id: "conference3",
      name: "Knowledge Exchange",
      background: "linear-gradient(135deg, #795548 0%, #8d6e63 50%, #a1887f 100%)",
      textColor: "white",
      accentColor: "#2196f3"
    }
  ]
};

export default function InvitationCardGenerator({ event, isOpen, onClose }: InvitationCardGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState("birthday");
  const [selectedTemplate, setSelectedTemplate] = useState(cardTemplates.birthday[0]);
  const [customMessage, setCustomMessage] = useState("");
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  
  // Photo customization states
  const [backgroundImage, setBackgroundImage] = useState("");
  const [hostPhoto, setHostPhoto] = useState("");
  const [logoImage, setLogoImage] = useState("");
  const [decorativeImage, setDecorativeImage] = useState("");
  
  // AI generation states
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [rsvpRequired, setRsvpRequired] = useState(true);
  const [includeLocation] = useState(true);
  const [includeTime] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [cardAnimation, setCardAnimation] = useState<"none" | "entering" | "exiting">("none");
  const [envelopeData, setEnvelopeData] = useState({
    recipientName: "",
    recipientAddress: "",
    recipientCity: "",
    recipientState: "",
    recipientZip: "",
    senderName: "",
    senderAddress: "",
    senderCity: "",
    senderState: "",
    senderZip: ""
  });
  const { toast } = useToast();

  const generateCard = useMutation({
    mutationFn: async (cardData: any) => {
      return await apiRequest("/api/invitation-cards/generate", "POST", cardData);
    },
    onSuccess: (data) => {
      toast({
        title: "Invitation Card Created",
        description: "Your beautiful invitation card is ready to share!"
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to create invitation card. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleGenerateCard = () => {
    generateCard.mutate({
      eventId: event.id,
      templateId: selectedTemplate.id,
      customMessage,
      rsvpRequired,
      includeLocation,
      includeTime,
      envelope: showEnvelope ? envelopeData : null
    });
  };

  const handlePackageInEnvelope = () => {
    if (showEnvelope) return; // Already in envelope
    console.log("Packaging card into envelope...");
    setCardAnimation("entering");
    setTimeout(() => {
      setShowEnvelope(true);
      setCardAnimation("none");
    }, 800);
  };

  const handleRemoveFromEnvelope = () => {
    if (!showEnvelope) return; // Already showing card
    console.log("Removing card from envelope...");
    setCardAnimation("exiting");
    setTimeout(() => {
      setShowEnvelope(false);
      setCardAnimation("none");
    }, 800);
  };

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/invite/${event.id}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link Copied",
      description: "Invitation link copied to clipboard!"
    });
  };

  // Helper functions for date/time formatting
  const formatDate = (date: any) => {
    if (!date) return "Date TBD";
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: any) => {
    if (!time) return "Time TBD";
    return time;
  };

  // Handle photo uploads
  const handlePhotoUpload = (file: File, type: 'background' | 'host' | 'logo' | 'decorative') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'background') setBackgroundImage(result);
      if (type === 'host') setHostPhoto(result);
      if (type === 'logo') setLogoImage(result);
      if (type === 'decorative') setDecorativeImage(result);
    };
    reader.readAsDataURL(file);
  }

  const removeImage = (type: 'background' | 'host' | 'logo' | 'decorative') => {
    if (type === 'background') setBackgroundImage("");
    if (type === 'host') setHostPhoto("");
    if (type === 'logo') setLogoImage("");
    if (type === 'decorative') setDecorativeImage("");
  };

  // Generate AI invitation message
  const generateAIInvitation = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a message or theme for the AI to work with.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/ai/generate-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: event.title,
          eventDate: formatDate(event.date),
          eventTime: formatTime(event.time),
          location: event.location,
          userPrompt: aiPrompt,
          tone: 'friendly'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate invitation');
      }

      const data = await response.json();
      setGeneratedMessage(data.message);
      setCustomMessage(data.message);
      
      toast({
        title: "AI Invitation Generated!",
        description: "Your personalized invitation message has been created."
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleDownload = () => {
    // Simulate download functionality
    toast({
      title: "Download Started",
      description: "Your invitation card is being prepared for download."
    });
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Create Invitation Card
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="flex gap-2">
                <Button
                  variant={!showEnvelope ? "default" : "outline"}
                  size="sm"
                  onClick={handleRemoveFromEnvelope}
                  disabled={cardAnimation !== "none"}
                >
                  Card
                </Button>
                <Button
                  variant={showEnvelope ? "default" : "outline"}
                  size="sm"
                  onClick={handlePackageInEnvelope}
                  disabled={cardAnimation !== "none"}
                >
                  Envelope
                </Button>
              </div>
            </div>
            
            <div className="relative h-96 perspective-1000">
              {!showEnvelope ? (
                <div 
                  className={`w-full h-full rounded-2xl p-8 overflow-hidden relative border border-white/10 transition-all duration-800 ease-out ${
                    viewMode === "3d" ? "invitation-card-3d shadow-3d-hover" : "shadow-2xl"
                  }`}
                  style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : selectedTemplate.background,
                    backgroundSize: backgroundImage ? 'cover' : undefined,
                    backgroundPosition: backgroundImage ? 'center' : undefined,
                    color: selectedTemplate.textColor,
                    fontFamily: '"Times New Roman", serif',
                    transform: cardAnimation === "entering" 
                      ? "translateY(40px) scale(0.9) rotateX(15deg)" 
                      : cardAnimation === "exiting" 
                      ? "translateY(-40px) scale(1.05) rotateX(-10deg)" 
                      : viewMode === "3d" 
                      ? "perspective(1000px) rotateX(8deg) rotateY(-8deg)"
                      : "translateY(0px) scale(1) rotateX(0deg)",
                    opacity: cardAnimation === "entering" 
                      ? 0.3 
                      : cardAnimation === "exiting" 
                      ? 0.7 
                      : 1,
                    zIndex: cardAnimation !== "none" ? 10 : 1,
                    transformStyle: viewMode === "3d" ? "preserve-3d" : undefined
                  }}
                >
                  {/* Background overlay for better text readability when custom image is used */}
                  {backgroundImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  )}
                  
                  {/* Logo/Brand Image */}
                  {logoImage && (
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg">
                      <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Host Photo */}
                  {hostPhoto && (
                    <div className="absolute top-4 left-4 w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-lg">
                      <img src={hostPhoto} alt="Host" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Template Built-in Decorative Elements */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Category-specific elegant decorations */}
                    {selectedCategory === 'wedding' && (
                      <>
                        {/* Ornate wedding frame */}
                        <div className="absolute inset-2 border-2 border-white/40 rounded-lg"></div>
                        <div className="absolute inset-4 border border-white/30 rounded-md" style={{
                          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)'
                        }}></div>
                        {/* Wedding corner flourishes */}
                        <div className="absolute top-2 left-2 w-12 h-12 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-pink-200">
                            <path d="M20,50 Q50,20 80,50 Q50,80 20,50 Z" fill="currentColor"/>
                            <circle cx="50" cy="50" r="8" fill="white"/>
                          </svg>
                        </div>
                        <div className="absolute top-2 right-2 w-12 h-12 opacity-30 rotate-90">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-pink-200">
                            <path d="M20,50 Q50,20 80,50 Q50,80 20,50 Z" fill="currentColor"/>
                            <circle cx="50" cy="50" r="8" fill="white"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 left-2 w-12 h-12 opacity-30 -rotate-90">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-pink-200">
                            <path d="M20,50 Q50,20 80,50 Q50,80 20,50 Z" fill="currentColor"/>
                            <circle cx="50" cy="50" r="8" fill="white"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 right-2 w-12 h-12 opacity-30 rotate-180">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-pink-200">
                            <path d="M20,50 Q50,20 80,50 Q50,80 20,50 Z" fill="currentColor"/>
                            <circle cx="50" cy="50" r="8" fill="white"/>
                          </svg>
                        </div>
                      </>
                    )}

                    {selectedCategory === 'birthday' && (
                      <>
                        {/* Festive birthday frame */}
                        <div className="absolute inset-3 rounded-xl" style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)'
                        }}></div>
                        {/* Birthday corner celebrations */}
                        <div className="absolute top-3 left-3 w-10 h-10 opacity-25 animate-pulse">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-200">
                            <polygon points="50,10 55,35 80,35 60,55 70,80 50,65 30,80 40,55 20,35 45,35" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute top-3 right-3 w-10 h-10 opacity-25 animate-pulse" style={{animationDelay: '0.5s'}}>
                          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-200">
                            <polygon points="50,10 55,35 80,35 60,55 70,80 50,65 30,80 40,55 20,35 45,35" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-3 left-3 w-10 h-10 opacity-25 animate-pulse" style={{animationDelay: '1s'}}>
                          <svg viewBox="0 0 100 100" className="w-full h-full text-green-200">
                            <polygon points="50,10 55,35 80,35 60,55 70,80 50,65 30,80 40,55 20,35 45,35" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-3 right-3 w-10 h-10 opacity-25 animate-pulse" style={{animationDelay: '1.5s'}}>
                          <svg viewBox="0 0 100 100" className="w-full h-full text-purple-200">
                            <polygon points="50,10 55,35 80,35 60,55 70,80 50,65 30,80 40,55 20,35 45,35" fill="currentColor"/>
                          </svg>
                        </div>
                      </>
                    )}

                    {selectedCategory === 'corporate' && (
                      <>
                        {/* Professional corporate frame */}
                        <div className="absolute inset-2 border border-white/40"></div>
                        <div className="absolute inset-4 border border-white/25"></div>
                        {/* Corporate corner accents */}
                        <div className="absolute top-2 left-2 w-8 h-8 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-200">
                            <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="8"/>
                            <rect x="35" y="35" width="30" height="30" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute top-2 right-2 w-8 h-8 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-200">
                            <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="8"/>
                            <rect x="35" y="35" width="30" height="30" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 left-2 w-8 h-8 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-200">
                            <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="8"/>
                            <rect x="35" y="35" width="30" height="30" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 right-2 w-8 h-8 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-200">
                            <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="8"/>
                            <rect x="35" y="35" width="30" height="30" fill="currentColor"/>
                          </svg>
                        </div>
                      </>
                    )}

                    {selectedCategory === 'elegant' && (
                      <>
                        {/* Sophisticated elegant frame */}
                        <div className="absolute inset-1 rounded-2xl" style={{
                          background: 'linear-gradient(45deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.1))',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}></div>
                        <div className="absolute inset-4 rounded-lg border border-white/20"></div>
                        {/* Elegant flourish corners */}
                        <div className="absolute top-1 left-1 w-16 h-16 opacity-25">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                            <path d="M10,10 Q50,30 90,10 Q70,50 90,90 Q50,70 10,90 Q30,50 10,10 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="50" cy="50" r="3" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute top-1 right-1 w-16 h-16 opacity-25 rotate-90">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                            <path d="M10,10 Q50,30 90,10 Q70,50 90,90 Q50,70 10,90 Q30,50 10,10 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="50" cy="50" r="3" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-1 left-1 w-16 h-16 opacity-25 -rotate-90">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                            <path d="M10,10 Q50,30 90,10 Q70,50 90,90 Q50,70 10,90 Q30,50 10,10 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="50" cy="50" r="3" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-1 right-1 w-16 h-16 opacity-25 rotate-180">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                            <path d="M10,10 Q50,30 90,10 Q70,50 90,90 Q50,70 10,90 Q30,50 10,10 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="50" cy="50" r="3" fill="currentColor"/>
                          </svg>
                        </div>
                      </>
                    )}

                    {selectedCategory === 'christmas' && (
                      <>
                        {/* Christmas decorative frame */}
                        <div className="absolute inset-2 border-2 border-red-300/50 rounded-xl" style={{
                          background: 'linear-gradient(45deg, rgba(220,38,127,0.1) 0%, rgba(34,139,34,0.1) 50%, rgba(255,215,0,0.1) 100%)'
                        }}></div>
                        {/* Christmas corner ornaments */}
                        <div className="absolute top-2 left-2 w-12 h-12 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-red-300">
                            <polygon points="50,10 60,40 90,40 70,60 80,90 50,75 20,90 30,60 10,40 40,40" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute top-2 right-2 w-12 h-12 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-green-300">
                            <circle cx="50" cy="50" r="30" fill="currentColor"/>
                            <circle cx="50" cy="50" r="20" fill="white"/>
                            <circle cx="50" cy="50" r="10" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 left-2 w-12 h-12 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-300">
                            <rect x="45" y="20" width="10" height="60" fill="currentColor"/>
                            <ellipse cx="50" cy="25" rx="15" ry="8" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 right-2 w-12 h-12 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-red-300">
                            <path d="M20,40 Q30,20 50,40 Q70,20 80,40 Q70,60 50,40 Q30,60 20,40 Z" fill="currentColor"/>
                          </svg>
                        </div>
                      </>
                    )}

                    {selectedCategory === 'valentine' && (
                      <>
                        {/* Valentine's decorative frame */}
                        <div className="absolute inset-2 border-2 border-pink-300/50 rounded-2xl" style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(255,20,147,0.15) 0%, transparent 70%)'
                        }}></div>
                        {/* Valentine corner hearts */}
                        <div className="absolute top-2 left-2 w-12 h-12 opacity-25 animate-pulse">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-pink-300">
                            <path d="M50,85 C50,85 20,50 20,35 C20,20 35,15 50,30 C65,15 80,20 80,35 C80,50 50,85 50,85 Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute top-2 right-2 w-12 h-12 opacity-25 animate-pulse" style={{animationDelay: '0.5s'}}>
                          <svg viewBox="0 0 100 100" className="w-full h-full text-red-300">
                            <path d="M50,85 C50,85 20,50 20,35 C20,20 35,15 50,30 C65,15 80,20 80,35 C80,50 50,85 50,85 Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 left-2 w-12 h-12 opacity-25 animate-pulse" style={{animationDelay: '1s'}}>
                          <svg viewBox="0 0 100 100" className="w-full h-full text-rose-300">
                            <path d="M50,85 C50,85 20,50 20,35 C20,20 35,15 50,30 C65,15 80,20 80,35 C80,50 50,85 50,85 Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 right-2 w-12 h-12 opacity-25 animate-pulse" style={{animationDelay: '1.5s'}}>
                          <svg viewBox="0 0 100 100" className="w-full h-full text-pink-300">
                            <path d="M50,85 C50,85 20,50 20,35 C20,20 35,15 50,30 C65,15 80,20 80,35 C80,50 50,85 50,85 Z" fill="currentColor"/>
                          </svg>
                        </div>
                      </>
                    )}

                    {selectedCategory === 'newyear' && (
                      <>
                        {/* New Year decorative frame */}
                        <div className="absolute inset-2 border-2 border-yellow-300/50 rounded-lg" style={{
                          background: 'linear-gradient(45deg, rgba(0,0,81,0.1) 0%, rgba(255,215,0,0.15) 50%, rgba(233,30,99,0.1) 100%)'
                        }}></div>
                        {/* New Year fireworks */}
                        <div className="absolute top-2 left-2 w-12 h-12 opacity-30 animate-pulse">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-300">
                            <circle cx="50" cy="50" r="5" fill="currentColor"/>
                            <path d="M50,20 L50,30 M80,50 L70,50 M50,80 L50,70 M20,50 L30,50 M71,29 L65,35 M71,71 L65,65 M29,71 L35,65 M29,29 L35,35" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="absolute top-2 right-2 w-12 h-12 opacity-30 animate-pulse" style={{animationDelay: '0.3s'}}>
                          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-300">
                            <circle cx="50" cy="50" r="5" fill="currentColor"/>
                            <path d="M50,20 L50,30 M80,50 L70,50 M50,80 L50,70 M20,50 L30,50 M71,29 L65,35 M71,71 L65,65 M29,71 L35,65 M29,29 L35,35" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 left-2 w-12 h-12 opacity-30 animate-pulse" style={{animationDelay: '0.6s'}}>
                          <svg viewBox="0 0 100 100" className="w-full h-full text-purple-300">
                            <circle cx="50" cy="50" r="5" fill="currentColor"/>
                            <path d="M50,20 L50,30 M80,50 L70,50 M50,80 L50,70 M20,50 L30,50 M71,29 L65,35 M71,71 L65,65 M29,71 L35,65 M29,29 L35,35" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 right-2 w-12 h-12 opacity-30 animate-pulse" style={{animationDelay: '0.9s'}}>
                          <svg viewBox="0 0 100 100" className="w-full h-full text-red-300">
                            <circle cx="50" cy="50" r="5" fill="currentColor"/>
                            <path d="M50,20 L50,30 M80,50 L70,50 M50,80 L50,70 M20,50 L30,50 M71,29 L65,35 M71,71 L65,65 M29,71 L35,65 M29,29 L35,35" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                      </>
                    )}

                    {selectedCategory === 'halloween' && (
                      <>
                        {/* Halloween decorative frame */}
                        <div className="absolute inset-2 border-2 border-orange-400/50 rounded-lg" style={{
                          background: 'linear-gradient(45deg, rgba(33,33,33,0.2) 0%, rgba(255,111,0,0.1) 50%, rgba(74,20,140,0.1) 100%)'
                        }}></div>
                        {/* Halloween spooky elements */}
                        <div className="absolute top-2 left-2 w-12 h-12 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400">
                            <circle cx="50" cy="50" r="35" fill="currentColor"/>
                            <polygon points="35,40 45,40 40,50" fill="black"/>
                            <polygon points="55,40 65,40 60,50" fill="black"/>
                            <path d="M35,65 Q50,75 65,65" stroke="black" strokeWidth="3" fill="none"/>
                          </svg>
                        </div>
                        <div className="absolute top-2 right-2 w-12 h-12 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-purple-400">
                            <path d="M50,20 Q30,30 20,50 Q30,70 50,80 Q70,70 80,50 Q70,30 50,20 Z" fill="currentColor"/>
                            <circle cx="45" cy="45" r="3" fill="white"/>
                            <circle cx="55" cy="45" r="3" fill="white"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 left-2 w-12 h-12 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-400">
                            <rect x="30" y="60" width="40" height="30" fill="currentColor"/>
                            <polygon points="30,60 50,40 70,60" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 right-2 w-12 h-12 opacity-30">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400">
                            <path d="M20,50 Q30,20 50,30 Q70,20 80,50 Q70,80 50,70 Q30,80 20,50 Z" fill="currentColor"/>
                          </svg>
                        </div>
                      </>
                    )}

                    {/* Default elegant frame for other categories */}
                    {!['wedding', 'birthday', 'corporate', 'elegant', 'christmas', 'valentine', 'newyear', 'halloween'].includes(selectedCategory) && (
                      <>
                        <div className="absolute inset-2 border border-white/30 rounded-lg"></div>
                        <div className="absolute inset-4 border border-white/20 rounded-md"></div>
                        <div className="absolute top-2 left-2 w-12 h-12 opacity-20">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                            <path d="M30,30 Q50,10 70,30 Q90,50 70,70 Q50,90 30,70 Q10,50 30,30 Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute top-2 right-2 w-12 h-12 opacity-20 rotate-90">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                            <path d="M30,30 Q50,10 70,30 Q90,50 70,70 Q50,90 30,70 Q10,50 30,30 Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 left-2 w-12 h-12 opacity-20 -rotate-90">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                            <path d="M30,30 Q50,10 70,30 Q90,50 70,70 Q50,90 30,70 Q10,50 30,30 Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div className="absolute bottom-2 right-2 w-12 h-12 opacity-20 rotate-180">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                            <path d="M30,30 Q50,10 70,30 Q90,50 70,70 Q50,90 30,70 Q10,50 30,30 Z" fill="currentColor"/>
                          </svg>
                        </div>
                      </>
                    )}
                    
                    {/* Elegant overlay effect */}
                    <div className="absolute inset-0 rounded-2xl" style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)'
                    }}></div>
                  </div>

                  {/* User's Custom Decorative Image Overlay */}
                  {decorativeImage && (
                    <div className="absolute inset-0 pointer-events-none">
                      <img 
                        src={decorativeImage} 
                        alt="Decoration" 
                        className="w-full h-full object-contain opacity-80 mix-blend-multiply" 
                        style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
                      />
                    </div>
                  )}

                  {/* Dynamic Background Decorative Elements */}
                  {selectedCategory === 'wedding' && (
                    <>
                      {/* Wedding Hearts - Multiple colors and positions */}
                      <div className="absolute top-8 left-1/3 opacity-20 transform rotate-12">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff6b9d" className="animate-pulse">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                      <div className="absolute bottom-16 right-1/4 opacity-15 transform -rotate-45">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff8fab" className="animate-pulse" style={{ animationDelay: '2s' }}>
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                      <div className="absolute top-20 right-12 opacity-12 transform rotate-75">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffc0cb" className="animate-pulse" style={{ animationDelay: '3s' }}>
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                      <div className="absolute bottom-8 left-8 opacity-18 transform -rotate-30">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff69b4" className="animate-pulse" style={{ animationDelay: '1.5s' }}>
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                      {/* Wedding Rings - Multiple colors */}
                      <div className="absolute top-1/2 right-8 opacity-15 transform rotate-45">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '1s' }}>
                          <circle cx="12" cy="12" r="10"/>
                          <circle cx="12" cy="12" r="6"/>
                        </svg>
                      </div>
                      <div className="absolute top-1/3 left-12 opacity-12 transform -rotate-15">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e6e6fa" strokeWidth="2" className="animate-pulse" style={{ animationDelay: '2.5s' }}>
                          <circle cx="12" cy="12" r="8"/>
                          <circle cx="12" cy="12" r="4"/>
                        </svg>
                      </div>
                    </>
                  )}

                  {selectedCategory === 'birthday' && (
                    <>
                      {/* Birthday Balloons - Multiple colors and positions */}
                      <div className="absolute top-6 right-12 opacity-20 transform rotate-12">
                        <svg width="20" height="32" viewBox="0 0 24 36" fill="#ff6b6b" className="animate-bounce" style={{ animationDelay: '0.5s' }}>
                          <ellipse cx="12" cy="12" rx="8" ry="12"/>
                          <line x1="12" y1="24" x2="12" y2="36" stroke="#ff6b6b" strokeWidth="1"/>
                        </svg>
                      </div>
                      <div className="absolute bottom-20 left-8 opacity-18 transform -rotate-12">
                        <svg width="18" height="28" viewBox="0 0 24 36" fill="#4ecdc4" className="animate-bounce" style={{ animationDelay: '1.5s' }}>
                          <ellipse cx="12" cy="12" rx="8" ry="12"/>
                          <line x1="12" y1="24" x2="12" y2="36" stroke="#4ecdc4" strokeWidth="1"/>
                        </svg>
                      </div>
                      <div className="absolute top-16 left-1/4 opacity-16 transform rotate-30">
                        <svg width="16" height="24" viewBox="0 0 24 36" fill="#ffd93d" className="animate-bounce" style={{ animationDelay: '2.5s' }}>
                          <ellipse cx="12" cy="12" rx="8" ry="12"/>
                          <line x1="12" y1="24" x2="12" y2="36" stroke="#ffd93d" strokeWidth="1"/>
                        </svg>
                      </div>
                      <div className="absolute bottom-12 right-1/3 opacity-14 transform -rotate-45">
                        <svg width="22" height="30" viewBox="0 0 24 36" fill="#a8e6cf" className="animate-bounce" style={{ animationDelay: '3s' }}>
                          <ellipse cx="12" cy="12" rx="8" ry="12"/>
                          <line x1="12" y1="24" x2="12" y2="36" stroke="#a8e6cf" strokeWidth="1"/>
                        </svg>
                      </div>
                      {/* Gift Boxes - Multiple colors */}
                      <div className="absolute top-1/3 left-6 opacity-15 transform rotate-45" style={{ color: '#ff6b9d' }}>
                        <Gift className="h-6 w-6 animate-pulse" style={{ animationDelay: '2s' }} />
                      </div>
                      <div className="absolute bottom-1/4 right-8 opacity-12 transform -rotate-30" style={{ color: '#74b9ff' }}>
                        <Gift className="h-5 w-5 animate-pulse" style={{ animationDelay: '3.5s' }} />
                      </div>
                      <div className="absolute top-1/2 right-1/4 opacity-10 transform rotate-15" style={{ color: '#fd79a8' }}>
                        <Gift className="h-4 w-4 animate-pulse" style={{ animationDelay: '1s' }} />
                      </div>
                      {/* Birthday cake icons */}
                      <div className="absolute top-12 left-12 opacity-15 transform rotate-12">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffb3ba" className="animate-pulse" style={{ animationDelay: '4s' }}>
                          <rect x="4" y="14" width="16" height="8" rx="1"/>
                          <rect x="6" y="12" width="12" height="2"/>
                          <line x1="8" y1="12" x2="8" y2="8" stroke="#ff6b6b" strokeWidth="2"/>
                          <line x1="12" y1="12" x2="12" y2="6" stroke="#ff6b6b" strokeWidth="2"/>
                          <line x1="16" y1="12" x2="16" y2="8" stroke="#ff6b6b" strokeWidth="2"/>
                        </svg>
                      </div>
                    </>
                  )}

                  {selectedCategory === 'elegant' && (
                    <>
                      {/* Crown */}
                      <div className="absolute top-12 right-1/3 opacity-15 transform rotate-12">
                        <svg width="28" height="20" viewBox="0 0 24 16" fill="currentColor" className="animate-pulse">
                          <path d="M2 12h20l-2-8-4 4-4-6-4 6-4-4-2 8z"/>
                          <rect x="0" y="12" width="24" height="2"/>
                        </svg>
                      </div>
                      {/* Diamond */}
                      <div className="absolute bottom-1/4 left-12 opacity-12 transform -rotate-45">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse" style={{ animationDelay: '1.5s' }}>
                          <path d="M6 2l-2 6h16l-2-6H6zM4 10l8 12 8-12H4z"/>
                        </svg>
                      </div>
                    </>
                  )}

                  {selectedCategory === 'corporate' && (
                    <>
                      {/* Top Hat */}
                      <div className="absolute top-8 left-1/4 opacity-15 transform rotate-12">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
                          <rect x="4" y="16" width="16" height="2"/>
                          <rect x="7" y="6" width="10" height="10"/>
                          <rect x="6" y="4" width="12" height="2"/>
                        </svg>
                      </div>
                      {/* Briefcase */}
                      <div className="absolute bottom-16 right-8 opacity-12 transform -rotate-12">
                        <svg width="20" height="16" viewBox="0 0 24 20" fill="currentColor" className="animate-pulse" style={{ animationDelay: '2s' }}>
                          <rect x="2" y="6" width="20" height="12" rx="2"/>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="2" y1="10" x2="22" y2="10" stroke="white" strokeWidth="1"/>
                        </svg>
                      </div>
                    </>
                  )}

                  {(selectedCategory === 'nature' || selectedCategory === 'baby') && (
                    <>
                      {/* Flowers - Multiple colors and sizes */}
                      <div className="absolute top-12 right-8 opacity-20 transform rotate-45">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff6b9d" className="animate-pulse">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                          <circle cx="12" cy="12" r="3" fill="#ffd93d"/>
                          <path d="M12 1l3 6-6 0z" fill="#ff8fab"/>
                          <path d="M12 23l-3-6 6 0z" fill="#ff8fab"/>
                          <path d="M1 12l6-3 0 6z" fill="#ff8fab"/>
                          <path d="M23 12l-6 3 0-6z" fill="#ff8fab"/>
                        </svg>
                      </div>
                      <div className="absolute bottom-20 left-1/4 opacity-18 transform -rotate-30">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#a8e6cf" className="animate-pulse" style={{ animationDelay: '1s' }}>
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                          <circle cx="12" cy="12" r="3" fill="#ffd93d"/>
                        </svg>
                      </div>
                      <div className="absolute top-8 left-1/3 opacity-16 transform rotate-75">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#74b9ff" className="animate-pulse" style={{ animationDelay: '3s' }}>
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                          <circle cx="12" cy="12" r="3" fill="#ffffff"/>
                        </svg>
                      </div>
                      <div className="absolute bottom-16 right-1/4 opacity-15 transform -rotate-60">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffc0cb" className="animate-pulse" style={{ animationDelay: '2.2s' }}>
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                          <circle cx="12" cy="12" r="2" fill="#ff6b6b"/>
                        </svg>
                      </div>
                      {/* Colorful Leaves */}
                      <div className="absolute top-1/2 left-8 opacity-15">
                        <svg width="16" height="20" viewBox="0 0 24 24" fill="#4ecdc4" className="animate-pulse" style={{ animationDelay: '2.5s' }}>
                          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.86.66C8 16 10 12 17 10V8z"/>
                        </svg>
                      </div>
                      <div className="absolute bottom-8 right-12 opacity-12">
                        <svg width="14" height="18" viewBox="0 0 24 24" fill="#a8e6cf" className="animate-pulse" style={{ animationDelay: '4s' }}>
                          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.86.66C8 16 10 12 17 10V8z"/>
                        </svg>
                      </div>
                      <div className="absolute top-20 right-1/3 opacity-14 transform rotate-45">
                        <svg width="12" height="16" viewBox="0 0 24 24" fill="#74b9ff" className="animate-pulse" style={{ animationDelay: '1.8s' }}>
                          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.86.66C8 16 10 12 17 10V8z"/>
                        </svg>
                      </div>
                      {/* Butterflies */}
                      <div className="absolute top-1/3 right-8 opacity-12 transform rotate-15">
                        <svg width="20" height="16" viewBox="0 0 24 20" fill="#ff8fab" className="animate-pulse" style={{ animationDelay: '3.5s' }}>
                          <path d="M12 2c-1 0-2 1-2 2 0 1 1 2 2 2s2-1 2-2c0-1-1-2-2-2z"/>
                          <path d="M8 6c-2 0-4 2-4 4s2 4 4 4c1 0 2-1 2-2V8c0-1-1-2-2-2z"/>
                          <path d="M16 6c2 0 4 2 4 4s-2 4-4 4c-1 0-2-1-2-2V8c0-1 1-2 2-2z"/>
                        </svg>
                      </div>
                    </>
                  )}

                  {selectedCategory === 'party' && (
                    <>
                      {/* Musical Notes - Multiple colors */}
                      <div className="absolute top-8 left-1/3 opacity-20 transform rotate-12" style={{ color: '#ff6b9d' }}>
                        <Music className="h-6 w-6 animate-bounce" style={{ animationDelay: '0.5s' }} />
                      </div>
                      <div className="absolute bottom-1/4 right-12 opacity-18 transform -rotate-45" style={{ color: '#4ecdc4' }}>
                        <Music className="h-5 w-5 animate-bounce" style={{ animationDelay: '2s' }} />
                      </div>
                      <div className="absolute top-1/2 left-8 opacity-15 transform rotate-60" style={{ color: '#ffd93d' }}>
                        <Music className="h-4 w-4 animate-bounce" style={{ animationDelay: '3.5s' }} />
                      </div>
                      <div className="absolute bottom-16 left-1/4 opacity-16 transform -rotate-30" style={{ color: '#a8e6cf' }}>
                        <Music className="h-5 w-5 animate-bounce" style={{ animationDelay: '1.5s' }} />
                      </div>
                      {/* Colorful Confetti - Scattered throughout */}
                      <div className="absolute top-1/4 right-8 opacity-25">
                        <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#ff6b6b' }}></div>
                      </div>
                      <div className="absolute top-1/3 left-12 opacity-25">
                        <div className="w-1 h-1 rounded-full animate-ping" style={{ backgroundColor: '#4ecdc4', animationDelay: '1s' }}></div>
                      </div>
                      <div className="absolute bottom-1/3 right-1/4 opacity-25">
                        <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: '#ffd93d', animationDelay: '0.5s' }}></div>
                      </div>
                      <div className="absolute top-12 right-1/3 opacity-20">
                        <div className="w-1 h-1 rounded-full animate-ping" style={{ backgroundColor: '#ff8fab', animationDelay: '2.5s' }}></div>
                      </div>
                      <div className="absolute bottom-8 left-1/3 opacity-22">
                        <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: '#a8e6cf', animationDelay: '1.8s' }}></div>
                      </div>
                      <div className="absolute top-20 left-16 opacity-18">
                        <div className="w-1 h-1 rounded-full animate-ping" style={{ backgroundColor: '#74b9ff', animationDelay: '3s' }}></div>
                      </div>
                      <div className="absolute bottom-20 right-16 opacity-20">
                        <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#fd79a8', animationDelay: '0.8s' }}></div>
                      </div>
                      {/* Party hats */}
                      <div className="absolute top-16 right-8 opacity-15 transform rotate-25">
                        <svg width="16" height="20" viewBox="0 0 24 24" fill="#ff6b9d" className="animate-pulse" style={{ animationDelay: '2.5s' }}>
                          <path d="M12 2L4 20h16L12 2z"/>
                          <circle cx="12" cy="4" r="2" fill="#ffd93d"/>
                        </svg>
                      </div>
                      <div className="absolute bottom-12 left-12 opacity-12 transform -rotate-35">
                        <svg width="14" height="18" viewBox="0 0 24 24" fill="#4ecdc4" className="animate-pulse" style={{ animationDelay: '4s' }}>
                          <path d="M12 2L4 20h16L12 2z"/>
                          <circle cx="12" cy="4" r="2" fill="#ff6b6b"/>
                        </svg>
                      </div>
                    </>
                  )}

                  {selectedCategory === 'holiday' && (
                    <>
                      {/* Stars */}
                      <div className="absolute top-12 right-1/4 opacity-15 transform rotate-12">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <div className="absolute bottom-16 left-8 opacity-12 transform -rotate-45">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse" style={{ animationDelay: '2s' }}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                    </>
                  )}

                  {/* 3D Sparkling Decorative Elements with Depth and Shadows */}
                  <div className="absolute top-1/4 right-1/4 opacity-25 animate-bounce" 
                       style={{ 
                         color: '#ffd93d',
                         transform: 'translateZ(10px) rotateX(15deg)',
                         filter: 'drop-shadow(2px 4px 6px rgba(255, 217, 61, 0.3))',
                         animation: 'sparkle3D 3s ease-in-out infinite'
                       }}>
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="absolute bottom-1/4 left-1/4 opacity-22" 
                       style={{ 
                         color: '#ff6b9d',
                         transform: 'translateZ(8px) rotateY(20deg)',
                         filter: 'drop-shadow(-2px 3px 5px rgba(255, 107, 157, 0.4))',
                         animation: 'sparkle3D 2.5s ease-in-out infinite 1s'
                       }}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="absolute top-1/3 left-1/2 opacity-18" 
                       style={{ 
                         color: '#4ecdc4',
                         transform: 'translateZ(12px) rotateZ(45deg)',
                         filter: 'drop-shadow(1px 3px 4px rgba(78, 205, 196, 0.5))',
                         animation: 'sparkle3D 4s ease-in-out infinite 2.5s'
                       }}>
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <div className="absolute top-12 left-1/2 opacity-20" 
                       style={{ 
                         color: '#74b9ff',
                         transform: 'translateZ(6px) rotateX(-10deg)',
                         filter: 'drop-shadow(3px 2px 7px rgba(116, 185, 255, 0.3))',
                         animation: 'sparkle3D 3.5s ease-in-out infinite 3.8s'
                       }}>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="absolute bottom-12 right-12 opacity-16" 
                       style={{ 
                         color: '#a8e6cf',
                         transform: 'translateZ(15px) rotateY(-25deg)',
                         filter: 'drop-shadow(-1px 4px 5px rgba(168, 230, 207, 0.4))',
                         animation: 'sparkle3D 2.8s ease-in-out infinite 0.5s'
                       }}>
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <div className="absolute top-16 left-8 opacity-19" 
                       style={{ 
                         color: '#ff8fab',
                         transform: 'translateZ(9px) rotateX(30deg)',
                         filter: 'drop-shadow(2px 5px 6px rgba(255, 143, 171, 0.35))',
                         animation: 'sparkle3D 3.2s ease-in-out infinite 4.2s'
                       }}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="absolute bottom-16 left-1/2 opacity-17" 
                       style={{ 
                         color: '#ffc0cb',
                         transform: 'translateZ(7px) rotateZ(-30deg)',
                         filter: 'drop-shadow(0px 3px 8px rgba(255, 192, 203, 0.4))',
                         animation: 'sparkle3D 2.7s ease-in-out infinite 1.8s'
                       }}>
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <div className="absolute top-8 right-1/3 opacity-21" 
                       style={{ 
                         color: '#dda0dd',
                         transform: 'translateZ(11px) rotateY(15deg)',
                         filter: 'drop-shadow(-3px 2px 6px rgba(221, 160, 221, 0.45))',
                         animation: 'sparkle3D 3.8s ease-in-out infinite 2.2s'
                       }}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="absolute bottom-8 right-1/3 opacity-15" 
                       style={{ 
                         color: '#98fb98',
                         transform: 'translateZ(5px) rotateX(-20deg)',
                         filter: 'drop-shadow(1px 1px 4px rgba(152, 251, 152, 0.5))',
                         animation: 'sparkle3D 4.2s ease-in-out infinite 3.5s'
                       }}>
                    <Sparkles className="h-2 w-2" />
                  </div>
                  <div className="absolute top-1/2 right-8 opacity-18" 
                       style={{ 
                         color: '#87ceeb',
                         transform: 'translateZ(13px) rotateZ(60deg)',
                         filter: 'drop-shadow(2px 4px 5px rgba(135, 206, 235, 0.3))',
                         animation: 'sparkle3D 3.1s ease-in-out infinite 0.8s'
                       }}>
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <div className="absolute bottom-1/3 left-8 opacity-16" 
                       style={{ 
                         color: '#f0e68c',
                         transform: 'translateZ(8px) rotateY(-35deg)',
                         filter: 'drop-shadow(-2px 3px 7px rgba(240, 230, 140, 0.4))',
                         animation: 'sparkle3D 2.9s ease-in-out infinite 4.5s'
                       }}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="absolute top-2/3 right-1/4 opacity-14" 
                       style={{ 
                         color: '#daa520',
                         transform: 'translateZ(14px) rotateX(25deg)',
                         filter: 'drop-shadow(3px 1px 5px rgba(218, 165, 32, 0.5))',
                         animation: 'sparkle3D 3.6s ease-in-out infinite 1.2s'
                       }}>
                    <Sparkles className="h-2 w-2" />
                  </div>

                  {/* 3D Print Effect Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-20"
                         style={{
                           background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                           animation: 'printSweep 4s ease-in-out infinite'
                         }}>
                    </div>
                  </div>

                  {/* Embossed Border Effect */}
                  <div className="absolute inset-2 rounded-lg pointer-events-none"
                       style={{
                         boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.2)',
                         border: '1px solid rgba(255,255,255,0.2)'
                       }}>
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Badge 
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{ 
                            backgroundColor: selectedTemplate.accentColor,
                            color: selectedTemplate.textColor === "white" ? "#333" : "white"
                          }}
                        >
                          You're Invited!
                        </Badge>
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full opacity-30" style={{ backgroundColor: selectedTemplate.accentColor }}></div>
                          <div className="w-3 h-3 rounded-full opacity-50" style={{ backgroundColor: selectedTemplate.accentColor }}></div>
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTemplate.accentColor }}></div>
                        </div>
                      </div>

                      <h1 className="text-3xl font-serif font-bold mb-4 tracking-wide leading-tight" 
                          style={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            letterSpacing: '0.5px'
                          }}>
                        {event.title}
                      </h1>
                      {event.description && (
                        <p className="text-base opacity-95 mb-4 font-light leading-relaxed">{event.description}</p>
                      )}
                      
                      {customMessage && (
                        <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                          <p className="text-base italic opacity-95 font-light leading-relaxed" 
                             style={{ fontFamily: 'serif' }}>
                            "{customMessage}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {includeTime && (
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: selectedTemplate.accentColor }}
                          >
                            <Calendar className="h-4 w-4" style={{ color: selectedTemplate.textColor === "white" ? "#333" : "white" }} />
                          </div>
                          <div>
                            <div className="font-medium">{formatDate(event.date)}</div>
                            <div className="text-sm opacity-80">{formatTime(event.time || "7:00 PM")}</div>
                          </div>
                        </div>
                      )}

                      {includeLocation && event.location && (
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: selectedTemplate.accentColor }}
                          >
                            <MapPin className="h-4 w-4" style={{ color: selectedTemplate.textColor === "white" ? "#333" : "white" }} />
                          </div>
                          <div className="font-medium">{event.location}</div>
                        </div>
                      )}

                      {rsvpRequired && (
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: selectedTemplate.accentColor }}
                          >
                            <Check className="h-4 w-4" style={{ color: selectedTemplate.textColor === "white" ? "#333" : "white" }} />
                          </div>
                          <div className="text-sm">RSVP Required</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`w-full h-96 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-2xl overflow-hidden relative border-2 border-amber-200 transition-all duration-800 ease-in-out ${
                  cardAnimation === "entering" ? "transform scale-105 shadow-3xl" : 
                  cardAnimation === "exiting" ? "transform scale-95 shadow-lg" : 
                  "transform scale-100 shadow-2xl"
                }`}>
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-amber-200 to-amber-100 transform origin-top"
                         style={{
                           clipPath: "polygon(0 0, 50% 70%, 100% 0)"
                         }}>
                    </div>
                    
                    <div className="absolute top-4 right-4 w-16 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded border-2 border-blue-700 flex items-center justify-center">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div className="relative z-10 p-8 pt-24 h-full flex flex-col justify-between text-gray-800">
                    <div className="space-y-1">
                      <div className="font-serif text-lg font-medium">
                        {envelopeData.recipientName || "Recipient Name"}
                      </div>
                      <div className="font-serif">
                        {envelopeData.recipientAddress || "123 Main Street"}
                      </div>
                      <div className="font-serif">
                        {envelopeData.recipientCity || "City"}, {envelopeData.recipientState || "ST"} {envelopeData.recipientZip || "12345"}
                      </div>
                    </div>

                    <div className="space-y-1 text-sm opacity-80">
                      <div className="font-serif font-medium">
                        {envelopeData.senderName || "Your Name"}
                      </div>
                      <div className="font-serif">
                        {envelopeData.senderAddress || "456 Your Street"}
                      </div>
                      <div className="font-serif">
                        {envelopeData.senderCity || "Your City"}, {envelopeData.senderState || "ST"} {envelopeData.senderZip || "67890"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Share Options */}
            <div className="flex gap-2">
              <Button onClick={handleCopyLink} variant="outline" className="flex-1">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Customize Your Invitation</h3>
              
              {/* View Mode Toggle */}
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">Choose Template</label>
                <div className="flex rounded-lg border overflow-hidden">
                  <Button
                    variant={viewMode === "2d" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("2d")}
                    className="rounded-none text-xs"
                  >
                    2D View
                  </Button>
                  <Button
                    variant={viewMode === "3d" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("3d")}
                    className="rounded-none text-xs"
                  >
                    3D View
                  </Button>
                </div>
              </div>
              
              {/* Category Selection */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-blue-700">Occasion Category</label>
                <Select value={selectedCategory} onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedTemplate(cardTemplates[value as keyof typeof cardTemplates][0]);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">🎂 Birthday</SelectItem>
                    <SelectItem value="wedding">💒 Wedding</SelectItem>
                    <SelectItem value="corporate">💼 Corporate</SelectItem>
                    <SelectItem value="graduation">🎓 Graduation</SelectItem>
                    <SelectItem value="baby">👶 Baby Shower</SelectItem>
                    <SelectItem value="anniversary">💕 Anniversary</SelectItem>
                    <SelectItem value="elegant">✨ Elegant</SelectItem>
                    <SelectItem value="party">🎉 Party</SelectItem>
                    <SelectItem value="nature">🌿 Nature</SelectItem>
                    <SelectItem value="christmas">🎄 Christmas</SelectItem>
                    <SelectItem value="valentine">💘 Valentine's Day</SelectItem>
                    <SelectItem value="newyear">🎊 New Year</SelectItem>
                    <SelectItem value="halloween">🎃 Halloween</SelectItem>
                    <SelectItem value="thanksgiving">🦃 Thanksgiving</SelectItem>
                    <SelectItem value="easter">🐣 Easter</SelectItem>
                    <SelectItem value="mothersday">🌸 Mother's Day</SelectItem>
                    <SelectItem value="fathersday">👔 Father's Day</SelectItem>
                    <SelectItem value="housewarming">🏠 Housewarming</SelectItem>
                    <SelectItem value="retirement">🌅 Retirement</SelectItem>
                    <SelectItem value="engagement">💍 Engagement</SelectItem>
                    <SelectItem value="bridal">👰 Bridal Shower</SelectItem>
                    <SelectItem value="quinceañera">👑 Quinceañera</SelectItem>
                    <SelectItem value="sweet16">🎈 Sweet 16</SelectItem>
                    <SelectItem value="reunion">👨‍👩‍👧‍👦 Reunion</SelectItem>
                    <SelectItem value="memorial">🕊️ Memorial</SelectItem>
                    <SelectItem value="charity">💝 Charity Event</SelectItem>
                    <SelectItem value="awards">🏆 Awards Ceremony</SelectItem>
                    <SelectItem value="fundraiser">💰 Fundraiser</SelectItem>
                    <SelectItem value="conference">📊 Conference</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Template Selection */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-blue-700">Template Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {cardTemplates[selectedCategory as keyof typeof cardTemplates]?.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedTemplate.id === template.id 
                          ? "border-blue-500 ring-2 ring-blue-200" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ background: template.background }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium" style={{ color: template.textColor }}>
                          {template.name}
                        </span>
                      </div>
                      {selectedTemplate.id === template.id && (
                        <div className="absolute top-1 right-1">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="h-2 w-2 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Invitation Generation */}
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Invitation Generator
                </h4>
                
                <div className="space-y-3">
                  <label className="text-xs font-medium text-purple-700">
                    Describe the tone or style you want for your invitation
                  </label>
                  <Textarea
                    placeholder="E.g., 'Make it fun and casual for a birthday party' or 'Keep it elegant and formal for an anniversary'"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                  <Button
                    type="button"
                    onClick={generateAIInvitation}
                    disabled={isGeneratingAI || !aiPrompt.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    size="sm"
                  >
                    {isGeneratingAI ? (
                      <>
                        <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-2" />
                        Generate AI Message
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Personal Message (Optional)</label>
                <Textarea
                  placeholder="Add a personal touch to your invitation..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                />
                {generatedMessage && (
                  <p className="text-xs text-green-600">
                    ✓ AI generated message applied above
                  </p>
                )}
              </div>

              {/* Photo Customization */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photo Customization
                </h4>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Background Image */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-blue-700 flex items-center gap-2">
                      <ImageIcon className="h-3 w-3" />
                      Background Image
                    </label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file, 'background');
                        }}
                        className="text-sm"
                      />
                      {backgroundImage && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-12 h-8 rounded border overflow-hidden">
                            <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImage('background')}
                            className="text-xs"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Upload a custom background image for your invitation</p>
                  </div>

                  {/* Host Photo */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-blue-700 flex items-center gap-2">
                      <UserCircle className="h-3 w-3" />
                      Host Photo
                    </label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file, 'host');
                        }}
                        className="text-sm"
                      />
                      {hostPhoto && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-12 h-12 rounded-full border overflow-hidden">
                            <img src={hostPhoto} alt="Host" className="w-full h-full object-cover" />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImage('host')}
                            className="text-xs"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Add your photo to personalize the invitation</p>
                  </div>

                  {/* Logo/Brand Image */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-blue-700 flex items-center gap-2">
                      <Star className="h-3 w-3" />
                      Logo/Brand Image
                    </label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file, 'logo');
                        }}
                        className="text-sm"
                      />
                      {logoImage && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-12 h-12 rounded border overflow-hidden">
                            <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImage('logo')}
                            className="text-xs"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Add a logo or brand image to your invitation</p>
                  </div>

                  {/* Decorative Image */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-blue-700 flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      Decorative Image
                    </label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file, 'decorative');
                        }}
                        className="text-sm"
                      />
                      {decorativeImage && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-12 h-8 rounded border overflow-hidden">
                            <img src={decorativeImage} alt="Decoration" className="w-full h-full object-cover" />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImage('decorative')}
                            className="text-xs"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Add decorative elements like borders, frames, or ornaments</p>
                  </div>

                  {/* Image Tips */}
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <h5 className="text-xs font-medium text-blue-800 mb-2">Image Tips:</h5>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Use high-quality images (1080p or higher)</li>
                      <li>• Background images work best in landscape format</li>
                      <li>• Host photos look great as square or portrait images</li>
                      <li>• Logo images should be clear with transparent backgrounds when possible</li>
                      <li>• Decorative images work best with transparent backgrounds (PNG format)</li>
                      <li>• Try ornamental borders, floral elements, or geometric patterns for decoration</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* RSVP Settings */}
              <div className="space-y-2">
                <label className="text-sm font-medium">RSVP Settings</label>
                <Select value={rsvpRequired ? "required" : "optional"} onValueChange={(value) => setRsvpRequired(value === "required")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="required">RSVP Required</SelectItem>
                    <SelectItem value="optional">RSVP Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Envelope Addressing */}
              {showEnvelope && (
                <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-800">Envelope Addressing</h4>
                  
                  <div className="space-y-3">
                    <h5 className="text-xs font-medium text-amber-700">Recipient Address:</h5>
                    <Input
                      placeholder="Recipient Name"
                      value={envelopeData.recipientName}
                      onChange={(e) => setEnvelopeData({...envelopeData, recipientName: e.target.value})}
                    />
                    <Input
                      placeholder="Street Address"
                      value={envelopeData.recipientAddress}
                      onChange={(e) => setEnvelopeData({...envelopeData, recipientAddress: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="City"
                        value={envelopeData.recipientCity}
                        onChange={(e) => setEnvelopeData({...envelopeData, recipientCity: e.target.value})}
                      />
                      <Input
                        placeholder="State"
                        value={envelopeData.recipientState}
                        onChange={(e) => setEnvelopeData({...envelopeData, recipientState: e.target.value})}
                      />
                    </div>
                    <Input
                      placeholder="ZIP Code"
                      value={envelopeData.recipientZip}
                      onChange={(e) => setEnvelopeData({...envelopeData, recipientZip: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-medium text-amber-700">Return Address:</h5>
                    <Input
                      placeholder="Your Name"
                      value={envelopeData.senderName}
                      onChange={(e) => setEnvelopeData({...envelopeData, senderName: e.target.value})}
                    />
                    <Input
                      placeholder="Your Street Address"
                      value={envelopeData.senderAddress}
                      onChange={(e) => setEnvelopeData({...envelopeData, senderAddress: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Your City"
                        value={envelopeData.senderCity}
                        onChange={(e) => setEnvelopeData({...envelopeData, senderCity: e.target.value})}
                      />
                      <Input
                        placeholder="State"
                        value={envelopeData.senderState}
                        onChange={(e) => setEnvelopeData({...envelopeData, senderState: e.target.value})}
                      />
                    </div>
                    <Input
                      placeholder="ZIP Code"
                      value={envelopeData.senderZip}
                      onChange={(e) => setEnvelopeData({...envelopeData, senderZip: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* Additional Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include event details</span>
                  <Badge variant="secondary">Always included</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include location</span>
                  <Badge variant="secondary">Always included</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include date & time</span>
                  <Badge variant="secondary">Always included</Badge>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerateCard}
              disabled={generateCard.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {generateCard.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Card...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Invitation Card
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}