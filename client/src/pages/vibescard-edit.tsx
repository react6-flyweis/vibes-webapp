import { useParams } from "react-router";
import { useCommunityDesignByIdQuery } from "@/queries/communityDesigns";
import Navigation from "@/components/navigation";
import EditorPage from "@/features/vibescard-studio/EditorPage";

export default function VibesCardEditPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: designResp,
    isLoading,
    isError,
    error,
  } = useCommunityDesignByIdQuery(id);
  const design = designResp ?? null;

  // When loading, keep showing a simple wrapper with navigation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1220] text-white">
        <Navigation />
        <div className="p-6 max-w-4xl mx-auto">Loading design...</div>
      </div>
    );
  }

  if (isError || !design) {
    return (
      <div className="min-h-screen bg-[#0b1220] text-white">
        <div className="p-6 max-w-4xl mx-auto">
          Error: {(error as any)?.message ?? "Failed to load"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      {/* Pass fetched design into the shared editor */}
      <EditorPage initialDesign={design} designData={design.design_json_data} />
    </div>
  );
}
