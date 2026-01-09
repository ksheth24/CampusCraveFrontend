"use client";

import Link from "next/link";
import { useState } from "react";
import SignedInNav from "./SignedInNav";

type SignedInHomeProps = {
  user: string;
}

export default function SignedInHome({user} : SignedInHomeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
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

      {/* NAVBAR */}
      <SignedInNav />

      {/* PAGE CONTENT */}
      <div className="px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* HERO */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-10 py-12 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              Welcome to CampusCrave, {user}
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              Buy and sell delicious home-cooked meals on your campus
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
                <p className="text-sm font-semibold text-teal-500 mb-1">
                  🥗 For Buyers
                </p>
                <p className="text-gray-600 mb-5">
                  Discover amazing home-cooked meals near you
                </p>
                <a href = "/signedInBrowse">
                <button className="px-6 py-3 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition">
                  Browse Meals
                </button>
                </a>
              </div>

              <div className="rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
                <p className="text-sm font-semibold text-pink-500 mb-1">
                  👩‍🍳 For Sellers
                </p>
                <p className="text-gray-600 mb-5">
                  Share your culinary creations and earn money
                </p>
                <a href = "/verify_seller">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:opacity-90 transition">
                  Get Verified
                </button>
                </a>
              </div>
            </div>
          </div>
          {/* HOW IT WORKS */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-10 py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="rounded-xl bg-gray-50 p-5">
                <p className="font-semibold text-gray-800 mb-1">1. Browse</p>
                <p className="text-gray-600">
                  Explore meals listed by students near you
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="font-semibold text-gray-800 mb-1">2. Connect</p>
                <p className="text-gray-600">
                  Message sellers to arrange pickup
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="font-semibold text-gray-800 mb-1">3. Enjoy</p>
                <p className="text-gray-600">
                  Pick up your meal and enjoy!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
