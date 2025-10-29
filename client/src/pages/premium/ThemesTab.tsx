import React from "react";
import { Check, ArrowRight } from "lucide-react";
import theme1 from "../../../assests/theme1.png";
import { templates } from "@/features/vibescard-studio/data/templates";

interface Theme {
  name: string;
  description: string;
  category: string;
  colors: string[];
  features: string[];
  previewImg: string;
}

const themes: Theme[] = (templates || []).map((t: any) => {
  const rawFeatures = Array.isArray(t.elements)
    ? Array.from(new Set(t.elements.map((e: any) => e.type))).slice(0, 6)
    : [];
  const previewImg =
    t.preview ||
    (t.elements &&
      t.elements.find((e: any) => e.type === "image")?.content?.src) ||
    theme1;
  return {
    name: t.name || "Untitled",
    description: t.style?.brand || t.style?.colorScheme || t.category || "",
    category: t.category || "",
    colors:
      Array.isArray(t.palette) && t.palette.length > 0
        ? t.palette
        : ["#cccccc"],
    features: rawFeatures,
    previewImg,
  } as Theme;
});

export default function ThemesTab() {
  return (
    <div className="relative w-full min-h-[650px] bg-white/10 text-slate-200 backdrop-blur-xs p-6">
      <h2 className="text-white text-2xl font-bold mb-1">Premium Themes</h2>
      <p className="text-slate-200 text-sm mb-8">
        Customize your events with professional theme and branding options
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {themes.map((theme, index) => (
          <div key={index} className="relative rounded-xl overflow-hidden">
            <img
              src={theme.previewImg}
              alt={theme.name}
              className="w-full h-[500px] object-fit"
            />
            <div className="absolute bottom-0 left-1/2 h-[300px] -translate-x-1/2 w-[90%] bg-black/40 backdrop-blur-md rounded-lg p-4">
              <h3 className="text-white text-lg font-semibold">{theme.name}</h3>
              <p className="text-gray-300 text-sm">{theme.description}</p>
              <div className="border border-gray-400/50 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mt-3">
                {theme.category}
              </div>
              <div className="mt-3 flex flex-row items-center gap-2">
                <span className="text-gray-300 text-xs">Colors: </span>
                <div className="flex gap-2 mt-1">
                  {theme.colors.map((color, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full border border-gray-200`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <span className="text-gray-300 text-xs font-medium">
                  Features:
                </span>
                <div className="grid grid-cols-2 gap-y-2 mt-2">
                  {theme.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center text-gray-300 text-xs"
                    >
                      <Check className="w-3 h-3 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 gap-2">
                <button className="flex items-center justify-center bg-blue-500 w-[277px] hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md">
                  Preview
                </button>
                <button className="flex items-center justify-center bg-white text-black border px-4 py-2 rounded-md">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
