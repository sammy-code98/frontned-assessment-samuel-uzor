export const runtime = "nodejs";

import { ApodGrid } from "@/components/apod/ApodGrid";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/card";

export const revalidate = 86400; // daily ISR

export function GridSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12 h-32 animate-pulse bg-white/5 rounded-2xl"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<GridSkeleton />}>
      <ApodGrid />
    </Suspense>
  );
}
