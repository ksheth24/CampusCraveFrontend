"use client";

import { useState } from "react";
import SellerNav from "./SellerNav";
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

type SignedInHomeProps = {
    user: string;
  }

export default function SellerSignedInHome({user} : SignedInHomeProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
    
          {/* NAVBAR (SAME STYLE AS USER HOME) */}
          <SellerNav/>
    
          {/* PAGE CONTENT */}
          <main className="px-6 py-12">
            <div className="max-w-6xl mx-auto space-y-10">
    
              {/* HERO */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-10 py-12 text-center">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                  Seller Dashboard
                </h1>
    
                <p className="mt-4 text-gray-600 text-lg">
                  Manage your listings and fulfill incoming orders
                </p>
    
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
                    <p className="text-sm font-semibold text-teal-500 mb-1">
                      📦 My Listings
                    </p>
                    <p className="text-gray-600 mb-5">
                      Create, edit, or pause your meal listings
                    </p>
                    <a href = "/seller_dashboard">
                    <button className="px-6 py-3 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition">
                      Manage Listings
                    </button>
                    </a>
                  </div>
    
                  <div className="rounded-xl border border-gray-100 p-6 hover:shadow-md transition">
                    <p className="text-sm font-semibold text-pink-500 mb-1">
                      🔔 Incoming Orders
                    </p>
                    <p className="text-gray-600 mb-5">
                      Review and prepare meals for pickup
                    </p>
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:opacity-90 transition">
                      View Orders
                    </button>
                  </div>
                </div>
              </div>
    
              {/* QUICK STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
                  <p className="text-sm text-gray-500">Active Listings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">3</p>
                </div>
    
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
                  <p className="text-sm text-gray-500">Incoming Orders</p>
                  <p className="text-3xl font-bold text-orange-500 mt-1">2</p>
                </div>
    
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
                  <p className="text-sm text-gray-500">Total Earnings</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">$128</p>
                </div>
              </div>
    
            </div>
          </main>
        </div>
      );
}
