/**
 * SignLex Frontend - API Layer (DUMMY / MOCK MODE)
 * Author: Pawan Rijal
 * No backend needed. Swap this file for the real axios version when backend is ready.
 */

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));
const ok = (data) => ({ data });

let _profile = {
  name: "Pawan Rijal",
  email: "pawan.rijal@example.com",
  bio: "ASL learner on a mission 🤟",
  avatarUrl: null,
  createdAt: "2025-09-01T00:00:00Z",
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: async (email) => { await delay(); return ok({ token: "dummy-jwt", user: { ..._profile, email } }); },
  register: async (userData) => { await delay(); return ok({ token: "dummy-jwt", user: userData }); },
  logout: async () => { await delay(100); return ok({ success: true }); },
  getCurrentUser: async () => { await delay(); return ok(_profile); },
};

// ─── VOCABULARY ───────────────────────────────────────────────────────────────
const ASL_SIGNS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter, i) => ({
  _id: `sign-${i}`,
  letter,
  category: i < 9 ? "beginner" : i < 18 ? "intermediate" : "advanced",
  description: `Hand shape for the letter ${letter} in ASL fingerspelling.`,
  tip: `Keep your palm facing ${i % 2 === 0 ? "forward" : "outward"} when signing ${letter}.`,
}));

export const vocabularyAPI = {
  getAllSigns: async () => { await delay(); return ok({ signs: ASL_SIGNS }); },
  getSignById: async (id) => { await delay(200); return ok(ASL_SIGNS.find((s) => s._id === id) || ASL_SIGNS[0]); },
  getSignsByCategory: async (cat) => { await delay(); return ok({ signs: ASL_SIGNS.filter((s) => s.category === cat) }); },
  searchSigns: async (query) => { await delay(200); const q = query.toUpperCase(); return ok({ signs: ASL_SIGNS.filter((s) => s.letter.includes(q)) }); },
};

// ─── LEARNING ─────────────────────────────────────────────────────────────────
// Flashcards — front shows the letter, back shows description + tip
const FLASHCARDS = ASL_SIGNS.map((sign, i) => ({
  _id: `card-${i}`,
  signId: sign._id,
  letter: sign.letter,
  front: sign.letter,
  back: sign.description,
  tip: sign.tip,
  category: sign.category,
  nextReview: new Date().toISOString(),
}));

// Mock test questions — each has a plain-string prompt and plain-string options array
// The correct answer is always the letter at question index (cycled)
function buildTestQuestions() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return letters.slice(0, 10).map((letter, i) => {
    // Pick 3 wrong options
    const wrong = letters.filter((l) => l !== letter).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [letter, ...wrong].sort(() => Math.random() - 0.5);
    return {
      _id: `q-${i}`,
      prompt: `Which letter does this ASL hand shape represent?`,
      letter,          // correct answer — plain string
      options,         // array of plain strings e.g. ["A","C","D","B"]
      category: ASL_SIGNS[i].category,
    };
  });
}

export const learningAPI = {
  getFlashcards: async (category) => {
    await delay();
    const cards = category ? FLASHCARDS.filter((c) => c.category === category) : FLASHCARDS;
    return ok({ cards, totalDue: cards.length });
  },
  submitFlashcardReview: async (data) => {
    await delay(200);
    return ok({ success: true, nextReview: new Date(Date.now() + 86400000).toISOString(), xpEarned: 10 });
  },
  getDrillSession: async () => {
    await delay();
    return ok({ signs: ASL_SIGNS.slice(0, 5).map((s) => ({ ...s, targetLetter: s.letter })), sessionId: "drill-001" });
  },
  submitDrillResult: async () => { await delay(200); return ok({ success: true, accuracy: 85, xpEarned: 25 }); },
  getMockTest: async () => {
    await delay();
    return ok({
      testId: "test-001",
      questions: buildTestQuestions(),
      timeLimit: 300,       // 5 minutes in seconds
      passingScore: 70,     // 70%
    });
  },
  submitTestResult: async (data) => {
    await delay();
    const correct = data.correctCount ?? Math.floor(Math.random() * 3) + 7;
    const total = data.totalCount ?? 10;
    const percentage = Math.round((correct / total) * 100);
    return ok({ score: percentage, passed: percentage >= 70, xpEarned: percentage >= 70 ? 100 : 30, correctCount: correct, totalCount: total, timeSpent: data.timeSpent || 180 });
  },
  getNextReviewSchedule: async () => { await delay(); return ok({ upcoming: FLASHCARDS.slice(0, 5) }); },
};

// ─── USER ─────────────────────────────────────────────────────────────────────
const STREAK_HISTORY = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (13 - i));
  return { date: d.toISOString().split("T")[0], active: i !== 3 && i !== 7 };
});

const ACTIVITY_FEED = [
  { type: "flashcard", description: "Reviewed 10 flashcards",           xpEarned: 10,  createdAt: new Date(Date.now() - 900000).toISOString() },
  { type: "badge",     description: "Earned badge: First Steps 🏅",     xpEarned: 50,  createdAt: new Date(Date.now() - 3600000).toISOString() },
  { type: "drill",     description: "Completed drill with 88% accuracy", xpEarned: 25,  createdAt: new Date(Date.now() - 10800000).toISOString() },
  { type: "test",      description: "Mock test score: 80%",              xpEarned: 50,  createdAt: new Date(Date.now() - 86400000).toISOString() },
  { type: "streak",    description: "7-day streak milestone! 🔥",        xpEarned: 100, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const BADGES = [
  { _id: "b1", name: "First Steps",   icon: "👶", unlocked: true,  rarity: "common",    xpReward: 50,  unlockedAt: "2025-09-05T00:00:00Z", description: "Complete your first lesson",    unlockCriteria: "Complete 1 lesson" },
  { _id: "b2", name: "On Fire",       icon: "🔥", unlocked: true,  rarity: "common",    xpReward: 100, unlockedAt: "2025-09-12T00:00:00Z", description: "Reach a 7-day streak",          unlockCriteria: "7 day streak" },
  { _id: "b3", name: "Flash Master",  icon: "📇", unlocked: true,  rarity: "rare",      xpReward: 150, unlockedAt: "2025-10-01T00:00:00Z", description: "Review 100 flashcards",         unlockCriteria: "Review 100 flashcards" },
  { _id: "b4", name: "Consistent",    icon: "📅", unlocked: true,  rarity: "common",    xpReward: 75,  unlockedAt: "2025-09-20T00:00:00Z", description: "Log in 14 days in a row",       unlockCriteria: "14 day streak" },
  { _id: "b5", name: "Sharpshooter",  icon: "🎯", unlocked: false, rarity: "rare",      xpReward: 200, description: "Score 90%+ on a mock test",     unlockCriteria: "90%+ on any test",    progress: { current: 80, target: 90 } },
  { _id: "b6", name: "ASL Scholar",   icon: "🎓", unlocked: false, rarity: "epic",      xpReward: 500, description: "Learn all 26 ASL letters",      unlockCriteria: "Master all 26 signs", progress: { current: 14, target: 26 } },
  { _id: "b7", name: "Centurion",     icon: "💯", unlocked: false, rarity: "epic",      xpReward: 300, description: "Reach a 30-day streak",         unlockCriteria: "30 day streak",       progress: { current: 11, target: 30 } },
  { _id: "b8", name: "Legend",        icon: "👑", unlocked: false, rarity: "legendary", xpReward: 1000,description: "Reach Level 10",               unlockCriteria: "Reach Level 10",      progress: { current: 4,  target: 10 } },
];

export const userAPI = {
  getProfile: async () => { await delay(); return ok({ ..._profile }); },
  updateProfile: async (data) => { await delay(300); _profile = { ..._profile, ...data }; return ok({ ..._profile }); },
  getProgress: async () => { await delay(); return ok({ signsLearned: 14, signsTotal: 26, byCategory: { beginner: 9, intermediate: 5, advanced: 0 } }); },
  getAchievements: async () => { await delay(); return ok({ badges: BADGES }); },
  getStreak: async () => { await delay(); return ok({ currentStreak: 11, longestStreak: 14, lastActive: new Date().toISOString(), streakHistory: STREAK_HISTORY }); },
  getStats: async () => {
    await delay();
    return ok({ totalXP: 1240, currentLevel: 4, currentLevelXP: 240, xpForNextLevel: 500, signsLearned: 14, practiceHours: 6, testsTaken: 3, averageAccuracy: 82, totalReviews: 127 });
  },
  getDashboard: async () => {
    await delay();
    return ok({ name: _profile.name, streak: 11, totalXP: 1240, level: 4, currentLevelXP: 240, xpForNextLevel: 500, signsLearned: 14 });
  },
  getActivityFeed: async () => { await delay(); return ok({ activities: ACTIVITY_FEED }); },
  getRecommendations: async () => {
    await delay();
    return ok({ recommendations: [
      { type: "flashcard",   icon: "📇", title: "Review due flashcards",  reason: "3 cards are due for spaced repetition today" },
      { type: "drill",       icon: "🎯", title: "Practice the letter M",   reason: "Your accuracy on M was 60% last session" },
      { type: "test",        icon: "📝", title: "Take a mock test",        reason: "You haven't tested yourself in 3 days" },
      { type: "leaderboard", icon: "🏆", title: "Check the leaderboard",   reason: "You're just 80 XP behind #3 this week!" },
    ]});
  },
};

// ─── GAMIFICATION ─────────────────────────────────────────────────────────────
const LEADERBOARD_USERS = [
  { userId: "u1", username: "RojalS",     avatarUrl: null, rank: 1, level: 7, xp: 3400, streak: 22, xpGain: 120, isCurrentUser: false },
  { userId: "u2", username: "AminM",      avatarUrl: null, rank: 2, level: 6, xp: 2800, streak: 18, xpGain: 95,  isCurrentUser: false },
  { userId: "u3", username: "pawan_r",    avatarUrl: null, rank: 3, level: 4, xp: 1240, streak: 11, xpGain: 60,  isCurrentUser: true  },
  { userId: "u4", username: "SignLexFan", avatarUrl: null, rank: 4, level: 3, xp: 980,  streak: 5,  xpGain: 40,  isCurrentUser: false },
  { userId: "u5", username: "ASLPro",     avatarUrl: null, rank: 5, level: 3, xp: 870,  streak: 3,  xpGain: 30,  isCurrentUser: false },
  { userId: "u6", username: "HandTalker", avatarUrl: null, rank: 6, level: 2, xp: 650,  streak: 0,  xpGain: 10,  isCurrentUser: false },
  { userId: "u7", username: "FingerSpell",avatarUrl: null, rank: 7, level: 2, xp: 500,  streak: 2,  xpGain: 20,  isCurrentUser: false },
];

export const gamificationAPI = {
  getXP: async () => { await delay(); return ok({ currentXP: 240, xpForNextLevel: 500, totalXP: 1240 }); },
  getLevel: async () => { await delay(); return ok({ currentLevel: 4, nextLevel: 5, levelTitle: "ASL Apprentice", upcomingPerks: ["Unlock Advanced signs", "Custom avatar border"] }); },
  getLeaderboard: async (timeframe = "all") => {
    await delay();
    const m = { daily: 0.1, weekly: 0.4, monthly: 0.8, all: 1 }[timeframe] ?? 1;
    const rankings = LEADERBOARD_USERS.map((u) => ({ ...u, xp: Math.round(u.xp * m), xpGain: Math.round(u.xpGain * m) }));
    return ok({ rankings, currentUser: rankings.find((u) => u.isCurrentUser) });
  },
  getBadges: async () => { await delay(); return ok({ badges: BADGES }); },
  claimReward: async (rewardId) => { await delay(300); return ok({ success: true, rewardId, xpEarned: 50 }); },
};

// ─── RECOGNITION ──────────────────────────────────────────────────────────────
export const recognitionAPI = {
  submitGesture: async () => {
    await delay(150);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return ok({ predictedLetter: letters[Math.floor(Math.random() * 26)], confidence: 0.78 + Math.random() * 0.2, success: true });
  },
  getFeedback: async (gestureId) => {
    await delay(200);
    return ok({ gestureId, feedback: "Good hand position! Keep your fingers relaxed.", tips: ["Angle your wrist slightly upward", "Keep your elbow stable"] });
  },
};

export default { authAPI, vocabularyAPI, learningAPI, userAPI, gamificationAPI, recognitionAPI };
