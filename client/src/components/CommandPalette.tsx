import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { quickActions } from "./app-shell-data";
import { useLocation } from "wouter";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({
  open,
  onOpenChange,
}: CommandPaletteProps) {
  const [, setLocation] = useLocation();

  return (
    <div>
      <Command>
        <CommandInput placeholder="Search features, events, or venues..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => (
              <CommandItem
                key={action.href}
                onSelect={() => {
                  setLocation(action.href);
                  onOpenChange(false);
                }}
              >
                {/* Icons are intentionally omitted in this extracted component */}
                <span>{action.name}</span>
                <Badge variant="outline" className="ml-auto">
                  {action.shortcut}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
