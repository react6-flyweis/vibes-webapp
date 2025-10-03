import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useLocation } from "wouter";
import userIcon from "@/assets/icons/user.svg";
import vendorIcon from "@/assets/icons/vendor.svg";

export default function GetStarted() {
  const [, setLocation] = useLocation();
  const choose = (role: string) => {
    setLocation(`/signup?role=${encodeURIComponent(role)}`);
  };

  return (
    <div className="w-full h-screen bg-gradient-primary flex justify-center items-center ">
      <Card className="max-w-xl w-full p-10">
        <CardHeader>
          <CardTitle className="bg-gradient-cta bg-clip-text font-bold text-center text-transparent">
            Who are you?
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center mt-10">
          <div className="flex flex-col gap-5 max-w-sm">
            <div
              role="button"
              tabIndex={0}
              onClick={() => choose("user")}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && choose("user")
              }
              className="flex items-center gap-4 rounded-lg border border-purple-200 p-4 cursor-pointer hover:bg-primary group transition-all duration-200"
            >
              <img
                src={userIcon}
                alt=""
                aria-hidden
                className="h-12 w-12 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-200"
              />

              <div className="flex-1">
                <div className="text-lg font-semibold text-purple-700 group-hover:text-white transition-all duration-200">
                  User
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-white transition-all duration-200">
                  Plan an event, book vendors
                </div>
              </div>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => choose("vendor")}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && choose("vendor")
              }
              className="flex items-center gap-4 rounded-lg border border-pink-200 p-4 cursor-pointer
              hover:bg-primary group transition-all duration-200"
            >
              <img
                src={vendorIcon}
                alt=""
                aria-hidden
                className="h-12 w-12 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-200"
              />

              <div className="flex-1">
                <div className="text-lg font-semibold text-pink-700 group-hover:text-white transition-all duration-200">
                  Vendor
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-white transition-all duration-200">
                  Offer services, get clients
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
