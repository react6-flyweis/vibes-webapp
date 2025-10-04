import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function PhotosTab({ photos }: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Event Gallery</CardTitle>
            <CardDescription>Share photos and memories</CardDescription>
          </div>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {photos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No photos yet. Upload the first one!</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo: any) => (
              <div key={photo.id} className="aspect-square bg-gray-200 rounded-lg">
                <img src={photo.photoUrl} alt={photo.caption || "Event photo"} className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
