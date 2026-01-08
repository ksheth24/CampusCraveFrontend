"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

export default function MyMealListingsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = React.useState(true);
  const [username, setUsername] = React.useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/check", {
          method: "GET",
          credentials: "include", // 🔥 REQUIRED for cookies
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        setUsername(data.username);
      } catch {
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const submit = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Logout failed");
      }
      
      // Force a full page reload to ensure auth state is re-checked
      window.location.href = "/";
      
    } catch (error: any) {
      console.error("Fetch error:", error);
      // Even on error, try to reload to clear any stale state
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* ================= HEADER ================= */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              
              {/* Logo */}
              <a href = "/">
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                🍜 CampusCrave
              </div>
              </a>
    
              {/* Nav Links */}
              <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                <button className="hover:text-gray-900 transition">Browse Meals</button>
                <button className="hover:text-gray-900 transition">My Orders</button>
                <button className="hover:text-gray-900 transition">My Listings</button>
                <button className="hover:text-gray-900 transition">Incoming Orders</button>
              </div>
    
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-3 rounded-full border border-gray-200 px-4 py-2 hover:bg-gray-50 transition"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                  {username?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {username}
                  </span>
                  <span className="text-gray-400 text-xs">▾</span>
                </button>
    
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-800">{username}</p>
                      <p className="text-xs text-gray-500">Seller</p>
                    </div>
    
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                      Seller Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                      Payouts
                    </button>
                    <button
                      onClick={submit}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            My Meal Listings
          </h1>

          <button
            onClick={() => router.push("/create_listing")}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 transition"
          >
            + Create New Listing
          </button>
        </div>

        {/* Empty State */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm py-20 px-6 flex flex-col items-center justify-center text-center">
          <p className="text-gray-600 mb-6">
            You haven&apos;t created any meal listings yet.
          </p>

          <button
            onClick={() => router.push("/create_listing")}
            className="px-6 py-2 rounded-md text-white font-medium bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 transition"
          >
            Create Your First Listing
          </button>
        </div>
      </main>
    </div>
  );
}
