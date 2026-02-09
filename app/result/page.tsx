"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Home } from "lucide-react";
import { Suspense } from "react";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchedName = searchParams.get("name") || "";

  if (!matchedName) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-pink-50 to-white flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img
            src="/logo.png"
            alt="Valentine.me logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-xl font-semibold text-pink-400">
            Valentine.me
          </h1>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          {/* Match Name Display */}
          <div className="mb-8">
            <h2 className="text-5xl md:text-7xl font-bold text-pink-400 mb-6 animate-fade-in">
              {matchedName}
            </h2>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <p className="text-2xl font-semibold text-gray-900">
              Your match is set! Enjoy the event.
            </p>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              We hope this Valentine&apos;s connection brings you joy and memorable
              moments!
            </p>
          </div>

          {/* Decorative Hearts */}
          <div className="mt-12 flex justify-center gap-4">
            <Heart className="w-8 h-8 text-pink-300 fill-pink-300 animate-bounce" />
            <Heart className="w-10 h-10 text-pink-400 fill-pink-400 animate-bounce delay-100" />
            <Heart className="w-8 h-8 text-pink-300 fill-pink-300 animate-bounce delay-200" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-2">
          <p className="w-full text-left">© 2026 Valentine.me team. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  );
}
