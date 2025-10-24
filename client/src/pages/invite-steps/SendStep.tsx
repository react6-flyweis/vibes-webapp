import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  // props placeholder for future wiring
}

const SendStep: React.FC<Props> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#EB6F71]" />
          Send Your Invitation
        </CardTitle>
        <CardDescription>
          Lorem ipsum is simply dummy text of the printing and typesetting
          industry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" bg-white/5 p-6 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-extrabold  mb-2">$99.99</div>
            <p className="text-sm  mb-4">
              To proceed with sending your invitation, please complete a
              one-time platform fee of{" "}
              <span className="font-semibold"> $99.99 USD</span>.
            </p>
          </div>

          <div className="space-y-3 text-sm ">
            <p>
              <Lock className="inline w-4 h-4 mr-2" />
              This fee helps us maintain a secure, high-quality experience for
              you and your guests. Once your payment is confirmed, you'll be
              able to send your invitation without any further charges.
            </p>

            <p>
              <Lock className="inline w-4 h-4 mr-2" />
              <span className="font-medium">One-time only.</span> No hidden
              costs. Immediate access.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SendStep;
