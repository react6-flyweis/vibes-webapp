import React from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

export default function MockupPreview({ elements, platform }: any) {
  const backgroundElement = elements.find(
    (el: any) => el.type === "background"
  );
  const textElements = elements.filter((el: any) => el.type === "text");
  const mainTitle =
    textElements.find((el: any) => el.style.fontSize && el.style.fontSize > 30)
      ?.content || "Event Title";
  const subtitle =
    textElements.find(
      (el: any) =>
        el.style.fontSize && el.style.fontSize <= 30 && el.style.fontSize > 18
    )?.content || "Event Details";

  return (
    <div className="relative bg-gray-900 p-4 rounded-lg">
      <div className="bg-gray-800 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-linear-to-r from-purple-400 to-pink-400 rounded-full" />
          <div>
            <div className="text-white font-medium text-sm">
              vibes_party_app
            </div>
            <div className="text-gray-400 text-xs">2 minutes ago</div>
          </div>
        </div>

        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            aspectRatio: platform?.aspectRatio || "16:9",
            maxWidth: "300px",
            background:
              backgroundElement?.style.background ||
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            filter: backgroundElement?.style.filter || "none",
          }}
        >
          <div
            className="absolute border-2 border-yellow-400 border-dashed opacity-30"
            style={{
              top: `${
                (platform?.specs.safeZones.top / platform?.dimensions.height) *
                100
              }%`,
              left: `${
                (platform?.specs.safeZones.left / platform?.dimensions.width) *
                100
              }%`,
              right: `${
                (platform?.specs.safeZones.right / platform?.dimensions.width) *
                100
              }%`,
              bottom: `${
                (platform?.specs.safeZones.bottom /
                  platform?.dimensions.height) *
                100
              }%`,
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
            <h2 className="text-lg font-bold mb-2 line-clamp-2">{mainTitle}</h2>
            <p className="text-sm opacity-90 line-clamp-2">{subtitle}</p>
            {textElements.length > 2 && (
              <p className="text-xs opacity-75 mt-1 line-clamp-1">
                {textElements[2]?.content}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-white">
          <div className="flex items-center gap-4">
            <Heart className="w-5 h-5" />
            <MessageCircle className="w-5 h-5" />
            <Share2 className="w-5 h-5" />
          </div>
          <Bookmark className="w-5 h-5" />
        </div>

        <div className="text-white text-sm mt-2">
          <span className="font-medium">
            {Math.floor(Math.random() * 2000) + 500} likes
          </span>
        </div>

        <div className="text-white text-sm mt-1">
          <span className="font-medium">vibes_party_app</span>
          <span className="text-gray-300 ml-2">
            {mainTitle.length > 20
              ? mainTitle.substring(0, 20) + "..."
              : mainTitle}{" "}
            Check out this amazing event! 🎉
          </span>
        </div>
      </div>
    </div>
  );
}
