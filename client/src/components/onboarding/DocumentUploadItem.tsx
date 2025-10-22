import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  file: File | null;
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
};

export default function DocumentUploadItem({
  label,
  file,
  accept = "image/*,application/pdf",
  onChange,
  onRemove,
}: Props) {
  return (
    <div>
      <div className="text-sm mb-2">{label}</div>
      <div className="border border-gray-200 rounded p-4 bg-white">
        {!file ? (
          <label className="w-full h-28 flex flex-col items-center justify-center cursor-pointer bg-gray-50 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16v4h10v-4M12 12V4m0 0l-3 3m3-3 3 3"
              />
            </svg>
            <div className="text-xs text-gray-500 mt-2">Click to upload</div>
            <input
              type="file"
              accept={accept}
              className="sr-only"
              onChange={onChange}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-sm truncate">{file.name}</div>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              Remove
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
