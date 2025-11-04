import EditorPage from "@/features/vibescard-studio/EditorPage";
import { useLocation } from "react-router";

export default function VibesCardStudioNew() {
  const location = useLocation();

  const designData = location.state?.designData;

  return (
    <div className="min-h-screen bg-[#111827]">
      <EditorPage designData={designData} />
    </div>
  );
}
