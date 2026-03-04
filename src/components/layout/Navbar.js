/**
 * SignLex Frontend - Navigation Bar
 * Author: Pawan Rijal
 * 
 * Responsive navigation bar with links to all main sections.
 * Includes mobile hamburger menu toggle.
 * 
 * Status: ~30% complete
 *   - Desktop nav layout implemented
 *   - Links to all core pages
 *   - Mobile responsive toggle TODO
 *   - Active route highlighting TODO
 *   - Auth state (Login/Logout) toggle TODO
 */

"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/learn", label: "Learn" },
    { href: "/practice", label: "Practice" },
    { href: "/test", label: "Mock Test" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">
              Sign<span className="text-gray-800">Lex</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-gray-600 hover:text-primary-600 font-medium"
            >
              Login
            </Link>
            <Link href="/signup" className="btn-primary text-sm">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2" />
              <Link
                href="/login"
                className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-2 bg-primary-600 text-white rounded-lg text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
