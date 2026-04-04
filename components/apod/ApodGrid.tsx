"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchApodsByRange } from "@/lib/apod";
import { ApodItem } from "@/types/apod";
import { useSearch } from "@/hooks/useSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { ApodCard, CardSkeleton } from "@/components/ui/card";
import { SearchIcon, Telescope } from "lucide-react";
import { useMemo, useState } from "react";
import { GridSkeleton } from "@/app/page";

export function ApodGrid() {
  const { filters, setFilters } = useSearch();
  const [localQuery, setLocalQuery] = useState(filters.query);
  const debouncedQuery = useDebounce(localQuery, 300);

  // Sync local debounced to URL state
  useMemo(() => {
    if (debouncedQuery !== filters.query) {
      setFilters("query", debouncedQuery);
    }
  }, [debouncedQuery, filters.query, setFilters]);

  // Infinite data fetching logic
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['apods', 'infinite'],
    initialPageParam: new Date().toISOString().split("T")[0],
    queryFn: ({ pageParam }) => {
      const end = new Date(pageParam);
      const start = new Date(end);
      start.setDate(end.getDate() - 30);
      return fetchApodsByRange(
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0]
      );
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      const oldestDate = new Date(lastPage[lastPage.length - 1].date);
      oldestDate.setDate(oldestDate.getDate() - 1);
      
      // APOD started on June 16, 1995
      if (oldestDate < new Date("1995-06-16")) return undefined;
      return oldestDate.toISOString().split("T")[0];
    }
  });

  const allApods = useMemo(() => {
    return data ? data.pages.flat() : [];
  }, [data]);

  // Client-side filtering logic
  const filteredData = useMemo(() => {
    return allApods.filter((item) => {
      // Media type filter
      if (filters.mediaType !== "all" && item.mediaType !== filters.mediaType) {
        return false;
      }

      // Search query filter
      if (filters.query) {
        const queryTerm = filters.query.toLowerCase();
        if (
          !item.title.toLowerCase().includes(queryTerm) &&
          !item.description.toLowerCase().includes(queryTerm)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [allApods, filters.mediaType, filters.query]);

  if (isLoading) {
    return <GridSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Cosmic Explorer
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-400">
              Journey through the universe with NASA's Astronomy Picture of the Day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search cosmic wonders..."
                className="w-full sm:w-64 pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none cursor-pointer"
              value={filters.mediaType}
              onChange={(e) => setFilters("mediaType", e.target.value)}
            >
              <option value="all">All Media</option>
              <option value="image">Images Only</option>
              <option value="video">Videos Only</option>
            </select>
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-white/5 border border-white/10 shadow-inner">
          <Telescope className="w-16 h-16 text-slate-500 mb-6" />
          <h2 className="text-2xl font-bold text-slate-200 mb-2">No discoveries found</h2>
          <p className="text-slate-400 mb-6 max-w-md">
            We couldn't find any celestial objects matching your criteria. Try adjusting your search filters.
          </p>
          <button
            onClick={() => {
              setLocalQuery("");
              setFilters("query", "");
              setFilters("mediaType", "all");
            }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((item) => (
              <ApodCard key={item.date} item={item} />
            ))}
          </div>
          
          {hasNextPage && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-8 py-3 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 font-medium rounded-xl border border-purple-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isFetchingNextPage ? (
                  <span className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                ) : null}
                {isFetchingNextPage ? "Loading discoveries..." : "Load Older Discoveries"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
