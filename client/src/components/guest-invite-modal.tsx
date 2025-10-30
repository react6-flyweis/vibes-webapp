import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useInviteGuest } from "@/mutations/guest";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface GuestInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

export default function GuestInviteModal({
  isOpen,
  onClose,
  eventId,
}: GuestInviteModalProps) {
  // We currently support only adding a guest directly through the master guest API.
  // The previous email-invite flow is commented out below for future re-enable.
  const [inviteType /*, setInviteType*/] = useState<"direct">("direct");
  // /* email invite state (commented) */
  // const [emails, setEmails] = useState<string[]>([]);
  // const [currentEmail, setCurrentEmail] = useState("");

  // react-hook-form for the direct-add flow
  type GuestFormValues = {
    name: string;
    email: string;
    mobileno?: string;
    specialnote?: string;
    img?: string;
    role: "guest" | "co-host" | "organizer";
  };

  const form = useForm<GuestFormValues>({
    defaultValues: {
      name: "",
      email: "",
      mobileno: "",
      specialnote: "",
      img: "",
      role: "guest",
    },
  });
  // const [customMessage, setCustomMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const watchedName = form.watch("name");
  const watchedEmail = form.watch("email");

  /* email-invite mutation (commented out)
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
  });
  */

  // Use the new invite mutation which also links guest to plan map
  const inviteGuest = useInviteGuest({
    onSuccess: () => {
      toast({
        title: "Guest Added",
        description: `${form.getValues().name} has been added to the event.`,
      });
      form.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: "Error Adding Guest",
        description: "Failed to add guest. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: GuestFormValues) => {
    // Only direct-add is enabled currently
    if (data.name && data.email) {
      inviteGuest.mutate({
        name: data.name,
        email: data.email,
        mobileno: data.mobileno,
        specialnote: data.specialnote,
        img: data.img,
        event_id: eventId,
        status: true,
      });
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
          {/* Invitation method selection is intentionally disabled; only direct add is active. */}
          {/*
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
          */}

          {/* Email-invite UI (commented out)
          {inviteType === "email" ? (
            <>
              ...email invite UI...
            </>
          ) : (
          */}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter guest name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobileno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile No</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. +1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="guest">Guest</SelectItem>
                          <SelectItem value="co-host">Co-Host</SelectItem>
                          <SelectItem value="organizer">Organizer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* hidden submit to allow the outer Add Guest button to submit this form */}
              <button type="submit" className="hidden" aria-hidden />
            </form>
          </Form>

          {/* )} */}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => form.handleSubmit(handleSubmit)()}
              disabled={
                // (inviteType === "email" && emails.length === 0) ||
                (inviteType === "direct" && (!watchedName || !watchedEmail)) ||
                // sendInvites.isPending ||
                inviteGuest.isPending
              }
              className="flex-1"
            >
              {/* {sendInvites.isPending || addGuestDirectly.isPending ? ( */}
              {inviteGuest.isPending ? (
                "Processing..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {/* {inviteType === "email" ? "Send Invites" : "Add Guest"} */}
                  Add Guest
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
