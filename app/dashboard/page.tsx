"use client";
import React, { useEffect, useState, useRef } from "react";
// Card component for course cards with hover video preview
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
  // Use course label as slug (replace spaces with dashes, lowercase)
  const slug = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <Link href={`/courses/${slug}`} className="block group">
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
    </Link>
  );
};
import Link from "next/link";
export default function DashboardPage() {
    // Replicate course detail dashboard view for learner dashboard
    // Sidebar and layout logic from [id]/page.tsx
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<string>("home");
    const [selectedContentSubmenu, setSelectedContentSubmenu] = useState<string>("");
    const [selectedMoreSubmenu, setSelectedMoreSubmenu] = useState<string>("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [learnSubmenu, setLearnSubmenu] = useState<string>("");
    const [libraryTab, setLibraryTab] = useState<string>("inprogress");
    const [showRolePlayModal, setShowRolePlayModal] = useState(false);
    const [rolePlays, setRolePlays] = useState<{title: string, description: string}[]>([]);
    const [rolePlayTitle, setRolePlayTitle] = useState("");
    const [rolePlayDesc, setRolePlayDesc] = useState("");
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

    // Demo course for dashboard view
    const course = {
      id: "1",
      title: "React Basics",
      description: "Learn the basics of React.",
      image: "/globe.svg",
      category: "technology",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
    };

    const [userRole, setUserRole] = useState<'teacher' | 'learner'>("learner"); // Change to 'teacher' to test

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
                {!sidebarCollapsed && <svg className="ml-auto h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-transform" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8l4 4 4-4" /></svg>}
              </a>
              {selectedMenu === 'learn' && !sidebarCollapsed && (
                <div className="ml-7 mt-1 flex flex-col gap-1 text-sm text-blue-800">
                  <a
                    onClick={() => setLearnSubmenu('library')}
                    className={`py-1 px-2 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${learnSubmenu === 'library' ? 'bg-blue-100 font-bold' : ''}`}
                  >
                    {/* Bookshelf icon */}
                  </a>
                  <a
                    onClick={() => setLearnSubmenu('content')}
                    className={`py-1 px-2 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${learnSubmenu === 'content' ? 'bg-blue-100 font-bold' : ''}`}
                  >
                    {/* Content icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="7" width="18" height="13" rx="2" /><rect x="6" y="3" width="12" height="4" rx="1" /></svg>
                    Content
                  </a>
                </div>
              )}
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
              {/* ...other sidebar items... */}
            </nav>
          </aside>
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col">
            {/* Dashboard Home Content (copied from course detail 'home' tab) */}
            {selectedMenu === 'home' && (
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
    </section>

    {/* Motivational Note */}

    {/* Upcoming Deadlines Section */}
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-[#a81818] mb-4 flex items-center gap-2">
        <svg className="w-7 h-7 text-[#a81818]" fill="none" stroke="#a81818" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4" /></svg>
        Upcoming Deadlines
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dummy data for assignments/quizzes */}
        {[
          { type: 'Assignment', title: 'Essay: The Future of AI', due: '2025-08-25', status: 'overdue' },
          { type: 'Quiz', title: 'React Basics Quiz', due: '2025-08-29', status: 'due' },
          { type: 'Test', title: 'Midterm Exam', due: '2025-09-02', status: 'upcoming' },
          { type: 'Assignment', title: 'Project Proposal', due: '2025-09-01', status: 'upcoming' },
        ].map((item, idx) => (
          <div key={idx} className={`rounded-2xl shadow-lg p-6 flex flex-col gap-2 border-l-8 ${item.status === 'overdue' ? 'border-[#a81818] bg-red-50' : item.status === 'due' ? 'border-[#f0a800] bg-yellow-50' : 'border-[#003078] bg-blue-50'}`}>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.type === 'Assignment' ? 'bg-[#003078] text-white' : item.type === 'Quiz' ? 'bg-[#f0a800] text-[#003078]' : 'bg-[#a81818] text-white'}`}>{item.type}</span>
              {item.status === 'overdue' && <span className="ml-2 px-2 py-0.5 text-xs bg-[#a81818] text-white rounded-full font-bold animate-pulse">Overdue</span>}
              {item.status === 'due' && <span className="ml-2 px-2 py-0.5 text-xs bg-[#f0a800] text-[#003078] rounded-full font-bold">Due Soon</span>}
            </div>
            <div className="font-semibold text-lg text-blue-900">{item.title}</div>
            <div className="text-sm text-gray-600">Due: <span className="font-bold">{item.due}</span></div>
          </div>
        ))}
      </div>
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
)}
{selectedMenu === 'career' && (
  <div className="p-8 max-w-2xl mx-auto">
    <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col items-center gap-6 animate-fade-in">
      <div className="flex flex-col items-center gap-2 w-full">
        <img src="/freepik__the-style-is-candid-image-photography-with-natural__21042.png" alt="Phalex Shikanga" className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover shadow-lg" />
        <h2 className="text-2xl font-extrabold text-blue-900">Phalex Shikanga</h2>
        <span className="text-blue-500 font-medium text-lg">Creative Development Lead</span>
      </div>
      <div className="w-full bg-blue-50 rounded-xl p-6 flex flex-col gap-2 border border-blue-100">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          <h3 className="text-lg font-bold text-blue-800">Career Goal</h3>
        </div>
        <p className="text-gray-700 text-base">Your goal helps us connect you with the right content and opportunities.</p>
        <div className="flex items-center gap-2 mt-2">
          <button className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Choose a focus
          </button>
          <span className="text-xs text-gray-500">Unlock your personalized learning plan</span>
        </div>
      </div>
      <div className="w-full">
        <h4 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-2a4 4 0 014-4h0a4 4 0 014 4v2" /></svg>
          Enrolled Courses
        </h4>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 bg-blue-50 rounded-lg px-4 py-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span className="text-blue-900 font-medium">React Basics</span>
          </li>
          <li className="flex items-center gap-2 bg-blue-50 rounded-lg px-4 py-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span className="text-blue-900 font-medium">TypeScript Essentials</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
)}
{selectedMenu === 'learn' && learnSubmenu === 'library' && (
  <div className="p-8 max-w-5xl mx-auto animate-fade-in">
    <h2 className="text-2xl font-extrabold text-blue-900 mb-4 flex items-center gap-2">
      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16" /></svg>
      My Library
    </h2>
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col md:flex-row gap-8">
      {/* Vertical Tabs */}
      <div className="flex flex-col gap-2 w-full md:w-56">
        <button onClick={() => setLibraryTab('inprogress')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-left transition border border-transparent ${libraryTab === 'inprogress' ? 'bg-blue-100 text-blue-800 border-blue-300 shadow' : 'hover:bg-blue-50 text-blue-700'}`}>
          <span className="text-base">In Progress (4)</span>
        </button>
        <button onClick={() => setLibraryTab('roleplays')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-left transition border border-transparent ${libraryTab === 'roleplays' ? 'bg-blue-100 text-blue-800 border-blue-300 shadow' : 'hover:bg-blue-50 text-blue-700'}`}>
          <span className="text-base">My Role Plays</span>
        </button>
        <button onClick={() => setLibraryTab('saved')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-left transition border border-transparent ${libraryTab === 'saved' ? 'bg-blue-100 text-blue-800 border-blue-300 shadow' : 'hover:bg-blue-50 text-blue-700'}`}>
          <span className="text-base">Saved</span>
        </button>
        <button onClick={() => setLibraryTab('collections')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-left transition border border-transparent ${libraryTab === 'collections' ? 'bg-blue-100 text-blue-800 border-blue-300 shadow' : 'hover:bg-blue-50 text-blue-700'}`}>
          <span className="text-base">My Collections</span>
        </button>
        <button onClick={() => setLibraryTab('history')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-left transition border border-transparent ${libraryTab === 'history' ? 'bg-blue-100 text-blue-800 border-blue-300 shadow' : 'hover:bg-blue-50 text-blue-700'}`}>
          <span className="text-base">Learning History (11)</span>
        </button>
      </div>
      {/* Tab Content */}
      <div className="flex-1">
        {libraryTab === 'inprogress' && (
          <div>
            <h3 className="text-xl font-bold text-blue-800 mb-4">In Progress</h3>
            <div className="space-y-8">
              {/* Course 1 */}
              <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow border border-blue-100 overflow-hidden">
                <div className="md:w-64 w-full h-48 md:h-auto flex-shrink-0 bg-black flex items-center justify-center">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/1Rs2ND1ryYc" title="React Basics" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                </div>
                <div className="flex-1 p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Course</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-semibold text-gray-600">By: Aimee Reese</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-semibold text-gray-600">Jan 2018</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-blue-900">React Basics</span>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-semibold">44m</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-500 mb-1">
                    <span>43m 40s left</span>
                  </div>
                  {/* Progress bar for duration */}
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-blue-500" style={{ width: '15%' }}></div>
                  </div>
                  <div className="border-t border-blue-50 my-2"></div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Learning Path</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-semibold text-blue-900">Become a Technical Program Manager</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">Apr 2019</span>
                  </div>
                </div>
              </div>
              {/* Course 2 */}
              <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow border border-blue-100 overflow-hidden">
                <div className="md:w-64 w-full h-48 md:h-auto flex-shrink-0 bg-black flex items-center justify-center">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/PkZNo7MFNFg" title="Agile Foundations" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                </div>
                <div className="flex-1 p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Course</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-semibold text-gray-600">By: Doug Rose</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-semibold text-gray-600">Updated Jun 2024</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-blue-900">Agile Foundations</span>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-semibold">1h 35m</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-500 mb-1">
                    <span>1h 27m 22s left</span>
                  </div>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-blue-500" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
              {/* Course 3 */}
              <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow border border-blue-100 overflow-hidden">
                <div className="md:w-64 w-full h-48 md:h-auto flex-shrink-0 bg-black flex items-center justify-center">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/2eebptXfEvw" title="Data Analytics for Business Professionals" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                </div>
                <div className="flex-1 p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Course</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-semibold text-gray-600">By: John Johnson</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">Jun 2022</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-blue-900">Data Analytics for Business Professionals (2022)</span>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-semibold">1h 16m</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-500 mb-1">
                    <span>1h 2m 52s left</span>
                  </div>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {libraryTab === 'roleplays' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-blue-800">My Role Plays</h3>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition focus:outline-none"
                onClick={() => setShowRolePlayModal(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Role Play
              </button>
            </div>
            {/* Modal for adding role play */}
            {showRolePlayModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-blue-600" onClick={() => setShowRolePlayModal(false)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <h4 className="text-lg font-bold mb-4 text-blue-800">Add Role Play</h4>
                  <form onSubmit={e => {
                    e.preventDefault();
                    if (!rolePlayTitle.trim()) return;
                    setRolePlays([...rolePlays, { title: rolePlayTitle, description: rolePlayDesc }]);
                    setRolePlayTitle("");
                    setRolePlayDesc("");
                    setShowRolePlayModal(false);
                  }}>
                    <label className="block mb-2 text-sm font-semibold text-blue-700">Title</label>
                    <input
                      className="w-full mb-4 px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={rolePlayTitle}
                      onChange={e => setRolePlayTitle(e.target.value)}
                      placeholder="e.g. Handling Difficult Customers"
                      required
                    />
                    <label className="block mb-2 text-sm font-semibold text-blue-700">Description</label>
                    <textarea
                      className="w-full mb-4 px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={rolePlayDesc}
                      onChange={e => setRolePlayDesc(e.target.value)}
                      placeholder="Describe the scenario..."
                      rows={3}
                    />
                    <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Add</button>
                  </form>
                </div>
              </div>
            )}
            {/* List of role plays */}
            {rolePlays.length === 0 ? (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px] text-blue-700">
                <svg className="w-12 h-12 mb-2 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                <span className="text-lg font-semibold mb-1">No role plays yet</span>
                <span className="text-sm text-blue-600">Click "Add Role Play" to create your first role play scenario.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {rolePlays.map((rp, idx) => (
                  <div key={idx} className="bg-white border border-blue-100 rounded-xl p-5 shadow flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-bold text-blue-900">{rp.title}</span>
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-semibold">Role Play</span>
                    </div>
                    <div className="text-sm text-blue-700">{rp.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)}
{selectedMenu === 'learn' && learnSubmenu === 'content' && (
  <div className="p-8 max-w-5xl mx-auto animate-fade-in">
    <h2 className="text-2xl font-extrabold text-blue-900 mb-4 flex items-center gap-2">
      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><rect x="6" y="3" width="12" height="4" rx="1" /></svg>
      My Content
    </h2>
    {/* Hero/Quick Actions */}
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
      <div>
        <h3 className="text-xl font-bold text-blue-800 mb-1">Create and Share Your Learning Content</h3>
        <p className="text-blue-700 text-sm mb-2">Upload resources, share videos, and manage your personal learning materials.</p>
        {userRole === 'teacher' && (
          <button className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Upload New Content</button>
        )}
      </div>
      <img src="/file.svg" alt="Content" className="w-24 h-24 md:w-32 md:h-32" />
    </div>
    {/* User Content List */}
    <div className="mb-8">
      <h4 className="text-lg font-semibold text-blue-700 mb-3">Your Uploaded Content</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-blue-100 rounded-xl p-5 shadow flex flex-col gap-2">
          <span className="font-bold text-blue-900">Effective Communication Slides</span>
          <span className="text-xs text-blue-600">PDF • Uploaded 2 days ago</span>
          <span className="text-xs text-gray-500">A quick guide to effective workplace communication.</span>
          <div className="flex gap-2 mt-2">
            <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">View</button>
            {userRole === 'teacher' && (
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Edit</button>
            )}
          </div>
        </div>
        <div className="bg-white border border-blue-100 rounded-xl p-5 shadow flex flex-col gap-2">
          <span className="font-bold text-blue-900">Intro to Project Management Video</span>
          <span className="text-xs text-blue-600">Video • Uploaded 1 week ago</span>
          <span className="text-xs text-gray-500">Short video on project management basics.</span>
          <div className="flex gap-2 mt-2">
            <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">View</button>
            {userRole === 'teacher' && (
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Edit</button>
            )}
          </div>
        </div>
      </div>
    </div>
    {/* Favorite Content */}
    <div>
      <h4 className="text-lg font-semibold text-blue-700 mb-3">Favorite Content</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-blue-100 rounded-xl p-5 shadow flex flex-col gap-2">
          <span className="font-bold text-blue-900">Design Thinking Toolkit</span>
          <span className="text-xs text-blue-600">PDF • Favorited</span>
          <span className="text-xs text-gray-500">Templates and guides for design thinking workshops.</span>
          <div className="flex gap-2 mt-2">
            <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">View</button>
          </div>
        </div>
        <div className="bg-white border border-blue-100 rounded-xl p-5 shadow flex flex-col gap-2">
          <span className="font-bold text-blue-900">Agile Methodology Cheat Sheet</span>
          <span className="text-xs text-blue-600">PDF • Favorited</span>
          <span className="text-xs text-gray-500">Quick reference for agile practices.</span>
          <div className="flex gap-2 mt-2">
            <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">View</button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
          </main>
        </div>
      </div>
    );
}

