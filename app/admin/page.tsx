"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // For demo, treat the first user as admin
    const auth = localStorage.getItem("swipe-lms-auth");
    const userData = localStorage.getItem("swipe-lms-user");
    if (!auth || !userData) {
      router.push("/signin");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/80 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="#2563EB"/><text x="16" y="22" textAnchor="middle" fontSize="18" fill="white" fontFamily="Arial" fontWeight="bold">A</text></svg>
          <span className="text-xl font-bold text-blue-700 tracking-tight">Admin Dashboard</span>
        </div>
        <div className="flex gap-6 text-gray-700 font-medium">
          <a href="/admin" className="hover:text-blue-600 transition">Admin</a>
          <a href="/dashboard" className="hover:text-blue-600 transition">User Dashboard</a>
        </div>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition"
          onClick={() => {
            localStorage.removeItem("swipe-lms-auth");
            router.push("/signin");
          }}
        >
          Sign Out
        </button>
      </nav>
      <main className="flex-1 flex flex-col md:flex-row gap-10 max-w-7xl mx-auto w-full px-6 py-12">
        <aside className="w-full md:w-72 bg-white/90 rounded-2xl shadow p-6 flex flex-col gap-6 border border-blue-100 h-fit mb-8 md:mb-0">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700 mb-4">
              {user.email[0].toUpperCase()}
            </div>
            <span className="text-lg font-semibold text-blue-700 mb-1">{user.email}</span>
            <span className="text-gray-500 text-sm mb-2">Admin</span>
          </div>
          <nav className="flex flex-col gap-2">
            <Link href="/admin" className="text-blue-700 font-semibold hover:underline">Admin Dashboard</Link>
            <Link href="/dashboard" className="text-blue-700 hover:underline">User Dashboard</Link>
            <Link href="/courses" className="text-blue-700 hover:underline">Browse Courses</Link>
          </nav>
        </aside>
        <section className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-blue-700 mb-4">Admin Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">User Statistics</h2>
              <p className="text-gray-600 mb-2">Total Users: <span className="font-bold">1</span></p>
              <p className="text-gray-600 mb-2">Active Learners: <span className="font-bold">1</span></p>
              <p className="text-gray-600">Courses Created: <span className="font-bold">6</span></p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">Recent Activity</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>User <span className="font-semibold">{user.email}</span> enrolled in <span className="font-semibold">React Basics</span></li>
                <li>New course <span className="font-semibold">Fullstack Project</span> added</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 col-span-2">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">Course Management</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition mb-2">Add New Course</button>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>React Basics</li>
                <li>Advanced JavaScript</li>
                <li>TypeScript Essentials</li>
                <li>Node.js Fundamentals</li>
                <li>CSS for Beginners</li>
                <li>Fullstack Project</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-8 text-center text-gray-500 text-sm bg-white/80 border-t border-blue-100 mt-auto">
        <span>© {new Date().getFullYear()} Swipe LMS. Inspired by LinkedIn Learning. All rights reserved.</span>
      </footer>
    </div>
  );
}
