"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      // API call later
      // await forgotPassword({ email });

      setTimeout(() => {
        setMessage(
          "Password reset link has been sent to your email address."
        );
        setLoading(false);
      }, 1000);

    } catch {
      setMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            InizsoftHub Pro
          </h1>
          <p className="text-gray-500 mt-2">
            School Management Platform
          </p>
        </div>


        {/* Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8">

          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="text-blue-600" size={30} />
            </div>
          </div>


          <h2 className="text-2xl font-semibold text-center">
            Forgot Password?
          </h2>

          <p className="text-gray-500 text-center mt-2 mb-6">
            Enter your registered email and we will send you
            a password reset link.
          </p>


          <form onSubmit={handleSubmit}>

            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
              w-full mt-2 px-4 py-3 rounded-xl
              border border-gray-200
              focus:outline-none
              focus:ring-2 focus:ring-blue-500
              "
            />


            <button
              disabled={loading}
              className="
              w-full mt-6
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-xl
              font-medium
              transition
              disabled:opacity-50
              "
            >
              {
                loading
                  ? "Sending..."
                  : "Send Reset Link"
              }
            </button>


          </form>


          {
            message && (
              <div className="
              mt-5
              bg-green-50
              text-green-700
              text-sm
              p-3
              rounded-lg
              text-center
              ">
                {message}
              </div>
            )
          }


          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-blue-600 hover:underline text-sm"
            >
              ← Back to Login
            </Link>

          </div>

        </div>
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2026 InizsoftHub Pro. All rights reserved.
        </p>

      </div>

    </div>
  );
}