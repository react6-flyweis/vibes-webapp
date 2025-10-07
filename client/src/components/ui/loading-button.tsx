import { Loader2Icon } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

function LoadingButton({
  isLoading,
  children,
  ...props
}: { isLoading?: boolean } & ComponentProps<typeof Button>) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading && <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />}
      {children}
    </Button>
  );
}

export { LoadingButton };
