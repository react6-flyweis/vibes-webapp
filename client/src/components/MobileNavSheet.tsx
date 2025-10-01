import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";
import type { NavCategory } from "./app-shell-data";
import { Menu } from "lucide-react";

interface MobileNavSheetProps {
  categories: NavCategory[];
}

export default function MobileNavSheet({ categories }: MobileNavSheetProps) {
  const [, setLocation] = useLocation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Access all Vibes features and tools
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {categories.map((category) => (
            <div key={category.title} className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                {category.title}
              </h3>
              <div className="space-y-1">
                {category.items.map((item) => (
                  <a
                    key={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation(item.href);
                    }}
                    href={item.href}
                    className="block w-full"
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3"
                    >
                      {/* icon intentionally omitted to keep styling consistent */}
                      <div className="text-left">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
