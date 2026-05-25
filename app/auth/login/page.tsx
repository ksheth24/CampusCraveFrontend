"use client";

import { useState } from "react";
import  React from "react";
import { useRouter } from "next/navigation";
import SignedOutNav from "@/app/SignedOutNav";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Login failed");
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
    <main className="relative min-h-screen overflow-hidden bg-[#FFF8F3]">
      {/* BACKGROUND BLOBS */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-[#FF6A3D]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#FF2F92]/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/3 h-[420px] w-[420px] rounded-full bg-[#16C79A]/20 blur-3xl" />

      {/* SUBTLE GRID TEXTURE */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.7) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <SignedOutNav />

      <div className="relative min-h-screen max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* ================= LEFT SIDE ================= */}
        <section>
          <a href="/" className="inline-flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#FF6A3D] to-[#FF2F92] shadow-lg" />
            <span className="text-xl font-bold tracking-tight">
              CampusCrave
            </span>
          </a>

          <h1 className="mt-10 text-5xl md:text-6xl font-extrabold leading-[1.05]">
            Welcome back —
            <span className="block bg-gradient-to-r from-[#FF6A3D] to-[#FF2F92] bg-clip-text text-transparent">
              your next meal is close.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Login to browse homemade meals made by verified students on your
            campus. Fresh, affordable, and pickup-ready.
          </p>

          {/* TRUST CHIPS */}
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/70 backdrop-blur px-4 py-2 text-sm font-semibold shadow border border-white">
              ✅ Verified students
            </span>
            <span className="rounded-full bg-white/70 backdrop-blur px-4 py-2 text-sm font-semibold shadow border border-white">
              ⭐ Ratings & reviews
            </span>
            <span className="rounded-full bg-white/70 backdrop-blur px-4 py-2 text-sm font-semibold shadow border border-white">
              🏫 Campus pickup
            </span>
            <span className="rounded-full bg-white/70 backdrop-blur px-4 py-2 text-sm font-semibold shadow border border-white">
              🍽 Made today
            </span>
          </div>

          {/* MINI PREVIEW CARDS */}
          <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-xl">
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white shadow-md p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Butter Chicken Bowl</p>
                  <p className="text-sm text-gray-600">Tech Square • ⭐ 4.9</p>
                </div>
                <span className="font-bold text-[#FF6A3D]">$9</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-[#FF6A3D]/30 to-[#FF2F92]/30" />
            </div>

            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white shadow-md p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Birria Tacos (3)</p>
                  <p className="text-sm text-gray-600">North Ave • ⭐ 4.8</p>
                </div>
                <span className="font-bold text-[#FF6A3D]">$8</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-[#FF6A3D]/30 to-[#FF2F92]/30" />
            </div>
          </div>
        </section>

        {/* ================= RIGHT SIDE ================= */}
        <section className="lg:justify-self-end w-full max-w-xl">
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white p-8 md:p-10">
            <h2 className="text-3xl font-bold">Login</h2>
            <p className="mt-1 text-gray-600">
              Use your CampusCrave account to continue.
            </p>

            <div className="mt-8 space-y-6">
              {/* USERNAME */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5
                             focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/60
                             placeholder:text-gray-400 shadow-sm"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5
                             focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/60
                             placeholder:text-gray-400 shadow-sm"
                />
              </div>

              <button
                onClick={submit}
                className="w-full py-4 rounded-2xl font-semibold text-white
                           bg-gradient-to-r from-[#FF6A3D] to-[#FF2F92]
                           hover:scale-[1.01] active:scale-[0.99]
                           transition shadow-lg"
              >
                Login
              </button>

              <p className="text-sm text-center text-gray-600">
                Don’t have an account?{" "}
                <a
                  href="/auth/register"
                  className="font-semibold text-[#FF6A3D] hover:underline"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-500 text-center">
            By continuing, you agree to CampusCrave’s Terms & Privacy Policy.
          </p>
        </section>
      </div>
    </main>
  );
}
