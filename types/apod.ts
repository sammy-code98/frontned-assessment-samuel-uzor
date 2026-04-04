export interface ApodItem {
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  mediaType: 'image' | 'video';
}

export interface ApodApiResponse {
  date: string;
  explanation: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  hdurl?: string;
  thumbnail_url?: string;
}
