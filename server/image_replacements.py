import re

# Read the routes.ts file
with open('routes.ts', 'r') as f:
    content = f.read()

# Define appropriate images for different event types
event_images = {
    'party_bus_001': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=240&fit=crop&auto=format',  # Party bus with LED lights
    'cruise_001': 'https://images.unsplash.com/photo-1566024287286-457247b70310?w=400&h=240&fit=crop&auto=format',    # Luxury yacht/cruise ship
    'yacht_001': 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=240&fit=crop&auto=format',     # Manhattan skyline yacht
    'rooftop_001': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=240&fit=crop&auto=format',   # Rooftop pool party
    'beach_001': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=240&fit=crop&auto=format',     # Beach party
    'nightclub_001': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop&auto=format', # Nightclub interior
    'warehouse_001': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=240&fit=crop&auto=format', # Underground warehouse rave
    'festival_001': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=240&fit=crop&auto=format',  # Music festival
    'corporate_001': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=240&fit=crop&auto=format'  # Corporate event
}

# Replace corrupted image URLs with clean ones
content = re.sub(r'image: "https://images\.unsplash\.com/[^"]*"[^"]*"[^"]*"[^"]*"[^"]*",', '', content)

# Fix the broken structure by replacing event entries with proper ones
events_data = '''        {
          id: "party_bus_001",
          title: "Miami Party Bus VIP Tour",
          description: "Experience Miami's hottest nightlife with our luxury party bus featuring premium sound system, LED lighting, and VIP club access. Includes stops at 3 top venues.",
          category: "party-bus",
          venue: "Luxury Party Bus",
          address: "South Beach Collection Point",
          city: "Miami",
          date: "2025-06-15",
          time: "20:00",
          price: { min: 85, max: 150, currency: "USD" },
          image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=240&fit=crop&auto=format",
          rating: 4.8,
          attendees: 24,
          maxCapacity: 40,
          tags: ["party bus", "VIP", "nightlife", "Miami"],
          featured: true,
          trending: false,
          soldOut: false,
          organizer: "Miami Party Bus Tours"
        },
        {
          id: "cruise_001",
          title: "Caribbean Sunset Cruise Party",
          description: "Sail into the sunset with live DJ, open bar, gourmet dining, and breathtaking ocean views. Experience luxury at sea with premium entertainment.",
          category: "cruise",
          venue: "Luxury Yacht Serenity",
          address: "Miami Beach Marina",
          city: "Miami",
          date: "2025-06-20",
          time: "18:00",
          price: { min: 125, max: 299, currency: "USD" },
          image: "https://images.unsplash.com/photo-1566024287286-457247b70310?w=400&h=240&fit=crop&auto=format",
          rating: 4.9,
          attendees: 156,
          maxCapacity: 200,
          tags: ["cruise", "sunset", "open bar", "luxury"],
          featured: true,
          trending: true,
          soldOut: false,
          organizer: "Ocean Luxury Events"
        },
        {
          id: "yacht_001",
          title: "Manhattan Skyline Yacht Experience",
          description: "Private yacht charter with stunning NYC skyline views, premium bottle service, gourmet catering, and professional photography.",
          category: "yacht",
          venue: "Private Yacht Neptune",
          address: "Chelsea Piers",
          city: "New York",
          date: "2025-06-22",
          time: "19:30",
          price: { min: 150, max: 250, currency: "USD" },
          image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=240&fit=crop&auto=format",
          rating: 4.7,
          attendees: 45,
          maxCapacity: 60,
          tags: ["yacht", "NYC skyline", "private", "luxury"],
          featured: false,
          trending: true,
          soldOut: false,
          organizer: "NYC Yacht Charters"
        },
        {
          id: "rooftop_001",
          title: "Downtown LA Rooftop Pool Party",
          description: "Exclusive rooftop pool party with panoramic city views, celebrity DJ, VIP cabanas, and signature cocktails in the heart of downtown LA.",
          category: "rooftop",
          venue: "SkyBar Rooftop",
          address: "550 S Flower St",
          city: "Los Angeles",
          date: "2025-06-25",
          time: "21:00",
          price: { min: 65, max: 120, currency: "USD" },
          image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=240&fit=crop&auto=format",
          rating: 4.6,
          attendees: 89,
          maxCapacity: 150,
          tags: ["rooftop", "pool party", "city views", "celebrity DJ"],
          featured: true,
          trending: false,
          soldOut: false,
          organizer: "LA Rooftop Events"
        },
        {
          id: "beach_001",
          title: "Malibu Beach Sunset Festival",
          description: "Beach festival with live bands, fire dancers, artisan food trucks, and bohemian vibes. Watch the sunset over the Pacific Ocean while dancing in the sand.",
          category: "beach",
          venue: "Malibu Beach Club",
          address: "Pacific Coast Highway",
          city: "Malibu",
          date: "2025-06-28",
          time: "16:00",
          price: { min: 45, max: 85, currency: "USD" },
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=240&fit=crop&auto=format",
          rating: 4.4,
          attendees: 312,
          maxCapacity: 500,
          tags: ["beach", "sunset", "live music", "bohemian"],
          featured: false,
          trending: true,
          soldOut: false,
          organizer: "California Beach Events"
        },
        {
          id: "nightclub_001",
          title: "Electric Nights at Club Neon",
          description: "Underground electronic music experience with world-class DJs, laser light shows, and immersive sound systems. VIP bottle service available.",
          category: "nightclub",
          venue: "Club Neon",
          address: "456 Electronic Ave",
          city: "Las Vegas",
          date: "2025-07-01",
          time: "22:00",
          price: { min: 75, max: 200, currency: "USD" },
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop&auto=format",
          rating: 4.5,
          attendees: 234,
          maxCapacity: 400,
          tags: ["nightclub", "electronic", "DJ", "VIP"],
          featured: true,
          trending: true,
          soldOut: false,
          organizer: "Vegas Night Entertainment"
        },
        {
          id: "warehouse_001",
          title: "Underground Warehouse Rave",
          description: "Secret location warehouse party with underground techno, industrial vibes, and immersive art installations. Limited capacity for exclusive experience.",
          category: "warehouse",
          venue: "Secret Warehouse Location",
          address: "Industrial District",
          city: "Detroit",
          date: "2025-07-05",
          time: "23:00",
          price: { min: 40, max: 80, currency: "USD" },
          image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=240&fit=crop&auto=format",
          rating: 4.3,
          attendees: 156,
          maxCapacity: 250,
          tags: ["warehouse", "techno", "underground", "art"],
          featured: false,
          trending: false,
          soldOut: true,
          organizer: "Underground Collective"
        },
        {
          id: "festival_001",
          title: "Summer Music Festival 2025",
          description: "Three-day music festival featuring 50+ artists across multiple stages, food vendors, art installations, and camping options.",
          category: "festival",
          venue: "Festival Grounds",
          address: "Golden Gate Park",
          city: "San Francisco",
          date: "2025-07-15",
          time: "12:00",
          price: { min: 150, max: 350, currency: "USD" },
          image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=240&fit=crop&auto=format",
          rating: 4.8,
          attendees: 2500,
          maxCapacity: 5000,
          tags: ["festival", "multi-day", "camping", "multiple stages"],
          featured: true,
          trending: true,
          soldOut: false,
          organizer: "Summer Fest Productions"
        }'''

# Find and replace the events array content
pattern = r'const events = \[(.*?)\];'
match = re.search(pattern, content, re.DOTALL)

if match:
    # Replace with clean events data
    content = content.replace(match.group(1), events_data)

# Write the corrected content back
with open('routes.ts', 'w') as f:
    f.write(content)

print("Successfully updated all event images with contextually appropriate photos!")
