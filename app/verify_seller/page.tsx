"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function SellerVerification() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [agree, setAgree] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const [email, setEmail] = useState<string>("");


    useEffect(() => {
      const checkAuth = async () => {
        try {
          const res = await fetch("http://localhost:8080/api/user/getEmail", {
            method: "GET",
            credentials: "include", // 🔥 REQUIRED for cookies
          });
  
          if (!res.ok) throw new Error("Not authenticated");
  
          const data = await res.json();
          setEmail(data.email);
        } catch {
          console.log("Error")
        } finally {
          setLoading(false);
        }
      };
  
      checkAuth();
    }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center px-4">
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
              type="text"
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2.5 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID Number
            </label>
            <input
              type="text"
              placeholder="903XXXXXX"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          {/* File Upload */}
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
              className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
            />
            <p className="text-sm text-gray-600">
              I confirm that I will follow all food safety and hygiene guidelines
              while preparing meals.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 text-white font-semibold shadow-md hover:opacity-90 transition"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
