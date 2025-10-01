import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import CommandPalette from "./CommandPalette";

export default function SearchActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm text-muted-foreground">Search...</span>
          <Badge variant="secondary" className="ml-2">
            ⌘K
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <CommandPalette open={isOpen} onOpenChange={setIsOpen} />
      </PopoverContent>
    </Popover>
  );
}
