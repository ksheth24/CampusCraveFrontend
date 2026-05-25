"use client";

import React, { useEffect, useState } from "react";
import SignedInNav from "@/app/SignedInNav";

export default function SellerVerification() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [agree, setAgree] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/user/getEmail", {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setEmail(data.email);
      } catch {
        setEmail("");
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <SignedInNav />

      <main className="flex justify-center px-4 py-16">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="border-b px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Seller Verification
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Verify your identity to start selling meals on CampusCrave
            </p>
          </div>

          <form className="px-8 py-6 space-y-6">
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
