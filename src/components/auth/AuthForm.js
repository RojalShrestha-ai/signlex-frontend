/**
 * SignLex Frontend - Authentication Form Component
 * Author: Pawan Rijal
 * 
 * Shared form component used by both Login and Signup pages.
 * Handles email/password input with basic validation.
 * 
 * Status: ~15% complete
 *   - Form layout and input fields implemented
 *   - Mode switching (login vs signup)
 *   - Form submission handler (placeholder)
 *   - Firebase auth integration TODO
 *   - Form validation TODO
 *   - Error message display TODO
 *   - Social login buttons TODO
 *   - Password recovery TODO
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../ui/Button";

export default function AuthForm({ mode = "login" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // TODO: Implement Firebase authentication
    // if (isSignup) {
    //   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //   await updateProfile(userCredential.user, { displayName });
    // } else {
    //   await signInWithEmailAndPassword(auth, email, password);
    // }

    console.log(`${mode} attempt:`, { email, password, displayName });
    setLoading(false);

    // TODO: Redirect to dashboard on success
    // router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-gray-500 text-center mb-8">
          {isSignup
            ? "Start your sign language learning journey"
            : "Continue your learning journey"}
        </p>

        {/* Error display */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name (signup only) */}
          {isSignup && (
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Sign In"}
          </Button>
        </form>

        {/* Social Login Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login Buttons (placeholder) */}
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-secondary flex items-center justify-center gap-2 py-2.5">
            Google
          </button>
          <button className="btn-secondary flex items-center justify-center gap-2 py-2.5">
            Facebook
          </button>
        </div>

        {/* Toggle Login/Signup */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
}
