"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = localStorage.getItem("swipe-lms-user");
    if (!user) {
      setError("No account found. Please sign up first.");
      return;
    }
    const { email, password } = JSON.parse(user);
    if (form.email !== email || form.password !== password) {
      setError("Invalid email or password.");
      return;
    }
    // Simulate login
    localStorage.setItem("swipe-lms-auth", "true");
  router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/80 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="#2563EB"/><text x="16" y="22" textAnchor="middle" fontSize="18" fill="white" fontFamily="Arial" fontWeight="bold">S</text></svg>
          <span className="text-xl font-bold text-blue-700 tracking-tight">Swipe LMS</span>
        </div>
        <div className="flex gap-6 text-gray-700 font-medium">
          <a href="/courses" className="hover:text-blue-600 transition">Courses</a>
          <a href="/profile" className="hover:text-blue-600 transition">Profile</a>
        </div>
      </nav>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-8 border border-blue-100">
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Sign In to Swipe LMS</h1>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-500 focus:outline-none text-lg"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-500 focus:outline-none text-lg"
              value={form.password}
              onChange={handleChange}
              required
            />
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>
          <div className="text-center mt-6 text-gray-500 text-sm">
            Don&apos;t have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
          </div>
        </div>
      </main>
      <footer className="py-8 text-center text-gray-500 text-sm bg-white/80 border-t border-blue-100 mt-auto">
        <span>© {new Date().getFullYear()} Swipe LMS. Inspired by LinkedIn Learning. All rights reserved.</span>
      </footer>
    </div>
  );
}
