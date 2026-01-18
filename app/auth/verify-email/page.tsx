"use client";

import React from "react";
import SignedOutNav from "@/app/SignedOutNav";

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
    <main className="relative min-h-screen overflow-hidden bg-[#FFF8F3]">
      {/* BACKGROUND BLOBS */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-[#FF6A3D]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#FF2F92]/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/3 h-[420px] w-[420px] rounded-full bg-[#16C79A]/20 blur-3xl" />

      {/* SUBTLE GRID */}
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
            One last step —
            <span className="block bg-gradient-to-r from-[#FF6A3D] to-[#FF2F92] bg-clip-text text-transparent">
              verify your email.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            We sent a 6-digit verification code to your email.
            Enter it to unlock your CampusCrave account.
          </p>

          {/* TRUST CHIPS */}
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/70 backdrop-blur px-4 py-2 text-sm font-semibold shadow border border-white">
              🔒 Secure verification
            </span>
            <span className="rounded-full bg-white/70 backdrop-blur px-4 py-2 text-sm font-semibold shadow border border-white">
              📧 Email protected
            </span>
            <span className="rounded-full bg-white/70 backdrop-blur px-4 py-2 text-sm font-semibold shadow border border-white">
              🏫 Campus-only access
            </span>
          </div>

          {/* MINI STATUS CARD */}
          <div className="mt-10 max-w-xl">
            <div className="rounded-2xl bg-white/70 backdrop-blur border border-white shadow-md p-4">
              <p className="font-semibold">Why verify?</p>
              <p className="text-sm text-gray-600 mt-1">
                Verification helps keep CampusCrave trusted, safe, and
                exclusive to real students.
              </p>
              <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-[#FF6A3D]/30 to-[#FF2F92]/30" />
            </div>
          </div>
        </section>

        {/* ================= RIGHT SIDE ================= */}
        <section className="lg:justify-self-end w-full max-w-xl">
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white p-8 md:p-10">
            <h2 className="text-3xl font-bold">Verify your email</h2>
            <p className="mt-1 text-gray-600">
              Enter the 6-digit code we sent you.
            </p>

            {/* CODE INPUTS */}
            <div className="mt-8 flex justify-between gap-3">
              {code.map((digit, i) => (
                <input
                  key={i}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const copy = [...code];
                    copy[i] = e.target.value.replace(/[^0-9]/g, "");
                    setCode(copy);
                  }}
                  className="h-14 w-14 text-center text-xl font-bold rounded-2xl
                             border border-gray-200 bg-white shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/60"
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="mt-8 w-full py-4 rounded-2xl font-semibold text-white
                         bg-gradient-to-r from-[#FF6A3D] to-[#FF2F92]
                         hover:scale-[1.01] active:scale-[0.99]
                         transition shadow-lg"
            >
              Verify Email
            </button>

            <p className="mt-6 text-sm text-center text-gray-600">
              Didn’t receive a code?{" "}
              <button
                onClick={handleSubmit}
                className="font-semibold text-[#FF6A3D] hover:underline"
              >
                Resend
              </button>
            </p>
          </div>

          <p className="mt-6 text-xs text-gray-500 text-center">
            Need help? Contact CampusCrave support.
          </p>
        </section>
      </div>
    </main>
  );
}
