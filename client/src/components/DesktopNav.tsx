import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router";
import {
  navigationItems,
  staffNavigationItems,
  userNavigationItems,
  vendorNavigationItems,
  type NavCategory,
} from "./app-shell-data";
import { useAuthStore } from "@/store/auth-store";

export default function DesktopNav() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);

  const categories: NavCategory[] = [
    ...navigationItems,
    ...(user?.role_id === 3 ? vendorNavigationItems : userNavigationItems),
    ...(user?.role_id === 4 ? staffNavigationItems : []),
  ];

  return (
    <NavigationMenu className="hidden lg:flex grow justify-center mx-4 min-w-0">
      <NavigationMenuList className="w-full max-w-[900px]">
        {categories.map((category) => (
          <NavigationMenuItem key={category.title}>
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
                        navigate(item.href);
                      }}
                      href={item.href}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="flex items-center space-x-3">
                        {/* Simple inline icon — replace with item.icon if available */}
                        <span className="flex-shrink-0">
                          {item.icon
                            ? React.isValidElement(item.icon)
                              ? item.icon
                              : React.createElement(item.icon, {
                                  className: "h-5 w-5 text-muted-foreground",
                                })
                            : null}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium leading-none">
                            {item.name}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
