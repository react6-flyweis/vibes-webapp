import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface EventTheme {
  name: string;
  colorScheme: string[];
  decorations: string[];
  musicSuggestions: string[];
  foodIdeas: string[];
  activities: string[];
}

export interface MenuSuggestion {
  category: string;
  items: Array<{
    name: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    servings: number;
    estimatedCost: string;
  }>;
}

export interface CollaborationInsight {
  type: "suggestion" | "warning" | "tip";
  message: string;
  actionable: boolean;
}

export class AIEventPlanner {
  // AI Theme Generator
  async generateEventTheme(eventType: string, guestCount: number, budget?: string): Promise<EventTheme> {
    try {
      const prompt = `Generate a creative event theme for a ${eventType} with ${guestCount} guests${budget ? ` on a ${budget} budget` : ''}. 
      Provide a comprehensive theme with specific recommendations. Respond in JSON format with this structure:
      {
        "name": "Theme Name",
        "colorScheme": ["color1", "color2", "color3"],
        "decorations": ["decoration1", "decoration2", "decoration3"],
        "musicSuggestions": ["genre1", "genre2", "specific song/artist"],
        "foodIdeas": ["food1", "food2", "food3"],
        "activities": ["activity1", "activity2", "activity3"]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a creative event planning expert. Generate unique, practical, and engaging event themes with specific actionable recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8
      });

      const themeData = JSON.parse(response.choices[0].message.content || "{}");
      return themeData as EventTheme;
    } catch (error) {
      console.error("AI Theme Generation Error:", error);
      throw new Error("Failed to generate event theme");
    }
  }

  // Smart Menu Suggestions
  async generateMenuSuggestions(eventType: string, guestCount: number, dietaryRestrictions?: string[]): Promise<MenuSuggestion[]> {
    try {
      const restrictions = dietaryRestrictions?.length ? ` considering ${dietaryRestrictions.join(", ")} dietary restrictions` : "";
      const prompt = `Generate menu suggestions for a ${eventType} with ${guestCount} guests${restrictions}. 
      Include appetizers, main dishes, desserts, and beverages. Provide practical recipes that guests can prepare and bring.
      Respond in JSON format with this structure:
      [
        {
          "category": "Appetizers",
          "items": [
            {
              "name": "Item Name",
              "description": "Brief description",
              "difficulty": "Easy|Medium|Hard",
              "servings": number,
              "estimatedCost": "$X-Y"
            }
          ]
        }
      ]`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a culinary expert specializing in crowd-pleasing recipes for events. Focus on practical, shareable dishes that are easy to transport and serve."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      const menuData = JSON.parse(response.choices[0].message.content || "[]");
      return menuData.suggestions || [];
    } catch (error) {
      console.error("AI Menu Generation Error:", error);
      throw new Error("Failed to generate menu suggestions");
    }
  }

  // Collaboration Intelligence
  async analyzeEventCollaboration(
    eventData: any,
    participantCount: number,
    currentTasks: any[]
  ): Promise<CollaborationInsight[]> {
    try {
      const prompt = `Analyze this event collaboration and provide intelligent insights:
      Event: ${eventData.title} (${eventData.date})
      Participants: ${participantCount}
      Current Tasks: ${currentTasks.length}
      
      Provide 3-5 actionable insights to improve collaboration, task distribution, and event success.
      Respond in JSON format:
      {
        "insights": [
          {
            "type": "suggestion|warning|tip",
            "message": "Insight message",
            "actionable": true/false
          }
        ]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert in event management and team collaboration. Provide practical, actionable insights to improve event planning efficiency."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.6
      });

      const analysisData = JSON.parse(response.choices[0].message.content || "{}");
      return analysisData.insights || [];
    } catch (error) {
      console.error("AI Collaboration Analysis Error:", error);
      throw new Error("Failed to analyze collaboration");
    }
  }

  // Smart Guest Matchmaking
  async generateGuestMatchmaking(guests: any[]): Promise<Array<{ guest1: string; guest2: string; reason: string }>> {
    try {
      const guestProfiles = guests.map(g => `${g.name}: ${g.interests || 'No interests listed'}`).join(", ");
      const prompt = `Analyze these guest profiles and suggest meaningful connections:
      ${guestProfiles}
      
      Generate 3-5 potential matches based on shared interests, complementary personalities, or networking opportunities.
      Respond in JSON format:
      {
        "matches": [
          {
            "guest1": "Guest Name 1",
            "guest2": "Guest Name 2", 
            "reason": "Why they should connect"
          }
        ]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a social networking expert who helps create meaningful connections between people at events."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      const matchData = JSON.parse(response.choices[0].message.content || "{}");
      return matchData.matches || [];
    } catch (error) {
      console.error("AI Guest Matchmaking Error:", error);
      throw new Error("Failed to generate guest matches");
    }
  }

  async generateInvitationMessage(params: {
    eventType: string;
    eventDate: string;
    eventTime: string;
    location: string;
    userPrompt: string;
    tone: string;
  }): Promise<string> {
    try {
      const prompt = `Create a personalized invitation message for this event:
      
      Event Type: ${params.eventType}
      Date: ${params.eventDate}
      Time: ${params.eventTime}
      Location: ${params.location}
      User Instructions: ${params.userPrompt}
      Desired Tone: ${params.tone}
      
      Generate a warm, engaging invitation message that incorporates the user's specific instructions while maintaining the requested tone. 
      Keep it concise but compelling, around 2-3 sentences. Make it feel personal and exciting.
      
      Return only the invitation message text, no additional formatting or explanations.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert at creating compelling, personalized event invitations that capture the perfect tone and excitement for any occasion."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8
      });

      return response.choices[0].message.content?.trim() || "Join us for an unforgettable celebration!";
    } catch (error) {
      console.error("Error generating invitation message:", error);
      throw new Error("Failed to generate invitation message");
    }
  }

  async generatePersonalizedStory(params: {
    prompt: string;
    mood: string;
    style: string;
    colorPalette: string[];
    context?: string;
  }): Promise<string> {
    try {
      const colorContext = params.colorPalette.length > 0 
        ? `with colors ${params.colorPalette.join(', ')}` 
        : '';
      
      const fullPrompt = `Create a personalized story based on this prompt: "${params.prompt}"
      
      Story requirements:
      - Mood: ${params.mood}
      - Style: ${params.style}
      - Visual theme: ${colorContext}
      - Context: ${params.context || ''}
      
      Make the story engaging, creative, and tailored to the specified mood and style. 
      Keep it between 200-400 words and ensure it reflects the chosen aesthetic.`;

      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514', // the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
        max_tokens: 500,
        messages: [
          { role: 'user', content: fullPrompt }
        ],
      });

      return response.content[0].text;
    } catch (error) {
      throw new Error("Failed to generate personalized story: " + (error as Error).message);
    }
  }
}

export const aiPlanner = new AIEventPlanner();