"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-100 mb-4">Something went wrong!</h2>
      <p className="text-slate-400 max-w-md mb-8">
        We encountered an error while trying to load the universe data. 
        Your space connection might be unstable or NASA's API might be overwhelmed.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
