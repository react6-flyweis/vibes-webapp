import React, { useEffect, useState, useRef } from "react";
import { useEventGalleryByIdQuery } from "@/queries/eventGallery";
import {
  useUpdatePlanEventMap,
  useCreatePlanEventMap,
} from "@/mutations/planEventMap";
import {
  useCreateEventGallery,
  useUpdateEventGallery,
} from "@/mutations/eventGallery";
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

function generateDefaultGalleryName(eId: any) {
  const short = Math.random().toString(36).slice(2, 8);
  const date = new Date().toISOString().slice(0, 10);
  return `Gallery for event ${eId} (${date}-${short})`;
}

// check if there is gallery id inplan map
// then update gallery or create new one if not exists and update plan map accordingly

export default function PhotosTab({
  photos: initialPhotos = [],
  eventId,
  planMap,
}: any) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos || []);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [galleryId, setGalleryId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updatePlanMapMutation = useUpdatePlanEventMap({});
  const createPlanMapMutation = useCreatePlanEventMap({});
  const createEventGallery = useCreateEventGallery({});
  const updateEventGallery = useUpdateEventGallery({});

  useEffect(() => {
    setPhotos(initialPhotos || []);
  }, [initialPhotos]);

  // If a planMap is provided, try to initialize galleryId and photos from it
  useEffect(() => {
    if (!planMap) return;

    // Try various common keys that might contain a gallery id
    const pmGalleryId =
      planMap?.galleryId ??
      planMap?.event_gallery_id ??
      planMap?.eventGalleryId ??
      planMap?.id ??
      planMap?.event_gallery?.id ??
      null;

    if (pmGalleryId) {
      // rely on planMap value only
      setGalleryId(Number(pmGalleryId));
    }

    // Try to extract photos array from planMap if initial photos are empty
    const pmPhotos =
      planMap?.photos ??
      planMap?.photos_list ??
      planMap?.event_gallery_photos ??
      planMap?.gallery_photos ??
      null;

    if (
      (initialPhotos == null || initialPhotos.length === 0) &&
      Array.isArray(pmPhotos) &&
      pmPhotos.length > 0
    ) {
      const mapped = pmPhotos.map((p: any, idx: number) => ({
        id: p.id ?? p.photoId ?? idx,
        photoUrl:
          p.photoUrl ?? p.photo ?? p.url ?? p.path ?? p.src ?? p.filename ?? "",
        caption: p.caption ?? p.name ?? p.photo_name ?? "",
      }));
      setPhotos(mapped);
    }
  }, [planMap]);

  // Fetch gallery from API when we have a galleryId
  const { data: gallery, isLoading: galleryLoading } =
    useEventGalleryByIdQuery(galleryId);

  useEffect(() => {
    if (!gallery || !gallery.event_gallery_photo) return;

    // map API photo objects to local Photo type
    const mapped = gallery.event_gallery_photo.map((p: any, idx: number) => ({
      id: p._id ?? p.id ?? idx,
      photoUrl: p.photo ?? p.photoUrl ?? p.url ?? "",
      caption: p.name ?? p.caption ?? "",
    }));

    // only set if we don't already have photos or to prepend if different
    setPhotos(mapped);
  }, [gallery]);

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

    // Auto-submit the file + name. Always clear the actual input element
    // using the persistent ref (fileInputRef) because the synthetic event
    // may be pooled and nullified after await.
    try {
      await uploadFile(f, name || f.name.replace(/\.[^.]+$/, ""));
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function uploadFile(file: File, photoName: string) {
    setLoading(true);
    try {
      const form = new FormData();

      const galleryNameToUse =
        !galleryId && (!photoName || String(photoName).trim() === "")
          ? generateDefaultGalleryName(eventId ?? "unknown")
          : photoName || generateDefaultGalleryName(eventId ?? "unknown");

      form.append("event_gallery_name", galleryNameToUse);
      form.append("photo", file);
      form.append("photo_name", photoName || galleryNameToUse);

      // Use the mutation hooks to perform create/update
      const result = galleryId
        ? await updateEventGallery.mutateAsync(form as FormData)
        : await createEventGallery.mutateAsync(form as FormData);

      const data = result || {};

      // Try to extract gallery id and photo url
      // result shape follows IResponse<EventGallery> -> .data contains EventGallery
      const created: any = data?.data ?? data ?? {};
      const newGalleryId =
        created?.event_gallery_id ?? created?._id ?? galleryId ?? Date.now();
      const photoUrlFromResp =
        created?.event_gallery_photo?.[0]?.photo ??
        created?.event_gallery_photo?.[0]?.url ??
        "";

      // don't persist to localStorage; planMap linking is handled below
      setGalleryId(Number(newGalleryId));

      // If there is no gallery in the plan map, we need to create/update the plan map to include it
      try {
        const pmGalleryArr: number[] | undefined =
          planMap?.event_gallery && Array.isArray(planMap.event_gallery)
            ? (planMap.event_gallery as any[]).map((x: any) => Number(x))
            : undefined;

        if (!pmGalleryArr || pmGalleryArr.length === 0) {
          // No gallery linked in plan map.
          // If there is an existing planMap (has event_id), update it
          if (planMap && (planMap as any).event_id) {
            const updated = [Number(newGalleryId)];
            updatePlanMapMutation.mutate({
              id:
                (planMap as any)._id ??
                (planMap as any).plan_event_id ??
                undefined,
              event_id: (planMap as any).event_id,
              event_gallery: updated,
            });
          } else {
            // No planMap exists: create a new plan map with the gallery id
            createPlanMapMutation.mutate({
              event_id: eventId,
              event_gallery: [Number(newGalleryId)],
            });
          }
        } else if (!pmGalleryArr.includes(Number(newGalleryId))) {
          // gallery exists in plan map array but doesn't include this id -> append
          const updated = [...pmGalleryArr, Number(newGalleryId)];
          if (planMap && (planMap as any).event_id) {
            updatePlanMapMutation.mutate({
              id:
                (planMap as any)._id ??
                (planMap as any).plan_event_id ??
                undefined,
              event_id: (planMap as any).event_id,
              event_gallery: updated,
            });
          }
        }
      } catch (e) {
        // non-fatal: continue
        console.warn("Failed to link gallery to plan map", e);
      }

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
