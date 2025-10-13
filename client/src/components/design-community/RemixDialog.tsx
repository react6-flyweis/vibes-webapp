import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Zap, Copy } from "lucide-react";

interface Props {
  onCreate: (payload: {
    title: string;
    description: string;
    remixType: "full" | "partial" | "inspired";
  }) => void;
  onCancel: () => void;
}

export default function RemixDialog({ onCreate, onCancel }: Props) {
  const [remixTitle, setRemixTitle] = useState("");
  const [remixDescription, setRemixDescription] = useState("");
  const [remixType, setRemixType] = useState<"full" | "partial" | "inspired">(
    "full"
  );
  return (
    <DialogContent className="bg-black/90 border-purple-500/20 text-white">
      <DialogHeader>
        <DialogTitle>Create a Remix</DialogTitle>
        <DialogDescription className="text-gray-400">
          Create your own version of this design with your unique twist
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="remix-title">Remix Title</Label>
          <Input
            id="remix-title"
            value={remixTitle}
            onChange={(e) => setRemixTitle(e.target.value)}
            placeholder="Give your remix a name..."
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <Label htmlFor="remix-type">Remix Type</Label>
          <Select
            value={remixType}
            onValueChange={(value: "full" | "partial" | "inspired") =>
              setRemixType(value)
            }
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Choose remix type" />
            </SelectTrigger>
            <SelectContent className="bg-black border-purple-500/20">
              <SelectItem
                value="full"
                className="text-white hover:bg-purple-500/20"
              >
                <div className="flex flex-col">
                  <span className="font-medium">Full Remix</span>
                  <span className="text-xs text-gray-400">
                    Copy entire design and customize freely
                  </span>
                </div>
              </SelectItem>
              <SelectItem
                value="partial"
                className="text-white hover:bg-purple-500/20"
              >
                <div className="flex flex-col">
                  <span className="font-medium">Partial Remix</span>
                  <span className="text-xs text-gray-400">
                    Use specific elements as inspiration
                  </span>
                </div>
              </SelectItem>
              <SelectItem
                value="inspired"
                className="text-white hover:bg-purple-500/20"
              >
                <div className="flex flex-col">
                  <span className="font-medium">Inspired By</span>
                  <span className="text-xs text-gray-400">
                    Create new design inspired by concepts
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="remix-description">Description</Label>
          <Textarea
            id="remix-description"
            value={remixDescription}
            onChange={(e) => setRemixDescription(e.target.value)}
            placeholder="Describe what makes your remix unique..."
            className="bg-white/10 border-white/20 text-white"
            rows={3}
          />
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Zap className="h-4 w-4 text-purple-400 mt-1" />
            <div className="text-sm">
              <p className="text-purple-300 font-medium">Remix Features</p>
              <ul className="text-gray-400 text-xs space-y-1 mt-1">
                <li>• Attribution to original creator automatically added</li>
                <li>• Full design editor access with all tools</li>
                <li>• Export in multiple formats (PNG, SVG, PDF)</li>
                <li>• Share your remix with the community</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            onCreate({
              title: remixTitle,
              description: remixDescription,
              remixType,
            })
          }
          disabled={!remixTitle.trim()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Copy className="h-4 w-4 mr-2" />
          Create Remix
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
