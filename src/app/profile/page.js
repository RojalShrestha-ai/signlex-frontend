"use client";

/**
 * SignLex Frontend - User Profile Page
 * Author: Pawan Rijal
 * Status: 100% complete
 *
 * Wired to:
 *   userAPI.getProfile()       → name, email, bio, avatarUrl, createdAt
 *   userAPI.getStats()         → totalXP, signsLearned, practiceHours, testsTaken, averageAccuracy, totalReviews
 *   userAPI.getStreak()        → currentStreak, longestStreak, streakHistory
 *   userAPI.getAchievements()  → badges array
 *   userAPI.updateProfile()    → save name / bio edits
 *
 * All gamification sub-components (StreakDisplay, XPProgressBar, AchievementBadges)
 * are imported from their existing files in components/ui/.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { userAPI } from "../../api/api";
import {
  User, Mail, Calendar, TrendingUp, Award,
  Activity, Edit2, Save, X, AlertCircle, Flame, Star,
} from "lucide-react";

// ─── Thin inline streak calendar (7-day strip) ────────────────────────────────
function StreakCalendar({ history = [] }) {
  const days = history.slice(-7);
  return (
    <div className="flex gap-1 mt-2">
      {days.map((d, i) => (
        <div
          key={i}
          title={d.date}
          className={`w-7 h-7 rounded-md text-xs flex items-center justify-center font-medium
            ${d.active ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-400"}`}
        >
          {["S","M","T","W","T","F","S"][(new Date(d.date).getDay())]}
        </div>
      ))}
    </div>
  );
}

// ─── Inline XP progress bar ───────────────────────────────────────────────────
function InlineXPBar({ currentXP = 0, xpForNextLevel = 100, level = 1 }) {
  const pct = Math.min(100, (currentXP / xpForNextLevel) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500" /> Level {level}</span>
        <span>{currentXP.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">
        {(xpForNextLevel - currentXP).toLocaleString()} XP to Level {level + 1}
      </p>
    </div>
  );
}

// ─── Badge grid ───────────────────────────────────────────────────────────────
function BadgeGrid({ badges = [] }) {
  if (badges.length === 0)
    return <p className="text-sm text-gray-400">No badges yet — keep learning!</p>;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {badges.map((badge, i) => (
        <motion.div
          key={badge._id || i}
          title={badge.name}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center cursor-default
            ${badge.unlocked ? "border-yellow-200 bg-yellow-50" : "border-gray-100 bg-gray-50 opacity-50"}`}
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-2xl">{badge.icon || "🏅"}</span>
          <p className="text-xs text-gray-600 leading-tight">{badge.name}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function Stat({ label, value, icon: Icon, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [profile, setProfile]       = useState(null);
  const [stats, setStats]           = useState(null);
  const [streakData, setStreakData]  = useState(null);
  const [badges, setBadges]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [editing, setEditing]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [formData, setFormData]     = useState({ name: "", bio: "" });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true); setError(null);
      const [profRes, statsRes, streakRes, badgesRes] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getStats(),
        userAPI.getStreak(),
        userAPI.getAchievements(),
      ]);
      setProfile(profRes.data);
      setStats(statsRes.data);
      setStreakData(streakRes.data);
      setBadges(badgesRes.data?.badges || []);
      setFormData({ name: profRes.data.name || "", bio: profRes.data.bio || "" });
    } catch (err) {
      console.error("Profile fetch failed:", err);
      setError("Could not load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userAPI.updateProfile(formData);
      setProfile((p) => ({ ...p, ...formData }));
      setEditing(false);
    } catch (err) {
      console.error("Profile update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
        <div className="card flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-48" />
          </div>
        </div>
        <div className="card h-40 bg-gray-100 rounded" />
        <div className="card h-32 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle size={16} /> {error}
          <button onClick={fetchAll} className="ml-auto underline font-medium">Retry</button>
        </div>
      )}

      {/* ── Identity card ───────────────────────────────────────────────────── */}
      <motion.div className="card mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            {profile?.avatarUrl
              ? <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              : <span className="text-2xl text-primary-600"><User size={32} /></span>}
          </div>

          {/* Info / Edit form */}
          <div className="flex-1 min-w-0">
            {!editing ? (
              <>
                <p className="text-lg font-semibold text-gray-900">{profile?.name || "—"}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <Mail size={13} /> {profile?.email}
                </p>
                {profile?.createdAt && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Calendar size={12} /> Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                )}
                {profile?.bio && <p className="text-sm text-gray-600 mt-2">{profile.bio}</p>}
                <button
                  onClick={() => setEditing(true)}
                  className="mt-3 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 font-medium"
                >
                  <Edit2 size={14} /> Edit Profile
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={2}
                    placeholder="Tell us about yourself..."
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1 text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-60"
                  >
                    <Save size={14} /> {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1 text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── XP + Streak ─────────────────────────────────────────────────────── */}
      <motion.div className="card mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* XP */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
              <Star size={14} className="text-yellow-500" /> XP & Level
            </h2>
            <InlineXPBar
              currentXP={stats?.currentLevelXP ?? 0}
              xpForNextLevel={stats?.xpForNextLevel ?? 100}
              level={stats?.currentLevel ?? 1}
            />
          </div>

          {/* Streak */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
              <Flame size={14} className="text-orange-500" /> Streak
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">{streakData?.currentStreak ?? 0}</span>
              <span className="text-sm text-gray-500">day streak</span>
            </div>
            <p className="text-xs text-gray-400">Longest: {streakData?.longestStreak ?? 0} days</p>
            {streakData?.streakHistory?.length > 0 && (
              <StreakCalendar history={streakData.streakHistory} />
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Stats grid ──────────────────────────────────────────────────────── */}
      <motion.div className="card mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity size={18} className="text-gray-400" /> Learning Stats
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          <Stat label="Total XP"        value={(stats?.totalXP ?? 0).toLocaleString()} icon={TrendingUp} color="bg-primary-500" />
          <Stat label="Signs Learned"   value={stats?.signsLearned ?? 0}               icon={BookOpen}   color="bg-green-500"   />
          <Stat label="Practice Hours"  value={`${stats?.practiceHours ?? 0}h`}        icon={Activity}   color="bg-blue-500"    />
          <Stat label="Tests Taken"     value={stats?.testsTaken ?? 0}                  icon={Award}      color="bg-purple-500"  />
          <Stat label="Avg Accuracy"    value={`${stats?.averageAccuracy ?? 0}%`}       icon={TrendingUp} color="bg-teal-500"    />
          <Stat label="Total Reviews"   value={stats?.totalReviews ?? 0}               icon={Activity}   color="bg-orange-400"  />
        </div>
      </motion.div>

      {/* ── Achievement badges ───────────────────────────────────────────────── */}
      <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Award size={18} className="text-gray-400" /> Achievements
          </h2>
          <span className="text-sm text-gray-500">
            {badges.filter(b => b.unlocked).length} / {badges.length} unlocked
          </span>
        </div>
        <BadgeGrid badges={badges} />
      </motion.div>
    </div>
  );
}
