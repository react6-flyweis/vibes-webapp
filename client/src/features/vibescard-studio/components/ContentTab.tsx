import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContentTabProps {
  eventTitle: string;
  setEventTitle: (value: string) => void;
  eventMessage: string;
  setEventMessage: (value: string) => void;
  eventDate: string;
  setEventDate: (value: string) => void;
  eventLocation: string;
  setEventLocation: (value: string) => void;
  hostName: string;
  setHostName: (value: string) => void;
}

export function ContentTab({
  eventTitle,
  setEventTitle,
  eventMessage,
  setEventMessage,
  eventDate,
  setEventDate,
  eventLocation,
  setEventLocation,
  hostName,
  setHostName,
}: ContentTabProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Event Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="eventTitle">Event Title</Label>
          <Input
            id="eventTitle"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Enter event title"
          />
        </div>

        <div>
          <Label htmlFor="eventMessage">Message</Label>
          <Textarea
            id="eventMessage"
            value={eventMessage}
            onChange={(e) => setEventMessage(e.target.value)}
            placeholder="Event description or message"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="eventDate">Date & Time</Label>
          <Input
            id="eventDate"
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="eventLocation">Location</Label>
          <Input
            id="eventLocation"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            placeholder="Event location"
          />
        </div>

        <div>
          <Label htmlFor="hostName">Host Name</Label>
          <Input
            id="hostName"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="Your name"
          />
        </div>
      </CardContent>
    </Card>
  );
}
