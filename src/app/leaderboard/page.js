/**
 * SignLex Frontend - Leaderboard Page
 * Author: Pawan Rijal
 * 
 * Status: ~10% complete (stub layout only)
 *   - Time filter tabs (weekly/monthly/all-time)
 *   - Rankings list placeholder
 *   - User rank highlight TODO
 *   - Real data from backend API TODO
 *   - Achievements/badges display TODO
 */

export default function LeaderboardPage() {
  const placeholderRankings = [
    { rank: 1, name: "---", xp: 0 },
    { rank: 2, name: "---", xp: 0 },
    { rank: 3, name: "---", xp: 0 },
    { rank: 4, name: "---", xp: 0 },
    { rank: 5, name: "---", xp: 0 },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
      <p className="text-gray-500 mb-8">
        See how you rank against other learners.
      </p>

      {/* Time Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["Weekly", "Monthly", "All Time"].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Rankings List */}
      <div className="space-y-2">
        {placeholderRankings.map((entry) => (
          <div key={entry.rank} className="card flex items-center gap-4 py-4">
            <span className="text-lg font-bold text-gray-400 w-8 text-center">
              #{entry.rank}
            </span>
            <span className="flex-grow text-gray-500">{entry.name}</span>
            <span className="text-sm font-medium text-gray-400">
              {entry.xp} XP
            </span>
          </div>
        ))}
      </div>

      {/* Your Rank */}
      <div className="card mt-6 bg-primary-50 border-primary-200">
        <p className="text-center text-primary-700">
          Complete lessons to appear on the leaderboard!
        </p>
      </div>
    </div>
  );
}
