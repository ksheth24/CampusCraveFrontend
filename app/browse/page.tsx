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
  photo: string;
};

export default function BrowsePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [isVerifiedSeller, setIsVerifiedSeller] = useState<boolean>(false);''


  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/listing/getListings");
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
        const res = await fetch("http://localhost:8081/api/auth/check", {
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
        const res = await fetch("http://localhost:8081/api/user/verifiedSeller", {
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
      await fetch("http://localhost:8081/api/auth/logout", {
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
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-[#FFF8F3] overflow-hidden">
      {/* background blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#FF6A3D]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#FF2F92]/20 blur-3xl" />

      {!username ? (
        <SignedOutNav />
      ) : isVerifiedSeller ? (
        <SellerNav />
      ) : (
        <SignedInNav />
      )}

      <div className="relative max-w-7xl mx-auto px-6 py-14">
        {/* ================= HEADER ================= */}
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Browse Meals
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl">
            Fresh, homemade meals cooked by students near you.
            Pickup on campus — no delivery fees.
          </p>

          {/* SEARCH + FILTER BAR */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <input
              placeholder="Search meals, cuisines, or sellers…"
              className="flex-1 rounded-2xl px-5 py-4 border border-gray-200 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/50"
            />

            <select className="rounded-2xl px-5 py-4 border border-gray-200 shadow-sm">
              <option>All Locations</option>
              <option>Student Center</option>
              <option>Tech Square</option>
              <option>North Ave</option>
            </select>

            <select className="rounded-2xl px-5 py-4 border border-gray-200 shadow-sm">
              <option>Any Price</option>
              <option>$</option>
              <option>$$</option>
              <option>$$$</option>
            </select>
          </div>
        </header>

        {/* ================= GRID ================= */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((meal) => (
            <div
              key={meal.id}
  onClick={() => router.push(`/listing/${meal.id}`)}
  className="group cursor-pointer rounded-3xl bg-white shadow-md hover:shadow-xl transition overflow-hidden"
            >
              {/* IMAGE */}
              <div className="relative h-56 bg-gray-200">
                {meal.photo ? (
                  <img
                    src={meal.photo}
                    alt={meal.title}
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}

                {/* PRICE BADGE */}
                <span className="absolute top-4 right-4 rounded-full bg-white px-4 py-1.5
                                 text-sm font-bold text-[#FF6A3D] shadow">
                  ${meal.price.toFixed(2)}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h3 className="text-lg font-semibold leading-tight">
                  {meal.title}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <span>📍</span>
                  <span>{meal.pickupLocation || "On campus"}</span>
                </div>

                {/* FOOTER */}
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    ⭐ 4.8 • Student Seller
                  </span>

                  <button
                    className="rounded-xl px-4 py-2 text-sm font-semibold
                               bg-gradient-to-r from-[#FF6A3D] to-[#FF2F92]
                               text-white hover:scale-[1.03] transition"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* EMPTY STATE */}
          {listings.length === 0 && (
            <div className="col-span-full text-center py-32 text-gray-500">
              <p className="text-lg font-semibold">No meals found</p>
              <p className="mt-2">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
