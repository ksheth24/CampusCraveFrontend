"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import SellerNav from "@/app/SellerNav";

type ListingInfo = {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  price: number;
  pickupLocation: string;
  photo?: string | null;
  imageUrl?: string | null;
  listingPhoto?: string | null;
};

const API_BASE = "http://localhost:8081";

function listingImageUrl(listing: ListingInfo | null) {
  if (!listing) return null;
  const image = listing.photo ?? listing.imageUrl ?? listing.listingPhoto;
  if (!image) return null;
  if (/^(https?:|data:|blob:)/.test(image)) return image;
  if (image.startsWith("/")) return `${API_BASE}${image}`;
  return `${API_BASE}/${image}`;
}

async function updateListing(id: string, formData: FormData) {
  const attempts = [
    { url: `${API_BASE}/api/listing/update/${id}`, method: "PUT" },
    { url: `${API_BASE}/api/listing/update/${id}`, method: "PATCH" },
    { url: `${API_BASE}/api/listing/${id}`, method: "PUT" },
    { url: `${API_BASE}/api/listing/${id}`, method: "PATCH" },
  ];

  let lastError = "Update failed";

  for (const attempt of attempts) {
    const res = await fetch(attempt.url, {
      method: attempt.method,
      credentials: "include",
      body: formData,
    });

    if (res.ok) return;
    lastError = (await res.text().catch(() => "")) || `Update failed with ${res.status}`;
  }

  throw new Error(lastError);
}

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<ListingInfo | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [price, setPrice] = useState("");
  const [pickUpLocation, setPickUpLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/listing/get/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load listing");

        const data = (await res.json()) as ListingInfo;
        setListing(data);
        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setIngredients(data.ingredients ?? "");
        setPrice(String(data.price ?? ""));
        setPickUpLocation(data.pickupLocation ?? "");
      } catch {
        setError("Could not load this listing.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const submit = async () => {
    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ingredients", ingredients);
    formData.append("price", price);
    formData.append("pickUpLocation", pickUpLocation);
    if (photo) formData.append("photo", photo);

    try {
      await updateListing(id, formData);
      router.push("/seller/seller_dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this listing.");
    } finally {
      setSaving(false);
    }
  };

  const currentImage = photoPreview ?? listingImageUrl(listing);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #fff5f0 0%, #fff0f5 50%, #fce8f3 100%)" }}
    >
      <SellerNav />

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
            style={{ background: "#fff3e0", color: "#f97316" }}
          >
            Seller Portal
          </span>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit{" "}
            <span style={{ background: "linear-gradient(90deg, #f97316, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Meal Listing
            </span>
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />

          {loading ? (
            <div className="flex flex-col items-center gap-3 py-24">
              <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-orange-400 animate-spin" />
              <p className="text-sm text-gray-400">Loading listing...</p>
            </div>
          ) : (
            <form
              className="p-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Field label="Title">
                <input
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Field>

              <Field label="Description">
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>

              <Field label="Ingredients" hint="List main ingredients, separated by commas">
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none resize-none"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                />
              </Field>

              <Field label="Photo">
                <label className="block rounded-xl border-2 border-dashed border-orange-200 bg-orange-50 cursor-pointer hover:bg-orange-100 transition overflow-hidden">
                  {currentImage ? (
                    <Image
                      src={currentImage}
                      alt="Listing preview"
                      width={800}
                      height={360}
                      unoptimized
                      className="w-full max-h-64 object-cover"
                    />
                  ) : (
                    <div className="py-10 text-center text-sm text-orange-500">
                      Click to upload a photo
                    </div>
                  )}
                  <input type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
                </label>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price" hint="Amount in USD">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Field>

                <Field label="Pickup Location">
                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none"
                    value={pickUpLocation}
                    onChange={(e) => setPickUpLocation(e.target.value)}
                  />
                </Field>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/seller/seller_dashboard")}
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                  style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
