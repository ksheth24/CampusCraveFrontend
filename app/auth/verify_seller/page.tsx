"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerVerification() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [agree, setAgree] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);

  const submit = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/user/getEmail", {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setEmail(data.email);
      } finally {
        setLoading(false);
      }
    };

    const getUsername = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/check", {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUsername(data.username);
      } catch {
        setUsername(null);
      }
    };

    checkAuth();
    getUsername();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href = "/">
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                🍜 CampusCrave
              </div>
          </a>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <button className="hover:text-gray-900">Browse Meals</button>
            <button className="hover:text-gray-900">My Orders</button>
            <a href="/verify_seller" className="hover:text-gray-900">
              Become a Seller
            </a>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 rounded-full border border-gray-200 px-4 py-2 hover:bg-gray-50 transition"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                {username?.charAt(0).toUpperCase() ?? "?"}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {username ?? "Guest"}
              </span>
              <span className="text-gray-400 text-xs">▾</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-800">
                    {username ?? "Guest"}
                  </p>
                  <p className="text-xs text-gray-500">CampusCrave User</p>
                </div>

                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                  Settings
                </button>

                <button
                  onClick={submit}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= PAGE CONTENT ================= */}
      <main className="flex justify-center px-4 py-16">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100">
          {/* Header */}
          <div className="border-b px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Seller Verification
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Verify your identity to start selling meals on CampusCrave
            </p>
          </div>

          {/* Form */}
          <form className="px-8 py-6 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-orange-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                disabled
                value={email}
                className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2.5 text-gray-500"
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID Number
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-orange-400"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            {/* Student ID Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID Upload
              </label>
              <div className="flex items-center justify-between rounded-lg border border-dashed border-gray-300 px-4 py-4">
                <span className="text-sm text-gray-500">
                  Upload a clear photo of your student ID
                </span>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200">
                  Choose File
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
              />
              <p className="text-sm text-gray-600">
                I confirm that I will follow all food safety and hygiene
                guidelines while preparing meals.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!agree}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Application
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
