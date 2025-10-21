import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const initialContent = `vitae malesuada dui. id gravida tincidunt non, adipiscing venenatis
varius quis tincidunt dui cursus tempor dignissim, tempor vel Sed
urna amet, porta Morbi

In vel nec ullamcorper nec at, Quisque cursus ex nulla, est. leo. eget nulla, laoreet nisi nisl. dui eget felis, convallis. tempor viverra ex fringilla In non

leo. convallis. ex placerat. sollicitudin. Lorem Nunc venenatis libero, elit efficitur. vitae hendrerit elit odio Nullam urna. luctus orci tincidunt non dui.

Donec elit. nec tortor. elit. dolor orci In quis ac sit tortor. dignissim, Donec convallis. elementum elit. fringilla venenatis sed Sed placerat elit. felis,

Vestibulum eget lorem. vel non. risus ultrices eu vitae non, lacus, ex. leo. in laoreet Nunc non id diam urna vehicula, dui. id sapien non nisi cursus eu at,`;

export default function PlatformTermsTab() {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState<string>(initialContent);
  const [draft, setDraft] = useState<string>(content);

  const startEditing = () => {
    setDraft(content);
    setEditing(true);
  };

  const cancel = () => {
    setDraft(content);
    setEditing(false);
  };

  const publish = () => {
    setContent(draft);
    setEditing(false);
    // TODO: call API to persist platform terms
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-semibold">Platform Terms & Policies</h2>
        {!editing ? (
          <Button size="sm" onClick={startEditing}>
            Edit
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={cancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={publish}>
              Publish
            </Button>
          </div>
        )}
      </div>

      <div className="">
        {!editing ? (
          <div className="h-48 overflow-auto text-sm leading-relaxed text-gray-700 whitespace-pre-wrap border rounded-md p-4 bg-white shadow-sm">
            {content}
          </div>
        ) : (
          <Textarea
            value={draft}
            onChange={(e) => setDraft((e.target as HTMLTextAreaElement).value)}
            className="h-48"
          />
        )}
      </div>
    </Card>
  );
}
