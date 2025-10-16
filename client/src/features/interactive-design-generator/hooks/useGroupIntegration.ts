import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SharedContent, GroupMember, EventContext } from "../types";
import { apiRequest } from "@/lib/queryClient";

export function useGroupIntegration() {
  const [sharedContent, setSharedContent] = useState<SharedContent[]>([]);
  const queryClient = useQueryClient();

  // Fetch event context
  const { data: eventData } = useQuery({
    queryKey: ["/api/events/user"],
    retry: false,
  });

  // Fetch group members
  const { data: participantsData } = useQuery({
    queryKey: ["/api/events/participants/1"],
    retry: false,
  });

  const eventContext: EventContext | null = eventData || null;
  const groupMembers: GroupMember[] = Array.isArray(participantsData)
    ? participantsData
    : [];

  const shareContentWithGroup = async (
    content: Omit<SharedContent, "id" | "sharedAt" | "sharedBy">
  ) => {
    try {
      await apiRequest("/api/events/messages", "POST", {
        eventId: 1,
        userId: 1,
        message: `${
          content.type === "story" ? "📖 Story" : "🎨 Design"
        }: ${content.content.substring(0, 100)}...`,
        type: "design_share",
        metadata: content,
      });

      const newContent: SharedContent = {
        id: Date.now(),
        ...content,
        sharedAt: new Date().toISOString(),
        sharedBy: "You",
      };

      setSharedContent((prev) => [...prev, newContent]);

      // Update query cache to refresh group data
      queryClient.invalidateQueries({ queryKey: ["/api/events/messages/1"] });

      return newContent;
    } catch (error) {
      console.error("Error sharing content:", error);
      throw error;
    }
  };

  return {
    eventContext,
    groupMembers,
    sharedContent,
    shareContentWithGroup,
  };
}
