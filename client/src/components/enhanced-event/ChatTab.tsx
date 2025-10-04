import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function ChatTab({ messages, newMessage, setNewMessage, onSendMessage }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Discussion</CardTitle>
        <CardDescription>Chat with other participants and coordinate planning</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 border rounded-lg p-4 mb-4 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No messages yet. Start the conversation!</div>
          ) : (
            <div className="space-y-3">
              {messages.map((message: any) => (
                <div key={message.id} className="bg-white p-3 rounded-lg">
                  <div className="font-medium text-sm text-gray-600 mb-1">User {message.userId} • {new Date(message.createdAt).toLocaleTimeString()}</div>
                  <div>{message.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e: any) => setNewMessage(e.target.value)}
            onKeyPress={(e: any) => e.key === 'Enter' && onSendMessage()}
          />
          <Button onClick={onSendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
