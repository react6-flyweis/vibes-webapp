import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gift, Star } from "lucide-react";
import { OnboardingStep } from "../types";

interface OnboardingCardProps {
  currentStep: OnboardingStep;
  progress: number;
  onNext: () => void;
}

export function OnboardingCard({
  currentStep,
  progress,
  onNext,
}: OnboardingCardProps) {
  return (
    <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-purple-600" />
          {currentStep.title}
        </CardTitle>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {currentStep.description}
        </p>
        <Button onClick={onNext} className="bg-purple-600 hover:bg-purple-700">
          Continue <Star className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
