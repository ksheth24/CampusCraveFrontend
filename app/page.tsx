"use client";

import React, { useEffect } from "react";
import SignedInHome from "./SignedInHome";
import SignedOutHome from "./SignedOutHome";
import SellerSignedInHome from "./SellerSignedInHome";

export default function HomePage() {
  const [loading, setLoading] = React.useState(true);
  const [username, setUsername] = React.useState<string | null>(null);
  const [isVerifiedSeller, setIsVerifiedSeller] = React.useState(false);

  useEffect(() => {
    const loadHomeState = async () => {
      try {
        const authRes = await fetch("http://localhost:8081/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        if (!authRes.ok) throw new Error("Not authenticated");

        const authData = await authRes.json();
        setUsername(authData.username);

        const sellerRes = await fetch("http://localhost:8081/api/user/verifiedSeller", {
          method: "GET",
          credentials: "include",
        });

        if (!sellerRes.ok) {
          setIsVerifiedSeller(false);
          return;
        }

        const sellerData = await sellerRes.json();
        setIsVerifiedSeller(Boolean(sellerData.verified));
      } catch {
        setUsername(null);
        setIsVerifiedSeller(false);
      } finally {
        setLoading(false);
      }
    };

    loadHomeState();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #fff5f0 0%, #fff0f5 50%, #fce8f3 100%)" }}
      >
        <div className="animate-spin h-7 w-7 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!username) {
    return <SignedOutHome />;
  }

  if (!isVerifiedSeller) {
    return <SignedInHome user={username} />;
  }

  return <SellerSignedInHome user={username} />;
}
