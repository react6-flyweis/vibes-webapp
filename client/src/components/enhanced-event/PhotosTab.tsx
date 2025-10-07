import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type Photo = {
  id: string | number;
  photoUrl: string;
  caption?: string;
};

// Minimal, user-friendly photos tab. Hides gallery-create/update complexity.
// Behavior:
// - Accepts `photos` and `eventId` props (photos can be initial list)
// - When the user clicks Upload, they pick a file and optionally add a name.
// - If a gallery hasn't been created before for this event we call create endpoint.
// - If a gallery exists (we persist gallery id in localStorage per-event) we call update endpoint.
// - The server is expected to accept multipart/form-data with fields: event_gallery_name, photo (file), etc.
export default function PhotosTab({
  photos: initialPhotos = [],
  eventId,
}: any) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos || []);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [galleryId, setGalleryId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // localStorage key per event to remember created gallery id
  const galleryStorageKey = `event_gallery_id_${eventId}`;

  useEffect(() => {
    setPhotos(initialPhotos || []);
  }, [initialPhotos]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(galleryStorageKey);
      if (raw) setGalleryId(Number(raw));
    } catch (e) {
      // ignore
    }
  }, [eventId]);

  // Trigger file dialog
  function handleUploadClick() {
    setShowForm(true);
    setTimeout(() => fileInputRef.current?.click(), 50);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;

    // If name empty, default to filename
    if (!name) setName(f.name.replace(/\.[^.]+$/, ""));

    // Auto-submit the file + name
    await uploadFile(f, name || f.name.replace(/\.[^.]+$/, ""));

    // reset input value so same file can be picked later if needed
    e.currentTarget.value = "";
  }

  async function uploadFile(file: File, photoName: string) {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("event_gallery_name", photoName);
      form.append("photo", file);
      form.append("photo_name", photoName);

      const url = galleryId
        ? "/api/master/event-gallery/updateEventGalleryById"
        : "/api/master/event-gallery/create";

      const res = await fetch(url, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Upload failed: ${res.status}`);
      }

      const data = await res.json();

      // Try to extract gallery id and photo url
      const created = data?.data || data?.created || data || {};
      const newGalleryId =
        created?.id ??
        created?.event_gallery_id ??
        created?.galleryId ??
        galleryId ??
        Date.now();
      const photoUrlFromResp =
        created?.photoUrl ||
        created?.photo ||
        created?.event_gallery_photo?.[0]?.photo ||
        created?.url;

      try {
        localStorage.setItem(galleryStorageKey, String(newGalleryId));
      } catch {}
      setGalleryId(Number(newGalleryId));

      const createdPhoto: Photo = {
        id: Date.now(),
        photoUrl: photoUrlFromResp || URL.createObjectURL(file),
        caption: photoName,
      };

      setPhotos((p) => [createdPhoto, ...p]);
      setShowForm(false);
      setName("");
    } catch (err: any) {
      console.error(err);
      alert("Upload failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Event Gallery</CardTitle>
            <CardDescription>Share photos and memories</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button onClick={handleUploadClick} disabled={loading}>
              <Upload className="w-4 h-4 mr-2" />
              {loading ? "Uploading..." : "Upload Photo"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-4 space-y-2">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                className="flex-1 px-3 py-2 border rounded"
                placeholder="Photo name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Choose a file to upload. We'll create a gallery automatically if
              needed.
            </p>
          </div>
        )}

        {photos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No photos yet. Upload the first one!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo: Photo) => (
              <div
                key={photo.id}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  src={photo.photoUrl}
                  alt={photo.caption || "Event photo"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
