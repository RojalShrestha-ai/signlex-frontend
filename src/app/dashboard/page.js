/**
 * SignLex Frontend - Dashboard Page
 * Author: Pawan Rijal
 * 
 * User dashboard showing overview of progress, streaks, XP,
 * and quick access to all learning modes.
 * 
 * Status: ~30% complete (layout structure only)
 *   - Grid layout for stats cards defined
 *   - Navigation cards to learning modes
 *   - Placeholder data throughout
 *   - Real user data integration TODO
 *   - Progress charts TODO
 *   - Recent activity feed TODO
 */

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-500 mt-1">
          Continue your sign language learning journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-sm text-gray-500">Daily Streak</p>
          <p className="text-3xl font-bold text-orange-500 mt-1">0 days</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Total XP</p>
          <p className="text-3xl font-bold text-primary-600 mt-1">0 XP</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Level</p>
          <p className="text-3xl font-bold text-green-600 mt-1">1</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Signs Learned</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">0 / 26</p>
        </div>
      </div>

      {/* Learning Mode Cards */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Start Learning
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { href: "/learn", title: "Learn", desc: "Flashcards & Drills", color: "bg-blue-500" },
          { href: "/practice", title: "Practice", desc: "Webcam Gesture Recognition", color: "bg-orange-500" },
          { href: "/test", title: "Mock Test", desc: "Timed Assessment", color: "bg-purple-500" },
          { href: "/leaderboard", title: "Leaderboard", desc: "Rankings & Achievements", color: "bg-teal-500" },
        ].map((mode) => (
          <Link key={mode.href} href={mode.href} className="card hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 ${mode.color} rounded-lg mb-3`}></div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {mode.title}
            </h3>
            <p className="text-sm text-gray-500">{mode.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Recent Activity
      </h2>
      <div className="card">
        <p className="text-gray-400 text-center py-8">
          No activity yet. Start a lesson to see your progress here!
        </p>
      </div>
    </div>
  );
}
