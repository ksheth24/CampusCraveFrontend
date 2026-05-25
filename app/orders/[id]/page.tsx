"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import SignedInNav from "@/app/SignedInNav";
import SellerNav from "@/app/SellerNav";

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

const API_BASE = "http://localhost:8081";

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  PENDING: { color: "#92400e", bg: "#fef3c7", border: "#fde68a" },
  CONFIRMED: { color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
  ACCEPTED: { color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
  RESERVED: { color: "#7c2d12", bg: "#fff7ed", border: "#fed7aa" },
  READY: { color: "#065f46", bg: "#ecfdf5", border: "#a7f3d0" },
  COMPLETED: { color: "#374151", bg: "#f3f4f6", border: "#e5e7eb" },
  CANCELLED: { color: "#991b1b", bg: "#fef2f2", border: "#fecaca" },
  CANCELED: { color: "#991b1b", bg: "#fef2f2", border: "#fecaca" },
  REJECTED: { color: "#991b1b", bg: "#fef2f2", border: "#fecaca" },
  EXPIRED: { color: "#52525b", bg: "#f4f4f5", border: "#e4e4e7" },
};

function statusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusStyle(status: string) {
  return STATUS_STYLE[status] ?? { color: "#374151", bg: "#f9fafb", border: "#e5e7eb" };
}

function formatDateTime(value: string) {
  if (!value) return "Not available";

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value ?? 0);
}

function photoUrl(photo: string | null) {
  if (!photo) return null;
  if (/^(https?:|data:|blob:)/.test(photo)) return photo;
  if (photo.startsWith("/")) return `${API_BASE}${photo}`;
  return `${API_BASE}/${photo}`;
}

export default function BuyerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<ReservationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerifiedSeller, setIsVerifiedSeller] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/reservation/myReservations`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load order");

        const reservations = (await res.json()) as ReservationInfo[];
        const match = reservations.find((item) => String(item.id) === String(id));
        if (!match) throw new Error("Order not found");

        setReservation(match);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load this order.");
      } finally {
        setLoading(false);
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
        setIsVerifiedSeller(Boolean(data.verified));
      } catch {
        setIsVerifiedSeller(false);
      }
    };

    loadOrder();
    checkVerifiedSeller();
  }, [id]);

  const imageSrc = reservation ? photoUrl(reservation.listingPhoto) : null;
  const style = reservation ? statusStyle(reservation.status) : statusStyle("PENDING");

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #fff5f0 0%, #fff0f5 50%, #fce8f3 100%)" }}
    >
      {isVerifiedSeller ? <SellerNav /> : <SignedInNav />}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:bg-orange-50 hover:text-orange-600 transition"
          >
            <span aria-hidden="true">←</span>
            Back
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Order{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #f97316, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Review
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review your reservation details and pickup information.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-24">
            <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-orange-400 animate-spin" />
            <p className="text-sm text-gray-500">Loading order...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-red-300" />
            <div className="py-12 px-6 text-center">
              <p className="font-medium text-red-600">{error}</p>
            </div>
          </div>
        )}

        {!loading && reservation && (
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
            <section className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
              <div className="p-5">
                <div className="relative h-72 rounded-xl overflow-hidden bg-orange-50">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={reservation.listingTitle}
                      width={900}
                      height={500}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-orange-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {reservation.listingTitle}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Sold by <span className="font-semibold text-gray-700">{reservation.sellerUsername}</span>
                    </p>
                  </div>

                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                    style={{ color: style.color, background: style.bg, borderColor: style.border }}
                  >
                    {statusLabel(reservation.status)}
                  </span>
                </div>

                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  <InfoTile label="Reserved" value={formatDateTime(reservation.reservedAt)} />
                  <InfoTile label="Last Updated" value={formatDateTime(reservation.updatedAt)} />
                  <InfoTile label="Pickup Location" value={reservation.pickupLocation || "On campus"} />
                  <InfoTile label="Order Number" value={`#${reservation.id}`} />
                </div>
              </div>
            </section>

            <aside className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden h-fit">
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

                <div className="mt-5 space-y-4">
                  <SummaryRow label="Meal" value={reservation.listingTitle} />
                  <SummaryRow label="Seller" value={reservation.sellerUsername} />
                  <SummaryRow label="Status" value={statusLabel(reservation.status)} />
                </div>

                <div className="my-6 border-t border-gray-100" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Total</span>
                  <span className="text-3xl font-extrabold text-orange-500">
                    {formatCurrency(reservation.listingPrice)}
                  </span>
                </div>

                <Link
                  href={`/listing/${reservation.listingId}`}
                  className="mt-6 block w-full rounded-xl border border-gray-200 py-3 text-center text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  View Original Listing
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-orange-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase text-orange-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800 text-right">{value}</span>
    </div>
  );
}
