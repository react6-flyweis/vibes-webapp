import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const platforms = [
  "Etsy",
  "TikTok",
  "Referral",
  "Instagram",
  "Website",
  "Facebook",
  "LinkedIn",
];

const stages = [
  "Lead Discovered",
  "Interested",
  "Contacted",
  "Onboarding Started",
  "Activated",
  "Featured",
];

const priorities = ["High", "Medium", "Low"];

export default function FilterDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Filter
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Vendor Leads</DialogTitle>
          <DialogDescription>
            Apply filters to find specific vendor leads in your CRM pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Vendor Name</Label>
            <Input placeholder="Search by vendor name..." />
          </div>

          <Separator />

          <div>
            <Label>Platforms</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {platforms.map((p) => (
                <label key={p} className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Pipeline Stages</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {stages.map((s) => (
                <label key={s} className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Priority Levels</Label>
            <div className="flex gap-4 mt-2">
              {priorities.map((p) => (
                <label key={p} className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Discovery Source</Label>
            <Input placeholder="Search discovery source" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Discovery Date Range</Label>
              <div className="flex gap-2 mt-2">
                <Input placeholder="From Date" />
                <Input placeholder="To Date" />
              </div>
            </div>

            <div>
              <Label>Estimated Value Range ($)</Label>
              <div className="flex gap-2 mt-2">
                <Input placeholder="Min value" />
                <Input placeholder="Max value" />
              </div>
            </div>
          </div>

          <div>
            <Label>Contact Information</Label>
            <label className="flex items-center gap-2 mt-2">
              <Checkbox />
              <span className="text-sm">Has contact email</span>
            </label>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input placeholder="Add tag filter.." />
              <Button variant="outline">Add</Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full items-center justify-between">
            <Button variant="ghost">Clear All Filters</Button>
            <div className="flex gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Apply Filters (0)</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
