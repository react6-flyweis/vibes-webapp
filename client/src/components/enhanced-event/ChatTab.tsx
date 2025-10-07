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

export default function ChatTab({ eventId }: { eventId: string | undefined }) {
  const { data: messages = [] } = useQuery<any[]>({
    queryKey: [`/api/events/${eventId}/messages`],
    enabled: !!eventId,
  });

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
          {!messages || messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message: any) => (
                <div key={message.id} className="bg-white p-3 rounded-lg">
                  <div className="font-medium text-sm text-gray-600 mb-1">
                    User {message.userId} •{" "}
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                  <div>{message.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <ChatInput eventId={eventId} />
      </CardContent>
    </Card>
  );
}
