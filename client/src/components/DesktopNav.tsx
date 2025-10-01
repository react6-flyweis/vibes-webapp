import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useLocation } from "wouter";
import type { NavCategory } from "./app-shell-data";

interface DesktopNavProps {
  categories: NavCategory[];
}

export default function DesktopNav({ categories }: DesktopNavProps) {
  const [, setLocation] = useLocation();

  return (
    <NavigationMenu className="hidden lg:flex flex-grow justify-center mx-4 min-w-0">
      <Swiper slidesPerView={"auto"} spaceBetween={10} className="w-full">
        {categories.map((category) => (
          <SwiperSlide key={category.title} style={{ width: "auto" }}>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium">
                {category.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                  {category.items.map((item) => (
                    <NavigationMenuLink key={item.href} asChild>
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          setLocation(item.href);
                        }}
                        href={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center space-x-2">
                          {/* icon omitted on purpose; components can add icons if needed */}
                          <div className="text-sm font-medium leading-none">
                            {item.name}
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {item.description}
                        </p>
                      </a>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </SwiperSlide>
        ))}
      </Swiper>
    </NavigationMenu>
  );
}
