"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SignedInNav from "@/app/SignedInNav";
import SignedOutNav from "@/app/SignedOutNav";
import SellerNav from "@/app/SellerNav";

type ListingInfo = {
  id: number;
  title: string;
  description: string;
  ingredients: string; // comma-separated string
  price: number;
  pickupLocation: string;
  photo: string;
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<ListingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [isVerifiedSeller, setIsVerifiedSeller] = useState<boolean>(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/listing/get/${id}`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch listing");
        setListing(await res.json());
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
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUsername(data.username);
      } catch {
        setUsername(null);
      }
    };

    const checkVerifiedSeller = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/user/verifiedSeller",
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setIsVerifiedSeller(data.verified);
      } catch {
        setIsVerifiedSeller(false);
      }
    };

    fetchListing();
    checkAuth();
    checkVerifiedSeller();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F3]">
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
    <main className="min-h-screen bg-[#FFF8F3]">
      {/* ================= NAV ================= */}
      {username ? (
        isVerifiedSeller ? <SellerNav /> : <SignedInNav />
      ) : (
        <SignedOutNav />
      )}

      {/* ================= HERO IMAGE ================= */}
      <section className="relative max-w-7xl mx-auto px-6 pt-10">
        <div className="relative overflow-hidden rounded-[32px] shadow-2xl">
          <img
            src={listing.photo}
            alt={listing.title}
            className="h-[420px] w-full object-cover"
          />

          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          {/* PRICE BADGE */}
          <div className="absolute top-6 right-6 rounded-full bg-white px-5 py-2 font-bold text-lg text-[#FF6A3D] shadow">
            ${listing.price.toFixed(2)}
          </div>

          {/* TITLE OVER IMAGE */}
          <div className="absolute bottom-6 left-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow">
              {listing.title}
            </h1>
            <p className="mt-1 text-white/90">
              Homemade • Student Seller
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-[2fr_1fr] gap-12">
        {/* ========== LEFT COLUMN ========== */}
        <div>
          {/* DESCRIPTION */}
          <div className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">
              About this meal
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* INGREDIENTS */}
          <div className="mt-8 bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">
              Ingredients
            </h2>

            <div className="flex flex-wrap gap-3">
              {listing.ingredients
                .split(",")
                .map((item, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-[#FFF3EA] px-4 py-2 text-sm font-semibold text-gray-700"
                  >
                    {item.trim()}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* ========== RIGHT COLUMN (STICKY CTA) ========== */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* PRICE */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">
                Price
              </span>
              <span className="text-3xl font-extrabold text-[#FF6A3D]">
                ${listing.price.toFixed(2)}
              </span>
            </div>

            {/* PICKUP LOCATION */}
            <div className="mt-6 rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">
                Pickup Location
              </p>
              <p className="font-semibold">
                📍 {listing.pickupLocation}
              </p>
            </div>

            {/* SELLER INFO */}
            <div className="mt-6 rounded-2xl bg-[#FFF8F3] p-4">
              <p className="text-sm text-gray-500">
                Seller
              </p>
              <p className="font-semibold">
                ⭐ 4.8 • Verified Student
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => alert("wire order / chat logic")}
              className="mt-8 w-full py-4 rounded-2xl font-semibold text-white
                         bg-gradient-to-r from-[#FF6A3D] to-[#FF2F92]
                         hover:scale-[1.02] active:scale-[0.99]
                         transition shadow-lg"
            >
              Reserve Meal
            </button>

            <p className="mt-4 text-xs text-center text-gray-500">
              You’ll coordinate pickup after reserving.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
