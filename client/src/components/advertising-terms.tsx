import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, Mail } from "lucide-react";

interface AdvertisingTermsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdvertisingTerms({ isOpen, onClose }: AdvertisingTermsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vibes Advertising Terms and Conditions
          </DialogTitle>
          <DialogDescription>
            Please review our advertising terms before submitting your business ad
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <p className="text-gray-600">
              These Advertising Terms and Conditions ("Terms") govern the relationship between 
              advertisers ("Advertiser") and Vibes ("Platform"), a party planning application 
              that enables businesses to promote products and services to event hosts and users.
            </p>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h3>
              <p className="text-gray-600">
                By submitting an advertisement for review or publication on the Vibes platform, 
                the Advertiser agrees to these Terms. Vibes reserves the right to update these 
                Terms at any time.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">2. Advertisement Submission and Review</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Advertisers must submit all required materials, including business name, product or service title, descriptions, contact info, and visuals.</li>
                <li>All ads are subject to review by Vibes before publication.</li>
                <li>Vibes reserves the right to reject or remove any ad at its discretion for any reason, including content that is offensive, misleading, or inappropriate.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">3. Content Guidelines</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Ads must be accurate, truthful, and comply with all applicable laws and regulations.</li>
                <li>Ads must not contain profanity, hate speech, sexually explicit material, or fraudulent claims.</li>
                <li>Ads should be relevant to Vibes users and relate to events, hospitality, entertainment, or social interaction.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">4. Payment and Fees</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Featured listings and premium ad placements require payment in advance.</li>
                <li>All fees are non-refundable once an ad is approved and published.</li>
                <li>Pricing may vary based on placement, duration, and promotional campaigns.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">5. Placement and Visibility</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Vibes will determine ad placement and rotation frequency based on availability, category relevance, and user engagement.</li>
                <li>No guarantees are made regarding the number of views, clicks, or conversions.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">6. Intellectual Property</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Advertiser retains ownership of submitted content.</li>
                <li>By submitting an ad, Advertiser grants Vibes a royalty-free license to use, reproduce, display, and distribute ad content within the platform.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">7. Termination and Removal</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>The advertiser may request to pause or remove an ad at any time in writing.</li>
                <li>Vibes reserves the right to remove any ad that violates these terms without refund.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">8. Limitation of Liability</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Vibes is not liable for any damages resulting from ad placement, including loss of business, reputation, or revenue.</li>
                <li>Advertiser assumes full responsibility for the content and performance of their advertisement.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">9. Dispute Resolution</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Any disputes arising under these Terms will be resolved under the laws of the state in which Vibes is incorporated.</li>
                <li>Parties agree to resolve disputes via arbitration before pursuing court action.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">10. Contact</h3>
              <p className="text-gray-600">
                For questions or concerns regarding advertising, contact:{" "}
                <a href="mailto:ads@vibeapp.com" className="text-violet-600 hover:underline inline-flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  ads@vibeapp.com
                </a>
              </p>
            </div>

            <Separator />

            <div className="bg-violet-50 p-4 rounded-lg">
              <p className="text-sm text-violet-800 font-medium">
                By checking the agreement box or submitting an advertisement, the Advertiser 
                confirms that they have read, understood, and agreed to abide by these Terms and Conditions.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}