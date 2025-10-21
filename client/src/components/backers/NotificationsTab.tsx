import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { NotificationDialog } from "./NotificationDialog";

export default function NotificationsTab({
  notifications: initialNotifications,
}: any) {
  const [notifications, setNotifications] = useState(
    initialNotifications || []
  );
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<any | null>(null);

  function handleCreate(n: any) {
    // If notification with same id exists, treat as update
    setNotifications((prev: any[]) => {
      const exists = prev.find((p) => p.id === n.id);
      if (exists) {
        return prev.map((p) => (p.id === n.id ? n : p));
      }
      return [n, ...prev];
    });
  }

  function handleView(n: any) {
    setSelected(n);
    setViewOpen(true);
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Table of Notifications</h3>
        {/* create dialog (trigger) */}
        <NotificationDialog onCreate={handleCreate} />
        {/* read-only view dialog (controlled) */}
        <NotificationDialog
          initialNotification={selected}
          readOnly
          open={viewOpen}
          onOpenChange={(v) => {
            setViewOpen(v);
            if (!v) setSelected(null);
          }}
          showTrigger={false}
        />
        {/* edit dialog (controlled) */}
        <NotificationDialog
          initialNotification={editing}
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v);
            if (!v) setEditing(null);
          }}
          onCreate={handleCreate}
          showTrigger={false}
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Notification</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sent to</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((n: any) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium">{n.title}</TableCell>
                <TableCell>{n.type}</TableCell>
                <TableCell>{n.sentTo}</TableCell>
                <TableCell>
                  <span
                    className={
                      n.status === "Sent"
                        ? "text-green-600"
                        : n.status === "Scheduled"
                        ? "text-orange-500"
                        : "text-red-600"
                    }
                  >
                    {n.status}
                  </span>
                </TableCell>
                <TableCell>{n.date}</TableCell>
                <TableCell>
                  {n.actions?.map((a: any, idx: number) => (
                    <React.Fragment key={a.label + idx}>
                      {/* If action label is Edit, wire it to open edit dialog */}
                      {a.label === "Edit" ? (
                        <Button
                          variant="link"
                          size="sm"
                          className={a.className}
                          onClick={() => {
                            setEditing(n);
                            setEditOpen(true);
                          }}
                        >
                          {a.label}
                        </Button>
                      ) : (
                        <Button
                          variant="link"
                          size="sm"
                          className={a.className}
                        >
                          {a.label}
                        </Button>
                      )}
                      {idx < (n.actions?.length || 0) - 1 && (
                        <span className="mx-2">/</span>
                      )}
                    </React.Fragment>
                  ))}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleView(n)}
                    className="ml-2"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
