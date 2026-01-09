"use client";
import { useState } from "react";
import { useEffect } from "react";

export default function SellerNav() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    const logout = async () => {
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
            const res = await fetch("http://localhost:8080/api/auth/check", {
              method: "GET",
              credentials: "include",
            });
            if (!res.ok) throw new Error("Not authenticated");
            const data = await res.json();
            setUsername(data.username);
          } catch {
            setUsername(null);
          }
        };
    
        checkAuth();
      }, []);
      return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              
              {/* Logo */}
              <a href = "/">
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                🍜 CampusCrave
              </div>
              </a>
    
              {/* Nav Links */}
              <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                <a href = "/browse"><button className="hover:text-gray-900 transition">Browse Meals</button></a>
                <button className="hover:text-gray-900 transition">My Orders</button>
                <a href = "/seller_dashboard"><button className="hover:text-gray-900 transition">My Listings</button></a>
                <button className="hover:text-gray-900 transition">Incoming Orders</button>
              </div>
    
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-3 rounded-full border border-gray-200 px-4 py-2 hover:bg-gray-50 transition"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                  {username?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {username}
                  </span>
                  <span className="text-gray-400 text-xs">▾</span>
                </button>
    
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-800">{username}</p>
                      <p className="text-xs text-gray-500">Seller</p>
                    </div>
    
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                      Seller Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                      Payouts
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
      );
}