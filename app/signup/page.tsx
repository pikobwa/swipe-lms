"use client";
import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "learner" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm || !form.role) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    // Simulate sign up
    localStorage.setItem("swipe-lms-user", JSON.stringify({ name: form.name, email: form.email, password: form.password, role: form.role }));
    setSuccess(true);
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
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Sign Up for Swipe LMS</h1>
          {success ? (
            <div className="text-green-600 text-center mb-4">Account created! <Link href="/signin" className="underline text-blue-700">Sign in</Link></div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-500 focus:outline-none text-lg"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-500 focus:outline-none text-lg"
                value={form.email}
                onChange={handleChange}
                required
              />
              <select
                name="role"
                className="px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-500 focus:outline-none text-lg"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="learner">Learner</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-500 focus:outline-none text-lg"
                value={form.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirm"
                placeholder="Confirm Password"
                className="px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-500 focus:outline-none text-lg"
                value={form.confirm}
                onChange={handleChange}
                required
              />
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <button
                type="submit"
                className="w-full py-3 mt-2 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </form>
          )}
          <div className="text-center mt-6 text-gray-500 text-sm">
            Already have an account? <Link href="/signin" className="text-blue-600 hover:underline">Sign in</Link>
          </div>
        </div>
      </main>
      <footer className="py-8 text-center text-gray-500 text-sm bg-white/80 border-t border-blue-100 mt-auto">
        <span>© {new Date().getFullYear()} Swipe LMS. Inspired by LinkedIn Learning. All rights reserved.</span>
      </footer>
    </div>
  );
}
