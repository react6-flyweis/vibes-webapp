import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useVendorEmailTemplates } from "@/queries/vendorTemplates";
import CreateTemplateDialog from "./CreateTemplateDialog";

export default function Templates() {
  const { data: templatesData, isLoading } = useVendorEmailTemplates();
  const [templatesState, setTemplatesState] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (templatesData) {
      // map API items into local shape expected by the UI
      const mapped = templatesData.map((t: any) => ({
        id: t.EmailTemplate_id ?? t._id,
        title: t.Title,
        category: "Imported",
        subject: t.Subject,
        preview: t.Preview,
        raw: t,
      }));
      setTemplatesState(mapped);
    }
  }, [templatesData]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Email Templates</h2>
          <p className="text-sm text-muted-foreground">
            Manage your vendor outreach email templates
          </p>
        </div>
        <div>
          <CreateTemplateDialog
            onCreated={(created) => setTemplatesState((s) => [created, ...s])}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading
          ? // render 4 skeleton cards to approximate final layout
            [1, 2, 3, 4].map((i) => (
              <Card key={`skeleton-${i}`}>
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-full mt-2" />
                    </div>

                    <div className="mt-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full mt-2" />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : templatesState.map((t: any) => (
              <Card key={t.id}>
                <CardContent>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xl font-semibold">{t.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {t.category}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {t.id === 1 ? "23.4% success" : "31.8% success"}
                    </div>
                  </div>

                  <div className="mt-6 text-sm">
                    <div className="font-medium">Subject:</div>
                    <div className="text-muted-foreground">{t.subject}</div>

                    <div className="mt-4 font-medium">Preview:</div>
                    <div className="text-muted-foreground">{t.preview}</div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Badge className="rounded-full">Contacted</Badge>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
