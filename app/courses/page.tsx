"use client";
import React, { useState } from "react";
import Link from "next/link";

const categories = [
  { key: "all", label: "All" },
  { key: "creative", label: "Creative" },
  { key: "business", label: "Business" },
  { key: "technology", label: "Technology" },
];

const defaultCourses = [
  { id: "1", title: "React Basics", description: "Learn the basics of React.", image: "/globe.svg", category: "technology" },
  { id: "2", title: "Advanced JavaScript", description: "Deep dive into JS.", image: "/next.svg", category: "technology" },
  { id: "3", title: "TypeScript Essentials", description: "Master TypeScript.", image: "/vercel.svg", category: "technology" },
  { id: "4", title: "Node.js Fundamentals", description: "Backend with Node.js.", image: "/window.svg", category: "technology" },
  { id: "5", title: "CSS for Beginners", description: "Style your web apps.", image: "/file.svg", category: "creative" },
  { id: "6", title: "Fullstack Project", description: "Build a fullstack app.", image: "/globe.svg", category: "technology" },
  { id: "7", title: "Digital Illustration", description: "Create stunning digital art.", image: "/file.svg", category: "creative" },
  { id: "8", title: "Photography Mastery", description: "Master your camera and composition.", image: "/vercel.svg", category: "creative" },
  { id: "9", title: "Entrepreneurship 101", description: "Start and grow your business.", image: "/window.svg", category: "business" },
  { id: "10", title: "Marketing Essentials", description: "Learn the fundamentals of marketing.", image: "/globe.svg", category: "business" },
];

function getTeacherCourses() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem("swipe-lms-teacher-courses");
    if (!stored) return [];
    return JSON.parse(stored).map((c: any, idx: number) => ({
      id: c.id || (c.title ? c.title.replace(/\s+/g, '').toLowerCase() : `t${idx}`),
      title: c.title,
      description: c.content || "",
      image: "/globe.svg",
      category: (c.category || "technology").toLowerCase(),
    }));
  } catch {
    return [];
  }
}


export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [allCourses, setAllCourses] = useState(defaultCourses);
  const [hydrated, setHydrated] = useState(false);

  // Only merge teacher courses after hydration (client-side)
  React.useEffect(() => {
    setAllCourses([...defaultCourses, ...getTeacherCourses()]);
    setHydrated(true);
  }, []);

  const filteredCourses =
    activeCategory === "all"
      ? allCourses
      : allCourses.filter((c) => c.category === activeCategory);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <span className="text-blue-700 text-lg font-semibold">Loading courses...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/80 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="#2563EB"/><text x="16" y="22" textAnchor="middle" fontSize="18" fill="white" fontFamily="Arial" fontWeight="bold">S</text></svg>
          <span className="text-xl font-bold text-blue-700 tracking-tight">Swipe LMS</span>
        </div>
        <div className="flex gap-6 text-gray-700 font-medium">
          <a href="/courses" className="hover:text-blue-600 transition">Courses</a>
          <a href="/profile" className="hover:text-blue-600 transition">Profile</a>
        </div>
        <a href="#" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Sign In</a>
      </nav>

      {/* Featured Carousel */}
      <section className="w-full max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Featured Courses</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
          {allCourses.slice(0, 5).map((course, idx) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="min-w-[320px] max-w-xs bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-5 border border-blue-100 hover:border-blue-400 group relative"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-200"
              />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                  {course.title[0]}
                </div>
                <span className="text-sm text-gray-500">Instructor</span>
                {idx === 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-semibold">New</span>}
              </div>
              <h3 className="text-lg font-bold text-blue-700 mb-1 group-hover:text-blue-900 transition-colors">
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2 min-h-[36px]">{course.description}</p>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-yellow-400">★</span>
                <span className="text-gray-300">★</span>
                <span className="ml-2 text-xs text-gray-500">4.0 (1,234)</span>
              </div>
              <button className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Start</button>
            </Link>
          ))}
        </div>
      </section>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-700 tracking-tight">Browse Courses</h2>
        {/* Category Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl bg-white/80 shadow border border-blue-100 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-6 py-3 font-semibold text-lg transition-all duration-150 focus:outline-none ${
                  activeCategory === cat.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-blue-700 hover:bg-blue-100"
                }`}
                style={{ minWidth: 120 }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg py-12">No courses found in this category.</div>
          ) : (
            filteredCourses.map((course, idx) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-blue-100 hover:border-blue-400 group relative"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-20 h-20 mx-auto mb-4 rounded-lg group-hover:scale-105 transition-transform duration-200"
                />
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {course.title[0]}
                  </div>
                  <span className="text-xs text-gray-500">Instructor</span>
                  {idx === 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-semibold">New</span>}
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-700 group-hover:text-blue-900 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-2 min-h-[48px]">{course.description}</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-300">★</span>
                  <span className="ml-2 text-xs text-gray-500">4.0 (1,234)</span>
                </div>
                <button className="w-full mt-2 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Start</button>
                <span className="absolute top-4 right-4 inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
              </Link>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm bg-white/80 border-t border-blue-100 mt-auto">
        <span>© {new Date().getFullYear()} Swipe LMS. Inspired by LinkedIn Learning. All rights reserved.</span>
      </footer>
    </div>
  );
}
