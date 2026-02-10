"use client";

import { useState, useEffect } from "react";
import { Heart, Search, Trash2, Plus, Lock, Users, Link as LinkIcon } from "lucide-react";

interface User {
  _id: string;
  userId: string;
  username: string;
  matchedUserId: string | null;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // User form states
  const [newUserId, setNewUserId] = useState("");
  const [newUsername, setNewUsername] = useState("");
  
  // Match form states
  const [matchUserId1, setMatchUserId1] = useState("");
  const [matchUserId2, setMatchUserId2] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      fetchUsers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.userId.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminAuth", "authenticated");
        setIsAuthenticated(true);
        setLoginUsername("");
        setLoginPassword("");
      } else {
        setLoginError(data.error || "Invalid credentials");
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

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newUserId || !newUsername) {
      setError("User ID and username are required");
      return;
    }

    if (!/^\d{4}$/.test(newUserId.trim())) {
      setError("User ID must be exactly 4 digits");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: newUserId.trim(),
          username: newUsername.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add user");
        return;
      }

      setSuccess("User added successfully!");
      setNewUserId("");
      setNewUsername("");
      fetchUsers();
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!matchUserId1 || !matchUserId2) {
      setError("Both user IDs are required");
      return;
    }

    if (matchUserId1 === matchUserId2) {
      setError("Cannot match a user with themselves");
      return;
    }

    try {
      const response = await fetch("/api/users/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId1: matchUserId1.trim(),
          userId2: matchUserId2.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create match");
        return;
      }

      setSuccess("Match created successfully!");
      setMatchUserId1("");
      setMatchUserId2("");
      fetchUsers();
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This will also remove any matches.")) {
      return;
    }

    try {
      const response = await fetch(`/api/users/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("User deleted successfully!");
        fetchUsers();
      } else {
        setError("Failed to delete user");
      }
    } catch {
      setError("An error occurred while deleting");
    }
  };

  const handleRemoveMatch = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this match?")) {
      return;
    }

    try {
      const response = await fetch("/api/users/match", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setSuccess("Match removed successfully!");
        fetchUsers();
      } else {
        setError("Failed to remove match");
      }
    } catch {
      setError("An error occurred while removing match");
    }
  };

  const getMatchedUsername = (matchedUserId: string | null) => {
    if (!matchedUserId) return null;
    const matched = users.find((u) => u.userId === matchedUserId);
    return matched ? matched.username : null;
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
            {/* Site name removed as requested */}
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
              Enter your credentials to access the admin panel
            </p>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Enter username"
                  disabled={loginLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Enter password"
                  disabled={loginLoading}
                  required
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
            {/* Site name removed as requested */}
          </h1>
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Panel: Manage Users & Matches
        </h1>

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

        {/* SECTION 1: Add Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-pink-400" />
            <h2 className="text-xl font-semibold text-gray-900">
              Section 1: Add Users/Accounts
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Add users with their 4-digit ID and username. Matches will be created in Section 2 below.
          </p>

          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="User ID (4 digits)"
                value={newUserId}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setNewUserId(value);
                }}
                maxLength={4}
                pattern="\d{4}"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="text"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </form>
        </div>

        {/* SECTION 2: Create Matches */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <LinkIcon className="w-6 h-6 text-pink-400" />
            <h2 className="text-xl font-semibold text-gray-900">
              Section 2: Create Matches
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Enter two user IDs to create a match between them.
          </p>

          <form onSubmit={handleCreateMatch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="User ID 1 (4 digits)"
                value={matchUserId1}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setMatchUserId1(value);
                }}
                maxLength={4}
                pattern="\d{4}"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <input
                type="text"
                placeholder="User ID 2 (4 digits)"
                value={matchUserId2}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setMatchUserId2(value);
                }}
                maxLength={4}
                pattern="\d{4}"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
              Create Match
            </button>
          </form>
        </div>

        {/* All Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Users
          </h2>

          {/* Search Bar */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by User ID or username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No users found" : "No users yet"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                      User ID
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                      Username
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                      Matched With
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const matchedUsername = getMatchedUsername(user.matchedUserId);
                    return (
                      <tr
                        key={user._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {user.userId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {user.matchedUserId ? (
                            <span className="text-green-600">
                              {user.matchedUserId} ({matchedUsername || "Unknown"})
                            </span>
                          ) : (
                            <span className="text-gray-400">Not matched</span>
                          )}
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          {user.matchedUserId && (
                            <button
                              onClick={() => handleRemoveMatch(user.userId)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded transition-colors"
                            >
                              Unmatch
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
