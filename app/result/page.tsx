"use client";

import { useRouter } from "next/navigation";
import { Heart, Sparkles } from "lucide-react";
import { Suspense, useState, useEffect } from "react";

interface Challenge {
  title: string;
  description: string;
}

function ResultContent() {
  const router = useRouter();
  const [matchedName, setMatchedName] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if match exists in sessionStorage (prevents direct URL access)
    const storedMatch = sessionStorage.getItem("valentineMatch");
    const storedChallenge = sessionStorage.getItem("valentineChallenge");
    
    if (!storedMatch) {
      router.push("/");
      return;
    }
    
    setMatchedName(storedMatch);
    
    if (storedChallenge) {
      try {
        setChallenge(JSON.parse(storedChallenge));
      } catch (e) {
        console.error("Failed to parse challenge:", e);
      }
    }
    
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
            alt="mais-valentine.me logo"
            className="w-20 h-20 object-contain"
          />
          {/* Site name removed as requested */}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="max-w-2xl w-full text-center space-y-12">
          {/* Match Name Display */}
          <div>
            <h2 className="text-5xl md:text-7xl font-bold text-pink-400 mb-6 animate-fade-in">
              {matchedName}
            </h2>
            
            {/* Success Message */}
            <div className="space-y-4">
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                Your match is set! 🎉
              </p>
              <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto">
                We hope this Valentine&apos;s connection brings you joy and memorable
                moments!
              </p>
            </div>
          </div>

          {/* Challenge Section */}
          {challenge && (
            <div className="bg-linear-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl p-8 shadow-lg animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-pink-400" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Valen-Smile Challenge
                </h3>
                <Sparkles className="w-6 h-6 text-pink-400" />
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-xl md:text-2xl font-semibold text-pink-500 mb-4">
                  {challenge.title}
                </h4>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {challenge.description}
                </p>
              </div>
              
              <p className="text-sm text-gray-600 mt-6">
                Complete this challenge together with your match to make this Valentine&apos;s unforgettable! 💕
              </p>
            </div>
          )}

          {/* Decorative Hearts */}
          <div className="flex justify-center gap-4">
            <Heart className="w-8 h-8 text-pink-300 fill-pink-300 animate-bounce" />
            <Heart className="w-10 h-10 text-pink-400 fill-pink-400 animate-bounce delay-100" />
            <Heart className="w-8 h-8 text-pink-300 fill-pink-300 animate-bounce delay-200" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 md:mt-0 p-6 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-2">
          <p className="w-full text-left">© 2026 mais-valentine.me team. All rights reserved.</p>
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
