"use client";

import React, { useEffect, useState } from "react";
import SignedInNav from "../SignedInNav";
import SignedOutNav from "../SignedOutNav";
import SellerNav from "../SellerNav";
import { useRouter } from "next/navigation";


type Listing = {
  id: number;
  title: string;
  price: number;
  pickupLocation: string;
};

export default function BrowsePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [isVerifiedSeller, setIsVerifiedSeller] = useState<boolean>(false);


  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/listing/getListings");
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/check", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUsername(data.username);
      } catch {
        setUsername(null);
      }
    };

    const checkVerifiedSeller = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/user/verifiedSeller", {
          method: "GET",
          credentials: "include", // 🔥 REQUIRED for cookies
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        setIsVerifiedSeller(data.verified);
      } catch {
        setIsVerifiedSeller(false);
      } finally {
        setLoading(false);
      }
    };
    checkVerifiedSeller();
    checkAuth();
    fetchListings();
  }, []);

  const submit = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <div className="animate-spin h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* ================= NAVBAR ================= */}
      {!username ? (
    <SignedOutNav />
  ) : isVerifiedSeller ? (
    <SellerNav />
  ) : (
    <SignedInNav />
  )}


      {/* ================= CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Browse Meals
          </h1>
          <p className="mt-2 text-gray-600">
            Fresh, homemade meals from students near you
          </p>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="text-gray-600 text-center py-20">
            No meals available right now.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  return (
    <div 
    onClick={() => router.push(`/listing/${listing.id}`)}
    className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img
          src="/placeholder-meal.jpg"
          alt="Meal"
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-orange-500 shadow">
          ${listing.price.toFixed(2)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 leading-tight">
          {listing.title}
        </h2>

        <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
          📍 {listing.pickupLocation}
        </p>
      </div>
    </div>
  );
}
