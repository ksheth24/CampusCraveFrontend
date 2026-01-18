"use client";

import Link from "next/link";
import SignedOutNav from "./SignedOutNav";

export default function SignedOutHome() {
  return (
    <main className="bg-[#FFF8F3] text-gray-900">
      <SignedOutNav/>


      {/* ================= HERO ================= */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#FFF3EA] via-[#FFE8F2] to-[#FFF8F3]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <span className="inline-block mb-4 rounded-full bg-[#FF6A3D]/10 px-4 py-1 text-sm font-semibold text-[#FF6A3D]">
              🍽 Made by students, for students
            </span>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Real food. <br />
              <span className="text-[#FF6A3D]">Made on campus.</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Buy and sell homemade meals made by verified students on your campus.
              Affordable, fresh, and just steps away.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/browse"
                className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#FF6A3D] to-[#FF2F92] hover:scale-[1.03] transition shadow-lg"
              >
                Browse Meals Near Me
              </Link>

              <Link
                href="/signup"
                className="px-8 py-4 rounded-xl font-semibold border border-[#FF6A3D] text-[#FF6A3D] hover:bg-[#FF6A3D]/10 transition"
              >
                Become a Seller
              </Link>
            </div>
          </div>

          {/* Right (Food Preview Cards) */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            {["Butter Chicken", "Birria Tacos", "Pasta Alfredo", "Chicken Shawarma"].map((meal, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white shadow-lg p-4 hover:shadow-xl transition"
              >
                <div className="h-32 rounded-xl bg-gradient-to-br from-gray-200 to-gray-100 mb-3" />
                <h3 className="font-semibold">{meal}</h3>
                <p className="text-sm text-gray-500">📍 North Ave</p>
                <div className="flex justify-between mt-2">
                  <span className="font-bold text-[#FF6A3D]">$8</span>
                  <span className="text-sm">⭐ 4.8</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED MEALS ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10">
            🔥 Popular Near You
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white shadow-md hover:shadow-xl transition p-4"
              >
                <div className="h-36 rounded-xl bg-gradient-to-br from-gray-200 to-gray-100 mb-3" />
                <h3 className="font-semibold">Homemade Bowl</h3>
                <p className="text-sm text-gray-500">Tech Square</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-[#FF6A3D]">$9</span>
                  <span className="text-sm">⭐ 4.9</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            How CampusCrave Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <Step
              title="Browse Meals"
              desc="Discover affordable homemade meals made by students near you."
              icon="🔍"
            />
            <Step
              title="Connect"
              desc="Chat with sellers and arrange a quick campus pickup."
              icon="💬"
            />
            <Step
              title="Enjoy"
              desc="Pick up your meal and enjoy real food without the hassle."
              icon="🍽"
            />
          </div>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          <TrustCard icon="✅" title="Verified Students" />
          <TrustCard icon="🏫" title="Campus Only" />
          <TrustCard icon="⭐" title="Ratings & Reviews" />
          <TrustCard icon="🔒" title="Secure Payments" />
        </div>
      </section>

      {/* ================= SELLER CTA ================= */}
      <section className="py-24 bg-gradient-to-r from-[#FF6A3D] to-[#FF2F92] text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold">
            Turn your cooking into income
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Sell meals between classes. No storefront. No upfront fees.
          </p>

          <Link
            href="/signup"
            className="inline-block mt-8 px-10 py-4 rounded-xl bg-white text-[#FF6A3D] font-semibold hover:scale-[1.05] transition shadow-lg"
          >
            Start Selling Today
          </Link>
        </div>
      </section>

    </main>
  );
}

/* ================= COMPONENTS ================= */

function Step({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-[#FFF8F3] p-8 shadow-md hover:shadow-lg transition text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function TrustCard({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="rounded-2xl bg-white shadow-md p-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}
