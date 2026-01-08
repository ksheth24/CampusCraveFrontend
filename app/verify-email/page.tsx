"use client";

import React from "react";

export default function VerifyEmailPage() {
  const [code, setCode] = React.useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };


  const handleSubmit = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      // 🔁 Replace with your real endpoint
      const res = await fetch("http://localhost:8080/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Invalid verification code");
      }

      alert("Email verified successfully!");
      // router.push("/login");
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2 text-xl font-bold text-red-500">
          🍜 <span>CampusCrave</span>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#" className="text-gray-700 hover:text-black">
            Browse Meals
          </a>
          <a href="/login" className="text-gray-700 hover:text-black">
            Login
          </a>
          <a href="/register" className="px-4 py-2 text-white bg-red-400 rounded-lg hover:bg-red-500">
            Sign Up
          </a>
        </div>
      </nav>

      {/* Verify Card */}
      <section className="flex justify-center mt-20">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-semibold mb-2 text-center">
            Verify Your Email
          </h1>

          <p className="text-sm text-gray-600 mb-6 text-center">
            Enter the 6-digit code we sent to your email.
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {(error)}
            </div>
          )}

          {/* Code Inputs */}
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, i) => (
              <input
                key={i}
                id={`code-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-12 h-12 text-center text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            ))}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-400 hover:bg-red-500"
            }`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Didn’t receive a code?{" "}
            <button className="text-red-400 hover:underline">
              Resend
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
