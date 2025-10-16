import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Wand2,
  Star,
  Heart,
  Share2,
  Download,
  Sparkles,
} from "lucide-react";
import { MoodType, DesignStyle } from "../types";

interface StoryGeneratorProps {
  storyPrompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  generatedStory: string;
  imageUrl?: string | null;
  currentMood: MoodType;
  designStyle: DesignStyle;
}

export function StoryGenerator({
  storyPrompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  generatedStory,
  imageUrl,
  currentMood,
  designStyle,
}: StoryGeneratorProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Story Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter a story prompt or theme..."
            value={storyPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            rows={4}
          />

          <div className="grid grid-cols-2 gap-2">
            <Badge variant="outline">Mood: {currentMood}</Badge>
            <Badge variant="outline">Style: {designStyle}</Badge>
          </div>

          <Button
            className="w-full"
            onClick={() => onGenerate(storyPrompt)}
            disabled={isGenerating || !storyPrompt.trim()}
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Story
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Generated Story
          </CardTitle>
        </CardHeader>
        <CardContent>
          {generatedStory ? (
            <div className="space-y-4">
              <div className="p-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                <p className="text-sm leading-relaxed">{generatedStory}</p>
              </div>
              {imageUrl && (
                <div className="pt-2">
                  <img
                    src={imageUrl}
                    alt="Generated"
                    className="w-full max-w-sm mx-auto rounded shadow"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No story generated yet</p>
              <p className="text-sm text-gray-400">
                Enter a prompt to create your personalized story
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
