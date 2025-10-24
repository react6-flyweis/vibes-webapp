import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Camera,
  Crown,
  Music,
  Gamepad2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { InvitationTemplate } from "@/types/invitation";

interface Props {
  selectedTemplate: InvitationTemplate | null;
  setSelectedTemplate: (t: InvitationTemplate | null) => void;
  sampleTemplates: InvitationTemplate[];
  setCurrentStep: (s: any) => void;
}

const TemplateSelection: React.FC<Props> = ({
  selectedTemplate,
  setSelectedTemplate,
  sampleTemplates,
  setCurrentStep,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#EB6F71]" />
          Choose Invitation Template
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "hover:shadow-lg"
              }`}
              onClick={() => {
                setSelectedTemplate(template);
                setCurrentStep("customize");
              }}
            >
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-110"
                />
                <div className="absolute top-2 left-2">
                  <Badge
                    variant="secondary"
                    className={
                      template.isPremium
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {template.isPremium ? "Premium" : "Free"}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-white/90">
                    {template.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {template.arElements && <Camera className="w-4 h-4" />}
                    {template.nftIntegration && <Crown className="w-4 h-4" />}
                    {template.musicIntegration && <Music className="w-4 h-4" />}
                    {template.gamificationLevel && (
                      <Gamepad2 className="w-4 h-4" />
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setCurrentStep("event")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={() => setCurrentStep("customize")}
            disabled={!selectedTemplate}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Customize Template
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelection;
