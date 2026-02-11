"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Suspense, useState, useEffect } from "react";

function ResultContent() {
  const router = useRouter();
  const [matchedName, setMatchedName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if match exists in sessionStorage (prevents direct URL access)
    const storedMatch = sessionStorage.getItem("valentineMatch");
    if (!storedMatch) {
      router.push("/");
      return;
    }
    setMatchedName(storedMatch);
    setIsLoading(false);
  }, [router]);

  if (isLoading || !matchedName) {
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
            alt="my-valentine.tech logo"
            className="w-20 h-20 object-contain"
          />
          {/* Site name removed as requested */}
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
            <p className="text-xl md:text-2xl font-semibold text-gray-900">
              Your match is set! Enjoy the event.
            </p>
            <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto">
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
      <footer className="mt-6 md:mt-0 p-6 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-2">
          <p className="w-full text-left">© 2026 my-valentine.tech team. All rights reserved.</p>
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
