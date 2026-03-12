"use client";

import { useState, useEffect } from "react";
import { Heart, Search, Plus, Lock, Download, RefreshCw, Trash2 } from "lucide-react";

interface Match {
  userId: string;
  username: string;
  class: string;
  matchedUserId: string;
  matchedUsername: string;
  matchedClass: string;
  challengeId: number;
}

const CHALLENGE_NAMES = [
  "Partner Reveal Selfie",
  "Compliment Exchange",
  "Teacher Photo Challenge",
  "Matching Pose",
  "School Landmark Tour",
  "Interview Challenge",
  "Matching Energy Video",
  "Creative Duo Photo",
  "Final Heart Photo",
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Form states for adding new match pair
  const [userId1, setUserId1] = useState("");
  const [username1, setUsername1] = useState("");
  const [class1, setClass1] = useState("");
  const [userId2, setUserId2] = useState("");
  const [username2, setUsername2] = useState("");
  const [class2, setClass2] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deploying, setDeploying] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const authToken = localStorage.getItem("adminAuth");
    if (authToken === "authenticated") {
      setIsAuthenticated(true);
    }
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMatches();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMatches(matches);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = matches.filter(
        (match) =>
          match.userId.toLowerCase().includes(query) ||
          match.username.toLowerCase().includes(query) ||
          match.matchedUserId.toLowerCase().includes(query) ||
          match.matchedUsername.toLowerCase().includes(query)
      );
      setFilteredMatches(filtered);
    }
  }, [searchQuery, matches]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminAuth", "authenticated");
        setIsAuthenticated(true);
        setLoginPassword("");
      } else {
        setLoginError(data.error || "Invalid password");
      }
    } catch {
      setLoginError("An error occurred. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/admin/matches");
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
        setFilteredMatches(data);
      }
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMatchPair = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!userId1 || !username1 || !class1 || !userId2 || !username2 || !class2) {
      setError("All fields are required");
      return;
    }

    if (!/^\d{4}$/.test(userId1.trim()) || !/^\d{4}$/.test(userId2.trim())) {
      setError("User IDs must be exactly 4 digits");
      return;
    }

    if (userId1 === userId2) {
      setError("Cannot match a user with themselves");
      return;
    }

    // Check if IDs already exist
    const existingIds = new Set(matches.map(m => m.userId));
    if (existingIds.has(userId1.trim()) || existingIds.has(userId2.trim())) {
      setError("One or both user IDs already exist");
      return;
    }

    // Randomly assign challenge (0-8, total 9 challenges)
    const challengeNum = Math.floor(Math.random() * 9);

    // Create new match pair (both directions)
    const newMatches = [
      ...matches,
      {
        userId: userId1.trim(),
        username: username1.trim(),
        class: class1.trim(),
        matchedUserId: userId2.trim(),
        matchedUsername: username2.trim(),
        matchedClass: class2.trim(),
        challengeId: challengeNum,
      },
      {
        userId: userId2.trim(),
        username: username2.trim(),
        class: class2.trim(),
        matchedUserId: userId1.trim(),
        matchedUsername: username1.trim(),
        matchedClass: class1.trim(),
        challengeId: challengeNum,
      },
    ];

    // Deploy to GitHub
    await deployMatches(newMatches);

    // Reset form
    setUserId1("");
    setUsername1("");
    setClass1("");
    setUserId2("");
    setUsername2("");
    setClass2("");
  };

  const handleDeleteMatchPair = async (userId: string) => {
    const match = matches.find(m => m.userId === userId);
    if (!match) return;

    if (!confirm(`Delete match pair: ${match.username} ↔ ${match.matchedUsername}?`)) {
      return;
    }

    // Remove both directions of the match
    const newMatches = matches.filter(
      m => !(m.userId === userId || m.userId === match.matchedUserId || 
             m.matchedUserId === userId || m.matchedUserId === match.matchedUserId)
    );

    await deployMatches(newMatches);
  };

  const deployMatches = async (newMatches: Match[]) => {
    setDeploying(true);
    setError("");
    setSuccess("");

    try {
      const password = prompt("Enter admin password to deploy:");
      if (!password) {
        setDeploying(false);
        return;
      }

      const response = await fetch("/api/matches/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matches: newMatches,
          adminPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`✅ Deployed successfully! ${data.matchCount} entries. Vercel will redeploy in ~1-2 minutes.`);
        setMatches(newMatches);
        setFilteredMatches(newMatches);
      } else {
        setError(data.error || "Failed to deploy");
      }
    } catch (err) {
      setError("An error occurred during deployment");
      console.error(err);
    } finally {
      setDeploying(false);
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(matches, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `matches-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const getUniquePairs = () => {
    const seen = new Set<string>();
    return matches.filter(match => {
      const pairKey = [match.userId, match.matchedUserId].sort().join('-');
      if (seen.has(pairKey)) return false;
      seen.add(pairKey);
      return true;
    });
  };

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-linear-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-b from-pink-50 to-white flex flex-col">
        <header className="p-6 flex items-center gap-3 border-b border-gray-200 bg-white">
          <div className="bg-pink-400 p-2 rounded-lg">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-xl font-semibold text-pink-400">
            Admin Panel
          </h1>
        </header>

        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-pink-100 p-4 rounded-full">
                <Lock className="w-12 h-12 text-pink-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Admin Login
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Enter admin password to manage matches
            </p>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder:text-gray-500 text-black"
                  placeholder="Enter admin password"
                  disabled={loginLoading}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  const uniquePairs = getUniquePairs();

  return (
    <div className="min-h-screen bg-linear-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-gray-200 bg-white">
        <button
          onClick={() => window.location.href = "/"}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="bg-pink-400 p-2 rounded-lg">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-xl font-semibold text-pink-400">
            Admin Panel - Static Matches
          </h1>
        </button>
        <div className="flex gap-2">
          <button
            onClick={exportToJSON}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ Static Mode:</strong> Matches are stored in <code className="bg-blue-100 px-1 rounded">data/matches.ts</code>.
            Changes deploy to GitHub and trigger Vercel rebuild (~1-2 min). Total: <strong>{matches.length} entries ({uniquePairs.length} pairs)</strong>
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {deploying && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Deploying to GitHub and triggering Vercel rebuild...
          </div>
        )}

        {/* Add Match Pair Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-6 h-6 text-pink-400" />
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Match Pair
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Creates both directions of the match with a randomly assigned challenge. Changes deploy to GitHub automatically.
          </p>

          <form onSubmit={handleAddMatchPair} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Person 1</label>
                <input
                  type="text"
                  placeholder="User ID (4 digits)"
                  value={userId1}
                  onChange={(e) => setUserId1(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  className="w-full px-4 py-2 border placeholder:text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
                />
                <input
                  type="text"
                  placeholder="Name (e.g., Amarbat.S)"
                  value={username1}
                  onChange={(e) => setUsername1(e.target.value)}
                  className="w-full px-4 py-2 border placeholder:text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
                />
                <input
                  type="text"
                  placeholder="Class (e.g., 26a)"
                  value={class1}
                  onChange={(e) => setClass1(e.target.value.toLowerCase())}
                  className="w-full px-4 py-2 border placeholder:text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Person 2</label>
                <input
                  type="text"
                  placeholder="User ID (4 digits)"
                  value={userId2}
                  onChange={(e) => setUserId2(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  className="w-full px-4 py-2 border placeholder:text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
                />
                <input
                  type="text"
                  placeholder="Name (e.g., Ninjin.B)"
                  value={username2}
                  onChange={(e) => setUsername2(e.target.value)}
                  className="w-full px-4 py-2 border placeholder:text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
                />
                <input
                  type="text"
                  placeholder="Class (e.g., 27d)"
                  value={class2}
                  onChange={(e) => setClass2(e.target.value.toLowerCase())}
                  className="w-full px-4 py-2 border placeholder:text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={deploying}
              className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Match Pair & Deploy
            </button>
          </form>
        </div>

        {/* All Match Pairs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Match Pairs ({uniquePairs.length})
          </h2>

          {/* Search Bar */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by User ID or username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : getUniquePairs().length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No matches found" : "No matches yet"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Person 1</th>
                    <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">↔</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Person 2</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Challenge</th>
                    <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getUniquePairs()
                    .filter(match => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return match.userId.toLowerCase().includes(q) ||
                             match.username.toLowerCase().includes(q) ||
                             match.matchedUserId.toLowerCase().includes(q) ||
                             match.matchedUsername.toLowerCase().includes(q);
                    })
                    .map((match) => (
                      <tr key={`${match.userId}-${match.matchedUserId}`} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium text-gray-900">{match.username}</div>
                          <div className="text-gray-500">{match.userId}</div>
                        </td>
                        <td className="text-center px-4 py-3">
                          <Heart className="w-4 h-4 text-pink-400 fill-pink-400 mx-auto" />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium text-gray-900">{match.matchedUsername}</div>
                          <div className="text-gray-500">{match.matchedUserId}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {match.challengeId}: {CHALLENGE_NAMES[match.challengeId]}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteMatchPair(match.userId)}
                            disabled={deploying}
                            className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
