"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SellerNav from "../../SellerNav";


export default function CreateListingPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [price, setPrice] = useState("");
  const [pickUpLocation, setPickUpLocation]  = useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();


  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          ingredients, 
          price, 
          pickUpLocation, 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Listing Creation Failed");
      }

      if (response.ok) {
        router.push("/");
      }
      
    } catch (error: any) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <SellerNav />

      {/* ================= PAGE CONTENT ================= */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Create New Meal Listing
          </h1>

          <form 
          className="space-y-6"
          onSubmit={(e) => {
          e.preventDefault(); 
          submit();
          }}
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingredients
              </label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                List main ingredients
              </p>
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo
              </label>
              <input
                type="file"
                className="block w-full text-sm text-gray-600
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-medium
                           file:bg-gray-100 file:text-gray-700
                           hover:file:bg-gray-200"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Price in USD</p>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup location
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                value={pickUpLocation}
                onChange={(e) => setPickUpLocation(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a descriptive location (e.g., "Main Library, 2nd Floor")
              </p>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">Is available</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded-md font-medium hover:bg-teal-600 transition"
            >
              Create Listing
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
