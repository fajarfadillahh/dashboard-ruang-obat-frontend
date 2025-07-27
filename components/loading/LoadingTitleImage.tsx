import { Skeleton } from "@nextui-org/react";

export default function LoadingTitleImage() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-20 rounded-xl" />

      <div className="grid gap-2">
        <Skeleton className="h-6 w-64 rounded-lg" />
        <Skeleton className="h-6 w-48 rounded-lg" />
      </div>
    </div>
  );
}
