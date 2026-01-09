"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import SellerNav from "../SellerNav";

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
      <SellerNav />

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
