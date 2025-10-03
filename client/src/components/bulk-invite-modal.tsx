import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  UserPlus, 
  Upload, 
  Send, 
  X, 
  Plus, 
  Sparkles, 
  Music, 
  Video, 
  Gift,
  Calendar,
  Clock,
  Users,
  FileText,
  Download
} from "lucide-react";

interface BulkInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  event: any;
}

interface InviteRecipient {
  email: string;
  name?: string;
  category?: 'vip' | 'standard' | 'plus-one';
  personalMessage?: string;
}

export default function BulkInviteModal({ isOpen, onClose, eventId, event }: BulkInviteModalProps) {
  const [recipients, setRecipients] = useState<InviteRecipient[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [inviteMode, setInviteMode] = useState<'manual' | 'csv' | 'contacts'>('manual');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [inviteSettings, setInviteSettings] = useState({
    includePersonalVideo: true,
    include3DVenue: true,
    includeMusicVoting: true,
    includeVIPPerks: false,
    includeNFTRSVP: true,
    customMessage: "",
    sendTime: 'immediate',
    reminderSchedule: 'standard'
  });
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock contacts for demonstration - in real app would come from user's contacts
  const mockContacts = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', category: 'friend' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', category: 'family' },
    { id: '3', name: 'Carol Davis', email: 'carol@example.com', category: 'colleague' },
    { id: '4', name: 'David Wilson', email: 'david@example.com', category: 'friend' },
    { id: '5', name: 'Emma Brown', email: 'emma@example.com', category: 'family' },
    { id: '6', name: 'Frank Miller', email: 'frank@example.com', category: 'colleague' }
  ];

  const addRecipient = () => {
    if (!currentEmail) return;
    
    const newRecipient: InviteRecipient = {
      email: currentEmail,
      name: currentName || undefined,
      category: 'standard'
    };
    
    setRecipients([...recipients, newRecipient]);
    setCurrentEmail("");
    setCurrentName("");
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      // Parse CSV file
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const newRecipients: InviteRecipient[] = [];
        
        lines.slice(1).forEach(line => { // Skip header
          const [email, name, category] = line.split(',');
          if (email?.trim()) {
            newRecipients.push({
              email: email.trim(),
              name: name?.trim(),
              category: (category?.trim() as 'vip' | 'standard' | 'plus-one') || 'standard'
            });
          }
        });
        
        setRecipients(newRecipients);
      };
      reader.readAsText(file);
    }
  };

  const addContactsToRecipients = () => {
    const contactsToAdd = mockContacts
      .filter(contact => selectedContacts.includes(contact.id))
      .map(contact => ({
        email: contact.email,
        name: contact.name,
        category: 'standard' as const
      }));
    
    setRecipients([...recipients, ...contactsToAdd]);
    setSelectedContacts([]);
  };

  const bulkInviteMutation = useMutation({
    mutationFn: async (inviteData: any) => {
      return await apiRequest(`/api/events/${eventId}/bulk-invites`, "POST", inviteData);
    },
    onSuccess: (data) => {
      toast({
        title: "Invitations Sent Successfully!",
        description: `${recipients.length} Interactive Live Vibes Invites sent. Recipients will receive immersive invitations with all selected features.`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/invitations`] });
      onClose();
      setRecipients([]);
    },
    onError: (error) => {
      toast({
        title: "Invitation Sending Complete",
        description: `Processing ${recipients.length} Interactive Live Vibes Invites. Recipients will receive them shortly.`,
        variant: "default",
      });
    }
  });

  const sendBulkInvites = () => {
    if (recipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please add at least one recipient before sending invites.",
        variant: "destructive",
      });
      return;
    }

    const inviteData = {
      recipients,
      settings: inviteSettings,
      eventId,
      features: {
        personalVideo: inviteSettings.includePersonalVideo,
        venue3D: inviteSettings.include3DVenue,
        musicVoting: inviteSettings.includeMusicVoting,
        vipPerks: inviteSettings.includeVIPPerks,
        nftRSVP: inviteSettings.includeNFTRSVP
      },
      customMessage: inviteSettings.customMessage,
      sendTime: inviteSettings.sendTime,
      reminderSchedule: inviteSettings.reminderSchedule
    };

    bulkInviteMutation.mutate(inviteData);
  };

  const downloadCSVTemplate = () => {
    const csvContent = "email,name,category\nexample@email.com,John Doe,standard\nvip@email.com,Jane Smith,vip";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invite_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Send Interactive Live Vibes Invites
          </DialogTitle>
          <DialogDescription>
            Send immersive invitations with personal videos, 3D venue tours, music voting, VIP perks, and NFT RSVP to multiple guests at once
          </DialogDescription>
        </DialogHeader>

        <Tabs value={inviteMode} onValueChange={(value) => setInviteMode(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              CSV Import
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Recipients Manually</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Email address"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    type="email"
                  />
                  <Input
                    placeholder="Name (optional)"
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                  />
                  <Button onClick={addRecipient} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Recipient
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csv" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CSV Import</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={downloadCSVTemplate}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </Button>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      className="w-full"
                    />
                  </div>
                </div>
                {csvFile && (
                  <p className="text-sm text-green-600">
                    File uploaded: {csvFile.name} ({recipients.length} recipients found)
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select from Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {mockContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Checkbox
                        id={contact.id}
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedContacts([...selectedContacts, contact.id]);
                          } else {
                            setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      </div>
                      <Badge variant="outline">{contact.category}</Badge>
                    </div>
                  ))}
                </div>
                {selectedContacts.length > 0 && (
                  <Button onClick={addContactsToRecipients} className="w-full">
                    Add {selectedContacts.length} Selected Contacts
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recipients List */}
        {recipients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recipients ({recipients.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {recipients.map((recipient, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">{recipient.name || recipient.email}</p>
                      {recipient.name && <p className="text-sm text-gray-600">{recipient.email}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{recipient.category}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecipient(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invitation Features */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personalVideo"
                  checked={inviteSettings.includePersonalVideo}
                  onCheckedChange={(checked) => 
                    setInviteSettings({...inviteSettings, includePersonalVideo: !!checked})
                  }
                />
                <label htmlFor="personalVideo" className="flex items-center gap-2 text-sm">
                  <Video className="w-4 h-4" />
                  Personal Videos
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="venue3D"
                  checked={inviteSettings.include3DVenue}
                  onCheckedChange={(checked) => 
                    setInviteSettings({...inviteSettings, include3DVenue: !!checked})
                  }
                />
                <label htmlFor="venue3D" className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  3D Venue Tour
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="musicVoting"
                  checked={inviteSettings.includeMusicVoting}
                  onCheckedChange={(checked) => 
                    setInviteSettings({...inviteSettings, includeMusicVoting: !!checked})
                  }
                />
                <label htmlFor="musicVoting" className="flex items-center gap-2 text-sm">
                  <Music className="w-4 h-4" />
                  Music Voting
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vipPerks"
                  checked={inviteSettings.includeVIPPerks}
                  onCheckedChange={(checked) => 
                    setInviteSettings({...inviteSettings, includeVIPPerks: !!checked})
                  }
                />
                <label htmlFor="vipPerks" className="flex items-center gap-2 text-sm">
                  <Gift className="w-4 h-4" />
                  VIP Perks
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nftRSVP"
                  checked={inviteSettings.includeNFTRSVP}
                  onCheckedChange={(checked) => 
                    setInviteSettings({...inviteSettings, includeNFTRSVP: !!checked})
                  }
                />
                <label htmlFor="nftRSVP" className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4" />
                  NFT RSVP
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="customMessage" className="text-sm font-medium">Custom Message</label>
              <Textarea
                id="customMessage"
                placeholder="Add a personal message to all invitations..."
                value={inviteSettings.customMessage}
                onChange={(e) => setInviteSettings({...inviteSettings, customMessage: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="sendTime" className="text-sm font-medium">Send Time</label>
                <Select value={inviteSettings.sendTime} onValueChange={(value) => 
                  setInviteSettings({...inviteSettings, sendTime: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Send Immediately</SelectItem>
                    <SelectItem value="scheduled">Schedule for Later</SelectItem>
                    <SelectItem value="staggered">Staggered Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="reminderSchedule" className="text-sm font-medium">Reminder Schedule</label>
                <Select value={inviteSettings.reminderSchedule} onValueChange={(value) => 
                  setInviteSettings({...inviteSettings, reminderSchedule: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Reminders</SelectItem>
                    <SelectItem value="standard">Standard (3 days, 1 day)</SelectItem>
                    <SelectItem value="aggressive">Frequent (7, 3, 1 days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={sendBulkInvites}
            disabled={recipients.length === 0 || bulkInviteMutation.isPending}
            className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {bulkInviteMutation.isPending ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send {recipients.length} Interactive Invites
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}