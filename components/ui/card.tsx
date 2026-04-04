"use client";

import Image from "next/image";
import Link from "next/link";
import { ApodItem } from "@/types/apod";
import { PlayCircle, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CardProps {
  item: ApodItem;
  className?: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80";

export function ApodCard({ item, className }: CardProps) {
  const [imgSrc, setImgSrc] = useState(item.imageUrl);

  return (
    <Link href={`/items/${item.date}`} className={cn("group flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10", className)}>
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900 flex items-center justify-center">
        {item.mediaType === "video" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
            <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        <Image
          src={imgSrc || FALLBACK_IMAGE}
          alt={item.title}
          width={600}
          height={400}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          placeholder="empty"
          priority={false}
          onError={() => {
            setImgSrc(FALLBACK_IMAGE);
          }}
        />
        <div className="absolute top-3 right-3 z-10 p-2 bg-black/60 backdrop-blur-md rounded-full">
          {item.mediaType === "image" ? (
            <ImageIcon className="w-4 h-4 text-white/90" />
          ) : (
            <PlayCircle className="w-4 h-4 text-white/90" />
          )}
        </div>
      </div>
      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-center space-x-2 text-xs font-medium text-purple-400 mb-2">
          <span>{item.date}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100 line-clamp-2" title={item.title}>
          {item.title}
        </h3>
      </div>
    </Link>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 animate-pulse">
      <div className="aspect-video w-full bg-white/10" />
      <div className="p-5 flex flex-col space-y-3">
        <div className="h-4 w-24 bg-white/10 rounded-md" />
        <div className="h-6 w-full bg-white/10 rounded-md" />
        <div className="h-6 w-2/3 bg-white/10 rounded-md" />
      </div>
    </div>
  );
}
