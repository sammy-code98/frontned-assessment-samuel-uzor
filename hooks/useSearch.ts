import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export interface SearchFilters {
  query: string;
  mediaType: "all" | "image" | "video";
}

export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const query = searchParams.get("query") || "";
  const mediaType = (searchParams.get("mediaType") as SearchFilters["mediaType"]) || "all";

  const setFilters = useCallback(
    (key: keyof SearchFilters, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return {
    filters: { query, mediaType },
    setFilters,
  };
}
