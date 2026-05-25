"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SellerNav from "../../SellerNav";

type Listing = {
  id: number;
  title: string;
  price: number;
  pickupLocation: string;
  photo?: string | null;
  imageUrl?: string | null;
  listingPhoto?: string | null;
};

const API_BASE = "http://localhost:8081";

function listingImageUrl(listing: Listing) {
  const image = listing.photo ?? listing.imageUrl ?? listing.listingPhoto;
  if (!image) return null;
  if (/^(https?:|data:|blob:)/.test(image)) return image;
  if (image.startsWith("/")) return `${API_BASE}${image}`;
  return `${API_BASE}/${image}`;
}

export default function MyMealListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(
          "http://localhost:8081/api/listing/getSellerListings",
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
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #fff5f0 0%, #fff0f5 50%, #fce8f3 100%)" }}
    >
      <SellerNav />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2"
              style={{ background: "#fff3e0", color: "#f97316" }}
            >
              Seller Portal
            </span>
            <h1 className="text-3xl font-bold text-gray-900">
              My{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #f97316, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Meal Listings
              </span>
            </h1>
          </div>

          <button
            onClick={() => router.push("/seller/create_listing")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }}
          >
            + Create New Listing
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-8 h-8 rounded-full border-2 border-transparent border-t-orange-400 animate-spin"
              />
              <p className="text-sm text-gray-400">Loading your listings…</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
            <div className="py-24 px-6 flex flex-col items-center justify-center text-center">
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: "#fff3e0" }}
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#f97316" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium mb-1">No listings yet</p>
              <p className="text-sm text-gray-400 mb-6">
                You haven&apos;t created any meal listings yet. Start selling today!
              </p>
              <button
                onClick={() => router.push("/seller/create_listing")}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }}
              >
                Create Your First Listing →
              </button>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && listings.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
  const imageSrc = listingImageUrl(listing);

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }}
      />

      <div className="relative h-44 bg-orange-50">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={listing.title}
            width={480}
            height={280}
            unoptimized
            className="h-full w-full object-cover group-hover:scale-[1.02] transition"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-sm text-orange-400">
            No image
          </div>
        )}
        <span
          className="absolute top-3 right-3 text-sm font-bold px-3 py-1 rounded-full shadow-sm"
          style={{ background: "#fff", color: "#f97316" }}
        >
          ${listing.price}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h2 className="text-base font-semibold text-gray-900 leading-snug">
            {listing.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {listing.pickupLocation}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/listing/${listing.id}`}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            View
          </Link>
          <Link
            href={`/seller/edit_listing/${listing.id}`}
            className="flex-1 rounded-xl px-4 py-2 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }}
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
