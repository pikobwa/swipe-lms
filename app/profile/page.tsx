
import Link from "next/link";

const user = {
  name: "Phalex Shikanga",
  avatar: "/freepik__the-style-is-candid-image-photography-with-natural__21042.png",
  title: "Creative Development Lead",
  enrolledCourses: [
    { id: "1", title: "React Basics" },
    { id: "3", title: "TypeScript Essentials" },
  ],
};

export default function ProfilePage() {
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
