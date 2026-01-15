"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SellerNav from "../../SellerNav";

type Listing = {
  id: number;
  title: string;
  price: number;
  pickupLocation: string;
};

export default function MyMealListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/listing/getSellerListings",
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <SellerNav />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            My Meal Listings
          </h1>

          <button
            onClick={() => router.push("/seller/create_listing")}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 transition"
          >
            + Create New Listing
          </button>
        </div>

        {/* Loading State (optional) */}
        {loading && (
          <div className="text-center text-gray-500 py-20">
            Loading your listings…
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm py-20 px-6 flex flex-col items-center justify-center text-center">
            <p className="text-gray-600 mb-6">
              You haven&apos;t created any meal listings yet.
            </p>

            <button
              onClick={() => router.push("/seller/create_listing")}
              className="px-6 py-2 rounded-md text-white font-medium bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 transition"
            >
              Create Your First Listing
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && listings.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {listing.title}
                    </h2>
                    <span className="font-bold text-gray-900">
                      ${listing.price}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Pickup: {listing.pickupLocation}
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      View
                    </button>
                    <button className="flex-1 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
