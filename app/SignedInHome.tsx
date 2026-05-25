"use client";

import Link from "next/link";
import SignedInNav from "./SignedInNav";

type SignedInHomeProps = {
  user: string;
};

export default function SignedInHome({ user }: SignedInHomeProps) {
  return (
    <main
      className="text-gray-900"
      style={{ background: "linear-gradient(135deg, #fff5f0 0%, #fff0f5 50%, #fce8f3 100%)" }}
    >
      <SignedInNav />

      <section className="relative min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center py-20">
          <div>
            <span
              className="inline-block mb-4 rounded-full px-4 py-1 text-sm font-semibold"
              style={{ background: "#fff3e0", color: "#f97316" }}
            >
              Welcome back, {user}
            </span>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              Find your next <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #f97316, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                campus meal.
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-500 max-w-xl">
              Browse homemade meals from verified student sellers and reserve pickup around your schedule.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">
              <Link
                href="/browse"
                className="px-8 py-4 rounded-xl font-semibold text-white hover:opacity-90 transition shadow-md"
                style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }}
              >
                Browse Meals
              </Link>
              <Link
                href="/auth/verify_seller"
                className="px-8 py-4 rounded-xl font-semibold border transition hover:bg-orange-50"
                style={{ borderColor: "#f97316", color: "#f97316" }}
              >
                Become a Seller
              </Link>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-5">
            {["Butter Chicken", "Birria Tacos", "Pasta Alfredo", "Chicken Shawarma"].map((meal) => (
              <div
                key={meal}
                className="rounded-2xl bg-white border border-orange-100 shadow-sm p-4 hover:shadow-md transition overflow-hidden"
              >
                <div
                  className="h-32 rounded-xl mb-3"
                  style={{ background: "linear-gradient(135deg, #fff3e0, #fce8f3)" }}
                />
                <div className="h-1 w-8 rounded-full mb-2" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
                <h3 className="font-semibold text-gray-900">{meal}</h3>
                <p className="text-xs text-gray-400 mt-0.5">North Ave</p>
                <div className="flex justify-between mt-2 items-center">
                  <span
                    className="text-sm font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#fff3e0", color: "#f97316" }}
                  >
                    $8
                  </span>
                  <span className="text-xs text-gray-400">4.8 stars</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-8 rounded-full" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
            <h2 className="text-2xl font-bold text-gray-900">Popular Near You</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-md transition p-4 overflow-hidden"
              >
                <div
                  className="h-36 rounded-xl mb-3"
                  style={{ background: "linear-gradient(135deg, #fff3e0, #fce8f3)" }}
                />
                <div className="h-1 w-6 rounded-full mb-2" style={{ background: "linear-gradient(90deg, #f97316, #ec4899)" }} />
                <h3 className="font-semibold text-gray-900">Homemade Bowl</h3>
                <p className="text-xs text-gray-400">Tech Square</p>
                <div className="flex justify-between items-center mt-2">
                  <span
                    className="text-sm font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#fff3e0", color: "#f97316" }}
                  >
                    $9
                  </span>
                  <span className="text-xs text-gray-400">4.9 stars</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
