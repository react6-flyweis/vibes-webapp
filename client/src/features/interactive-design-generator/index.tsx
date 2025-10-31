import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wand2, Sparkles, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Import hooks
import {
  useKonvaCanvas,
  useMoodPalette,
  useAchievements,
  useSparkleEffect,
  useCollaboration,
  useOnboarding,
  useGroupIntegration,
} from "./hooks";

// Import components
import {
  KonvaDesignCanvas,
  DesignControls,
  MoodPalettes,
  StoryGenerator,
  AchievementsDisplay,
  CollaborationPanel,
  OnboardingCard,
  GroupIntegration,
} from "./components";

// Import types
import { DesignStyle, MoodType, SharedContent } from "./types";

// Import utilities
import { createSparkleEffect } from "./utils";

export default function InteractiveDesignGenerator() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("generator");

  // Design state
  const [designStyle, setDesignStyle] = useState<DesignStyle>("modern");
  const [storyPrompt, setStoryPrompt] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [clientImageUrl, setClientImageUrl] = useState<string | null>(null);
  const [isClientGenerating, setIsClientGenerating] = useState(false);

  // Custom hooks
  const canvas = useKonvaCanvas();
  const moodPalette = useMoodPalette();
  const achievements = useAchievements();
  const collaboration = useCollaboration();
  const onboarding = useOnboarding();
  const groupIntegration = useGroupIntegration();
  useSparkleEffect();

  // Client-side story generation using OpenAI API
  const clientGenerateStoryAndImage = async (prompt: string) => {
    const key = import.meta.env.VITE_OPENAI_API_KEY;
    if (!key) {
      toast({
        title: "VITE_OPENAI_API_KEY missing",
        description:
          "Set VITE_OPENAI_API_KEY in your .env and restart the dev server.",
        variant: "destructive",
      });
      return;
    }

    setIsClientGenerating(true);
    setClientImageUrl(null);

    try {
      // Chat completion
      const chatResp = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content:
                  "You are a creative storyteller that writes immersive short stories tailored to mood and style.",
              },
              {
                role: "user",
                content: `Prompt: ${prompt}\nMood: ${
                  moodPalette.currentMood
                }\nStyle: ${designStyle}\nColors: ${moodPalette.colorPalette.join(
                  ", "
                )}`,
              },
            ],
            max_tokens: 500,
            temperature: 0.85,
          }),
        }
      );

      if (!chatResp.ok) {
        let errMsg = "Chat generation failed";
        try {
          const j = await chatResp.json();
          errMsg = j?.error?.message || JSON.stringify(j);
        } catch (e) {
          errMsg = await chatResp.text();
        }
        throw new Error(errMsg || "Chat generation failed");
      }

      const chatData = await chatResp.json();
      const storyText = (
        chatData.choices?.[0]?.message?.content ||
        chatData.choices?.[0]?.text ||
        ""
      ).toString();
      setGeneratedStory(storyText.trim());

      // Image generation
      const imagePrompt = `${designStyle} ${
        moodPalette.currentMood
      } themed poster for: ${prompt}. Use colors: ${moodPalette.colorPalette.join(
        ", "
      )}. High resolution, vibrant composition, centered subject.`;

      const imgResp = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: "gpt-image-1",
            prompt: imagePrompt,
            size: "1024x1024",
            n: 1,
          }),
        }
      );

      if (!imgResp.ok) {
        let errMsg = "Image generation failed";
        try {
          const j = await imgResp.json();
          errMsg = j?.error?.message || JSON.stringify(j);
        } catch (e) {
          errMsg = await imgResp.text();
        }
        throw new Error(errMsg || "Image generation failed");
      }

      const imgData = await imgResp.json();
      const imgEntry = imgData.data?.[0] || null;
      if (imgEntry?.b64_json) {
        setClientImageUrl(`data:image/png;base64,${imgEntry.b64_json}`);
      } else if (imgEntry?.url) {
        setClientImageUrl(imgEntry.url);
      }

      // Unlock achievement and share
      achievements.unlockAchievement("story_teller");

      await groupIntegration.shareContentWithGroup({
        type: "story",
        content: storyText,
        mood: moodPalette.currentMood,
        style: designStyle,
      });

      createSparkleEffect("share");

      toast({
        title: "Generated",
        description: "Story and image generated in-browser.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Generation failed",
        description: error?.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsClientGenerating(false);
    }
  };

  const handleOnboardingNext = () => {
    onboarding.nextStep();
    if (onboarding.isComplete) {
      achievements.unlockAchievement("first_design");
    }
  };

  const handleShareContent = async (
    content: Omit<SharedContent, "id" | "sharedAt" | "sharedBy">
  ) => {
    try {
      await groupIntegration.shareContentWithGroup(content);
      createSparkleEffect("share");
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to share content with group.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wand2 className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Interactive Design Generator
            </h1>
            <Sparkles className="h-8 w-8 text-pink-600" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create personalized designs with AI-powered mood detection,
            real-time collaboration, and dynamic storytelling features.
          </p>
        </div>

        {/* Onboarding */}
        {!onboarding.isComplete && (
          <OnboardingCard
            currentStep={onboarding.currentStep}
            progress={onboarding.progress}
            onNext={handleOnboardingNext}
          />
        )}

        <Tabs
          defaultValue="generator"
          className="space-y-6"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="generator">Design Generator</TabsTrigger>
            <TabsTrigger value="moods">Mood Palettes</TabsTrigger>
            {/* <TabsTrigger value="collaboration">Collaboration</TabsTrigger> */}
            <TabsTrigger value="stories">Story Generator</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            {/* <TabsTrigger value="group-integration">
              Group Integration
            </TabsTrigger> */}
          </TabsList>

          {/* Design Generator Tab - Keep canvas always mounted */}
          <div className={activeTab === "generator" ? "space-y-6" : "hidden"}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Design Canvas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <KonvaDesignCanvas
                    colorPalette={moodPalette.colorPalette}
                    selectedColor={canvas.brushColor}
                    onColorSelect={(color) => {
                      canvas.setBrushColor(color);
                    }}
                    onUndo={canvas.undo}
                    onRedo={canvas.redo}
                    onClear={canvas.clearCanvas}
                    onExport={canvas.exportCanvas}
                    tool={canvas.tool}
                    onToolChange={canvas.setTool}
                    layers={canvas.layers}
                    onToggleLayer={canvas.toggleLayer}
                    lines={canvas.lines}
                    importedImages={canvas.importedImages}
                    onMouseDown={canvas.handleMouseDown}
                    onMouseMove={canvas.handleMouseMove}
                    onMouseUp={canvas.handleMouseUp}
                    stageRef={canvas.stageRef}
                    drawingLayerRef={canvas.drawingLayerRef}
                    imageLayerRef={canvas.imageLayerRef}
                  />
                </CardContent>
              </Card>

              <DesignControls
                currentMood={moodPalette.currentMood}
                onMoodChange={moodPalette.setCurrentMood}
                designStyle={designStyle}
                onStyleChange={setDesignStyle}
                moodIntensity={moodPalette.moodIntensity}
                onIntensityChange={moodPalette.setMoodIntensity}
                onGeneratePalette={moodPalette.generateMoodPalette}
                onImportImage={canvas.importImage}
              />
            </div>
          </div>

          {/* Mood Palettes Tab */}
          <div className={activeTab === "moods" ? "space-y-6" : "hidden"}>
            <MoodPalettes
              currentMood={moodPalette.currentMood}
              onMoodSelect={(mood) => {
                moodPalette.setCurrentMood(mood);
                createSparkleEffect("mood");
              }}
            />
          </div>

          {/* Collaboration Tab */}
          <div
            className={activeTab === "collaboration" ? "space-y-6" : "hidden"}
          >
            <CollaborationPanel
              collaborators={collaboration.collaborators}
              onAddCollaborator={(collaborator) => {
                collaboration.addCollaborator(collaborator);
                achievements.unlockAchievement("collaborator");
              }}
              onTriggerSparkle={collaboration.triggerSparkleEffect}
            />
          </div>

          {/* Story Generator Tab */}
          <div className={activeTab === "stories" ? "space-y-6" : "hidden"}>
            <StoryGenerator
              storyPrompt={storyPrompt}
              onPromptChange={setStoryPrompt}
              onGenerate={clientGenerateStoryAndImage}
              isGenerating={isClientGenerating}
              generatedStory={generatedStory}
              imageUrl={clientImageUrl}
              currentMood={moodPalette.currentMood}
              designStyle={designStyle}
            />
          </div>

          {/* Achievements Tab */}
          <div
            className={activeTab === "achievements" ? "space-y-6" : "hidden"}
          >
            <AchievementsDisplay
              achievements={achievements.achievements}
              animationTriggers={achievements.animationTriggers}
              totalPoints={achievements.totalPoints}
              unlockedCount={achievements.unlockedCount}
              progressPercentage={achievements.progressPercentage}
            />
          </div>

          {/* Group Integration Tab */}
          <div
            className={
              activeTab === "group-integration" ? "space-y-6" : "hidden"
            }
          >
            <GroupIntegration
              eventContext={groupIntegration.eventContext}
              groupMembers={groupIntegration.groupMembers}
              sharedContent={groupIntegration.sharedContent}
              onShareContent={handleShareContent}
              currentMood={moodPalette.currentMood}
              designStyle={designStyle}
              colorPalette={moodPalette.colorPalette}
            />
          </div>
        </Tabs>
      </div>
    </div>
  );
}
