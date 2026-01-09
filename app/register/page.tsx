"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SignedOutNav from "../SignedOutNav";


export default function RegisterPage() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();


  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          passwordConfirm: passwordConfirmation,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed");
      }

      if (response.ok) {
        router.push("/verify-email");
      }
      
    } catch (error: any) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Navbar */}
      <SignedOutNav />

      {/* Register Card */}
      <section className="flex justify-center mt-16">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-semibold mb-6">
            Create Your Account
          </h1>

          {/* IMPORTANT: form submit handler */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            {error && (
    <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
      {error}
    </div>
  )}
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Letters, digits and @/./+/-/_ only.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password confirmation
              </label>
              <input
                type="password"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the same password as before.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-2 rounded-lg text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-400 hover:bg-red-500"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-red-400 hover:underline">
              Login
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
