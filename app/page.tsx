"use client";

import SignedOutHome from "./SignedOutHome"
import  SellerSignedInHome from "./SellerSignedInHome"
import { useEffect } from "react";
import React from "react";
import { useState } from "react";
import SignedInHome from "./SignedInHome";


export default function HomePage() {
    const [loading, setLoading] = React.useState(true);
    const [username, setUsername] = React.useState<string | null>(null);
    const [isVerifiedSeller, setIsVerifiedSeller] = useState<boolean>(false);


    useEffect(() => {
      const checkAuth = async () => {
        try {
          const res = await fetch("http://localhost:8080/api/auth/check", {
            method: "GET",
            credentials: "include", // 🔥 REQUIRED for cookies
          });
  
          if (!res.ok) throw new Error("Not authenticated");
  
          const data = await res.json();
          setUsername(data.username);
        } catch {
          setUsername(null);
        } finally {
          setLoading(false);
        }
      };
      const checkVerifiedSeller = async () => {
        try {
          const res = await fetch("http://localhost:8080/api/user/verifiedSeller", {
            method: "GET",
            credentials: "include", // 🔥 REQUIRED for cookies
          });
  
          if (!res.ok) throw new Error("Not authenticated");
  
          const data = await res.json();
          setIsVerifiedSeller(data.verified);
        } catch {
          setIsVerifiedSeller(false);
        } finally {
          setLoading(false);
        }
      };
      checkAuth();
      checkVerifiedSeller();
    }, []);

    if (!username) {
      return <SignedOutHome />;
    }
  
    if (username && !isVerifiedSeller) {
      return <SignedInHome user = {username}/>; 
    }

    return <SellerSignedInHome user = {username} />;
}
