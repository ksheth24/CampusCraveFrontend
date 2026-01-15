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
      const response = await fetch("http://localhost:8080/api/auth/login", {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <SignedOutNav />

      {/* Login Card */}
      <div className="flex justify-center items-center mt-24 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Login to Your Account
          </h2>
          <form 
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="space-y-4"
          >
            {error && (
    <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
      Invalid Login Credentials
    </div>
  )}
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-red-400 text-white py-2 rounded-md hover:bg-red-500 transition font-medium"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <a href = "/auth/register">
          <p className="text-sm text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <span className="text-red-500 hover:underline cursor-pointer">
              Sign Up
            </span>
          </p>
          </a>
        </div>
      </div>
    </div>
  );
}
