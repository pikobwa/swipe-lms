export default function Home() {
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
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#testimonials" className="hover:text-blue-600 transition">Testimonials</a>
        </div>
  <a href="/signin" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Sign In</a>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-center flex-1 px-8 py-16 gap-12 max-w-7xl mx-auto w-full">
        {/* Text */}
        <section className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-blue-700 tracking-tight drop-shadow-lg animate-slidein">Welcome to Swipe LMS</h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10">Learn anything, anytime. Upskill with expert-led courses and hands-on projects.</p>
          <a
            href="/courses"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
          >
            Browse Courses
          </a>
        </section>
        {/* Illustration */}
        <section className="flex-1 flex justify-center">
          <img
            src="/reading.svg"
            alt="Illustration of someone reading online"
            className="w-80 h-80 object-contain drop-shadow-xl animate-float"
            style={{ minWidth: '220px' }}
          />
        </section>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white/70 border-t border-blue-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">Why Choose Swipe LMS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <svg className="mb-4" width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2563EB"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <h3 className="font-semibold text-lg mb-2">Expert Instructors</h3>
              <p className="text-gray-600 text-center">Learn from industry leaders and top educators with real-world experience.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <svg className="mb-4" width="40" height="40" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#2563EB"/><path d="M7 17l5-5 5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <h3 className="font-semibold text-lg mb-2">Flexible Learning</h3>
              <p className="text-gray-600 text-center">Access courses anytime, anywhere, and learn at your own pace on any device.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <svg className="mb-4" width="40" height="40" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#2563EB"/><path d="M12 8v8m0 0l-3-3m3 3l3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <h3 className="font-semibold text-lg mb-2">Career Growth</h3>
              <p className="text-gray-600 text-center">Earn certificates, build your portfolio, and advance your career with practical skills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">What Our Learners Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <img src="/vercel.svg" alt="User avatar" className="w-14 h-14 rounded-full mb-4" />
              <p className="text-gray-700 italic mb-2">“Swipe LMS helped me land my dream job! The courses are practical and easy to follow.”</p>
              <span className="font-semibold text-blue-700">Alex T.</span>
              <span className="text-gray-500 text-sm">Software Engineer</span>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <img src="/file.svg" alt="User avatar" className="w-14 h-14 rounded-full mb-4" />
              <p className="text-gray-700 italic mb-2">“I love the flexibility. I can learn at my own pace and revisit lessons anytime.”</p>
              <span className="font-semibold text-blue-700">Priya S.</span>
              <span className="text-gray-500 text-sm">Marketing Specialist</span>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <img src="/window.svg" alt="User avatar" className="w-14 h-14 rounded-full mb-4" />
              <p className="text-gray-700 italic mb-2">“The instructors are top-notch and the projects really helped me build my portfolio.”</p>
              <span className="font-semibold text-blue-700">Jordan M.</span>
              <span className="text-gray-500 text-sm">UI/UX Designer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm bg-white/80 border-t border-blue-100 mt-auto">
        <span>© {new Date().getFullYear()} Swipe LMS. Inspired by LinkedIn Learning. All rights reserved.</span>
      </footer>
      {/* Tailwind animation utilities for float and slidein */}
      <style>{`
        @layer utilities {
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-16px); }
          }
          .animate-slidein {
            animation: slidein 1.2s cubic-bezier(0.4,0,0.2,1) both;
          }
          @keyframes slidein {
            0% { opacity: 0; transform: translateY(-40px) scale(0.95); }
            60% { opacity: 1; transform: translateY(8px) scale(1.03); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        }
      `}</style>
    </div>
  );
}
