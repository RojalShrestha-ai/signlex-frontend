"use client";

/**
 * SignLex Frontend - Mock Test Component
 * Author: Pawan Rijal
 * Status: 100% complete
 *
 * Fixes applied:
 *  - Import path corrected to ../../api/api
 *  - Uses question.prompt (not question.text) to match dummy data
 *  - Options are plain strings, not {_id, text} objects
 *  - Answers keyed by question._id, compared against plain string option
 *  - Score calculated client-side (correct answer = question.letter)
 *  - Added correct/wrong highlight on result reveal
 *  - passingScore and timeLimit from API (with safe fallbacks)
 *  - submitTestResult receives correctCount so dummy API scores correctly
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { learningAPI } from "../../api/api";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import "./Mocktest.css";

export default function MockTest() {
  const [testData, setTestData]             = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers]               = useState({});   // { questionId: selectedOption (string) }
  const [timeRemaining, setTimeRemaining]   = useState(0);
  const [testStarted, setTestStarted]       = useState(false);
  const [testCompleted, setTestCompleted]   = useState(false);
  const [score, setScore]                   = useState(null);
  const [submitting, setSubmitting]         = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    loadTest();
    return () => clearInterval(timerRef.current);
  }, []);

  // Start countdown only when test is running
  useEffect(() => {
    if (!testStarted || testCompleted) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) { handleSubmitTest(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [testStarted, testCompleted]);

  const loadTest = async () => {
    try {
      const res = await learningAPI.getMockTest();
      setTestData(res.data);
      setTimeRemaining(res.data.timeLimit ?? 300);
    } catch (err) {
      console.error("Failed to load test:", err);
    }
  };

  const handleAnswerSelect = (questionId, option) => {
    if (testCompleted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitTest = async (autoSubmit = false) => {
    if (submitting || testCompleted) return;
    clearInterval(timerRef.current);
    setSubmitting(true);

    // Calculate correct answers client-side so the dummy API can return a real score
    const correctCount = testData.questions.reduce((acc, q) => {
      return answers[q._id] === q.letter ? acc + 1 : acc;
    }, 0);

    try {
      const res = await learningAPI.submitTestResult({
        testId: testData.testId,
        answers,
        correctCount,
        totalCount: testData.questions.length,
        timeSpent: (testData.timeLimit ?? 300) - timeRemaining,
        autoSubmit,
        timestamp: new Date().toISOString(),
      });
      setScore(res.data);
      setTestCompleted(true);
    } catch (err) {
      console.error("Failed to submit test:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const answeredCount = Object.keys(answers).length;
  const isWarning = timeRemaining < 60 && timeRemaining > 0;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!testData) {
    return <div className="test-container loading">Loading test…</div>;
  }

  // ── Intro screen ──────────────────────────────────────────────────────────
  if (!testStarted) {
    return (
      <div className="test-container">
        <div className="test-intro">
          <div style={{ fontSize: "3rem", textAlign: "center", marginBottom: "1rem" }}>📝</div>
          <h1>Mock ASL Test</h1>
          <div className="test-info">
            <div className="info-item"><span>Questions</span><strong>{testData.questions.length}</strong></div>
            <div className="info-item"><span>Time Limit</span><strong>{formatTime(testData.timeLimit ?? 300)}</strong></div>
            <div className="info-item"><span>Passing Score</span><strong>{testData.passingScore ?? 70}%</strong></div>
          </div>
          <div className="test-instructions">
            <h3>Instructions</h3>
            <ul>
              <li>Each question shows a letter — pick the correct ASL sign label.</li>
              <li>You can jump between questions using the grid at the bottom.</li>
              <li>The test auto-submits when time runs out.</li>
              <li>You can submit early once you've answered all questions.</li>
            </ul>
          </div>
          <button onClick={() => setTestStarted(true)} className="btn-start-test">
            Start Test
          </button>
        </div>
      </div>
    );
  }

  // ── Results screen ────────────────────────────────────────────────────────
  if (testCompleted && score) {
    const passed = score.passed;
    const pct    = score.score ?? 0;
    return (
      <div className="test-container">
        <motion.div
          className="test-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={`result-icon ${passed ? "passed" : "failed"}`}>
            {passed ? <CheckCircle size={64} /> : <XCircle size={64} />}
          </div>
          <h1>{passed ? "Congratulations! 🎉" : "Keep Practicing! 💪"}</h1>

          <div className="score-breakdown">
            <div className="score-item">
              <span className="score-label">Your Score</span>
              <span className="score-value" style={{ color: passed ? "#10b981" : "#ef4444" }}>{pct}%</span>
            </div>
            <div className="score-item">
              <span className="score-label">Correct</span>
              <span className="score-value">{score.correctCount} / {score.totalCount}</span>
            </div>
            <div className="score-item">
              <span className="score-label">Time Taken</span>
              <span className="score-value">{formatTime(score.timeSpent ?? 0)}</span>
            </div>
          </div>

          <div className="xp-earned">⭐ +{score.xpEarned} XP earned</div>

          {/* Review — show correct/wrong per question */}
          <div className="answer-review">
            <h3>Answer Review</h3>
            {testData.questions.map((q, i) => {
              const selected = answers[q._id];
              const correct  = q.letter;
              const isRight  = selected === correct;
              return (
                <div key={q._id} className={`review-row ${isRight ? "correct" : "wrong"}`}>
                  <span className="review-num">{i + 1}</span>
                  <span className="review-letter">{correct}</span>
                  {isRight
                    ? <CheckCircle size={16} className="review-icon correct" />
                    : <span className="review-selected">You: {selected ?? "—"}</span>}
                </div>
              );
            })}
          </div>

          <div className="result-actions">
            <button onClick={() => { setTestCompleted(false); setTestStarted(false); setAnswers({}); loadTest(); }} className="btn-retake">
              Retake Test
            </button>
            <button onClick={() => window.location.href = "/dashboard"} className="btn-dashboard">
              Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Active test ───────────────────────────────────────────────────────────
  const question = testData.questions[currentQuestion];

  return (
    <div className="test-container">

      {/* Header */}
      <div className="test-header">
        <div className={`timer-display ${isWarning ? "timer-warning" : ""}`}>
          {isWarning && <AlertTriangle size={16} />}
          <Clock size={18} />
          <span>{formatTime(timeRemaining)}</span>
        </div>
        <div className="progress-info">
          Question {currentQuestion + 1} of {testData.questions.length}
        </div>
        <div className="answered-count">
          {answeredCount}/{testData.questions.length} answered
        </div>
      </div>

      {/* Body */}
      <div className="test-content">

        {/* Question panel */}
        <div className="question-section">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <p className="question-label">Question {currentQuestion + 1}</p>
              <h2 className="question-text">{question.prompt}</h2>

              {/* Big letter display */}
              <div className="question-letter-display">{question.letter}</div>

              {/* Options — plain strings */}
              <div className="answer-options">
                {question.options.map((option, idx) => (
                  <motion.button
                    key={option}
                    className={`answer-option ${answers[question._id] === option ? "selected" : ""}`}
                    onClick={() => handleAnswerSelect(question._id, option)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="option-indicator">{String.fromCharCode(65 + idx)}</div>
                    <div className="option-content">{option}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation sidebar */}
        <div className="question-navigation">
          <div className="nav-buttons">
            <button
              onClick={() => setCurrentQuestion((q) => q - 1)}
              disabled={currentQuestion === 0}
              className="btn-nav"
            >
              ← Prev
            </button>
            {currentQuestion < testData.questions.length - 1 ? (
              <button onClick={() => setCurrentQuestion((q) => q + 1)} className="btn-nav btn-next">
                Next →
              </button>
            ) : (
              <button
                onClick={() => handleSubmitTest(false)}
                disabled={submitting}
                className="btn-submit-test"
              >
                {submitting ? "Submitting…" : "Submit Test"}
              </button>
            )}
          </div>

          {/* Early submit if all answered */}
          {answeredCount === testData.questions.length && currentQuestion < testData.questions.length - 1 && (
            <button onClick={() => handleSubmitTest(false)} disabled={submitting} className="btn-early-submit">
              ✓ Submit early
            </button>
          )}

          {/* Question grid */}
          <div className="question-grid">
            {testData.questions.map((q, idx) => (
              <button
                key={q._id}
                className={`question-indicator ${idx === currentQuestion ? "active" : ""} ${answers[q._id] ? "answered" : ""}`}
                onClick={() => setCurrentQuestion(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="legend">
            <span className="legend-item answered-legend">✓ Answered</span>
            <span className="legend-item active-legend">● Current</span>
            <span className="legend-item unanswered-legend">○ Unanswered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
