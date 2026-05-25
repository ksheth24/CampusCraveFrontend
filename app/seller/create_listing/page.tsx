"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SellerNav from "../../SellerNav";

export default function CreateListingPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [price, setPrice] = useState("");
  const [pickUpLocation, setPickUpLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } else {
      setPhotoPreview(null);
    }
  };

  const submit = async () => {
    setLoading(true);
    setError(null);

    if (!photo) {
      alert("Upload a photo");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("ingredients", ingredients);
    formData.append("price", price.toString());
    formData.append("pickUpLocation", pickUpLocation);
    formData.append("photo", photo);

    try {
      const res = await fetch("http://localhost:8081/api/listing/create", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Create failed");
      router.push("/seller/seller_dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #fff5f0 0%, #fff0f5 50%, #fce8f3 100%)" }}>
      <SellerNav />

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
            style={{ background: "#fff3e0", color: "#f97316" }}
          >
            Seller Portal
          </span>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New{" "}
            <span style={{ background: "linear-gradient(90deg, #f97316, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Meal Listing
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Fill in the details below to post your meal for students.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          {/* Orange accent bar */}
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />

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

            {/* Title */}
            <Field label="Title">
              <input
                type="text"
                placeholder="e.g. Homemade Chicken Biryani"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ "--tw-ring-color": "#f97316" } as React.CSSProperties}
                onFocus={e => e.currentTarget.style.setProperty("box-shadow", "0 0 0 2px #f9731640")}
                onBlur={e => e.currentTarget.style.removeProperty("box-shadow")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea
                rows={3}
                placeholder="Describe your meal — what makes it special?"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none transition"
                onFocus={e => e.currentTarget.style.setProperty("box-shadow", "0 0 0 2px #f9731640")}
                onBlur={e => e.currentTarget.style.removeProperty("box-shadow")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            {/* Ingredients */}
            <Field label="Ingredients" hint="List main ingredients, separated by commas">
              <textarea
                rows={2}
                placeholder="e.g. chicken, basmati rice, onions, spices..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none transition"
                onFocus={e => e.currentTarget.style.setProperty("box-shadow", "0 0 0 2px #f9731640")}
                onBlur={e => e.currentTarget.style.removeProperty("box-shadow")}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </Field>

            {/* Photo Upload */}
            <Field label="Photo">
              <label
                className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-orange-200 bg-orange-50 cursor-pointer hover:bg-orange-100 transition overflow-hidden"
                style={{ minHeight: photoPreview ? "auto" : "120px" }}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full max-h-56 object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-8">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#fff3e0" }}>
                      {/* Camera icon */}
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#f97316" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.172a2 2 0 001.414-.586l.828-.828A2 2 0 018.828 5h6.344a2 2 0 011.414.586l.828.828A2 2 0 0019.828 7H20a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#f97316" }}>Click to upload a photo</span>
                    <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handlePhotoChange}
                />
              </label>
              {photoPreview && (
                <button
                  type="button"
                  className="mt-2 text-xs text-gray-400 hover:text-red-400 transition"
                  onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                >
                  Remove photo
                </button>
              )}
            </Field>

            {/* Price + Pickup row */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price" hint="Amount in USD">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-xl border border-gray-200 pl-7 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition"
                    onFocus={e => e.currentTarget.style.setProperty("box-shadow", "0 0 0 2px #f9731640")}
                    onBlur={e => e.currentTarget.style.removeProperty("box-shadow")}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </Field>

              <Field label="Pickup Location" hint='e.g. "Main Library, 2nd Floor"'>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition"
                  onFocus={e => e.currentTarget.style.setProperty("box-shadow", "0 0 0 2px #f9731640")}
                  onBlur={e => e.currentTarget.style.removeProperty("box-shadow")}
                  value={pickUpLocation}
                  onChange={(e) => setPickUpLocation(e.target.value)}
                />
              </Field>
            </div>

            {/* Availability toggle */}
            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-700">Available for orders</p>
                <p className="text-xs text-gray-400">Toggle off to pause this listing</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                style={{ background: isAvailable ? "#14b8a6" : "#d1d5db" }}
              >
                <span
                  className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
                  style={{ transform: isAvailable ? "translateX(22px)" : "translateX(2px)" }}
                />
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity"
              style={{
                background: "linear-gradient(90deg, #f97316, #ec4899)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating listing…" : "Create Listing →"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

/* ── Helper ── */
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
