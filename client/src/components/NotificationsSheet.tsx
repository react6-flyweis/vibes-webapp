import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { useNotificationsQuery } from "@/queries/notifications";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

export default function NotificationsSheet() {
  // don't fetch automatically; we'll fetch when the sheet opens
  const { data, isLoading, error, refetch } = useNotificationsQuery(false);

  const [open, setOpen] = useState(false);

  const notifications = data?.data || [];

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open]);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Sheet open={open} onOpenChange={(val) => setOpen(val)}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="flex justify-center items-center absolute -top-1 -right-1 w-4 h-4 p-0 bg-red-500 text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 max-h-screen flex flex-col">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Recent activity and updates</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading...</div>
          )}
          {error && (
            <div className="text-sm text-red-500">
              Could not load notifications
            </div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No notifications
            </div>
          )}

          <div className="mt-2 flex-1 min-h-0">
            <ScrollArea className="h-full">
              <ul className="space-y-2 p-2">
                {notifications.map((n) => (
                  <li
                    key={n._id}
                    className={`p-3 rounded-md border ${
                      n.is_read
                        ? "bg-transparent"
                        : "bg-gradient-to-r from-purple-50 to-pink-50"
                    }`}
                  >
                    <div className="text-sm text-foreground">
                      {n.notification_txt}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {n.created_at
                        ? formatDistanceToNowStrict(parseISO(n.created_at), {
                            addSuffix: true,
                          })
                        : ""}
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
