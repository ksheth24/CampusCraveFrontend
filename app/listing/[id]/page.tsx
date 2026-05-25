"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import SignedInNav from "@/app/SignedInNav";
import SignedOutNav from "@/app/SignedOutNav";
import SellerNav from "@/app/SellerNav";

const API_BASE = "http://localhost:8081";

type ListingInfo = {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  price: number;
  pickupLocation: string;
  photo: string;
};

type ReservationInfo = {
  id: number;
  listingId: number;
  listingTitle: string;
  listingPhoto: string | null;
  listingPrice: number;
  pickupLocation: string;
  buyerId: number;
  buyerUsername: string;
  sellerId: number;
  sellerUsername: string;
  status: string;
  reservedAt: string;
  updatedAt: string;
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<ListingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [isVerifiedSeller, setIsVerifiedSeller] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [reservation, setReservation] = useState<ReservationInfo | null>(null);
  const [reservationError, setReservationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/listing/get/${id}`, {
          method: "GET",
          credentials: "include",
        });
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
        const res = await fetch(`${API_BASE}/api/auth/check`, {
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
        const res = await fetch(`${API_BASE}/api/user/verifiedSeller`, {
          method: "GET",
          credentials: "include",
        });
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

  const createReservation = async () => {
    if (!listing) return;

    if (!username) {
      setReservationError("Please log in before reserving this meal.");
      return;
    }

    setReserving(true);
    setReservationError(null);
    setReservation(null);

    try {
      const res = await fetch(`${API_BASE}/api/reservation/create/${listing.id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to create reservation");
      }

      setReservation(await res.json());
    } catch (err) {
      setReservationError(
        err instanceof Error && err.message
          ? err.message
          : "Could not reserve this meal. Please try again."
      );
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #fff5f0 0%, #fff0f5 50%, #fce8f3 100%)" }}
      >
        <div className="animate-spin h-7 w-7 border-2 border-orange-500 border-t-transparent rounded-full" />
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

  const ingredients = listing.ingredients
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <main
      className="min-h-screen text-gray-900"
      style={{ background: "linear-gradient(135deg, #fff5f0 0%, #fff0f5 50%, #fce8f3 100%)" }}
    >
      {username ? (
        isVerifiedSeller ? <SellerNav /> : <SignedInNav />
      ) : (
        <SignedOutNav />
      )}

      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start">
          <div className="rounded-2xl bg-white border border-orange-100 shadow-sm overflow-hidden">
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
            <div className="p-4">
              <div className="relative h-[320px] sm:h-[420px] overflow-hidden rounded-xl bg-orange-50">
                {listing.photo ? (
                  <Image
                    src={listing.photo}
                    alt={listing.title}
                    width={1000}
                    height={700}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-orange-400">
                    No image
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <span
              className="inline-block rounded-full px-4 py-1 text-sm font-semibold mb-4"
              style={{ background: "#fff3e0", color: "#f97316" }}
            >
              Homemade meal
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              {listing.title}
            </h1>

            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              Fresh food from a student seller, ready for campus pickup.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mt-8">
              <InfoTile label="Price" value={`$${listing.price.toFixed(2)}`} />
              <InfoTile label="Pickup" value={listing.pickupLocation || "On campus"} />
              <InfoTile label="Seller" value="Verified Student" />
            </div>

            <div className="mt-8 rounded-2xl bg-white border border-orange-100 shadow-sm overflow-hidden">
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Reserve this meal</p>
                    <p className="text-2xl font-extrabold" style={{ color: "#f97316" }}>
                      ${listing.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-semibold bg-orange-50 text-orange-500">
                    Campus pickup
                  </span>
                </div>

                <button
                  onClick={createReservation}
                  disabled={reserving || Boolean(reservation)}
                  className="mt-6 w-full py-4 rounded-xl font-semibold text-white
                             bg-gradient-to-r from-orange-500 to-pink-500
                             hover:scale-[1.02] active:scale-[0.99]
                             transition shadow-md disabled:opacity-60 disabled:hover:scale-100"
                >
                  {reserving ? "Reserving..." : reservation ? "Meal Reserved" : "Reserve Meal"}
                </button>

                {reservation && (
                  <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
                    Reservation created. Status:{" "}
                    <span className="font-semibold">{reservation.status}</span>
                  </div>
                )}

                {reservationError && (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                    {reservationError}
                  </div>
                )}

                <p className="mt-4 text-xs text-center text-gray-500">
                  You will coordinate pickup after reserving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16 grid lg:grid-cols-[1.4fr_0.8fr] gap-6">
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-1 w-8 rounded-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
              <h2 className="text-2xl font-bold text-gray-900">About this meal</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {listing.description}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-1 w-8 rounded-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
              <h2 className="text-2xl font-bold text-gray-900">Ingredients</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {ingredients.length > 0 ? (
                ingredients.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-gray-700"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No ingredients listed.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white border border-orange-100 shadow-sm p-4">
      <p className="text-xs font-semibold uppercase text-gray-400">{label}</p>
      <p className="mt-1 font-bold text-gray-900 break-words">{value}</p>
    </div>
  );
}
