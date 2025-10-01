import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Mail, UserPlus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface GuestInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
}

export default function GuestInviteModal({ isOpen, onClose, eventId }: GuestInviteModalProps) {
  const [inviteType, setInviteType] = useState<"email" | "direct">("email");
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestRole, setGuestRole] = useState("guest");
  const [customMessage, setCustomMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addEmailToList = () => {
    if (currentEmail && !emails.includes(currentEmail)) {
      setEmails([...emails, currentEmail]);
      setCurrentEmail("");
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const sendInvites = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/events/${eventId}/invite`, "POST", {
        emails,
        customMessage,
        eventId
      });
    },
    onSuccess: () => {
      toast({
        title: "Invitations Sent",
        description: `Successfully sent ${emails.length} invitation${emails.length > 1 ? 's' : ''}.`
      });
      setEmails([]);
      setCustomMessage("");
      onClose();
    },
    onError: () => {
      toast({
        title: "Invitation Error",
        description: "Failed to send invitations. Please try again.",
        variant: "destructive"
      });
    }
  });

  const addGuestDirectly = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/events/${eventId}/participants`, "POST", {
        name: guestName,
        email: guestEmail,
        role: guestRole,
        status: "confirmed"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/participants`] });
      toast({
        title: "Guest Added",
        description: `${guestName} has been added to the event.`
      });
      setGuestName("");
      setGuestEmail("");
      setGuestRole("guest");
      onClose();
    },
    onError: () => {
      toast({
        title: "Error Adding Guest",
        description: "Failed to add guest. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = () => {
    if (inviteType === "email" && emails.length > 0) {
      sendInvites.mutate();
    } else if (inviteType === "direct" && guestName && guestEmail) {
      addGuestDirectly.mutate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Guests
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Invitation Method</Label>
            <Select value={inviteType} onValueChange={(value: "email" | "direct") => setInviteType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Send Email Invitations</SelectItem>
                <SelectItem value="direct">Add Guest Directly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {inviteType === "email" ? (
            <>
              <div>
                <Label className="text-sm font-medium">Email Addresses</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addEmailToList()}
                  />
                  <Button onClick={addEmailToList} variant="outline" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
                
                {emails.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {emails.map((email) => (
                      <Badge key={email} variant="secondary" className="flex items-center gap-1">
                        {email}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeEmail(email)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Custom Message (Optional)</Label>
                <Textarea
                  placeholder="Add a personal message to your invitation..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label className="text-sm font-medium">Guest Name</Label>
                <Input
                  placeholder="Enter guest name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Email Address</Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Role</Label>
                <Select value={guestRole} onValueChange={setGuestRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guest">Guest</SelectItem>
                    <SelectItem value="co-host">Co-Host</SelectItem>
                    <SelectItem value="organizer">Organizer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={
                (inviteType === "email" && emails.length === 0) ||
                (inviteType === "direct" && (!guestName || !guestEmail)) ||
                sendInvites.isPending ||
                addGuestDirectly.isPending
              }
              className="flex-1"
            >
              {sendInvites.isPending || addGuestDirectly.isPending ? (
                "Processing..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {inviteType === "email" ? "Send Invites" : "Add Guest"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}