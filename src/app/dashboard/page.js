"use client";

/**
 * SignLex Frontend - Dashboard Page
 * Author: Pawan Rijal
 * Status: 100% complete
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { userAPI } from "../../api/api";
import { Flame, Star, BookOpen, TrendingUp, Clock, ChevronRight, Zap, Trophy, AlertCircle } from "lucide-react";

function StatSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
      <div className="h-8 w-24 bg-gray-200 rounded" />
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={16} className={color} />}
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </motion.div>
  );
}

function ActivityItem({ activity }) {
  const icons = { flashcard: "📇", drill: "🎯", test: "📝", badge: "🏅", streak: "🔥", xp: "⭐" };
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="text-xl">{icons[activity.type] || "📌"}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 font-medium truncate">{activity.description}</p>
        {activity.xpEarned > 0 && <p className="text-xs text-primary-600">+{activity.xpEarned} XP</p>}
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(activity.createdAt)}</span>
    </div>
  );
}

function RecommendationCard({ rec }) {
  const hrefMap = { flashcard: "/learn", drill: "/practice", test: "/test", leaderboard: "/leaderboard" };
  return (
    <Link href={hrefMap[rec.type] || "/learn"} className="card hover:shadow-md transition-shadow group flex items-center gap-3">
      <div className="text-2xl">{rec.icon || "📚"}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">{rec.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{rec.reason}</p>
      </div>
      <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
    </Link>
  );
}

const LEARNING_MODES = [
  { href: "/learn",        title: "Learn",       desc: "Flashcards & Spaced Repetition",    color: "bg-blue-500",   icon: "📇" },
  { href: "/practice",     title: "Practice",    desc: "Live Webcam Gesture Recognition",   color: "bg-orange-500", icon: "🎯" },
  { href: "/test",         title: "Mock Test",   desc: "Timed Assessment",                  color: "bg-purple-500", icon: "📝" },
  { href: "/leaderboard",  title: "Leaderboard", desc: "Rankings & Achievements",           color: "bg-teal-500",   icon: "🏆" },
];

const FALLBACK_RECS = [
  { type: "flashcard",  icon: "📇", title: "Review today's flashcards",  reason: "Spaced repetition keeps signs fresh" },
  { type: "drill",      icon: "🎯", title: "Practice with your webcam",  reason: "Live feedback improves muscle memory" },
  { type: "test",       icon: "📝", title: "Take a mock test",           reason: "Measure how much you've learned" },
];

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [activity, setActivity] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true); setError(null);
      const [dashRes, actRes, recRes] = await Promise.all([
        userAPI.getDashboard(),
        userAPI.getActivityFeed(),
        userAPI.getRecommendations(),
      ]);
      setDashboard(dashRes.data);
      setActivity(actRes.data.activities || []);
      setRecommendations(recRes.data.recommendations || []);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      setError("Could not load your dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboard ? [
    { label: "Daily Streak",   value: `${dashboard.streak ?? 0} days`,                         color: "text-orange-500",  icon: Flame      },
    { label: "Total XP",       value: `${(dashboard.totalXP ?? 0).toLocaleString()} XP`,       color: "text-primary-600", icon: Star       },
    { label: "Level",          value: dashboard.level ?? 1,                                    color: "text-green-600",   icon: TrendingUp },
    { label: "Signs Learned",  value: `${dashboard.signsLearned ?? 0} / 26`,                  color: "text-purple-600",  icon: BookOpen   },
  ] : [];

  const userName = dashboard?.name ? `, ${dashboard.name.split(" ")[0]}` : "";
  const xpPct = dashboard ? Math.min(100, ((dashboard.currentLevelXP ?? 0) / (dashboard.xpForNextLevel ?? 100)) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back{userName}!</h1>
        <p className="text-gray-500 mt-1">Continue your sign language learning journey.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {error}
          <button onClick={fetchAll} className="ml-auto underline font-medium">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />) : stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* XP bar */}
      {!loading && dashboard && (
        <motion.div className="card mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Zap size={14} className="text-yellow-500" />
              Level {dashboard.level ?? 1} Progress
            </span>
            <span className="text-xs text-gray-500">
              {(dashboard.currentLevelXP ?? 0).toLocaleString()} / {(dashboard.xpForNextLevel ?? 100).toLocaleString()} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-primary-400 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpPct.toFixed(1)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {((dashboard.xpForNextLevel ?? 100) - (dashboard.currentLevelXP ?? 0)).toLocaleString()} XP to Level {(dashboard.level ?? 1) + 1}
          </p>
        </motion.div>
      )}

      {/* Learning modes */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Start Learning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {LEARNING_MODES.map((mode) => (
          <Link key={mode.href} href={mode.href} className="card hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 ${mode.color} rounded-lg mb-3 flex items-center justify-center text-white text-lg`}>{mode.icon}</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{mode.title}</h3>
            <p className="text-sm text-gray-500">{mode.desc}</p>
          </Link>
        ))}
      </div>

      {/* Activity + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-gray-400" /> Recent Activity
          </h2>
          <div className="card min-h-[200px]">
            {loading ? (
              <div className="space-y-3 animate-pulse">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded" />)}</div>
            ) : activity.length > 0 ? (
              activity.slice(0, 8).map((a, i) => <ActivityItem key={i} activity={a} />)
            ) : (
              <p className="text-gray-400 text-center py-10 text-sm">No activity yet — start a lesson to see your progress here!</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-gray-400" /> Recommended for You
          </h2>
          <div className="space-y-3">
            {loading ? (
              <div className="card animate-pulse space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded" />)}</div>
            ) : (recommendations.length > 0 ? recommendations : FALLBACK_RECS).slice(0, 4).map((rec, i) => <RecommendationCard key={i} rec={rec} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
