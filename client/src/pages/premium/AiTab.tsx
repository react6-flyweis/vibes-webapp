import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const aiSuggestions = [
  {
    category: "Food Pairing",
    suggestion: "Add Caesar salad to complement the Italian theme",
    confidence: 92,
    reasoning: "Guests who added pasta dishes often include salads for balance",
  },
  {
    category: "Drink Recommendation",
    suggestion: "Consider adding a signature cocktail with gin",
    confidence: 87,
    reasoning: "Based on guest preferences and seasonal trends",
  },
  {
    category: "Entertainment",
    suggestion: "Add background jazz playlist for dinner hour",
    confidence: 79,
    reasoning: "Similar events had 40% higher satisfaction with ambient music",
  },
];

export default function AiTab() {
  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<number[]>(
    []
  );
  const { toast } = useToast();

  return (
    <Card className="bg-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          AI-Powered Suggestions
        </CardTitle>
        <CardDescription className="text-gray-200">
          Smart recommendations based on your event patterns and guest
          preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {aiSuggestions.map((suggestion, index) => (
          <div key={index} className="border rounded-lg p-4 border-gray-400">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-white border-white">
                {suggestion.category}
              </Badge>
              <div className="flex items-center">
                <span className="text-sm mr-2 text-gray-300">Confidence:</span>
                <span className="font-semibold text-green-400">
                  {suggestion.confidence}%
                </span>
              </div>
            </div>
            <h4 className="font-medium mb-2">{suggestion.suggestion}</h4>
            <p className="text-sm text-gray-300 mb-3">{suggestion.reasoning}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border border-white text-white hover:bg-gray-800 hover:text-white"
                disabled={
                  appliedSuggestions.includes(index) ||
                  dismissedSuggestions.includes(index)
                }
                onClick={() => {
                  setAppliedSuggestions([...appliedSuggestions, index]);
                  toast({
                    title: "Suggestion Applied",
                    description: `${suggestion.suggestion} has been added to your event.`,
                  });
                }}
              >
                {appliedSuggestions.includes(index)
                  ? "Applied"
                  : "Apply Suggestion"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white"
                disabled={
                  appliedSuggestions.includes(index) ||
                  dismissedSuggestions.includes(index)
                }
                onClick={() => {
                  setDismissedSuggestions([...dismissedSuggestions, index]);
                  toast({
                    title: "Suggestion Dismissed",
                    description:
                      "We'll learn from your preferences for future recommendations.",
                  });
                }}
              >
                {dismissedSuggestions.includes(index) ? "Dismissed" : "Dismiss"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
