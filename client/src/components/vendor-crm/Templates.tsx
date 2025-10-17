import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function Templates({
  templatesState,
  isDialogOpen,
  setIsDialogOpen,
  newSubject,
  setNewSubject,
  newMessage,
  setNewMessage,
  handleSaveTemplate,
}: any) {
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Email Templates</h2>
          <p className="text-sm text-muted-foreground">
            Manage your vendor outreach email templates
          </p>
        </div>
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">+ Create Template</Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-lg font-semibold">
                    Create Email Template
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Apply filters to find specific vendor leads in your CRM
                    pipeline.
                  </p>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium">Subject</label>
                  <Input
                    placeholder="Enter the Subject"
                    value={newSubject}
                    onChange={(e: any) => setNewSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Enter the Message..."
                    value={newMessage}
                    onChange={(e: any) => setNewMessage(e.target.value)}
                    className="min-h-[160px]"
                  />
                </div>
              </div>

              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>Save Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templatesState.map((t: any) => (
          <Card key={t.id}>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xl font-semibold">{t.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {t.category}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {t.id === 1 ? "23.4% success" : "31.8% success"}
                </div>
              </div>

              <div className="mt-6 text-sm">
                <div className="font-medium">Subject:</div>
                <div className="text-muted-foreground">{t.subject}</div>

                <div className="mt-4 font-medium">Preview:</div>
                <div className="text-muted-foreground">{t.preview}</div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Badge className="rounded-full">Contacted</Badge>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button size="sm">Use Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
