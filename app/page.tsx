"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY = "valentine_requests";

export default function Home() {
  const [valentineId, setValentineId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const router = useRouter();

  const checkAndUpdateCooldown = useCallback(() => {
    const storedRequests = localStorage.getItem(STORAGE_KEY);
    const requests = storedRequests ? JSON.parse(storedRequests) : [];
    const now = Date.now();

    // Remove requests older than 30 minutes
    const recentRequests = requests.filter(
      (timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
      const oldestRequest = recentRequests[0];
      const timeUntilExpiry = RATE_LIMIT_WINDOW_MS - (now - oldestRequest);
      setCooldownRemaining(Math.max(0, timeUntilExpiry));
    } else {
      setCooldownRemaining(0);
    }
  }, []);

  const recordRequest = () => {
    const storedRequests = localStorage.getItem(STORAGE_KEY);
    const requests = storedRequests ? JSON.parse(storedRequests) : [];
    const now = Date.now();

    // Keep only recent requests
    const recentRequests = requests.filter(
      (timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    recentRequests.push(now);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentRequests));
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Load request history and check cooldown on mount
  useEffect(() => {
    checkAndUpdateCooldown();
    
    // Update cooldown timer every second
    const interval = setInterval(checkAndUpdateCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check rate limit
    if (cooldownRemaining > 0) {
      setError(`Please try again in ${formatTime(cooldownRemaining)}`);
      return;
    }

    if (!valentineId.trim()) {
      setError("Please enter your Valentine ID");
      return;
    }

    if (!/^\d{4}$/.test(valentineId.trim())) {
      setError("Valentine ID must be exactly 4 digits (e.g., 0001)");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/matches/${valentineId.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to find your match");
        setLoading(false);
        return;
      }

      // Record the successful request
      recordRequest();
      checkAndUpdateCooldown();

      // Store match in sessionStorage to prevent direct URL access
      sessionStorage.setItem("valentineMatch", data.matchedName);

      // Navigate to result page
      router.push("/result");
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-pink-50 to-white flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center gap-3">
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
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover Your
              <br />
              <span className="text-pink-400">Valentine Match</span>
            </h2>
            <p className="text-gray-600">
              It&apos;s time for the big reveal! Enter your 4-digit student code
              to discover your match.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter your 4-digit ID (e.g. 0380)"
                value={valentineId}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setValentineId(value);
                }}
                maxLength={4}
                pattern="\d{4}"
                className="w-full placeholder:text-gray-500 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-center text-xl md:text-2xl tracking-widest text-black"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || cooldownRemaining > 0}
              className="w-full bg-pink-300 hover:bg-pink-400 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  Revealing
                  <span className="inline-flex gap-0.5 -ml-1">
                    <span className="dot-pulse-1">.</span>
                    <span className="dot-pulse-2">.</span>
                    <span className="dot-pulse-3">.</span>
                  </span>
                </>
              ) : (
                <>
                  Reveal My Match
                  <Heart className="w-5 h-5" />
                </>
              )}
            </button>

            {cooldownRemaining > 0 && (
              <div className="text-center text-sm text-pink-400 font-semibold mt-2">
                Try again in {formatTime(cooldownRemaining)}
              </div>
            )}
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            If you have questions, check your email for details.
          </p>
        </div>
      </main>
      {/* Footer */}
      <footer className="mt-16 md:mt-0 p-6 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-center sm:text-left w-full sm:w-auto">© 2026 my-valentine.tech team. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
