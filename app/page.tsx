"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

export default function Home() {
  const [valentineId, setValentineId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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

      // Navigate to result page with match name
      router.push(`/result?name=${encodeURIComponent(data.matchedName)}`);
    } catch (err) {
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-center text-2xl tracking-widest"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-300 hover:bg-pink-400 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Revealing..." : "Reveal My Match"}
              <Heart className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            If you have questions, check your email for details.
          </p>
        </div>
      </main>
      {/* Footer */}
      <footer className="p-6 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-center sm:text-left w-full sm:w-auto">© 2026 Valentine.me team. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
