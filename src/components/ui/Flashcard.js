"use client";

/**
 * SignLex Frontend - Flashcard Component
 * Author: Pawan Rijal
 * Status: 100% complete
 *
 * Fixes applied:
 *  - Import path corrected to ../../api/api
 *  - Uses card.letter (not card.word) to match dummy data shape
 *  - Category filter (Beginner / Intermediate / Advanced) wired to API
 *  - Flip animation resets properly when moving to next card
 *  - Rating buttons always visible on back face without re-triggering flip
 *  - Session summary screen with per-rating stats
 *  - XP earned feedback after each rating
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { learningAPI } from "../../api/api";
import { RotateCw, Flame } from "lucide-react";
import "./Flashcard.css";

const CATEGORIES = [
  { key: "all",          label: "All (26)" },
  { key: "beginner",     label: "Beginner (A–I)" },
  { key: "intermediate", label: "Intermediate (J–R)" },
  { key: "advanced",     label: "Advanced (S–Z)" },
];

const RATING_CONFIG = [
  { value: 1, label: "Again", emoji: "😣", className: "hard" },
  { value: 2, label: "Hard",  emoji: "😬", className: "medium" },
  { value: 3, label: "Good",  emoji: "🙂", className: "good" },
  { value: 4, label: "Easy",  emoji: "😄", className: "easy" },
];

export default function Flashcard() {
  const [cards, setCards]               = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped]       = useState(false);
  const [loading, setLoading]           = useState(true);
  const [category, setCategory]         = useState("all");
  const [sessionComplete, setSessionComplete] = useState(false);
  const [ratings, setRatings]           = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [xpTotal, setXpTotal]           = useState(0);
  const [xpFlash, setXpFlash]           = useState(null); // "+10 XP" toast

  useEffect(() => {
    loadCards();
  }, [category]);

  const loadCards = async () => {
    setLoading(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
    setRatings({ 1: 0, 2: 0, 3: 0, 4: 0 });
    setXpTotal(0);
    try {
      const response = await learningAPI.getFlashcards(category === "all" ? null : category);
      setCards(response.data.cards || []);
    } catch (err) {
      console.error("Failed to load flashcards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => setIsFlipped((f) => !f);

  const handleRating = async (rating) => {
    try {
      const res = await learningAPI.submitFlashcardReview({
        cardId: cards[currentIndex]._id,
        signId: cards[currentIndex].signId,
        rating,
        timestamp: new Date().toISOString(),
      });

      const earned = res.data.xpEarned || 10;
      setRatings((r) => ({ ...r, [rating]: r[rating] + 1 }));
      setXpTotal((x) => x + earned);

      // Show XP toast
      setXpFlash(`+${earned} XP`);
      setTimeout(() => setXpFlash(null), 1000);

      if (currentIndex < cards.length - 1) {
        setIsFlipped(false);
        // Brief pause so the flip-back animates before card changes
        setTimeout(() => setCurrentIndex((i) => i + 1), 200);
      } else {
        setSessionComplete(true);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flashcard-container">
        <div className="loading-spinner">Loading your flashcards…</div>
      </div>
    );
  }

  // ── Session complete ───────────────────────────────────────────────────────
  if (sessionComplete) {
    const total = cards.length;
    const easy   = ratings[4];
    const good   = ratings[3];
    const hard   = ratings[2];
    const again  = ratings[1];
    return (
      <div className="flashcard-container">
        <motion.div
          className="session-complete"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎉</div>
          <h2>Session Complete!</h2>
          <p>You reviewed <strong>{total}</strong> signs.</p>

          <div className="session-stats">
            <div className="stat-row"><span className="dot easy" />Easy   <strong>{easy}</strong></div>
            <div className="stat-row"><span className="dot good" />Good   <strong>{good}</strong></div>
            <div className="stat-row"><span className="dot hard" />Hard   <strong>{hard}</strong></div>
            <div className="stat-row"><span className="dot again"/>Again  <strong>{again}</strong></div>
          </div>

          <div className="xp-summary">⭐ {xpTotal} XP earned this session</div>

          <button onClick={loadCards} className="btn-primary">
            <RotateCw size={16} style={{ marginRight: "0.4rem" }} />
            Start New Session
          </button>
        </motion.div>
      </div>
    );
  }

  // ── No cards ───────────────────────────────────────────────────────────────
  if (!cards.length) {
    return (
      <div className="flashcard-container">
        <div className="no-cards">
          <p>No flashcards in this category right now.</p>
          <button onClick={() => setCategory("all")} className="btn-primary" style={{ marginTop: "1rem" }}>
            Show All Cards
          </button>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;

  return (
    <div className="flashcard-container">

      {/* Category filter */}
      <div className="category-filter">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`cat-btn ${category === c.key ? "active" : ""}`}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="card-counter">
        {currentIndex + 1} / {cards.length}
        {card.category && (
          <span className={`cat-badge ${card.category}`}>{card.category}</span>
        )}
      </div>

      {/* XP toast */}
      <AnimatePresence>
        {xpFlash && (
          <motion.div
            className="xp-toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {xpFlash}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <div className="card-wrapper" onClick={!isFlipped ? handleFlip : undefined}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIndex}-${isFlipped ? "back" : "front"}`}
            className="flashcard"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0,  opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {!isFlipped ? (
              /* ── FRONT ── */
              <div className="card-front">
                <p className="card-label">What is the ASL sign for…</p>
                <div className="sign-word">{card.letter}</div>
                <p className="tap-hint">👆 Tap to reveal</p>
              </div>
            ) : (
              /* ── BACK ── */
              <div className="card-back">
                <div className="back-letter">{card.letter}</div>
                <p className="sign-description">{card.back}</p>
                {card.tip && (
                  <div className="sign-tip">
                    <Flame size={14} style={{ marginRight: "0.3rem", color: "#f97316" }} />
                    {card.tip}
                  </div>
                )}

                <div className="difficulty-rating">
                  <p>How well did you know this?</p>
                  <div className="rating-buttons">
                    {RATING_CONFIG.map((r) => (
                      <button
                        key={r.value}
                        onClick={(e) => { e.stopPropagation(); handleRating(r.value); }}
                        className={`rating-btn ${r.className}`}
                        title={r.label}
                      >
                        <span className="rating-emoji">{r.emoji}</span>
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flip back button (only visible on back) */}
      {isFlipped && (
        <button className="flip-back-btn" onClick={handleFlip}>
          ↩ Show question
        </button>
      )}
    </div>
  );
}
