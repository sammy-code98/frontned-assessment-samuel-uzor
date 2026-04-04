import { ApodApiResponse, ApodItem } from "@/types/apod";

const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

/**
 * Normalizes the raw API response into our standard ApodItem
 */
function normalizeApod(raw: ApodApiResponse): ApodItem {
  return {
    date: raw.date,
    title: raw.title,
    description: raw.explanation,
    imageUrl: raw.media_type === "video" ? (raw.thumbnail_url || raw.url) : raw.url,
    mediaType: raw.media_type as "image" | "video",
  };
}

/**
 * Fetch APOD items by date range.
 * This is primarily used by the Server Components for ISR initial fetching.
 */
export async function fetchApodsByRange(startDate: string, endDate: string): Promise<ApodItem[]> {
  const params = new URLSearchParams({
    api_key: API_KEY,
    start_date: startDate,
    end_date: endDate,
    thumbs: "true", // request thumbnails for videos
  });

  const url = `${BASE_URL}?${params.toString()}`;
  console.log(`[APOD API] Fetching range: ${startDate} to ${endDate}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch APODs: ${res.statusText}`);
  }

  const rawData: ApodApiResponse[] = await res.json();
  
  // Sort descending by date (newest first)
  const normalized = rawData.map(normalizeApod).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return normalized;
}

/**
 * Fetch a single APOD by date.
 */
export async function fetchApodByDate(date: string): Promise<ApodItem> {
  const params = new URLSearchParams({
    api_key: API_KEY,
    date: date,
    thumbs: "true"
  });

  const url = `${BASE_URL}?${params.toString()}`;
  console.log(`[APOD API] Fetching APOD for date: ${date}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch APOD: ${res.statusText}`);
  }

  const rawData: ApodApiResponse = await res.json();
  return normalizeApod(rawData);
}
