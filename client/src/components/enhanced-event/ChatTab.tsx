import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import ChatInput from "./ChatInput";
import {
  fetchEventDiscussionMessages,
  ChatMessage,
} from "@/queries/eventDiscussion";
import { useAuthStore } from "@/store/auth-store";

export default function ChatTab({ eventId }: { eventId: string | undefined }) {
  const authUser = useAuthStore((s) => s.user) as any;
  const currentUserId =
    authUser?.id || authUser?.userId || authUser?.user_id || authUser?.id;

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: [`/api/master/event-discussion-chat/event/${eventId}`],
    queryFn: () => fetchEventDiscussionMessages(eventId),
    enabled: !!eventId,
  });

  // sort messages oldest -> newest so newest appears at the bottom of the list
  const sortedMessages = React.useMemo(() => {
    if (!messages || messages.length === 0) return [] as ChatMessage[];
    return [...messages].sort((a, b) => {
      const ta = new Date(a.createdAt).getTime() || 0;
      const tb = new Date(b.createdAt).getTime() || 0;
      return ta - tb;
    });
  }, [messages]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Discussion</CardTitle>
        <CardDescription>
          Chat with other participants and coordinate planning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 border rounded-lg p-4 mb-4 overflow-y-auto bg-gray-50">
          {sortedMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-3">
              {sortedMessages.map((message: ChatMessage) => {
                const isMine =
                  currentUserId &&
                  (String(message.user_id) === String(currentUserId) ||
                    (message.createdBy &&
                      String(message.createdBy) === String(currentUserId)));

                return (
                  <div
                    key={message._id || message.id}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      isMine ? "ml-auto bg-blue-50 text-right" : "bg-white"
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-600 mb-1">
                      {isMine ? "You" : `User ${message.user_id}`} •{" "}
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="whitespace-pre-wrap">{message.message}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <ChatInput eventId={eventId} />
      </CardContent>
    </Card>
  );
}
