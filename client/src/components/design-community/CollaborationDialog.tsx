import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Users } from "lucide-react";

interface Props {
  onSend: (payload: { email: string; role: "editor" | "viewer" }) => void;
  onCancel: () => void;
}

export default function CollaborationDialog({ onSend, onCancel }: Props) {
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [collaboratorRole, setCollaboratorRole] = useState<"editor" | "viewer">(
    "viewer"
  );

  return (
    <DialogContent className="bg-black/90 border-purple-500/20 text-white max-w-lg">
      <DialogHeader>
        <DialogTitle>Invite Collaborators</DialogTitle>
        <DialogDescription className="text-gray-400">
          Invite others to collaborate on your design project
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="collaborator-email">Email Address</Label>
          <Input
            id="collaborator-email"
            type="email"
            value={collaboratorEmail}
            onChange={(e) => setCollaboratorEmail(e.target.value)}
            placeholder="teammate@example.com"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div>
          <Label htmlFor="collaborator-role">Permission Level</Label>
          <Select
            value={collaboratorRole}
            onValueChange={(value: "editor" | "viewer") =>
              setCollaboratorRole(value)
            }
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">
                Viewer - Can view and comment
              </SelectItem>
              <SelectItem value="editor">
                Editor - Can edit and modify
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSend({ email: collaboratorEmail, role: collaboratorRole })
          }
          disabled={!collaboratorEmail.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Users className="h-4 w-4 mr-2" />
          Send Invitation
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
