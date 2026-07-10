"use client";

import { useState } from "react";
import { loginApi } from "@/api/auth.api";
import { useRouter } from "next/navigation";
import Link from "next/link";



export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginApi(email, password);

      if (res.user.role === "SUPER_ADMIN") {
        router.push("/super-admin/dashboard");
      } else if (res.user.role === "SCHOOL_ADMIN") {
        router.push("/school-admin/dashboard");
      } else if (res.user.role === "STUDENT") {
        router.push("/student/dashboard");
      } else if (res.user.role === "TEACHER") {
        router.push("/teacher/dashboard");
      }
    } catch {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-card shadow-2xl bg-gradient-to-r from-primary via-secondary to-accent   border md:grid-cols-2">

        {/* Left */}
        <div className="hidden md:flex flex-col justify-center p-12 text-white border-r">
          <h1 className="text-5xl font-bold leading-tight">Welcome Back</h1>
         <p className="mt-6 text-lg text-blue-100"> Login to continue managing your ERP dashboard. </p >
          <div className="mt-10 space-y-3 text-blue-100">
            <p>✓ Student Management</p>
            <p>✓ Teacher Dashboard</p>
            <p>✓ Attendance & Reports</p>
            <p>✓ Secure Authentication</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full ">
            <h2 className="text-3xl  text-white font-bold">Sign In</h2>
               <p className="mt-2 text-white "> Enter your credentials to access your account. </p >
            <form onSubmit={handleLogin} className="mt-8 space-y-5" >
              <div>
            <label className="mb-2 block text-sm font-medium"> Email </label >
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
              <label className="mb-2 block text-sm font-medium"> Password </label >
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end">
              <Link href="/forgot-password"
              className="text-sm text-blue-600 hover:underline" >
              Forgot Password?
              </Link>
              </div>

              <button
                disabled={loading}
                className="h-12 w-full rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}





