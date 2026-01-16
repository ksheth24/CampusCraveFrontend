"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ListingInfo = {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  price: number;
  pickupLocation: string;
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<ListingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/listing/get/${id}`, {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch listing");
        }

        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <div className="animate-spin h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Listing not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 px-6 py-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* IMAGE / HERO */}
        <div className="relative">
          <img
            src="/placeholder-meal.jpg"
            alt="Meal"
            className="w-full h-72 object-cover"
          />
  
          {/* Price Badge */}
          <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow text-lg font-bold text-orange-500">
            ${listing.price.toFixed(2)}
          </div>
        </div>
  
        {/* CONTENT */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT: MAIN INFO */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {listing.title}
            </h1>
  
            <p className="mt-4 text-gray-600 leading-relaxed">
              {listing.description}
            </p>
  
            {/* INGREDIENTS */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-800 mb-2">
                Ingredients
              </h3>
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {listing.ingredients}
              </div>
            </div>
          </div>
  
          {/* RIGHT: META + CTA */}
          <div className="space-y-6">
            
            {/* PICKUP LOCATION */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Pickup Location
              </p>
              <p className="text-sm font-medium text-gray-800">
                📍 {listing.pickupLocation}
              </p>
            </div>
  
            {/* ACTION */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-pink-50 p-5">
              <button
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 text-white font-semibold shadow-md hover:opacity-90 transition"
              >
                Place Order
              </button>
  
              <p className="mt-3 text-xs text-center text-gray-500">
                You’ll confirm quantity & pickup time next
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
