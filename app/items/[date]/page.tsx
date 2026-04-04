"use client";

import { fetchApodByDate } from "@/lib/apod";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { use, useState } from "react";
import { notFound } from "next/navigation";

interface DetailPageProps {
  params: Promise<{ date: string }>;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80";

export default function DetailPage({ params }: DetailPageProps) {
  const { date } = use(params);

  const { data: item, isLoading, isError } = useQuery({
    queryKey: ["apod", date],
    queryFn: () => fetchApodByDate(date)
  });

  const [imgSrc, setImgSrc] = useState<string | null>(null);

  if (isLoading) {
    return (
      <article className="max-w-5xl mx-auto px-4 py-8 md:py-12 animate-pulse">
        <div className="h-6 w-32 bg-white/10 rounded mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-[4/3] w-full rounded-3xl bg-white/10"></div>
          <div className="flex flex-col space-y-4">
            <div className="h-6 w-48 bg-white/10 rounded"></div>
            <div className="h-12 w-full bg-white/10 rounded"></div>
            <div className="h-4 w-full bg-white/10 rounded"></div>
            <div className="h-4 w-5/6 bg-white/10 rounded"></div>
          </div>
        </div>
      </article>
    );
  }

  if (isError || !item) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-red-400 mb-4">Discovery Not Found</h1>
        <p className="text-slate-400 mb-8">We couldn't locate the celestial phenomenon for this date.</p>
        <Link href="/" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors">
          Return to Discoveries
        </Link>
      </div>
    );
  }

  const currentImgSrc = imgSrc || item.imageUrl || FALLBACK_IMAGE;

  return (
    <article className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <Link 
        href="/" 
        className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Discoveries
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Media Block */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-white/5 flex items-center justify-center">
            {item.mediaType === "video" ? (
              <iframe
                src={item.imageUrl}
                title={item.title}
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <Image
                src={currentImgSrc}
                alt={item.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={() => {
                  setImgSrc(FALLBACK_IMAGE);
                }}
              />
            )}
          </div>
          {item.mediaType === "image" && (
            <a 
              href={item.imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-slate-200 text-center uppercase tracking-wide font-semibold"
            >
              Open Full Resolution Image
            </a>
          )}
        </div>

        {/* Info Block */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 text-purple-400 font-medium mb-4">
            <Calendar className="w-5 h-5" />
            <time dateTime={item.date}>
              {new Date(item.date).toLocaleDateString(undefined, {
                dateStyle: "long",
              })}
            </time>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-50 mb-6 leading-tight">
            {item.title}
          </h1>

          <div className="prose prose-invert prose-purple max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex items-start gap-4">
            <Info className="w-6 h-6 text-slate-500 shrink-0" />
            <p className="text-sm text-slate-400">
              This content is provided by NASA's Astronomy Picture of the Day service. 
              Each day a different image or photograph of our fascinating universe is 
              featured, along with a brief explanation written by a professional astronomer.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
