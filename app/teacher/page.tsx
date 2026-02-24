"use client";
import { useEffect, useState, useRef } from "react";
// Dynamically import JSZip for browser use
async function launchScorm(scormFile: File) {
  if (!scormFile) return;
  // @ts-ignore
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const loaded = await zip.loadAsync(scormFile);
  let indexPath = Object.keys(loaded.files).find(
    (f) => f.toLowerCase().endsWith("index.html")
  );
  if (!indexPath) {
    alert("No index.html found in SCORM package.");
    return;
  }
  const htmlContent = await loaded.files[indexPath].async("blob");
  const url = URL.createObjectURL(htmlContent);
  window.open(url, "_blank");
}
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddCoursePage from "./AddCoursePage";

export default function TeacherDashboard() {
  // Analytics course filter state
  const [selectedAnalyticsCourse, setSelectedAnalyticsCourse] = useState<string>("");
  // Quiz Builder State
  type SectionType = 'home' | 'courses' | 'add' | 'categories' | 'quiz' | 'analytics';
  const [activeSection, setActiveSection] = useState<SectionType>('home');

  type Question = {
    type: string;
    text: string;
    options?: { text: string; correct: boolean }[];
    points: number;
    feedback?: string;
  };
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    description: '',
    course: '',
    timeLimit: '',
    attempts: '1',
    shuffle: false,
    passing: '',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number>(-1);
  const [questionDraft, setQuestionDraft] = useState<Question>({
    type: 'Multiple Choice',
    text: '',
    options: [{ text: '', correct: false }, { text: '', correct: false }],
    points: 1,
    feedback: ''
  });
  const [user, setUser] = useState<{ email: string, name?: string, avatar?: string } | null>(null);
  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("swipe-lms-teacher-categories");
      return stored ? JSON.parse(stored) : ["Technology", "Creative"];
    }
    return ["Technology", "Creative"];
  });
  const [courses, setCourses] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("swipe-lms-teacher-courses");
      return stored ? JSON.parse(stored) : [
        { title: "React Basics", category: "Technology", content: "", scorm: null, status: "Published", students: 12 },
        { title: "Advanced JavaScript", category: "Technology", content: "", scorm: null, status: "Draft", students: 7 },
      ];
    }
    return [
      { title: "React Basics", category: "Technology", content: "", scorm: null, status: "Published", students: 12 },
      { title: "Advanced JavaScript", category: "Technology", content: "", scorm: null, status: "Draft", students: 7 },
    ];
  });
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editCourseIdx, setEditCourseIdx] = useState<number|null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryIdx, setEditCategoryIdx] = useState<number|null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [newCourse, setNewCourse] = useState<{ title: string; category: string; content: string; scorm: File | null; status: string }>(
    { title: "", category: categories[0] || "Technology", content: "", scorm: null, status: "Draft" }
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showGrading, setShowGrading] = useState(false);
  const [viewSubmission, setViewSubmission] = useState(null as null | { student: string; course: string; assignment: string; submission: string });
  const [showRubric, setShowRubric] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  // ...existing code...
  const dropdownBtnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("swipe-lms-auth");
    const userData = localStorage.getItem("swipe-lms-user");
    if (!auth || !userData) {
      router.push("/signin");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // Persist categories and courses
  useEffect(() => {
    localStorage.setItem("swipe-lms-teacher-categories", JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem("swipe-lms-teacher-courses", JSON.stringify(courses));
  }, [courses]);

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

  if (!user) return null;


  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      setShowCategoryForm(false);
    }
  }

  function handleEditCategory(e: React.FormEvent) {
    e.preventDefault();
    if (editCategoryIdx !== null && editCategoryName && !categories.includes(editCategoryName)) {
      const oldName = categories[editCategoryIdx];
      const updatedCategories = [...categories];
      updatedCategories[editCategoryIdx] = editCategoryName;
      setCategories(updatedCategories);
      // Update courses with new category name
      setCourses(courses.map(c => c.category === oldName ? { ...c, category: editCategoryName } : c));
      setEditCategoryIdx(null);
      setEditCategoryName("");
    }
  }

  function handleDeleteCategory(idx: number) {
    const cat = categories[idx];
    if (window.confirm(`Delete category "${cat}"? This will remove the category from all courses.`)) {
      setCategories(categories.filter((_, i) => i !== idx));
      setCourses(courses.map(c => c.category === cat ? { ...c, category: "Uncategorized" } : c));
    }
  }

  function handleAddOrEditCourse(e: React.FormEvent) {
    e.preventDefault();
    if (newCourse.title && newCourse.category) {
      const slug = newCourse.title ? newCourse.title.replace(/\s+/g, '').toLowerCase() : `t${courses.length}`;
      if (editCourseIdx !== null) {
        // Edit existing
        const updated = [...courses];
        updated[editCourseIdx] = { ...newCourse, id: slug };
        setCourses(updated);
      } else {
        setCourses([...courses, { ...newCourse, id: slug, students: 0 }]);
      }
      setNewCourse({ title: "", category: categories[0] || "Technology", content: "", scorm: null, status: "Draft" });
      setShowCourseForm(false);
      setEditCourseIdx(null);
    }
  }

  function handleCourseContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNewCourse({ ...newCourse, content: e.target.value });
  }

  function handleScormChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewCourse({ ...newCourse, scorm: e.target.files?.[0] || null });
  }

  // Replace the main return with a dashboard-style layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="w-full h-16 bg-white/90 border-b border-blue-100 shadow flex items-center px-6 z-30 sticky top-0">
        <div className="flex items-center gap-2">
          <img src="/globe.svg" alt="Logo" className="h-8 w-8" />
          <span className="font-extrabold text-xl text-blue-700 tracking-tight">SwipeLMS Teacher</span>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-blue-100 transition relative group" onClick={() => setShowNotifications(s => !s)}>
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">2</span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-blue-100 rounded-xl shadow-lg py-3 z-50 animate-fade-in">
                <h4 className="px-4 pb-2 text-blue-800 font-bold text-base">Notifications</h4>
                <div className="flex flex-col gap-2 px-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">New Enrollment</span>
                    <span className="text-blue-900 text-sm">John Doe enrolled in React Basics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">Announcement</span>
                    <span className="text-blue-900 text-sm">Platform update: New analytics dashboard released!</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Messages Dropdown */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-blue-100 transition relative group" onClick={() => setShowMessages(s => !s)}>
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">2</span>
            </button>
            {showMessages && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-blue-100 rounded-xl shadow-lg py-3 z-50 animate-fade-in">
                <h4 className="px-4 pb-2 text-blue-800 font-bold text-base">Messages</h4>
                <div className="flex flex-col gap-2 px-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">Message</span>
                    <span className="text-blue-900 text-sm">Jane Smith: "I have a question about Assignment 2."</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">Message</span>
                    <span className="text-blue-900 text-sm">Alex Lee: "Can you extend the deadline for Quiz 1?"</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition focus:outline-none"
              onClick={() => setDropdownOpen((open) => !open)}
              ref={dropdownBtnRef}
              type="button"
            >
              <img src={user.avatar || "/freepik__the-style-is-candid-image-photography-with-natural__21042.png"} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-blue-200" />
              <svg className={`h-4 w-4 text-blue-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-blue-100 rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 text-blue-900 font-bold border-b border-blue-100">{user.name || user.email.split("@")[0]}</div>
                <div className="px-4 py-2 text-blue-700 text-sm border-b border-blue-100">{user.email}</div>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-blue-50"
                  onClick={() => {
                    localStorage.removeItem("swipe-lms-auth");
                    window.location.href = "/signin";
                  }}
                >Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 px-4 bg-white/90 border-r border-blue-100 shadow-lg py-0 pt-4 gap-2 text-blue-900 text-base font-medium sticky top-16 h-[calc(100vh-4rem)] z-20 relative transition-all duration-200">
          <nav className="flex-1 flex flex-col gap-1">
            <a className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer font-bold ${activeSection === 'home' ? 'bg-blue-100' : ''}`} onClick={() => setActiveSection('home')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z" /></svg>
              Teacher Home
            </a>
            <a className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${activeSection === 'courses' ? 'bg-blue-100 font-bold' : ''}`} onClick={() => setActiveSection('courses')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 7v-6m0 0l-9-5m9 5l9-5" /></svg>
              My Courses
            </a>
            <a className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${activeSection === 'analytics' ? 'bg-blue-100 font-bold' : ''}`} onClick={() => setActiveSection('analytics')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2M7 13V7a4 4 0 018 0v6" /></svg>
              Analytics & Reports
            </a>
            <a className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${activeSection === 'quiz' ? 'bg-blue-100 font-bold' : ''}`} onClick={() => setActiveSection('quiz')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 01-8 0M12 3v4m0 0a4 4 0 01-4 4H4m8-4a4 4 0 014 4h4m-8 0v4m0 0a4 4 0 004 4h4m-8-4a4 4 0 01-4 4H4" /></svg>
              My Quiz
            </a>
            <a className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${activeSection === 'add' ? 'bg-blue-100 font-bold' : ''}`} onClick={() => setActiveSection('add')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Create Course
            </a>
            <a className={`py-2 px-3 rounded hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer ${activeSection === 'categories' ? 'bg-blue-100 font-bold' : ''}`} onClick={() => setActiveSection('categories')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="7" width="18" height="13" rx="2" /><rect x="6" y="3" width="12" height="4" rx="1" /></svg>
              Categories
            </a>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8 max-w-6xl mx-auto">
          {/* Main Content for Sidebar Tabs */}
        {activeSection === 'analytics' && (
          <section className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
              <h1 className="text-3xl font-black text-amber-700 tracking-tight flex items-center gap-3">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2M7 13V7a4 4 0 018 0v6" /></svg>
                Analytics & Reports
              </h1>
              <div className="flex items-center gap-2 bg-white/80 rounded-xl shadow px-4 py-2">
                <label className="font-semibold text-blue-800 mr-2">Filter by Course:</label>
                <select className="px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-amber-400" value={selectedAnalyticsCourse} onChange={e => setSelectedAnalyticsCourse(e.target.value)}>
                  <option value="">All Courses</option>
                  {courses.map((c, i) => <option key={i} value={c.title}>{c.title}</option>)}
                </select>
              </div>
            </div>
            {/* General Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="rounded-3xl shadow-xl p-8 flex flex-col items-center min-w-[120px] hover:scale-[1.03] transition-transform group cursor-pointer" style={{background: 'linear-gradient(135deg, #003078 60%, #f0f4fa 100%)'}}>
                <svg className="w-8 h-8 mb-2 group-hover:text-[#f0a800] transition" fill="none" stroke="#f0a800" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
                <span className="text-3xl font-extrabold text-white">{courses.length}</span>
                <span className="text-sm text-blue-100 font-semibold mt-1">Courses</span>
              </div>
              <div className="rounded-3xl shadow-xl p-8 flex flex-col items-center min-w-[120px] hover:scale-[1.03] transition-transform group cursor-pointer" style={{background: 'linear-gradient(135deg, #a81818 60%, #fbe9e9 100%)'}}>
                <svg className="w-8 h-8 mb-2 group-hover:text-[#f0a800] transition" fill="none" stroke="#f0a800" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" /></svg>
                <span className="text-3xl font-extrabold text-white">3</span>
                <span className="text-sm text-red-100 font-semibold mt-1">Active Students</span>
              </div>
              <div className="rounded-3xl shadow-xl p-8 flex flex-col items-center min-w-[120px] hover:scale-[1.03] transition-transform group cursor-pointer" style={{background: 'linear-gradient(135deg, #f0a800 60%, #fffbe6 100%)'}}>
                <svg className="w-8 h-8 mb-2 group-hover:text-[#003078] transition" fill="none" stroke="#003078" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 8v8" /></svg>
                <span className="text-3xl font-extrabold text-[#003078]">87%</span>
                <span className="text-sm text-yellow-900 font-semibold mt-1">Avg. Completion</span>
              </div>
            </div>

            {/* Course Progress Tracking Section */}
            <div className="bg-white/80 rounded-3xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-7 h-7 text-[#003078]" fill="none" stroke="#003078" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Course Progress Tracking
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Per Student View */}
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#003078]">Per Student View</h4>
                  <div className="space-y-4">
                    {/* Dummy student data */}
                    {[{
                      name: 'Alice Johnson',
                      percent: 82,
                      modules: [
                        { name: 'Intro', done: true, time: 8 },
                        { name: 'Module 1', done: true, time: 22 },
                        { name: 'Module 2', done: false, time: 5 },
                        { name: 'Quiz 1', done: false, time: 0 },
                      ]
                    }, {
                      name: 'Brian Lee',
                      percent: 56,
                      modules: [
                        { name: 'Intro', done: true, time: 6 },
                        { name: 'Module 1', done: true, time: 15 },
                        { name: 'Module 2', done: false, time: 2 },
                        { name: 'Quiz 1', done: false, time: 0 },
                      ]
                    }].map((student, idx) => (
                      <div key={idx} className="bg-[#f0f4fa] rounded-xl p-4 shadow flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#003078]">{student.name}</span>
                          <span className="text-sm text-gray-500">{student.percent}% completed</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div className="h-3 rounded-full" style={{ width: `${student.percent}%`, background: 'linear-gradient(90deg, #003078 60%, #f0a800 100%)' }}></div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {student.modules.map((mod, i) => (
                            <div key={i} className={`px-2 py-1 rounded-lg flex items-center gap-1 ${mod.done ? 'bg-[#003078] text-white' : 'bg-gray-100 text-gray-600'}`}>
                              <span>{mod.name}</span>
                              {mod.done && <svg className="w-3 h-3 text-[#f0a800]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" /></svg>}
                              <span className="ml-1 text-[10px] text-[#a81818]">{mod.time}m</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Per Class View */}
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#a81818]">Per Class View</h4>
                  <div className="bg-[#fffbe6] rounded-xl p-4 shadow flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[#a81818]">Average Completion Rate</span>
                      <span className="text-2xl font-bold text-[#003078]">69%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="h-3 rounded-full" style={{ width: '69%', background: 'linear-gradient(90deg, #a81818 60%, #f0a800 100%)' }}></div>
                    </div>
                    {/* Drop-off points heatmap (dummy) */}
                    <div>
                      <span className="font-semibold text-[#003078]">Drop-off Points</span>
                      <div className="flex gap-2 mt-2">
                        {/* Each bar is a module, height = engagement, color = drop-off */}
                        {[80, 60, 35, 20].map((val, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div className="w-6 rounded-t-lg" style={{height: `${val}px`, background: val < 40 ? '#a81818' : val < 70 ? '#f0a800' : '#003078', transition: 'background 0.3s'}}></div>
                            <span className="text-xs mt-1 text-gray-500">M{i+1}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Lower bars indicate where students stop engaging</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Analytics: Quiz Insights */}
            <div className="bg-white/80 rounded-3xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-7 h-7 text-[#a81818]" fill="none" stroke="#a81818" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" /></svg>
                Assessment Analytics: Quiz Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Average scores per quiz */}
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#003078]">Average Scores Per Quiz</h4>
                  <div className="space-y-4">
                    {/* Dummy quiz data */}
                    {[{
                      quiz: 'React Basics Quiz',
                      avg: 78,
                      attempts: 12
                    }, {
                      quiz: 'JS Advanced Quiz',
                      avg: 62,
                      attempts: 8
                    }].map((q, idx) => (
                      <div key={idx} className="bg-[#f0f4fa] rounded-xl p-4 shadow flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#003078]">{q.quiz}</span>
                          <span className="text-sm text-gray-500">{q.attempts} attempts</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div className="h-3 rounded-full" style={{ width: `${q.avg}%`, background: 'linear-gradient(90deg, #a81818 60%, #f0a800 100%)' }}></div>
                        </div>
                        <span className="text-sm text-[#a81818] font-bold">{q.avg}% avg. score</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Time taken per quiz attempt */}
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-[#f0a800]">Time Taken Per Quiz Attempt</h4>
                  <div className="space-y-4">
                    {[{
                      quiz: 'React Basics Quiz',
                      times: [12, 15, 10, 14, 13, 11, 16, 12, 13, 15, 14, 13]
                    }, {
                      quiz: 'JS Advanced Quiz',
                      times: [18, 20, 17, 19, 21, 16, 18, 20]
                    }].map((q, idx) => (
                      <div key={idx} className="bg-[#fffbe6] rounded-xl p-4 shadow flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#a81818]">{q.quiz}</span>
                          <span className="text-sm text-gray-500">{q.times.length} attempts</span>
                        </div>
                        <div className="flex gap-1 items-end h-16">
                          {q.times.map((t, i) => (
                            <div key={i} className="w-3 rounded-t bg-[#f0a800]" style={{height: `${t*4}px`}} title={`Attempt ${i+1}: ${t} min`}></div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">Each bar = 1 attempt ({q.times.reduce((a,b)=>a+b,0)/q.times.length|0} min avg)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Question-level analysis */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-2 text-[#003078]">Question-Level Analysis</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="px-3 py-2 text-left">Quiz</th>
                        <th className="px-3 py-2 text-left">Question</th>
                        <th className="px-3 py-2 text-left">Correct (%)</th>
                        <th className="px-3 py-2 text-left">Failed (%)</th>
                        <th className="px-3 py-2 text-left">Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Dummy data */}
                      {[
                        { quiz: 'React Basics Quiz', question: 'What is JSX?', correct: 85, failed: 15 },
                        { quiz: 'React Basics Quiz', question: 'React state is...', correct: 60, failed: 40 },
                        { quiz: 'React Basics Quiz', question: 'Q5: useEffect runs when?', correct: 30, failed: 70 },
                        { quiz: 'JS Advanced Quiz', question: 'Hooks are used for?', correct: 40, failed: 60 },
                        { quiz: 'JS Advanced Quiz', question: 'Q5: Closures are...', correct: 25, failed: 75 },
                      ].map((row, i) => (
                        <tr key={i} className={row.failed >= 60 ? 'bg-red-50' : ''}>
                          <td className="px-3 py-2">{row.quiz}</td>
                          <td className="px-3 py-2">{row.question}</td>
                          <td className="px-3 py-2 text-green-700 font-bold">{row.correct}%</td>
                          <td className="px-3 py-2 text-red-600 font-bold">{row.failed}%</td>
                          <td className="px-3 py-2">{row.failed >= 60 ? <span className="text-xs bg-[#a81818] text-white px-2 py-1 rounded">Flag</span> : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-xs text-gray-500 mt-2">Questions with high failure rates are flagged for review.</div>
                </div>
              </div>
            </div>
            {/* Course Progress Reports */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-blue-800 mb-2">Course Progress</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-3 py-2 text-left">Student</th>
                      <th className="px-3 py-2 text-left">Course</th>
                      <th className="px-3 py-2 text-left">Progress</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Dummy data, filter by selected course */}
                    {[
                      { student: 'Alice', course: 'React Basics', progress: 80, status: 'In Progress' },
                      { student: 'Bob', course: 'React Basics', progress: 100, status: 'Completed' },
                      { student: 'Carol', course: 'Advanced JavaScript', progress: 40, status: 'Dropped Out' },
                    ].filter(row => !selectedAnalyticsCourse || row.course === selectedAnalyticsCourse).map((row, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">{row.student}</td>
                        <td className="px-3 py-2">{row.course}</td>
                        <td className="px-3 py-2"><div className="w-32 bg-blue-100 rounded h-3"><div className="bg-blue-500 h-3 rounded" style={{width:`${row.progress}%`}}></div></div> {row.progress}%</td>
                        <td className={`px-3 py-2 font-bold ${row.status === 'Completed' ? 'text-amber-600' : row.status === 'Dropped Out' ? 'text-red-600' : 'text-green-600'}`}>{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Engagement Heatmap */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-blue-800 mb-2">Engagement Heatmap</h2>
              <div className="flex flex-col gap-2">
                <div className="text-blue-700 text-sm">Video: {selectedAnalyticsCourse ? `${selectedAnalyticsCourse} - Lesson 2` : 'React Basics - Lesson 2'}</div>
                <div className="w-full h-8 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 rounded relative overflow-hidden">
                  {/* Simulated heatmap bars */}
                  <div className="absolute left-0 top-0 h-full bg-amber-400/80" style={{width:'10%', opacity:0.7}}></div>
                  <div className="absolute left-[10%] top-0 h-full bg-blue-600/80" style={{width:'20%', opacity:0.7}}></div>
                  <div className="absolute left-[30%] top-0 h-full bg-blue-300/80" style={{width:'15%', opacity:0.7}}></div>
                  <div className="absolute left-[45%] top-0 h-full bg-amber-400/80" style={{width:'10%', opacity:0.7}}></div>
                  <div className="absolute left-[55%] top-0 h-full bg-blue-600/80" style={{width:'25%', opacity:0.7}}></div>
                  <div className="absolute left-[80%] top-0 h-full bg-blue-300/80" style={{width:'20%', opacity:0.7}}></div>
                </div>
                <div className="flex justify-between text-xs text-blue-400 mt-1">
                  <span>0:00</span>
                  <span>2:00</span>
                  <span>4:00</span>
                  <span>6:00</span>
                  <span>8:00</span>
                  <span>10:00</span>
                </div>
                <div className="text-xs text-blue-500">Darker bars = more replays/views</div>
              </div>
            </div>
            {/* Quiz Performance */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-blue-800 mb-2">Quiz Performance (Per Question)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-3 py-2 text-left">Question</th>
                      <th className="px-3 py-2 text-left">Correct (%)</th>
                      <th className="px-3 py-2 text-left">Most Common Wrong Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Dummy data, filter by selected course */}
                    {[
                      { course: 'React Basics', question: 'What is JSX?', correct: 85, wrong: 'HTML' },
                      { course: 'React Basics', question: 'React state is...', correct: 60, wrong: 'A prop' },
                      { course: 'Advanced JavaScript', question: 'Hooks are used for?', correct: 40, wrong: 'Styling' },
                    ].filter(row => !selectedAnalyticsCourse || row.course === selectedAnalyticsCourse).map((row, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">{row.question}</td>
                        <td className="px-3 py-2 text-green-700 font-bold">{row.correct}%</td>
                        <td className="px-3 py-2 text-red-600">{row.wrong}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Dropout/Completion Rates */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-blue-800 mb-2">Dropout & Completion Rates</h2>
              <div className="flex gap-8 items-center">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-green-600">72%</span>
                  <span className="text-xs text-green-900 font-semibold">Completion Rate</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-red-600">28%</span>
                  <span className="text-xs text-red-900 font-semibold">Dropout Rate</span>
                </div>
              </div>
            </div>
          </section>
        )}
  // ...existing code...
        {activeSection === 'quiz' && (
          <section className="space-y-8">
            <h1 className="text-2xl font-extrabold text-pink-700 mb-2">Quiz Builder</h1>
            {/* Quiz Details Section */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-blue-800">Quiz Title</label>
                  <input className="w-full px-3 py-2 border border-blue-200 rounded-lg mt-1" placeholder="Enter quiz title"
                    value={quizDetails.title}
                    onChange={e => setQuizDetails(q => ({ ...q, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="font-semibold text-blue-800">Associated Course/Module</label>
                  <select className="w-full px-3 py-2 border border-blue-200 rounded-lg mt-1"
                    value={quizDetails.course}
                    onChange={e => setQuizDetails(q => ({ ...q, course: e.target.value }))}
                  >
                    <option value="">Select course</option>
                    {courses.map((c, i) => <option key={i} value={c.title}>{c.title}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="font-semibold text-blue-800">Description/Instructions</label>
                  <textarea className="w-full px-3 py-2 border border-blue-200 rounded-lg mt-1 min-h-[60px]" placeholder="Describe the quiz, instructions, etc."
                    value={quizDetails.description}
                    onChange={e => setQuizDetails(q => ({ ...q, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="font-semibold text-blue-800">Time Limit (minutes)</label>
                  <input type="number" min="0" className="w-full px-3 py-2 border border-blue-200 rounded-lg mt-1" placeholder="Optional"
                    value={quizDetails.timeLimit}
                    onChange={e => setQuizDetails(q => ({ ...q, timeLimit: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="font-semibold text-blue-800">Number of Attempts</label>
                  <select className="w-full px-3 py-2 border border-blue-200 rounded-lg mt-1"
                    value={quizDetails.attempts}
                    onChange={e => setQuizDetails(q => ({ ...q, attempts: e.target.value }))}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-blue-800">Shuffle Questions/Answers</label>
                  <input type="checkbox" className="ml-2 align-middle"
                    checked={quizDetails.shuffle}
                    onChange={e => setQuizDetails(q => ({ ...q, shuffle: e.target.checked }))}
                  />
                </div>
                <div>
                  <label className="font-semibold text-blue-800">Passing Grade (%)</label>
                  <input type="number" min="0" max="100" className="w-full px-3 py-2 border border-blue-200 rounded-lg mt-1" placeholder="e.g. 70"
                    value={quizDetails.passing}
                    onChange={e => setQuizDetails(q => ({ ...q, passing: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            {/* Question Bank Builder */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-blue-700 mb-2">Question Bank</h2>
              {/* Add/Edit Question Form */}
              <div className="border border-blue-100 rounded-lg p-4 mb-4">
                <div className="flex flex-col md:flex-row gap-4 mb-2">
                  <div className="flex-1">
                    <label className="font-semibold text-blue-800">Question Type</label>
                    <select className="w-full px-3 py-2 border border-blue-200 rounded-lg mt-1"
                      value={questionDraft.type}
                      onChange={e => setQuestionDraft(q => ({ ...q, type: e.target.value }))}
                    >
                      <option>Multiple Choice</option>
                      <option>Multiple Select</option>
                      <option>True/False</option>
                      <option>Short Answer</option>
                      <option>Fill-in-the-Blank</option>
                      <option>Matching / Ordering</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="font-semibold text-blue-800">Points</label>
                    <input type="number" min="1" className="w-full px-3 py-2 border border-blue-200 rounded-lg mt-1" placeholder="e.g. 1"
                      value={questionDraft.points}
                      onChange={e => setQuestionDraft(q => ({ ...q, points: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="font-semibold text-blue-800">Question Text</label>
                  <textarea className="w-full px-3 py-2 border border-blue-200 rounded-lg mt-1 min-h-[60px]" placeholder="Enter question text, support images/videos (coming soon)"
                    value={questionDraft.text}
                    onChange={e => setQuestionDraft(q => ({ ...q, text: e.target.value }))}
                  />
                </div>
                {/* Answer Options UI (example for MCQ) */}
                {(questionDraft.type === 'Multiple Choice' || questionDraft.type === 'Multiple Select') && (
                  <div className="mb-2">
                    <label className="font-semibold text-blue-800">Answer Options</label>
                    <div className="flex flex-col gap-2 mt-1">
                      {(questionDraft.options ?? []).map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input className="flex-1 px-2 py-1 border border-blue-200 rounded" placeholder={`Option ${i+1}`}
                            value={opt.text}
                            onChange={e => setQuestionDraft(q => {
                              const options = [...(q.options ?? [])];
                              options[i] = { ...options[i], text: e.target.value };
                              return { ...q, options };
                            })}
                          />
                          <input type={questionDraft.type === 'Multiple Choice' ? 'radio' : 'checkbox'}
                            checked={!!opt.correct}
                            name="correct"
                            onChange={e => setQuestionDraft(q => {
                              const options = [...(q.options ?? [])];
                              if (questionDraft.type === 'Multiple Choice') {
                                options.forEach((o, idx) => options[idx] = { ...o, correct: false });
                                options[i].correct = true;
                              } else {
                                options[i].correct = e.target.checked;
                              }
                              return { ...q, options };
                            })}
                          />
                          <span className="text-xs text-blue-700">Correct</span>
                          <button className="text-xs text-red-500 ml-2" onClick={() => setQuestionDraft(q => ({ ...q, options: (q.options ?? []).filter((_, idx) => idx !== i) }))}>Remove</button>
                        </div>
                      ))}
                    </div>
                    <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                      onClick={() => setQuestionDraft(q => ({ ...q, options: [...(q.options ?? []), { text: '', correct: false }] }))}
                    >+ Add Option</button>
                  </div>
                )}
                <div className="mb-2">
                  <label className="font-semibold text-blue-800">Feedback (optional)</label>
                  <textarea className="w-full px-3 py-2 border border-blue-200 rounded-lg mt-1 min-h-[40px]" placeholder="Feedback shown after answer (optional)"
                    value={questionDraft.feedback}
                    onChange={e => setQuestionDraft(q => ({ ...q, feedback: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  {editingQuestionIdx === -1 ? (
                    <button className="px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700"
                      onClick={() => {
                        setQuestions(qs => [...qs, questionDraft]);
                        setQuestionDraft({ type: 'Multiple Choice', text: '', options: [{ text: '', correct: false }, { text: '', correct: false }], points: 1, feedback: '' });
                      }}
                    >Save Question</button>
                  ) : (
                    <>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        onClick={() => {
                          setQuestions(qs => qs.map((q, i) => i === editingQuestionIdx ? questionDraft : q));
                          setEditingQuestionIdx(-1);
                          setQuestionDraft({ type: 'Multiple Choice', text: '', options: [{ text: '', correct: false }, { text: '', correct: false }], points: 1, feedback: '' });
                        }}
                      >Update</button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                        onClick={() => {
                          setEditingQuestionIdx(-1);
                          setQuestionDraft({ type: 'Multiple Choice', text: '', options: [{ text: '', correct: false }, { text: '', correct: false }], points: 1, feedback: '' });
                        }}
                      >Cancel</button>
                    </>
                  )}
                </div>
              </div>
              {/* List of Questions */}
              <div className="divide-y divide-blue-100">
                {questions.length === 0 && <div className="text-blue-400 text-sm">No questions added yet.</div>}
                {questions.map((q, i) => (
                  <div key={i} className="py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="flex-1">
                      <div className="font-semibold text-blue-800">{q.type}</div>
                      <div className="text-blue-900">{q.text}</div>
                      {q.options && (
                        <ul className="list-disc ml-6 text-blue-700 text-sm">
                          {q.options.map((opt, j) => (
                            <li key={j} className={opt.correct ? 'font-bold text-green-700' : ''}>{opt.text} {opt.correct && <span className="ml-1">✔</span>}</li>
                          ))}
                        </ul>
                      )}
                      {q.feedback && <div className="text-xs text-blue-500 mt-1">Feedback: {q.feedback}</div>}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                        onClick={() => {
                          setEditingQuestionIdx(i);
                          setQuestionDraft(q);
                        }}
                      >Edit</button>
                      <button className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                        onClick={() => setQuestions(qs => qs.filter((_, idx) => idx !== i))}
                      >Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-blue-500">(More question types and advanced features coming soon!)</div>
            </div>
          </section>
        )}
          {activeSection === 'home' && (
            <section className="space-y-10">
              {/* Welcome & Quick Stats */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-blue-800 mb-1">Welcome, {user.name || user.email.split("@")[0]}!</h1>
                  <p className="text-blue-700 text-lg">Here's an overview of your teaching activity and updates.</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow p-6 flex flex-col items-center min-w-[120px]">
                    <span className="text-2xl font-extrabold text-blue-700">{courses.length}</span>
                    <span className="text-xs text-blue-900 font-semibold">Courses</span>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow p-6 flex flex-col items-center min-w-[120px]">
                    <span className="text-2xl font-extrabold text-green-700">{categories.length}</span>
                    <span className="text-xs text-green-900 font-semibold">Categories</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl shadow p-6 flex flex-col items-center min-w-[120px]">
                    <span className="text-2xl font-extrabold text-purple-700">{courses.reduce((sum, c) => sum + (c.students || 0), 0)}</span>
                    <span className="text-xs text-purple-900 font-semibold">Total Students</span>
                  </div>
                </div>
              </div>

              {/* Courses Overview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-blue-800">Your Courses</h2>
                  <button className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold shadow hover:bg-blue-700 transition text-base" onClick={() => setActiveSection('add')}>+ Create Course</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.length === 0 && (
                    <div className="col-span-full text-center text-blue-500 text-lg">No courses yet. Click "Create Course" to get started!</div>
                  )}
                  {courses.map((c, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-lg border border-blue-100 p-5 flex flex-col gap-3 relative group hover:shadow-2xl transition">
                      <div className="flex items-center gap-3 mb-2">
                        {c.thumbnail ? (
                          <img src={typeof c.thumbnail === 'string' ? c.thumbnail : URL.createObjectURL(c.thumbnail)} alt="Thumbnail" className="w-16 h-12 object-cover rounded border" />
                        ) : (
                          <div className="w-16 h-12 bg-blue-100 rounded border flex items-center justify-center text-blue-400 text-xl font-bold">📚</div>
                        )}
                        <span className="text-lg font-bold text-blue-900 flex-1 truncate">{c.title}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'Published' ? 'bg-green-100 text-green-700' : c.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{c.status || 'Draft'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-700 text-xs mb-1">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5V7a4 4 0 00-8 0v2m12 4v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h12a2 2 0 012 2z" /></svg>
                        <span>{c.students || 0} enrolled</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold" onClick={() => { setEditCourseIdx(i); setNewCourse({ ...c }); setShowCourseForm(true); }}>Edit</button>
                        <button className="px-3 py-1 bg-blue-50 text-blue-500 rounded hover:bg-blue-100 text-xs font-semibold">View</button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-semibold" onClick={() => setCourses(courses.filter((_, idx) => idx !== i))}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Stats & Assignments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                {/* Engagement Stats */}
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-6">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">Engagement Stats</h3>
                  <div className="flex flex-col gap-6">
                    {/* Dummy Bar Chart: Daily Active Students */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-blue-700">Daily Active Students</span>
                        <span className="text-xs text-blue-500">Last 7 days</span>
                      </div>
                      <svg viewBox="0 0 200 60" className="w-full h-20">
                        <rect x="10" y="30" width="15" height="25" fill="#3b82f6" rx="3" />
                        <rect x="35" y="20" width="15" height="35" fill="#60a5fa" rx="3" />
                        <rect x="60" y="10" width="15" height="45" fill="#2563eb" rx="3" />
                        <rect x="85" y="25" width="15" height="30" fill="#3b82f6" rx="3" />
                        <rect x="110" y="15" width="15" height="40" fill="#60a5fa" rx="3" />
                        <rect x="135" y="35" width="15" height="20" fill="#2563eb" rx="3" />
                        <rect x="160" y="20" width="15" height="35" fill="#3b82f6" rx="3" />
                      </svg>
                      <div className="flex justify-between text-xs text-blue-400 mt-1">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>
                    </div>
                    {/* Dummy Line Chart: Course Completion Rate */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-green-700">Course Completion Rate</span>
                        <span className="text-xs text-green-500">Last 6 months</span>
                      </div>
                      <svg viewBox="0 0 200 60" className="w-full h-20">
                        <polyline fill="none" stroke="#22c55e" strokeWidth="3" points="0,55 30,40 60,35 90,25 120,20 150,10 200,5" />
                        <circle cx="0" cy="55" r="3" fill="#22c55e" />
                        <circle cx="30" cy="40" r="3" fill="#22c55e" />
                        <circle cx="60" cy="35" r="3" fill="#22c55e" />
                        <circle cx="90" cy="25" r="3" fill="#22c55e" />
                        <circle cx="120" cy="20" r="3" fill="#22c55e" />
                        <circle cx="150" cy="10" r="3" fill="#22c55e" />
                        <circle cx="200" cy="5" r="3" fill="#22c55e" />
                      </svg>
                      <div className="flex justify-between text-xs text-green-400 mt-1">
                        <span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Assignments & Quizzes */}
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-6">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">Assignments & Quizzes</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-700">Pending Submissions to Grade</span>
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-700">Upcoming Deadlines</span>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">2</span>
                    </div>
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition w-fit" onClick={() => setShowGrading(true)}>Go to Grading</button>
              {/* Grading Modal */}
              {showGrading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl relative animate-fade-in">
                    <button className="absolute top-3 right-3 text-gray-400 hover:text-blue-600" onClick={() => setShowGrading(false)}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <h4 className="text-2xl font-bold mb-4 text-blue-800">Pending Submissions to Grade</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-2xl shadow border border-blue-100">
                        <thead>
                          <tr className="bg-blue-50 text-blue-700 text-left">
                            <th className="py-3 px-4 font-semibold">Student</th>
                            <th className="py-3 px-4 font-semibold">Course</th>
                            <th className="py-3 px-4 font-semibold">Assignment</th>
                            <th className="py-3 px-4 font-semibold">Submission</th>
                            <th className="py-3 px-4 font-semibold">Grade</th>
                            <th className="py-3 px-4 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Dummy submissions */}
                          {[
                            { student: "John Doe", course: "React Basics", assignment: "Quiz 1", submission: "A, C, D", grade: "", },
                            { student: "Jane Smith", course: "Advanced JavaScript", assignment: "Assignment 2", submission: "Essay.pdf", grade: "", },
                            { student: "Alex Lee", course: "React Basics", assignment: "Quiz 1", submission: "B, D, A", grade: "", },
                          ].map((s, i) => (
                            <tr key={i} className="border-t border-blue-50 hover:bg-blue-50 transition">
                              <td className="py-3 px-4 font-semibold text-blue-900">{s.student}</td>
                              <td className="py-3 px-4 text-blue-700">{s.course}</td>
                              <td className="py-3 px-4 text-blue-700">{s.assignment}</td>
                              <td className="py-3 px-4 text-blue-700 flex gap-2 items-center">
                                <span>{s.submission}</span>
                                <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200" onClick={() => setViewSubmission(s)}>View</button>
                              </td>
                              <td className="py-3 px-4">
                                <input type="text" className="px-2 py-1 border border-blue-200 rounded w-16" placeholder="A+" />
                              </td>
                              <td className="py-3 px-4 flex gap-2">
                                <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">Save</button>
                                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Skip</button>
                                <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200" onClick={() => setShowRubric(true)}>Rubric</button>
                              </td>
                            </tr>
                          ))}
              {/* Submission Preview Modal */}
              {viewSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
                    <button className="absolute top-3 right-3 text-gray-400 hover:text-blue-600" onClick={() => setViewSubmission(null)}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <h4 className="text-lg font-bold mb-4 text-blue-800">Submission Preview</h4>
                    <div className="mb-2"><span className="font-semibold text-blue-700">Student:</span> {viewSubmission.student}</div>
                    <div className="mb-2"><span className="font-semibold text-blue-700">Course:</span> {viewSubmission.course}</div>
                    <div className="mb-2"><span className="font-semibold text-blue-700">Assignment:</span> {viewSubmission.assignment}</div>
                    <div className="mb-2"><span className="font-semibold text-blue-700">Submission:</span> {viewSubmission.submission}</div>
                  </div>
                </div>
              )}
              {/* Rubric Modal */}
              {showRubric && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative animate-fade-in">
                    <button className="absolute top-3 right-3 text-gray-400 hover:text-purple-600" onClick={() => setShowRubric(false)}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <h4 className="text-lg font-bold mb-4 text-purple-800">Grading Rubric</h4>
                    <table className="min-w-full bg-white rounded-2xl border border-purple-100 mb-4">
                      <thead>
                        <tr className="bg-purple-50 text-purple-700 text-left">
                          <th className="py-2 px-4 font-semibold">Criteria</th>
                          <th className="py-2 px-4 font-semibold">Excellent</th>
                          <th className="py-2 px-4 font-semibold">Good</th>
                          <th className="py-2 px-4 font-semibold">Needs Improvement</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 px-4">Accuracy</td>
                          <td className="py-2 px-4">All answers correct</td>
                          <td className="py-2 px-4">Most answers correct</td>
                          <td className="py-2 px-4">Many errors</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">Completeness</td>
                          <td className="py-2 px-4">All parts answered</td>
                          <td className="py-2 px-4">Most parts answered</td>
                          <td className="py-2 px-4">Incomplete</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">Clarity</td>
                          <td className="py-2 px-4">Clear and well explained</td>
                          <td className="py-2 px-4">Somewhat clear</td>
                          <td className="py-2 px-4">Unclear or confusing</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="text-purple-700 text-sm">Use this rubric as a guide for consistent and fair grading.</div>
                  </div>
                </div>
              )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
                  </div>
                </div>
              </div>

              {/* Notifications & Messages moved to top navbar */}
            </section>
          )}
          {activeSection === 'courses' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-blue-700">My Courses</h1>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow hover:bg-blue-700 transition text-lg"
                  onClick={() => setActiveSection('add')}
                >
                  + Create Course
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {courses.length === 0 && (
                  <div className="col-span-full text-center text-blue-500 text-lg">No courses yet. Click "Create Course" to get started!</div>
                )}
                {courses.map((c, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-3 relative group hover:shadow-2xl transition">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-blue-900 flex-1 truncate">{c.title}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
                    </div>
                    <div className="text-blue-700 text-sm font-semibold mb-1">{c.category}</div>
                    <div className="flex items-center gap-2 text-blue-700 text-xs">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5V7a4 4 0 00-8 0v2m12 4v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h12a2 2 0 012 2z" /></svg>
                      <span>{c.students || 0} students</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="px-4 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold" onClick={() => {
                        setEditCourseIdx(i);
                        setNewCourse({ ...c });
                        setShowCourseForm(true);
                      }}>Edit</button>
                      <button className="px-4 py-1 bg-blue-50 text-blue-500 rounded hover:bg-blue-100 text-xs font-semibold">View</button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Table for details (optional, keep for advanced users) */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-2xl shadow border border-blue-100">
                  <thead>
                    <tr className="bg-blue-50 text-blue-700 text-left">
                      <th className="py-3 px-4 font-semibold">Title</th>
                      <th className="py-3 px-4 font-semibold">Category</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Students</th>
                      <th className="py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c, i) => (
                      <tr key={i} className="border-t border-blue-50 hover:bg-blue-50 transition">
                        <td className="py-3 px-4 font-semibold text-blue-900">{c.title}</td>
                        <td className="py-3 px-4 text-blue-700">{c.category}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
                        </td>
                        <td className="py-3 px-4 text-blue-700">{c.students || 0}</td>
                        <td className="py-3 px-4">
                          <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 mr-2" onClick={() => {
                            setEditCourseIdx(i);
                            setNewCourse({ ...c });
                            setShowCourseForm(true);
                          }}>Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Course Editor Modal */}
              {showCourseForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative animate-fade-in">
                    <button className="absolute top-3 right-3 text-gray-400 hover:text-blue-600" onClick={() => { setShowCourseForm(false); setEditCourseIdx(null); }}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <h4 className="text-lg font-bold mb-4 text-blue-800">{editCourseIdx !== null ? 'Edit Course' : 'Create Course'}</h4>
                    <form onSubmit={handleAddOrEditCourse} className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Course Title"
                        className="px-3 py-2 rounded border border-blue-200"
                        value={newCourse.title}
                        onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                        required
                      />
                      <select
                        className="px-3 py-2 rounded border border-blue-200"
                        value={newCourse.category}
                        onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                      >
                        {categories.map((cat, i) => (
                          <option key={i} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <textarea
                        className="px-3 py-2 rounded border border-blue-200"
                        placeholder="Course Content (optional)"
                        value={newCourse.content}
                        onChange={handleCourseContentChange}
                      />
                      <label className="block text-sm text-gray-600">SCORM Package (zip, optional):
                        <input
                          type="file"
                          accept=".zip,application/zip"
                          className="mt-1"
                          onChange={handleScormChange}
                        />
                      </label>
                      <select
                        className="px-3 py-2 rounded border border-blue-200"
                        value={newCourse.status}
                        onChange={e => setNewCourse({ ...newCourse, status: e.target.value })}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                      <div className="flex gap-2 mt-2">
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{editCourseIdx !== null ? 'Save' : 'Add'}</button>
                        <button type="button" onClick={() => { setShowCourseForm(false); setEditCourseIdx(null); }} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}
          {activeSection === 'add' && (
            <section>
              <AddCoursePage categories={categories} setCategories={setCategories} courses={courses} setCourses={setCourses} />
            </section>
          )}
          {activeSection === 'categories' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-blue-700">Categories</h1>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow hover:bg-blue-700 transition text-lg"
                  onClick={() => setShowCategoryForm(true)}
                >
                  + Add Category
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {categories.length === 0 && (
                  <div className="col-span-full text-center text-blue-500 text-lg">No categories yet. Click "Add Category" to get started!</div>
                )}
                {categories.map((cat, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-3 relative group hover:shadow-2xl transition">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-blue-900 flex-1 truncate">{cat}</span>
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{courses.filter(c => c.category === cat).length} courses</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="px-4 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-semibold" onClick={() => {
                        setEditCategoryIdx(i);
                        setEditCategoryName(cat);
                      }}>Edit</button>
                      <button className="px-4 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-semibold" onClick={() => handleDeleteCategory(i)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Add Category Modal */}
              {showCategoryForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
                    <button className="absolute top-3 right-3 text-gray-400 hover:text-blue-600" onClick={() => setShowCategoryForm(false)}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <h4 className="text-lg font-bold mb-4 text-blue-800">Add Category</h4>
                    <form onSubmit={handleAddCategory} className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Category Name"
                        className="px-3 py-2 rounded border border-blue-200"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        required
                      />
                      <div className="flex gap-2 mt-2">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
                        <button type="button" onClick={() => setShowCategoryForm(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {/* Edit Category Modal */}
              {editCategoryIdx !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
                    <button className="absolute top-3 right-3 text-gray-400 hover:text-blue-600" onClick={() => { setEditCategoryIdx(null); setEditCategoryName(""); }}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <h4 className="text-lg font-bold mb-4 text-blue-800">Edit Category</h4>
                    <form onSubmit={handleEditCategory} className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Category Name"
                        className="px-3 py-2 rounded border border-blue-200"
                        value={editCategoryName}
                        onChange={e => setEditCategoryName(e.target.value)}
                        required
                      />
                      <div className="flex gap-2 mt-2">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                        <button type="button" onClick={() => { setEditCategoryIdx(null); setEditCategoryName(""); }} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
      <footer className="py-8 text-center text-gray-500 text-sm bg-white/80 border-t border-blue-100 mt-auto">
        <span>© {new Date().getFullYear()} Swipe LMS. Inspired by LinkedIn Learning. All rights reserved.</span>
      </footer>
    </div>
  );
}
