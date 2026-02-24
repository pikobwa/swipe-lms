"use client";
// Card component for course cards with hover video preview
import React from "react";

type CourseCardProps = {
  img: string;
  alt: string;
  label: string;
  by: string;
  time: string;
  progress: number;
  tag: string;
};

const CourseCard: React.FC<CourseCardProps> = ({ img, alt, label, by, time, progress, tag }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = React.useState(false);
  React.useEffect(() => {
    if (!hovered && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [hovered]);
  return (
    <div
      className="bg-white rounded-xl shadow p-5 flex flex-col relative group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden"
      onMouseEnter={() => {
        setHovered(true);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play();
        }
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-black">
        <img
          src={img}
          alt={alt}
          className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`}
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-300 z-10 bg-black ${hovered ? 'opacity-100' : 'opacity-0'}`}
          src="/sample-video.mp4"
          muted
          loop
          playsInline
        />
      </div>
      <span className="absolute top-3 right-3 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{tag}</span>
      <span className="text-sm text-gray-500 mb-1">{time}</span>
      <h3 className="font-bold text-lg mb-1">{label}</h3>
      <span className="text-xs text-gray-600 mb-1">By: {by}</span>
      <div className="w-full h-2 bg-blue-100 rounded mb-2">
        <div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }}></div>
      </div>
      <span className="text-xs text-blue-700">{progress}% complete</span>
    </div>
  );
};
import { useParams } from "next/navigation";
import Link from "next/link";

// Inline ProfilePage for My Career Journey section
const user = {
  name: "Phalex Shikanga",
  avatar: "/freepik__the-style-is-candid-image-photography-with-natural__21042.png",
  title: "Creative Development Lead",
  enrolledCourses: [
    { id: "1", title: "React Basics" },
    { id: "3", title: "TypeScript Essentials" },
  ],
};

function ProfilePage() {
  return (
    <main className="max-w-2xl mx-auto p-6 md:p-10">
      {/* My Career Journey Section */}
      <section className="bg-white rounded-2xl shadow-md p-6 mb-8 flex flex-col md:flex-row items-center gap-6 border border-blue-100">
        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-blue-900 mb-1">My Career Journey</h2>
          <p className="text-lg font-semibold text-blue-700">{user.name}</p>
          <p className="text-blue-500 mb-3">{user.title}</p>
          <div className="bg-blue-50 rounded-lg p-4 mb-2">
            <h3 className="font-semibold text-blue-800 mb-1">Career goal</h3>
            <p className="text-gray-700 text-sm mb-2">Your goal helps us connect you with the right content and opportunities.</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Choose a focus
            </button>
            <p className="text-xs text-gray-500 mt-2">Choose a focus to unlock your personalized learning plan. We’ll create a plan to help you get there.</p>
          </div>
        </div>
      </section>

      {/* Enrolled Courses Section */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Enrolled Courses</h3>
        <ul className="space-y-3">
          {user.enrolledCourses.map((course) => (
            <li key={course.id}>
              <Link href={`/courses/${course.id}`} className="text-blue-600 hover:underline">
                {course.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
import { useState, useEffect, useRef } from "react";
const SECTIONS = [
  { key: "course", label: "Course" },
  { key: "participants", label: "Participants" },
  { key: "grades", label: "Grades" },
  { key: "questionbank", label: "Question bank" },
  { key: "competencies", label: "Competencies" },
];



// Demo: get teacher courses from localStorage
function getTeacherCourses() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem("swipe-lms-teacher-courses");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

type Course = {
  id?: string;
  title: string;
  description?: string;
  image?: string;
  video?: string;
  overview?: string;
  lessons?: string[];
  category?: string;
  content?: string;
};


export default function Page() {
  // Dropdown state for user menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownBtnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownBtnRef.current && !dropdownBtnRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  // Sidebar navigation state (force string, not literal union)
  const [selectedMenu, setSelectedMenu] = useState<string>("home" as string);
  // Submenu state for content and more
  const [selectedContentSubmenu, setSelectedContentSubmenu] = useState<string>("" as string);
  const [selectedMoreSubmenu, setSelectedMoreSubmenu] = useState<string>("" as string);
  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!id) return;
    // Ensure default courses are in localStorage for detail view
    const defaultCourses = [
      { id: "1", title: "React Basics", description: "Learn the basics of React.", image: "/globe.svg", category: "technology", video: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: "2", title: "Advanced JavaScript", description: "Deep dive into JS.", image: "/next.svg", category: "technology", video: "https://www.w3schools.com/html/movie.mp4" },
      { id: "3", title: "TypeScript Essentials", description: "Master TypeScript.", image: "/vercel.svg", category: "technology", video: "https://samplelib.com/mp4/sample-5s.mp4" },
      { id: "4", title: "Node.js Fundamentals", description: "Backend with Node.js.", image: "/window.svg", category: "technology", video: "https://samplelib.com/mp4/sample-10s.mp4" },
      { id: "5", title: "CSS for Beginners", description: "Style your web apps.", image: "/file.svg", category: "creative", video: "https://samplelib.com/mp4/sample-15s.mp4" },
      { id: "6", title: "Fullstack Project", description: "Build a fullstack app.", image: "/globe.svg", category: "technology", video: "https://samplelib.com/mp4/sample-20s.mp4" },
      { id: "7", title: "Digital Illustration", description: "Create stunning digital art.", image: "/file.svg", category: "creative", video: "https://samplelib.com/mp4/sample-30s.mp4" },
      { id: "8", title: "Photography Mastery", description: "Master your camera and composition.", image: "/vercel.svg", category: "creative", video: "https://samplelib.com/mp4/sample-1mb.mp4" },
      { id: "9", title: "Entrepreneurship 101", description: "Start and grow your business.", image: "/window.svg", category: "business", video: "https://samplelib.com/mp4/sample-3mb.mp4" },
      { id: "10", title: "Marketing Essentials", description: "Learn the fundamentals of marketing.", image: "/globe.svg", category: "business", video: "https://samplelib.com/mp4/sample-5mb.mp4" },
    ];
    let needsUpdate = false;
    try {
      const stored = JSON.parse(localStorage.getItem("swipe-lms-default-courses") || "[]");
      if (stored.length !== defaultCourses.length || stored.some((c: any, i: number) => !c.video)) {
        needsUpdate = true;
      }
    } catch { needsUpdate = true; }
    if (!localStorage.getItem("swipe-lms-default-courses") || needsUpdate) {
      localStorage.setItem("swipe-lms-default-courses", JSON.stringify(defaultCourses));
    }
    // Try to get courses from localStorage (teacher-created)
    const teacherCourses = getTeacherCourses();
    const storedDefaults = JSON.parse(localStorage.getItem("swipe-lms-default-courses") || "[]");
    const allCourses = [...storedDefaults, ...teacherCourses];
    // Try to match by id or by slug (for dashboard links)
    const slug = (id as string).toLowerCase();
    const found = allCourses.find((c: Course) => String(c.id) === String(id) || c.title?.toLowerCase().replace(/\s+/g, '-') === slug);
    setCourse(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-blue-700 text-xl">Loading...</div>;
  }
  if (!course) {
    return <div className="flex items-center justify-center min-h-screen text-red-600 text-xl">Course Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="w-full h-16 bg-white/90 border-b border-blue-100 shadow flex items-center px-6 z-30 sticky top-0">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <img src="/globe.svg" alt="Logo" className="h-8 w-8" />
            <span className="font-extrabold text-xl text-blue-700 tracking-tight">SwipeLMS</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Modern Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses, skills, ..."
                className="pl-10 pr-4 py-2 rounded-lg border border-blue-100 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm w-64 transition"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            </div>
            {/* User Account Icon with Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition focus:outline-none"
                onClick={() => setDropdownOpen((open) => !open)}
                ref={dropdownBtnRef}
                type="button"
              >
                <img src="/freepik__the-style-is-candid-image-photography-with-natural__21042.png" alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-blue-200" />
                <svg className={`h-4 w-4 text-blue-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-100 rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                  {/* Show user name at the top of dropdown */}
                  <div className="px-4 py-2 text-blue-900 font-bold border-b border-blue-100">Phalex Shikanga</div>
                  <Link href="/" className="block px-4 py-2 text-blue-900 hover:bg-blue-50">My Learning</Link>
                  <Link href="/career" className="block px-4 py-2 text-blue-900 hover:bg-blue-50">My Career Journey</Link>
                  <Link href="/content" className="block px-4 py-2 text-blue-900 hover:bg-blue-50">My Content</Link>
                  <Link href="/settings" className="block px-4 py-2 text-blue-900 hover:bg-blue-50">Settings</Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-blue-50"
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/login";
                    }}
                  >Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`hidden md:flex flex-col ${sidebarCollapsed ? 'w-16 px-1' : 'w-64 px-4'} bg-white/90 border-r border-blue-100 shadow-lg py-0 pt-4 gap-2 text-blue-900 text-base font-medium sticky top-16 h-[calc(100vh-4rem)] z-20 relative transition-all duration-200`}> 
          <div className="flex items-center justify-end mb-6 px-1">
            <button
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-2 rounded hover:bg-blue-50 transition ml-2"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              {/* Sidebar collapse/expand icon (chevron left/right) */}
              {sidebarCollapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              )}
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-1">
            <a onClick={() => setSelectedMenu('home')} className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedMenu === 'home' ? 'bg-blue-100 font-bold' : ''}`}> 
              {/* Dashboard icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" /></svg>
              {!sidebarCollapsed && 'Home'}
            </a>
            <a onClick={() => setSelectedMenu('career')} className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedMenu === 'career' ? 'bg-blue-100 font-bold' : ''}`}>
              {/* Roadmap icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m7-7h2M3 12H5m12.07-7.07l1.42 1.42M4.51 19.49l1.42-1.42M19.49 19.49l-1.42-1.42M4.51 4.51l1.42 1.42" /></svg>
              {!sidebarCollapsed && 'My Career Journey'}
            </a>
            <a onClick={() => setSelectedMenu('learn')} className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedMenu === 'learn' ? 'bg-blue-100 font-bold' : ''}`}> 
              {/* Graduation cap icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 7v-6m0 0l-9-5m9 5l9-5" /></svg>
              {!sidebarCollapsed && 'Learn'}
            </a>
            <a onClick={() => setSelectedMenu('library')} className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedMenu === 'library' ? 'bg-blue-100 font-bold' : ''}`}> 
              {/* Bookshelf icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="16" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16" /></svg>
              {!sidebarCollapsed && 'My Library'}
            </a>
            {/* Content submenu */}
            <div className="group">
              <button
                type="button"
                className="w-full flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-50 transition focus:outline-none"
                onClick={() => {
                  setSelectedMenu('content');
                  setSelectedContentSubmenu("");
                }}
              >
                {/* Content icon (stacked files) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="7" width="18" height="13" rx="2" /><rect x="6" y="3" width="12" height="4" rx="1" /></svg>
                {!sidebarCollapsed && 'Content'}
                {!sidebarCollapsed && <svg className="ml-auto h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-transform" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8l4 4 4-4" /></svg>}
              </button>
              {selectedMenu === 'content' && !sidebarCollapsed && (
                <div className="ml-7 mt-1 flex flex-col gap-1 text-sm text-blue-800">
                  <a
                    onClick={() => { setSelectedMenu('content'); setSelectedContentSubmenu('materials'); }}
                    className={`py-1 px-2 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedContentSubmenu === 'materials' ? 'bg-blue-100 font-bold' : ''}`}
                  >
                    {/* File text icon for materials */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v13a2 2 0 01-2 2z" /></svg>
                    Course Materials
                  </a>
                  <a
                    onClick={() => { setSelectedMenu('content'); setSelectedContentSubmenu('videos'); }}
                    className={`py-1 px-2 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedContentSubmenu === 'videos' ? 'bg-blue-100 font-bold' : ''}`}
                  >
                    {/* Video camera icon for videos */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h16M4 18h16M4 6v12" /><rect x="2" y="6" width="20" height="12" rx="2" /></svg>
                    Videos
                  </a>
                  <a
                    onClick={() => { setSelectedMenu('content'); setSelectedContentSubmenu('quizzes'); }}
                    className={`py-1 px-2 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedContentSubmenu === 'quizzes' ? 'bg-blue-100 font-bold' : ''}`}
                  >
                    {/* Clipboard check icon for quizzes */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4m-6 4V7a2 2 0 012-2h2a2 2 0 012 2v5" /></svg>
                    Quizzes
                  </a>
                </div>
              )}
            </div>
            <a onClick={() => setSelectedMenu('apply')} className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedMenu === 'apply' ? 'bg-blue-100 font-bold' : ''}`}> 
              {/* Clipboard icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-5a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 002 2z" /></svg>
              {!sidebarCollapsed && 'Apply'}
            </a>
            <a onClick={() => setSelectedMenu('coding')} className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedMenu === 'coding' ? 'bg-blue-100 font-bold' : ''}`}> 
              {/* Code icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>
              {!sidebarCollapsed && 'Coding Practice'}
            </a>
            <a onClick={() => setSelectedMenu('certifications')} className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedMenu === 'certifications' ? 'bg-blue-100 font-bold' : ''}`}> 
              {/* Badge icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a2 2 0 00-2-2h-1a2 2 0 00-2 2v2zM9 20h6v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2z" /></svg>
              {!sidebarCollapsed && 'Certifications'}
            </a>
            <a onClick={() => setSelectedMenu('trending')} className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedMenu === 'trending' ? 'bg-blue-100 font-bold' : ''}`}> 
              {/* Fire icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 21a2 2 0 01-2.828 0C7.05 18.364 3 14.477 3 10.5A7.5 7.5 0 0112 3a7.5 7.5 0 019 7.5c0 3.977-4.05 7.864-8 10.5z" /></svg>
              {!sidebarCollapsed && 'Trending topics'}
            </a>
            {/* Submenu for Leadership, AI, Cybersecurity */}
            <div className="group">
              <button
                type="button"
                className="w-full flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-50 transition focus:outline-none"
                onClick={() => {
                  setSelectedMenu('more');
                  setSelectedMoreSubmenu("");
                }}
              >
                {/* Users icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a2 2 0 00-2-2h-1a2 2 0 00-2 2v2zM9 20h6v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2z" /></svg>
                {!sidebarCollapsed && 'More Topics'}
                {!sidebarCollapsed && <svg className="ml-auto h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-transform" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8l4 4 4-4" /></svg>}
              </button>
              {selectedMenu === 'more' && !sidebarCollapsed && (
                <div className="ml-7 mt-1 flex flex-col gap-1 text-sm text-blue-800">
                  <a
                    onClick={() => { setSelectedMenu('more'); setSelectedMoreSubmenu('leadership'); }}
                    className={`py-1 px-2 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedMoreSubmenu === 'leadership' ? 'bg-blue-100 font-bold' : ''}`}
                  >
                    {/* Leader icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 7v-6m0 0l-9-5m9 5l9-5" /></svg>
                    Leadership and Management
                  </a>
                  <a
                    onClick={() => { setSelectedMenu('more'); setSelectedMoreSubmenu('ai'); }}
                    className={`py-1 px-2 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedMoreSubmenu === 'ai' ? 'bg-blue-100 font-bold' : ''}`}
                  >
                    {/* AI icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" /></svg>
                    Artificial Intelligence
                  </a>
                  <a
                    onClick={() => { setSelectedMenu('more'); setSelectedMoreSubmenu('cybersecurity'); }}
                    className={`py-1 px-2 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${selectedMoreSubmenu === 'cybersecurity' ? 'bg-blue-100 font-bold' : ''}`}
                  >
                    {/* Shield icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    Cybersecurity
                  </a>
                </div>
              )}
            </div>
          </nav>
        </aside>
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {/* LinkedIn Learning style: two-column layout for course details */}
          {selectedMenu === 'career' ? (
            <div className="p-8"><ProfilePage /></div>
          ) : course && selectedMenu !== 'home' ? (
            <div className="flex flex-col lg:flex-row gap-8 p-8">
              {/* Left: Video and Info */}
              <div className="flex-1 min-w-0">
                {/* Video Player */}
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow mb-6">
                  {course?.video ? (
                    <video controls poster={course?.image} className="w-full h-full object-cover">
                      <source src={course.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="flex items-center justify-center h-full text-white text-lg">No video available</div>
                  )}
                </div>
                {/* Course Title & Meta */}
                <h1 className="text-3xl font-extrabold text-blue-800 mb-2">{course?.title}</h1>
                <div className="flex items-center gap-4 mb-4 text-gray-500 text-sm">
                  <span>By <span className="font-semibold text-blue-700">Instructor Name</span></span>
                  <span>•</span>
                  <span>Category: <span className="capitalize">{course?.category || 'General'}</span></span>
                  <span>•</span>
                  <span>4.0 (1,234 ratings)</span>
                </div>
                {/* Tabs */}
                <div className="border-b border-blue-100 mb-4 flex gap-2">
                  {/* Simple tab state for demo */}
                  <button className="px-4 py-2 font-semibold text-blue-700 border-b-2 border-blue-600 bg-white">Overview</button>
                  <button className="px-4 py-2 font-semibold text-blue-500 hover:text-blue-700">Contents</button>
                  <button className="px-4 py-2 font-semibold text-blue-500 hover:text-blue-700">Q&amp;A</button>
                  <button className="px-4 py-2 font-semibold text-blue-500 hover:text-blue-700">Notes</button>
                </div>
                {/* Overview Content */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2 text-blue-700">Course Overview</h2>
                  <p className="text-gray-700 mb-2">{course?.description || 'No description available.'}</p>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Learn at your own pace with hands-on projects</li>
                    <li>Access downloadable resources and quizzes</li>
                    <li>Earn a certificate of completion</li>
                  </ul>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-4 mb-4">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Start Learning</button>
                  <button className="px-6 py-3 bg-white border border-blue-600 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-50 transition">Save</button>
                </div>
              </div>
              {/* Right: Sticky Sidebar (Menu) */}
              <div className="hidden lg:block w-80 min-w-[18rem]">
                <div className="sticky top-24 bg-white/90 rounded-xl shadow border border-blue-100 p-6">
                  <h3 className="text-lg font-bold text-blue-700 mb-4">Course Menu</h3>
                  <ul className="flex flex-col gap-2">
                    <li>
                      <button
                        onClick={() => { setSelectedMenu('home'); setSelectedContentSubmenu(""); }}
                        className={`w-full text-left px-3 py-2 rounded ${selectedMenu === 'home' ? 'bg-blue-100 font-bold' : 'hover:bg-blue-50'}`}
                      >Overview</button>
                    </li>
                    <li>
                      <button
                        onClick={() => { setSelectedMenu('content'); setSelectedContentSubmenu('materials'); }}
                        className={`w-full text-left px-3 py-2 rounded ${(selectedMenu === 'content' && selectedContentSubmenu === 'materials') ? 'bg-blue-100 font-bold' : 'hover:bg-blue-50'}`}
                      >Materials</button>
                    </li>
                    <li>
                      <button
                        onClick={() => { setSelectedMenu('content'); setSelectedContentSubmenu('videos'); }}
                        className={`w-full text-left px-3 py-2 rounded ${(selectedMenu === 'content' && selectedContentSubmenu === 'videos') ? 'bg-blue-100 font-bold' : 'hover:bg-blue-50'}`}
                      >Videos</button>
                    </li>
                    <li>
                      <button
                        onClick={() => { setSelectedMenu('content'); setSelectedContentSubmenu('quizzes'); }}
                        className={`w-full text-left px-3 py-2 rounded ${(selectedMenu === 'content' && selectedContentSubmenu === 'quizzes') ? 'bg-blue-100 font-bold' : 'hover:bg-blue-50'}`}
                      >Quizzes</button>
                    </li>
                    <li>
                      <button
                        onClick={() => { setSelectedMenu('apply'); setSelectedContentSubmenu(""); }}
                        className={`w-full text-left px-3 py-2 rounded ${selectedMenu === 'apply' ? 'bg-blue-100 font-bold' : 'hover:bg-blue-50'}`}
                      >Apply</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : selectedMenu === 'home' ? (
            <div className="p-8 max-w-6xl mx-auto">
              {/* Hero section */}
              <section className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-lg px-8 py-10 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 overflow-hidden">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-3 tracking-tight">Welcome back, <span className="text-blue-600">Phalex</span>!</h1>
                  <p className="text-xl md:text-2xl text-blue-800 mb-4 font-medium">Grow your skills and advance your career with <span className="font-bold text-blue-700">Strathmore University - Digital Learning</span>.</p>
                </div>
                <div className="flex gap-6 md:gap-10">
                  <div className="bg-white/80 backdrop-blur rounded-2xl px-8 py-6 flex flex-col items-center shadow-lg border border-blue-100">
                    <span className="text-3xl font-extrabold text-blue-700 mb-1">7</span>
                    <span className="text-sm text-blue-900 font-semibold">Courses in Progress</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-2xl px-8 py-6 flex flex-col items-center shadow-lg border border-blue-100">
                    <span className="text-3xl font-extrabold text-blue-700 mb-1">3</span>
                    <span className="text-sm text-blue-900 font-semibold">Certificates Earned</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-2xl px-8 py-6 flex flex-col items-center shadow-lg border border-blue-100">
                    <span className="text-3xl font-extrabold text-blue-700 mb-1">12h</span>
                    <span className="text-sm text-blue-900 font-semibold">Learning This Month</span>
                  </div>
                </div>
                {/* Decorative SVG or illustration could go here for extra polish */}
              </section>

              {/* Continue learning section */}
              <h2 className="text-2xl font-bold text-blue-700 mb-2">Continue Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    img: "/freepik__the-style-is-candid-image-photography-with-natural__21042.png",
                    alt: "How to Research and Write Using Generative AI Tools",
                    label: "How to Research and Write Using Generative AI Tools",
                    by: "Dave Birss",
                    time: "1h 36m",
                    progress: 60,
                    tag: "In Progress"
                  },
                  {
                    img: "/freepik__the-style-is-candid-image-photography-with-natural__29396.png",
                    alt: "AI and Digital Marketing Trends",
                    label: "AI and Digital Marketing Trends",
                    by: "Martin Waxman",
                    time: "2h 23m",
                    progress: 35,
                    tag: "In Progress"
                  },
                  {
                    img: "/freepik__the-style-is-candid-image-photography-with-natural__78101.png",
                    alt: "AI and Machine Learning Tools for After Effects",
                    label: "AI and Machine Learning Tools for After Effects",
                    by: "Eran Stern",
                    time: "2h 16m",
                    progress: 80,
                    tag: "In Progress"
                  }
                ].map((card) => (
                  <CourseCard key={card.label} {...card} />
                ))}
              </div>

              {/* Personalized recommendations */}
              <h2 className="text-2xl font-bold text-blue-700 mb-2">Recommended for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    img: "/freepik__the-style-is-candid-image-photography-with-natural__78102.png",
                    alt: "Tips to Ask Questions that Enhance Communication",
                    label: "Tips to Ask Questions that Enhance Communication",
                    by: "Pia Lauritzen",
                    time: "16m",
                    progress: 0,
                    tag: "Popular"
                  },
                  {
                    img: "/freepik__the-style-is-candid-image-photography-with-natural__21042.png",
                    alt: "Adobe Express: Designing Simple but Effective Infographics",
                    label: "Adobe Express: Designing Simple but Effective Infographics",
                    by: "Nicte Cuevas",
                    time: "1h 17m",
                    progress: 0,
                    tag: "Popular"
                  },
                  {
                    img: "/freepik__the-style-is-candid-image-photography-with-natural__29396.png",
                    alt: "Wireless Networking Essential Training",
                    label: "Wireless Networking Essential Training",
                    by: "Kevin Wallace",
                    time: "1h 19m",
                    progress: 0,
                    tag: "New"
                  }
                ].map((card) => (
                  <CourseCard key={card.label} {...card} />
                ))}
              </div>

              {/* Skill progress and suggestions */}
              <h2 className="text-2xl font-bold text-blue-700 mb-2">Your Skill Progress</h2>
              <div className="space-y-2 mb-8">
                {[
                  { skill: 'Adobe Photoshop', percent: 40 },
                  { skill: 'Screenwriting', percent: 50 },
                  { skill: 'Graphic Design', percent: 60 },
                  { skill: 'Creative Direction', percent: 70 },
                  { skill: 'Social Media Marketing', percent: 80 },
                  { skill: 'Adobe Illustrator', percent: 90 },
                ].map(({ skill, percent }) => (
                  <div key={skill} className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded shadow-sm">
                    <span className="w-32 truncate text-xs text-blue-900">{skill}</span>
                    <div className="flex-1 mx-2">
                      <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-1.5 bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                    <span className="w-8 text-right text-xs text-blue-700 font-semibold">{percent}%</span>
                  </div>
                ))}
              </div>

              {/* This week's top courses */}
              <h2 className="text-2xl font-bold text-blue-700 mb-2">This Week’s Top Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    img: "/freepik__the-style-is-candid-image-photography-with-natural__78101.png",
                    alt: "Unboxing AI: Build a Remote MCP Server from Zero to Deployed with OAuth",
                    label: "Unboxing AI: Build a Remote MCP Server from Zero to Deployed with OAuth",
                    by: "Morten Rand-Hendriksen",
                    time: "2h 54m",
                    progress: 0,
                    tag: "Popular"
                  },
                  {
                    img: "/freepik__the-style-is-candid-image-photography-with-natural__21042.png",
                    alt: "Advanced Gemini for Developers (2024)",
                    label: "Advanced Gemini for Developers (2024)",
                    by: "Lynn Langit",
                    time: "1h 27m",
                    progress: 0,
                    tag: "Popular"
                  },
                  {
                    img: "/freepik__the-style-is-candid-image-photography-with-natural__29396.png",
                    alt: "OpenAI API: Realtime API on the Server",
                    label: "OpenAI API: Realtime API on the Server",
                    by: "Morten Rand-Hendriksen",
                    time: "39m",
                    progress: 0,
                    tag: "New"
                  }
                ].map((card) => (
                  <CourseCard key={card.label} {...card} />
                ))}
              </div>

              {/* Certificates and achievements */}
              <h2 className="text-2xl font-bold text-blue-700 mb-2">Your Achievements</h2>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-blue-50 rounded-xl px-6 py-4 flex flex-col items-center shadow">
                  <span className="text-2xl font-bold text-blue-700 mb-1">Certificate</span>
                  <span className="text-xs text-gray-600">AI and Digital Marketing Trends</span>
                </div>
                <div className="bg-blue-50 rounded-xl px-6 py-4 flex flex-col items-center shadow">
                  <span className="text-2xl font-bold text-blue-700 mb-1">Certificate</span>
                  <span className="text-xs text-gray-600">How to Research and Write Using Generative AI Tools</span>
                </div>
                <div className="bg-blue-50 rounded-xl px-6 py-4 flex flex-col items-center shadow">
                  <span className="text-2xl font-bold text-blue-700 mb-1">Certificate</span>
                  <span className="text-xs text-gray-600">Wireless Networking Essential Training</span>
                </div>
              </div>

              {/* Popular on SU Digital Learning */}
              <h2 className="text-2xl font-bold text-blue-700 mb-2">Popular on SU Digital Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    img: "/freepik__the-style-is-candid-image-photography-with-natural__78102.png",
                    alt: "AI Orchestration: Planning and Orchestrating for Observability",
                    label: "AI Orchestration: Planning and Orchestrating for Observability",
                    by: "Fikayo Adepoju",
                    time: "1h 53m",
                    progress: 0,
                    tag: "Popular"
                  },
                  {
                    img: "/freepik__the-style-is-candid-image-photography-with-natural__21042.png",
                    alt: "Building Trustworthy AI in Government: Responsible and Impactful Innovation",
                    label: "Building Trustworthy AI in Government: Responsible and Impactful Innovation",
                    by: "Brandie Nonnecke",
                    time: "1h 36m",
                    progress: 0,
                    tag: "Popular"
                  },
                  {
                    img: "/freepik__the-style-is-candid-image-photography-with-natural__29396.png",
                    alt: "Unleashing the Power of DALL-E 3: A Conversation with Creative Director Chad Nelson",
                    label: "Unleashing the Power of DALL-E 3: A Conversation with Creative Director Chad Nelson",
                    by: "Ashley Kennedy",
                    time: "32m",
                    progress: 0,
                    tag: "Popular"
                  }
                ].map((card) => (
                  <CourseCard key={card.label} {...card} />
                ))}
              </div>
            </div>
          ) : (
            // ...existing code for other sidebar menu pages...
            <>
              {selectedMenu === 'career' && <div className="p-8">This is the My Career Journey page (dummy content).</div>}
              {selectedMenu === 'learn' && <div className="p-8">This is the Learn page (dummy content).</div>}
              {selectedMenu === 'library' && <div className="p-8">This is the My Library page (dummy content).</div>}
              {/* Content menu and submenus */}
              {selectedMenu === 'content' && !selectedContentSubmenu && <div className="p-8">This is the Content overview page (dummy content).</div>}
              {selectedMenu === 'content' && selectedContentSubmenu === 'materials' && <div className="p-8">This is the Course Materials page (dummy content).</div>}
              {selectedMenu === 'content' && selectedContentSubmenu === 'videos' && <div className="p-8">This is the Videos page (dummy content).</div>}
              {selectedMenu === 'content' && selectedContentSubmenu === 'quizzes' && <div className="p-8">This is the Quizzes page (dummy content).</div>}
              {selectedMenu === 'apply' && <div className="p-8">This is the Apply page (dummy content).</div>}
              {selectedMenu === 'coding' && <div className="p-8">This is the Coding Practice page (dummy content).</div>}
              {selectedMenu === 'certifications' && <div className="p-8">This is the Certifications page (dummy content).</div>}
              {selectedMenu === 'trending' && <div className="p-8">This is the Trending Topics page (dummy content).</div>}
              {/* More menu and submenus */}
              {selectedMenu === 'more' && !selectedMoreSubmenu && <div className="p-8">This is the More Topics overview page (dummy content).</div>}
              {selectedMenu === 'more' && selectedMoreSubmenu === 'leadership' && <div className="p-8">This is the Leadership and Management page (dummy content).</div>}
              {selectedMenu === 'more' && selectedMoreSubmenu === 'ai' && <div className="p-8">This is the Artificial Intelligence page (dummy content).</div>}
              {selectedMenu === 'more' && selectedMoreSubmenu === 'cybersecurity' && <div className="p-8">This is the Cybersecurity page (dummy content).</div>}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

