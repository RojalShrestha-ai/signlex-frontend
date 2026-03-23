"use client";

/**
 * SignLex Frontend - Leaderboard Page
 * Author: Pawan Rijal
 * Converted to Tailwind CSS
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gamificationAPI, userAPI } from "../../api/api";
import { Trophy, Medal, TrendingUp, Flame, Star, Users, Zap, ChevronUp } from "lucide-react";

const TIMEFRAMES = [
  { key: "daily",   label: "Today" },
  { key: "weekly",  label: "This Week" },
  { key: "monthly", label: "This Month" },
  { key: "all",     label: "All Time" },
];

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[60px_44px_1fr_80px_90px] gap-3 items-center px-4 py-3 bg-white border border-gray-200 rounded-xl">
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
      <div className="flex flex-col gap-1">
        <div className="h-3 w-4/5 rounded bg-gray-200 animate-pulse" />
        <div className="h-2.5 w-1/2 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="h-6 w-16 rounded-full bg-gray-200 animate-pulse" />
      <div className="h-3.5 w-[70px] rounded bg-gray-200 animate-pulse" />
    </div>
  );
}

function getRankIcon(rank) {
  if (rank === 1) return <Trophy size={22} className="text-amber-400" />;
  if (rank === 2) return <Medal size={22} className="text-gray-400" />;
  if (rank === 3) return <Medal size={22} className="text-amber-600" />;
  return <span className="text-base font-bold text-gray-400">#{rank}</span>;
}

function Avatar({ entry }) {
  return (
    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-base flex-shrink-0 overflow-hidden border-2 ${entry.isCurrentUser ? "border-indigo-500" : "border-gray-200"}`}>
      {entry.avatarUrl
        ? <img src={entry.avatarUrl} alt={entry.username} className="w-full h-full object-cover" />
        : <span>{entry.username.charAt(0).toUpperCase()}</span>}
    </div>
  );
}

function PodiumCard({ entry, position }) {
  const sizeClass = position === 1 ? "first" : position === 2 ? "second" : "third";
  const avatarSize = position === 1 ? "w-[72px] h-[72px]" : "w-14 h-14";
  const baseHeight = position === 1 ? "h-[72px]" : position === 2 ? "h-12" : "h-9";
  const baseGradient =
    position === 1 ? "from-amber-400 to-amber-600" :
    position === 2 ? "from-gray-400 to-gray-500" :
    "from-amber-600 to-amber-700";

  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.1, type: "spring", stiffness: 200 }}
    >
      <div className={`${avatarSize} rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-2xl border-[3px] border-white shadow-md overflow-hidden`}>
        {entry.avatarUrl
          ? <img src={entry.avatarUrl} alt={entry.username} className="w-full h-full object-cover" />
          : <span>{entry.username.charAt(0).toUpperCase()}</span>}
      </div>
      <div className="my-0.5">{getRankIcon(position)}</div>
      <p className="font-bold text-sm text-gray-800 text-center">
        {entry.username}
        {entry.isCurrentUser && <span className="text-indigo-500 ml-0.5 text-xs">●</span>}
      </p>
      <p className="text-sm font-bold text-indigo-500">{entry.xp.toLocaleString()} XP</p>
      <p className="text-xs text-gray-400">Lv.{entry.level}</p>
      <div className={`w-[90px] ${baseHeight} rounded-t-md bg-gradient-to-b ${baseGradient} mt-1`} />
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [rankings, setRankings]       = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [badges, setBadges]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [timeframe, setTimeframe]     = useState("all");

  useEffect(() => { fetchAll(); }, [timeframe]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [lbRes, badgeRes] = await Promise.all([
        gamificationAPI.getLeaderboard(timeframe),
        userAPI.getAchievements(),
      ]);
      setRankings(lbRes.data.rankings || []);
      setCurrentUser(lbRes.data.currentUser || null);
      setBadges((badgeRes.data.badges || []).filter(b => b.unlocked).slice(0, 4));
    } catch (e) {
      console.error("Failed to load leaderboard:", e);
    } finally {
      setLoading(false);
    }
  };

  const top3    = rankings.slice(0, 3);
  const rest    = rankings.slice(3);
  const podiumOrder = top3.length === 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  return (
    <div className="max-w-[760px] mx-auto px-5 py-8 pb-16 flex flex-col gap-6">

      {/* Hero */}
      <div className="flex items-center gap-4">
        <Trophy size={32} className="text-amber-400 flex-shrink-0" />
        <div>
          <h1 className="text-[2rem] font-extrabold text-gray-900 m-0">Leaderboard</h1>
          <p className="text-gray-500 m-0 text-[0.95rem]">See how you rank against other learners</p>
        </div>
      </div>

      {/* Timeframe filter */}
      <div className="flex gap-1.5 bg-gray-100 p-1.5 rounded-xl">
        {TIMEFRAMES.map(tf => (
          <button
            key={tf.key}
            onClick={() => setTimeframe(tf.key)}
            className={`flex-1 py-2 px-3 rounded-lg border-none cursor-pointer font-semibold text-sm transition-all duration-200
              ${timeframe === tf.key
                ? "bg-white text-indigo-600 shadow-sm"
                : "bg-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Current user card */}
      {currentUser && !loading && (
        <motion.div
          className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl px-6 py-5 flex justify-between items-center text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-[0.78rem] opacity-85 font-semibold uppercase tracking-wide">Your Rank</span>
            <div className="flex items-center gap-2.5 text-[1.6rem] font-extrabold">
              {getRankIcon(currentUser.rank)}
              <span>#{currentUser.rank}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 text-sm font-semibold opacity-95">
            <span className="flex items-center gap-1.5"><Zap size={14}/> {currentUser.xp.toLocaleString()} XP</span>
            <span className="flex items-center gap-1.5"><Star size={14}/> Lv.{currentUser.level}</span>
            {currentUser.streak > 0 && <span className="flex items-center gap-1.5"><Flame size={14}/> {currentUser.streak} day streak</span>}
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({length: 7}).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={timeframe} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* Podium */}
            {top3.length === 3 && (
              <div className="flex justify-center items-end gap-4 py-4 pb-2">
                {podiumOrder.map((entry, i) => {
                  const pos = i === 0 ? 2 : i === 1 ? 1 : 3;
                  return <PodiumCard key={entry.userId} entry={entry} position={pos} />;
                })}
              </div>
            )}

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[72px_1fr_90px_110px] gap-3 px-5 py-3 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Rank</span>
                <span>User</span>
                <span>Level</span>
                <span>XP</span>
              </div>
              <div>
                {rankings.map((entry, idx) => {
                  let rowBg = "";
                  if (entry.isCurrentUser) rowBg = "bg-indigo-50 border-l-4 border-indigo-500";
                  else if (entry.rank === 1) rowBg = "bg-gradient-to-r from-amber-50 to-transparent";
                  else if (entry.rank === 2) rowBg = "bg-gradient-to-r from-indigo-50 to-transparent";
                  else if (entry.rank === 3) rowBg = "bg-gradient-to-r from-orange-50 to-transparent";

                  return (
                    <motion.div
                      key={entry.userId}
                      className={`grid grid-cols-[72px_1fr_90px_110px] gap-3 px-5 py-3.5 border-b border-gray-100 last:border-b-0 items-center transition-colors duration-150 hover:bg-gray-50 ${rowBg}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <div className="flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar entry={entry} />
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            {entry.username}
                            {entry.isCurrentUser && (
                              <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded text-[0.65rem] font-extrabold">You</span>
                            )}
                          </span>
                          {entry.streak > 0 && (
                            <span className="text-[0.72rem] text-orange-600 flex items-center gap-0.5">
                              <Flame size={11}/> {entry.streak}d streak
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                          Lv.{entry.level}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-gray-900 text-base">{entry.xp.toLocaleString()}</span>
                        {entry.xpGain > 0 && (
                          <span className="text-emerald-500 text-[0.72rem] font-semibold flex items-center">
                            <ChevronUp size={10}/>{entry.xpGain}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {rankings.length === 0 && (
              <div className="text-center py-12 text-gray-400 flex flex-col items-center gap-4">
                <Users size={40}/>
                <p>No data for this timeframe yet.</p>
              </div>
            )}

            {/* Badges teaser */}
            {badges.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 mt-4">
                <p className="text-[0.78rem] font-bold text-gray-400 uppercase tracking-wider mb-3">Your Badges</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {badges.map(b => (
                    <div
                      key={b._id}
                      title={b.name}
                      className={`flex flex-col items-center gap-1 py-2.5 px-3 rounded-xl border min-w-[60px] text-center
                        ${b.rarity === "rare" ? "border-indigo-200 bg-indigo-50" :
                          b.rarity === "epic" ? "border-violet-200 bg-violet-50" :
                          b.rarity === "legendary" ? "border-amber-300 bg-amber-50" :
                          "border-gray-200"}`}
                    >
                      <span className="text-2xl">{b.icon}</span>
                      <p className="text-[0.68rem] text-gray-500 font-semibold m-0">{b.name}</p>
                    </div>
                  ))}
                  <a href="/profile" className="ml-auto text-indigo-600 text-sm font-semibold no-underline whitespace-nowrap hover:underline">
                    View all →
                  </a>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}