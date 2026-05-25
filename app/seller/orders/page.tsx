"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SellerNav from "../../SellerNav";

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
const SELLER_STATUS_OPTIONS = [
  "RESERVED",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
];
const SELLER_RESERVATION_ENDPOINTS = [
  `${API_BASE}/api/reservations/sellerReservations`,
  `${API_BASE}/api/reservation/sellerReservations`,
  `${API_BASE}/api/sellerReservations`,
];

const ACTIVE_STATUSES = new Set(["PENDING", "CONFIRMED", "ACCEPTED", "RESERVED", "PREPARING", "READY", "READY_FOR_PICKUP"]);
const CLOSED_STATUSES = new Set([
  "COMPLETED",
  "CANCELLED",
  "CANCELED",
  "CANCELLED_BY_BUYER",
  "CANCELLED_BY_SELLER",
  "REJECTED",
  "EXPIRED",
]);

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  PENDING: { color: "#92400e", bg: "#fef3c7", border: "#fde68a" },
  CONFIRMED: { color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
  ACCEPTED: { color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
  RESERVED: { color: "#7c2d12", bg: "#fff7ed", border: "#fed7aa" },
  PREPARING: { color: "#6d28d9", bg: "#f5f3ff", border: "#ddd6fe" },
  READY: { color: "#065f46", bg: "#ecfdf5", border: "#a7f3d0" },
  READY_FOR_PICKUP: { color: "#065f46", bg: "#ecfdf5", border: "#a7f3d0" },
  COMPLETED: { color: "#374151", bg: "#f3f4f6", border: "#e5e7eb" },
  CANCELLED: { color: "#991b1b", bg: "#fef2f2", border: "#fecaca" },
  CANCELED: { color: "#991b1b", bg: "#fef2f2", border: "#fecaca" },
  CANCELLED_BY_BUYER: { color: "#991b1b", bg: "#fef2f2", border: "#fecaca" },
  CANCELLED_BY_SELLER: { color: "#991b1b", bg: "#fef2f2", border: "#fecaca" },
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

function isClosed(status: string) {
  return CLOSED_STATUSES.has(status);
}

function isActive(status: string) {
  return ACTIVE_STATUSES.has(status) || !isClosed(status);
}

function formatDateTime(value: string) {
  if (!value) return "Not available";

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
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

async function fetchSellerReservations() {
  let lastError: Error | null = null;

  for (const endpoint of SELLER_RESERVATION_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, { credentials: "include" });
      if (!res.ok) {
        lastError = new Error(`Request failed: ${res.status}`);
        continue;
      }

      return (await res.json()) as ReservationInfo[];
    } catch (err) {
      lastError = err instanceof Error ? err : new Error("Request failed");
    }
  }

  throw lastError ?? new Error("Unable to load reservations");
}

async function updateReservationStatus(reservationId: number, status: string) {
  const res = await fetch(`${API_BASE}/api/reservation/${reservationId}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || "Failed to update reservation status");
  }

  return (await res.json()) as ReservationInfo;
}

export default function SellerOrdersPage() {
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [tab, setTab] = useState<"active" | "past">("active");

  const loadReservations = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchSellerReservations();
      setReservations(data);
    } catch {
      setError("Could not load seller reservations. Please make sure the backend is running on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleStatusUpdate = async (reservationId: number, status: string) => {
    setUpdatingId(reservationId);
    setStatusError(null);

    try {
      const updated = await updateReservationStatus(reservationId, status);
      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === reservationId ? updated : reservation
        )
      );
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "Could not update this reservation.");
    } finally {
      setUpdatingId(null);
    }
  };

  const activeReservations = useMemo(
    () => reservations.filter((reservation) => isActive(reservation.status)),
    [reservations]
  );

  const pastReservations = useMemo(
    () => reservations.filter((reservation) => isClosed(reservation.status)),
    [reservations]
  );

  const shownReservations = tab === "active" ? activeReservations : pastReservations;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #fff5f0 0%, #fff0f5 50%, #fce8f3 100%)" }}
    >
      <SellerNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2"
              style={{ background: "#fff3e0", color: "#f97316" }}
            >
              Seller Portal
            </span>
            <h1 className="text-3xl font-bold text-gray-900">
              Incoming{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #f97316, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Orders
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track reservations buyers have placed for your listings.
            </p>
          </div>

          <button
            onClick={loadReservations}
            disabled={loading}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-orange-100 hover:bg-orange-50 transition disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        <div className="flex gap-1 bg-white border border-orange-100 rounded-xl p-1 mb-6 w-fit shadow-sm">
          {[
            { key: "active" as const, label: "Active", count: activeReservations.length },
            { key: "past" as const, label: "Past", count: pastReservations.length },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={
                tab === item.key
                  ? { background: "linear-gradient(90deg, #f97316, #ec4899)", color: "#fff" }
                  : { color: "#6b7280" }
              }
            >
              {item.label}
              <span
                className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: tab === item.key ? "rgba(255,255,255,0.25)" : "#fff3e0",
                  color: tab === item.key ? "#fff" : "#f97316",
                }}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {statusError && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {statusError}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3 py-24">
            <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-orange-400 animate-spin" />
            <p className="text-sm text-gray-500">Loading orders...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-red-300" />
            <div className="py-12 px-6 text-center">
              <p className="font-medium text-red-600 mb-2">{error}</p>
              <button
                onClick={loadReservations}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && shownReservations.length === 0 && (
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
            <div className="py-20 flex flex-col items-center text-center px-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-orange-50">
                <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6m-8 4h10M7 13h10M9 17h6" />
                </svg>
              </div>
              <p className="font-medium text-gray-700 mb-1">
                {tab === "active" ? "No active orders right now" : "No past orders yet"}
              </p>
              <p className="text-sm text-gray-500">
                {tab === "active"
                  ? "Reservations for your listings will appear here."
                  : "Completed, cancelled, or expired reservations will appear here."}
              </p>
            </div>
          </div>
        )}

        {!loading && !error && shownReservations.length > 0 && (
          <div className="grid gap-4">
            {shownReservations.map((reservation) => (
              <ReservationCard
                key={`${reservation.id}-${reservation.status}`}
                reservation={reservation}
                updating={updatingId === reservation.id}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ReservationCard({
  reservation,
  updating,
  onStatusUpdate,
}: {
  reservation: ReservationInfo;
  updating: boolean;
  onStatusUpdate: (reservationId: number, status: string) => void;
}) {
  const style = statusStyle(reservation.status);
  const imageSrc = photoUrl(reservation.listingPhoto);
  const [selectedStatus, setSelectedStatus] = useState(reservation.status);

  return (
    <article className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
      <div
        className="h-1 w-full"
        style={{
          background: isClosed(reservation.status)
            ? style.border
            : "linear-gradient(90deg, #f97316, #ec4899)",
        }}
      />
      <div className="p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[96px_1fr_auto] sm:items-start">
          <div className="h-24 w-full sm:w-24 rounded-xl overflow-hidden bg-orange-50 border border-orange-100">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={reservation.listingTitle}
                width={96}
                height={96}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-orange-400">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-semibold text-gray-900 truncate">
                {reservation.listingTitle}
              </h2>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                style={{ color: style.color, background: style.bg, borderColor: style.border }}
              >
                {statusLabel(reservation.status)}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Buyer: <span className="font-medium text-gray-700">{reservation.buyerUsername}</span>
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
                {reservation.pickupLocation}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
                Reserved {formatDateTime(reservation.reservedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" />
                </svg>
                Updated {formatDateTime(reservation.updatedAt)}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
                Update Order Status
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  disabled={updating}
                  className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:opacity-60"
                >
                  {SELLER_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onStatusUpdate(reservation.id, selectedStatus)}
                  disabled={updating || selectedStatus === reservation.status}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }}
                >
                  {updating ? "Saving..." : "Save"}
                </button>
              </div>
              <div className="mt-2">
                <div>
                  <p className="text-xs text-gray-500">
                    Sends <span className="font-semibold">{selectedStatus}</span> to the reservation status endpoint.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
            <span
              className="text-base font-bold px-3 py-1 rounded-full"
              style={{ background: "#fff3e0", color: "#f97316" }}
            >
              {formatCurrency(reservation.listingPrice)}
            </span>
            <Link
              href={`/listing/${reservation.listingId}`}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
            >
              View Listing
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
