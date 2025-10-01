import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, MapPin, Calendar, Crown, Settings, Bell, Eye, Lock, Camera, Star, Trophy, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  location?: string;
  bio?: string;
  profileImage?: string;
  subscriptionTier: "free" | "premium" | "enterprise";
  eventsHosted: number;
  totalGuests: number;
  joinDate: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    eventReminders: boolean;
    theme: "light" | "dark" | "system";
    language: string;
  };
}

const mockUserProfile: UserProfile = {
  id: 1,
  username: "sarah_chen",
  email: "sarah.chen@email.com",
  fullName: "Sarah Chen",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  bio: "Event planning enthusiast who loves bringing people together for unforgettable experiences. Specializing in tech meetups and creative celebrations!",
  profileImage: "",
  subscriptionTier: "premium",
  eventsHosted: 12,
  totalGuests: 340,
  joinDate: "2024-01-15",
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    eventReminders: true,
    theme: "system",
    language: "en"
  }
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: Partial<UserProfile>) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return updatedProfile;
    },
    onSuccess: () => {
      setIsEditing(false);
      toast({
        title: "✅ Profile Updated!",
        description: "Your changes have been saved successfully."
      });
    }
  });

  const updatePreferences = useMutation({
    mutationFn: async (preferences: UserProfile['preferences']) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return preferences;
    },
    onSuccess: () => {
      toast({
        title: "⚙️ Preferences Saved!",
        description: "Your notification settings have been updated."
      });
    }
  });

  const handleSaveProfile = () => {
    updateProfile.mutate(profile);
  };

  const handlePreferenceChange = (key: keyof UserProfile['preferences'], value: any) => {
    const newPreferences = { ...profile.preferences, [key]: value };
    setProfile({ ...profile, preferences: newPreferences });
    updatePreferences.mutate(newPreferences);
  };

  const getSubscriptionBadge = (tier: string) => {
    switch (tier) {
      case "premium":
        return <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"><Crown className="h-3 w-3 mr-1" />Premium</Badge>;
      case "enterprise":
        return <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"><Trophy className="h-3 w-3 mr-1" />Enterprise</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <User className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <Settings className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        {/* Profile Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.profileImage} />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {profile.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                  {getSubscriptionBadge(profile.subscriptionTier)}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">@{profile.username}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{profile.eventsHosted} events hosted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{profile.totalGuests} total guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>Member since {new Date(profile.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Personal Info</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ""}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location || ""}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ""}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself and your event planning style..."
                    className="min-h-[100px]"
                  />
                </div>

                {isEditing && (
                  <Button
                    onClick={handleSaveProfile}
                    disabled={updateProfile.isPending}
                    className="w-full"
                  >
                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about your events via email</p>
                  </div>
                  <Switch
                    checked={profile.preferences.emailNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get text messages for urgent updates</p>
                  </div>
                  <Switch
                    checked={profile.preferences.smsNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive tips, trends, and platform updates</p>
                  </div>
                  <Switch
                    checked={profile.preferences.marketingEmails}
                    onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Event Reminders</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get reminded about upcoming events</p>
                  </div>
                  <Switch
                    checked={profile.preferences.eventReminders}
                    onCheckedChange={(checked) => handlePreferenceChange('eventReminders', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Display Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={profile.preferences.theme}
                    onValueChange={(value) => handlePreferenceChange('theme', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={profile.preferences.language}
                    onValueChange={(value) => handlePreferenceChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Premium Plan</h3>
                    <p className="text-gray-600 dark:text-gray-400">$8.99/month</p>
                  </div>
                  {getSubscriptionBadge(profile.subscriptionTier)}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <span className="text-sm">AI Theme Generator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Guest Matchmaking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <span className="text-sm">AR Space Preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <span className="text-sm">VibeBot Assistant</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Change Plan
                  </Button>
                  <Button variant="outline">
                    Billing History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last changed 3 months ago</p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Active Sessions</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage devices signed into your account</p>
                  </div>
                  <Button variant="outline">View Sessions</Button>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                  <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
                    This action cannot be undone
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}