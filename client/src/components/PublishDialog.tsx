import React from "react";

type PublishDialogProps = {
  open: boolean;
  title: string;
  subTitle: string;
  tags: string;
  loading?: boolean;
  onClose: () => void;
  onChangeTitle: (v: string) => void;
  onChangeSubTitle: (v: string) => void;
  onChangeTags: (v: string) => void;
  onPublish: () => void;
};

export default function PublishDialog({
  open,
  title,
  subTitle,
  tags,
  loading = false,
  onClose,
  onChangeTitle,
  onChangeSubTitle,
  onChangeTags,
  onPublish,
}: PublishDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">Publish Design</h3>
        <p className="text-sm text-gray-600 mt-1">
          Add a title, description and tags before publishing.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => onChangeTitle(e.target.value)}
              className="mt-1 block w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={subTitle}
              onChange={(e) => onChangeSubTitle(e.target.value)}
              className="mt-1 block w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              value={tags}
              onChange={(e) => onChangeTags(e.target.value)}
              placeholder="design, creative, art"
              className="mt-1 block w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded border px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onPublish}
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Export & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
