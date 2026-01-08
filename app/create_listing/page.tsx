"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {useEffect } from "react";


export default function CreateListingPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [price, setPrice] = useState("");
  const [pickUpLocation, setPickUpLocation]  = useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = React.useState<string | null>(null);


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
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          ingredients, 
          price, 
          pickUpLocation, 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Listing Creation Failed");
      }

      if (response.ok) {
        router.push("/");
      }
      
    } catch (error: any) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
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

      {/* ================= PAGE CONTENT ================= */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Create New Meal Listing
          </h1>

          <form 
          className="space-y-6"
          onSubmit={(e) => {
          e.preventDefault(); 
          submit();
          }}
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingredients
              </label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                List main ingredients
              </p>
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo
              </label>
              <input
                type="file"
                className="block w-full text-sm text-gray-600
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-medium
                           file:bg-gray-100 file:text-gray-700
                           hover:file:bg-gray-200"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Price in USD</p>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup location
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={pickUpLocation}
                onChange={(e) => setPickUpLocation(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a descriptive location (e.g., "Main Library, 2nd Floor")
              </p>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">Is available</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded-md font-medium hover:bg-teal-600 transition"
            >
              Create Listing
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
