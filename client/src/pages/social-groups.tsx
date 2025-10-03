import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Search, Filter, MapPin, Calendar, Crown, Star, Heart, MessageCircle, Share2, UserPlus } from "lucide-react";
import { Link } from "wouter";

export default function SocialGroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const groups = [
    {
      id: 1,
      name: "Tech Meetup NYC",
      description: "Weekly gatherings for tech enthusiasts in New York City",
      members: 847,
      category: "Technology",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=200&fit=crop&auto=format",
      isPrivate: false,
      nextEvent: "Jan 15, 2025",
      location: "Manhattan",
      tags: ["networking", "startups", "AI"],
      verified: true
    },
    {
      id: 2,
      name: "Fitness Warriors",
      description: "Group workouts and wellness events for all fitness levels",
      members: 1203,
      category: "Health & Fitness",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=200&fit=crop&auto=format",
      isPrivate: false,
      nextEvent: "Jan 12, 2025",
      location: "Central Park",
      tags: ["fitness", "outdoor", "community"],
      verified: false
    },
    {
      id: 3,
      name: "Foodie Adventures",
      description: "Exploring the best restaurants and food experiences",
      members: 692,
      category: "Food & Drink",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=200&fit=crop&auto=format",
      isPrivate: false,
      nextEvent: "Jan 18, 2025",
      location: "Brooklyn",
      tags: ["food", "restaurants", "culture"],
      verified: true
    },
    {
      id: 4,
      name: "Creative Minds",
      description: "Artists, designers, and creators collaborating on projects",
      members: 356,
      category: "Arts & Culture",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=200&fit=crop&auto=format",
      isPrivate: true,
      nextEvent: "Jan 20, 2025",
      location: "SoHo",
      tags: ["art", "design", "creativity"],
      verified: false
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "technology", label: "Technology" },
    { value: "health", label: "Health & Fitness" },
    { value: "food", label: "Food & Drink" },
    { value: "arts", label: "Arts & Culture" },
    { value: "business", label: "Business & Networking" },
    { value: "sports", label: "Sports & Recreation" }
  ];

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           group.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Social Groups
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect with like-minded people and create unforgettable experiences together
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-64">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                  <DialogDescription>
                    Start a new community around your interests
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input id="groupName" placeholder="Enter group name" />
                  </div>
                  <div>
                    <Label htmlFor="groupDescription">Description</Label>
                    <Textarea id="groupDescription" placeholder="Describe your group..." />
                  </div>
                  <div>
                    <Label htmlFor="groupCategory">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-linear-to-r from-purple-600 to-blue-600"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Create Group
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="overflow-hidden hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
              <div className="relative">
                <img 
                  src={group.image} 
                  alt={group.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {group.verified && (
                    <Badge className="bg-blue-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {group.isPrivate && (
                    <Badge variant="secondary">
                      <Crown className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {group.description}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {group.members.toLocaleString()} members
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {group.location}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4" />
                    Next event: {group.nextEvent}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/groups/${group.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Button size="sm" className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No groups found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or create a new group
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to get started?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/virtual-meeting-platform">
              <Button size="lg" className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Calendar className="h-5 w-5 mr-2" />
                Join Virtual Meetings
              </Button>
            </Link>
            <Link href="/create-event">
              <Button variant="outline" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Your Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}