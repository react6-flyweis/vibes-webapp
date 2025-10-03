import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Sparkles, UserPlus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function GuestMatchmaking() {
  const [guests, setGuests] = useState([
    {
      name: "Sarah Chen",
      interests: "photography, hiking, craft beer",
      personality: "creative, adventurous"
    },
    {
      name: "Mike Rodriguez", 
      interests: "photography, travel, cooking",
      personality: "artistic, outgoing"
    }
  ]);
  const [matches, setMatches] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateMatches = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/ai/guest-matchmaking', 'POST', { guests });
      return response;
    },
    onSuccess: (data) => {
      setMatches(data);
      toast({
        title: "🎉 AI Matchmaking Complete!",
        description: `Found ${data.length} potential connections for your guests.`
      });
    },
    onError: () => {
      toast({
        title: "Matchmaking Error",
        description: "Let's try again with updated guest information.",
        variant: "destructive"
      });
    }
  });

  const handleGenerateMatches = () => {
    if (guests.length < 2) {
      toast({
        title: "Add More Guests",
        description: "You need at least 2 guests for AI matchmaking.",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    generateMatches.mutate();
  };

  const addGuest = () => {
    setGuests([...guests, { name: "", interests: "", personality: "" }]);
  };

  const updateGuest = (index: number, field: string, value: string) => {
    const updated = [...guests];
    updated[index] = { ...updated[index], [field]: value };
    setGuests(updated);
  };

  const removeGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-pink-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              AI Guest Matchmaking
            </h1>
            <Sparkles className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Help your guests connect! Add guest profiles and let AI find meaningful connections based on shared interests and compatibility.
          </p>
        </div>

        {/* Guest Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Guest Profiles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {guests.map((guest, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Guest {index + 1}</h3>
                  {guests.length > 2 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeGuest(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Guest name"
                    value={guest.name}
                    onChange={(e) => updateGuest(index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Interests (comma separated)"
                    value={guest.interests}
                    onChange={(e) => updateGuest(index, 'interests', e.target.value)}
                  />
                  <Input
                    placeholder="Personality traits"
                    value={guest.personality}
                    onChange={(e) => updateGuest(index, 'personality', e.target.value)}
                  />
                </div>
              </div>
            ))}
            
            <div className="flex gap-4">
              <Button onClick={addGuest} variant="outline" className="flex-1">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Guest
              </Button>
              <Button 
                onClick={handleGenerateMatches}
                disabled={isGenerating || guests.length < 2}
                className="flex-1 bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Finding Connections...
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Generate AI Matches
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Matches Display */}
        {matches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                AI-Generated Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {matches.map((match, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-linear-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">
                        {match.guest1} ↔ {match.guest2}
                      </h3>
                      <Badge className="bg-green-100 text-green-800">
                        Perfect Match
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      <strong>Why they'll connect:</strong> {match.reason}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8 bg-linear-to-r from-violet-600 to-purple-600 text-white">
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">How AI Matchmaking Works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-90" />
                  <h3 className="font-semibold mb-2">Add Guests</h3>
                  <p className="text-sm opacity-80">Input guest names, interests, and personalities</p>
                </div>
                <div className="text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-90" />
                  <h3 className="font-semibold mb-2">AI Analysis</h3>
                  <p className="text-sm opacity-80">Advanced algorithms find compatibility patterns</p>
                </div>
                <div className="text-center">
                  <Heart className="h-12 w-12 mx-auto mb-3 opacity-90" />
                  <h3 className="font-semibold mb-2">Perfect Matches</h3>
                  <p className="text-sm opacity-80">Get intelligent suggestions for meaningful connections</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}