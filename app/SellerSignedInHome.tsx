"use client";

import { useEffect, useState } from "react";
import SellerNav from "./SellerNav";
import { useRouter } from "next/navigation";

type SignedInHomeProps = {
  user: string;
};

type Listing = {
  id: number;
  title: string;
  price: number;
  pickupLocation: string;
};

export default function SellerSignedInHome({ user }: SignedInHomeProps) {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/listing/getSellerListings",
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
    <div className="min-h-screen bg-gradient-to-br from-[#FFF3EC] via-[#FFE9F1] to-[#FFF8F3]">
      {/* HEADER (UNCHANGED) */}
      <SellerNav />

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* ================= LEFT: TEXT ================= */}
          <section>
            <span className="inline-block mb-4 rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-600">
              Seller Portal
            </span>

            <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
              Run your food<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                business on campus
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Manage listings, handle incoming orders, and track your earnings —
              all from one place.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/seller/listings/new")}
                className="px-8 py-4 rounded-xl font-semibold text-white
                           bg-gradient-to-r from-orange-500 to-pink-500
                           hover:scale-[1.02] transition shadow-lg"
              >
                Create New Listing
              </button>

              <button
                onClick={() => router.push("/seller/seller_dashboard")}
                className="px-8 py-4 rounded-xl font-semibold
                           border border-orange-400 text-orange-600
                           hover:bg-orange-50 transition"
              >
                Manage Listings
              </button>
            </div>
          </section>

          {/* ================= RIGHT: NAV CARDS ================= */}
          <section className="grid sm:grid-cols-2 gap-8">
            <NavCard
              title="My Listings"
              description="Edit, pause, or remove meals you’ve posted."
              accent="orange"
              onClick={() => router.push("/seller/seller_dashboard")}
            />

            <NavCard
              title="Incoming Orders"
              description="View orders that need to be prepared."
              accent="pink"
              onClick={() => router.push("/seller/incoming_orders")}
            />

            <NavCard
              title="Earnings"
              description="Track payouts and total revenue."
              accent="green"
              onClick={() => router.push("/seller/earnings")}
            />

            <NavCard
              title="Profile & Settings"
              description="Update seller info and preferences."
              accent="gray"
              onClick={() => router.push("/seller/profile")}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

/* ================= NAV CARD ================= */

function NavCard({
  title,
  description,
  accent,
  onClick,
}: {
  title: string;
  description: string;
  accent: "orange" | "pink" | "green" | "gray";
  onClick: () => void;
}) {
  const accentMap = {
    orange: "from-orange-400 to-orange-500",
    pink: "from-orange-400 to-pink-500",
    green: "from-green-400 to-green-500",
    gray: "from-gray-400 to-gray-600",
  };

  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-3xl p-8
                 shadow-md hover:shadow-xl transition"
    >
      <div
        className={`h-2 w-16 rounded-full bg-gradient-to-r ${accentMap[accent]} mb-6`}
      />

      <h3 className="text-xl font-bold mb-2">
        {title}
      </h3>

      <p className="text-gray-600">
        {description}
      </p>

      <p className="mt-6 font-semibold text-orange-500 group-hover:underline">
        Go →
      </p>
    </button>
  );
}
