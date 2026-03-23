"use client";

/**
 * SignLex Frontend - Practice Page (Webcam Gesture Recognition)
 * Author: Pawan Rijal
 * Converted to Tailwind CSS
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { recognitionAPI } from "../../api/api";
import {
  Camera, CameraOff, ChevronRight, RotateCw, Zap,
  Target, CheckCircle2, XCircle, Trophy, Flame, Play,
} from "lucide-react";

const SIGNS_SEQUENCE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const MODES = [
  { key: "free",  label: "Free Practice", icon: "🎯", description: "Sign any letter — get instant AI feedback" },
  { key: "drill", label: "Guided Drill",   icon: "🔥", description: "Follow a sequence of signs with scoring" },
];

function timeAgo(start) {
  const s = Math.floor((Date.now() - start) / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

function drawFakeSkeleton(ctx, w, h, tick) {
  const cx = w * 0.5 + Math.sin(tick * 0.04) * w * 0.03;
  const cy = h * 0.55 + Math.cos(tick * 0.03) * h * 0.02;
  const pts = [
    [cx, cy-h*.22],[cx-w*.07,cy-h*.32],[cx-w*.11,cy-h*.42],[cx-w*.13,cy-h*.49],[cx-w*.14,cy-h*.54],
    [cx-w*.04,cy-h*.38],[cx-w*.04,cy-h*.49],[cx-w*.04,cy-h*.56],[cx-w*.04,cy-h*.62],
    [cx+w*.01,cy-h*.40],[cx+w*.01,cy-h*.52],[cx+w*.01,cy-h*.59],[cx+w*.01,cy-h*.65],
    [cx+w*.06,cy-h*.38],[cx+w*.06,cy-h*.49],[cx+w*.06,cy-h*.56],[cx+w*.06,cy-h*.62],
    [cx+w*.11,cy-h*.34],[cx+w*.11,cy-h*.44],[cx+w*.11,cy-h*.50],[cx+w*.11,cy-h*.55],
  ];
  const conns = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],
    [9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
  ctx.save();
  ctx.strokeStyle = "rgba(99,102,241,0.85)";
  ctx.lineWidth = 2;
  conns.forEach(([a,b]) => {
    ctx.beginPath(); ctx.moveTo(pts[a][0],pts[a][1]); ctx.lineTo(pts[b][0],pts[b][1]); ctx.stroke();
  });
  pts.forEach(([x,y]) => {
    ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fillStyle="rgba(239,68,68,0.9)"; ctx.fill();
  });
  ctx.restore();
}

function ModeSelector({ onStart }) {
  const [selected, setSelected] = useState("free");
  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <div className="text-center pt-8 pb-2">
        <span className="text-[3.5rem] block mb-3">🤟</span>
        <h1 className="text-[2.25rem] font-extrabold text-gray-900 mb-2">Practice Mode</h1>
        <p className="text-gray-500 text-base">Use your webcam to practice ASL signs with real-time AI feedback.</p>
      </div>

      {/* Mode cards */}
      <div className="flex flex-col gap-3">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setSelected(m.key)}
            className={`flex items-center gap-4 px-6 py-5 bg-white border-2 rounded-xl cursor-pointer text-left transition-all duration-200 w-full
              ${selected === m.key
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
              }`}
          >
            <span className="text-3xl flex-shrink-0">{m.icon}</span>
            <div>
              <p className="font-bold text-gray-900 text-base">{m.label}</p>
              <p className="text-sm text-gray-500 mt-0.5">{m.description}</p>
            </div>
            {selected === m.key && <CheckCircle2 size={20} className="text-indigo-500 ml-auto flex-shrink-0" />}
          </button>
        ))}
      </div>

      {/* Tips */}
      <div className="grid grid-cols-3 gap-3">
        {[
          ["💡", "Good lighting helps the AI detect your hand better"],
          ["✋", "Keep your hand centered and visible in the camera"],
          ["📷", "A plain background improves recognition accuracy"],
        ].map(([e, t]) => (
          <div key={e} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 text-center text-[0.82rem] text-gray-500">
            <span className="text-2xl">{e}</span>
            <p>{t}</p>
          </div>
        ))}
      </div>

      {/* Start button */}
      <button
        onClick={() => onStart(selected)}
        className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold text-[1.05rem] px-8 py-4 border-none rounded-xl cursor-pointer transition-all duration-200 hover:bg-indigo-700 hover:-translate-y-px"
      >
        <Play size={18}/> Start {MODES.find(m => m.key === selected)?.label}
      </button>
    </div>
  );
}

function SessionSummary({ stats, onRestart }) {
  return (
    <motion.div
      className="max-w-[480px] mx-auto mt-12 bg-white border border-gray-200 rounded-[20px] p-10 text-center shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-[3.5rem] mb-2">🏆</div>
      <h2 className="text-[1.75rem] font-extrabold text-gray-900 mb-6">Session Complete!</h2>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {[
          { icon: <Trophy size={22} className="text-violet-500 opacity-70"/>, val: stats.xpEarned, label: "XP Earned" },
          { icon: <Target size={22} className="text-indigo-500 opacity-70"/>, val: `${stats.accuracy}%`, label: "Accuracy" },
          { icon: <CheckCircle2 size={22} className="text-green-600 opacity-70"/>, val: stats.correct, label: "Correct" },
          { icon: <Flame size={22} className="text-orange-500 opacity-70"/>, val: stats.bestStreak, label: "Best Streak" },
        ].map(({ icon, val, label }) => (
          <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-1.5">
            {icon}
            <span className="text-[1.75rem] font-extrabold text-gray-900">{val}</span>
            <span className="text-[0.78rem] text-gray-400 font-semibold uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-400 mb-6">⏱ Session time: {stats.duration}</div>
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 bg-indigo-600 text-white border-none rounded-xl px-6 py-3 font-bold text-[0.95rem] cursor-pointer transition-colors hover:bg-indigo-700"
        >
          <RotateCw size={16}/> Practice Again
        </button>
        <a
          href="/dashboard"
          className="flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-xl px-6 py-3 font-semibold text-[0.95rem] no-underline transition-colors hover:bg-gray-200"
        >
          Back to Dashboard
        </a>
      </div>
    </motion.div>
  );
}

function PracticeSession({ mode, onEnd }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animRef = useRef(null);
  const tickRef = useRef(0);
  const pollRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const [cameraState, setCameraState] = useState("idle");
  const [currentSignIdx, setCurrentSignIdx] = useState(0);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xpTotal, setXpTotal] = useState(0);
  const [xpFlash, setXpFlash] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [sessionDone, setSessionDone] = useState(false);
  const [sessionStats, setSessionStats] = useState(null);

  const currentSign = SIGNS_SEQUENCE[currentSignIdx % SIGNS_SEQUENCE.length];
  const isDrill = mode === "drill";

  const startCamera = useCallback(async () => {
    setCameraState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setCameraState("active");
    } catch { setCameraState("denied"); }
  }, []);

  useEffect(() => {
    if (cameraState !== "active") return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const draw = () => {
      const ctx = canvas.getContext("2d");
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      const w = canvas.width; const h = canvas.height;
      ctx.save(); ctx.translate(w,0); ctx.scale(-1,1);
      if (video.readyState >= 2) ctx.drawImage(video,0,0,w,h);
      else { ctx.fillStyle="#111827"; ctx.fillRect(0,0,w,h); }
      ctx.restore();
      drawFakeSkeleton(ctx,w,h,tickRef.current);
      tickRef.current += 1;
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [cameraState]);

  const handleCorrect = useCallback((conf) => {
    const xp = Math.round(10 + conf * 15);
    setScore(s=>s+1); setAttempts(a=>a+1);
    setStreak(st=>{ const n=st+1; setBestStreak(b=>Math.max(b,n)); return n; });
    setXpTotal(x=>x+xp); setXpFlash(`+${xp} XP`); setFeedback("correct");
    setTimeout(()=>setXpFlash(null),1200);
    setTimeout(()=>{ setFeedback(null); setCurrentSignIdx(i=>i+1); },800);
  }, []);

  useEffect(() => {
    if (cameraState !== "active") return;
    const poll = async () => {
      try {
        const res = await recognitionAPI.submitGesture();
        setPrediction(res.data.predictedLetter); setConfidence(res.data.confidence);
        if (isDrill && res.data.predictedLetter === currentSign && res.data.confidence > 0.75) handleCorrect(res.data.confidence);
      } catch(e) { console.error(e); }
    };
    pollRef.current = setInterval(poll, 1500);
    return () => clearInterval(pollRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraState, currentSignIdx, isDrill]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(t=>t.stop());
    cancelAnimationFrame(animRef.current); clearInterval(pollRef.current);
  }, []);

  const handleSkip = () => {
    setAttempts(a=>a+1); setStreak(0); setFeedback("wrong");
    setTimeout(()=>{ setFeedback(null); setCurrentSignIdx(i=>i+1); },600);
  };

  const handleEndSession = () => {
    streamRef.current?.getTracks().forEach(t=>t.stop()); clearInterval(pollRef.current);
    const total = attempts || 1;
    setSessionStats({ xpEarned: xpTotal, accuracy: Math.round((score/total)*100), correct: score, bestStreak, duration: timeAgo(startTimeRef.current) });
    setSessionDone(true);
  };

  if (sessionDone && sessionStats) return <SessionSummary stats={sessionStats} onRestart={onEnd}/>;

  return (
    <div className="flex flex-col gap-5">
      {/* Session header */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[0.82rem] font-bold">
            {isDrill ? "🔥 Drill" : "🎯 Free"}
          </span>
          <span className="text-sm text-gray-500">Sign {currentSignIdx + 1}</span>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[0.8rem] font-bold">
            <CheckCircle2 size={14}/> {score}/{attempts}
          </span>
          {streak > 1 && (
            <span className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[0.8rem] font-bold">
              <Flame size={14}/> {streak}x
            </span>
          )}
          <span className="flex items-center gap-1.5 bg-purple-50 text-violet-600 px-3 py-1 rounded-full text-[0.8rem] font-bold">
            <Zap size={14}/> {xpTotal} XP
          </span>
        </div>
      </div>

      {/* XP toast */}
      <AnimatePresence>
        {xpFlash && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2.5 rounded-full font-extrabold text-[1.1rem] z-50 pointer-events-none shadow-xl shadow-indigo-400/40"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
          >
            {xpFlash}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session body */}
      <div className="grid grid-cols-[1fr_2fr] gap-5 items-start">

        {/* Target panel */}
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-8 text-center flex flex-col items-center gap-4">
          <p className="text-[0.85rem] text-gray-400 font-semibold uppercase tracking-wider">Sign this letter</p>
          <motion.div
            key={currentSign}
            className="text-[6rem] font-black text-indigo-600 leading-none"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {currentSign}
          </motion.div>
          <div className="flex gap-1.5 items-center">
            {SIGNS_SEQUENCE.slice(Math.max(0, currentSignIdx - 1), currentSignIdx + 4).map((l, i) => (
              <span
                key={l}
                className={`w-7 h-7 flex items-center justify-center rounded-md font-bold text-[0.85rem] transition-all duration-300
                  ${l === currentSign ? "bg-indigo-600 text-white scale-110" :
                    i === 0 && currentSignIdx > 0 ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-400"}`}
              >
                {l}
              </span>
            ))}
          </div>
          <div className="text-[0.78rem] text-gray-400 px-2 py-1.5 rounded-lg bg-gray-50">
            Keep your palm facing forward, fingers relaxed
          </div>
        </div>

        {/* Camera panel */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-[4/3] relative flex items-center justify-center">
          {cameraState === "idle" && (
            <div className="flex flex-col items-center gap-4 text-gray-400 text-center px-8">
              <Camera size={48} className="text-gray-600"/>
              <p>Camera access required for gesture recognition</p>
              <button
                onClick={startCamera}
                className="flex items-center gap-2 bg-indigo-600 text-white border-none rounded-lg px-5 py-2.5 font-semibold cursor-pointer hover:bg-indigo-700 transition-colors"
              >
                <Camera size={16}/> Enable Camera
              </button>
            </div>
          )}
          {cameraState === "requesting" && (
            <div className="flex flex-col items-center gap-4 text-gray-400">
              <div className="w-10 h-10 border-[3px] border-gray-600 border-t-indigo-500 rounded-full animate-spin"/>
              <p>Requesting camera access…</p>
            </div>
          )}
          {cameraState === "denied" && (
            <div className="flex flex-col items-center gap-3 text-red-400 text-center px-8">
              <CameraOff size={48}/>
              <p>Camera access denied</p>
              <p className="text-sm text-gray-500">Allow camera in browser settings and refresh.</p>
            </div>
          )}
          {cameraState === "active" && (
            <div className="absolute inset-0">
              <video ref={videoRef} className="hidden" autoPlay muted playsInline/>
              <canvas ref={canvasRef} className="w-full h-full block"/>

              {/* Feedback overlay */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none
                      ${feedback === "correct" ? "bg-emerald-500/35 text-emerald-100" : "bg-red-500/30 text-red-200"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {feedback === "correct" ? <CheckCircle2 size={64}/> : <XCircle size={64}/>}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Prediction badge */}
              {prediction && (
                <div className={`absolute top-3 left-3 flex items-center gap-2 backdrop-blur-sm px-3.5 py-1.5 rounded-lg font-bold transition-colors duration-300
                  ${prediction === currentSign ? "bg-emerald-500/90 text-white" : "bg-black/70 text-white"}`}>
                  <span className="text-[1.4rem]">{prediction}</span>
                  <span className="text-[0.8rem] opacity-85">{Math.round(confidence * 100)}%</span>
                </div>
              )}

              {/* Confidence bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
                <div
                  className="h-full bg-indigo-500 transition-all duration-400"
                  style={{ width: `${Math.round(confidence * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center flex-wrap">
        {cameraState === "active" ? (
          <>
            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 bg-gray-100 text-gray-700 border-none rounded-xl px-6 py-3 font-semibold text-[0.95rem] cursor-pointer transition-colors hover:bg-gray-200"
            >
              Skip <ChevronRight size={16}/>
            </button>
            {!isDrill && (
              <button
                onClick={() => handleCorrect(0.9)}
                className="flex items-center gap-1.5 bg-green-100 text-green-700 border-none rounded-xl px-6 py-3 font-semibold text-[0.95rem] cursor-pointer transition-colors hover:bg-green-200"
              >
                <CheckCircle2 size={16}/> Mark Correct
              </button>
            )}
            <button
              onClick={handleEndSession}
              className="flex items-center gap-1.5 bg-red-100 text-red-600 border-none rounded-xl px-6 py-3 font-semibold text-[0.95rem] cursor-pointer transition-colors hover:bg-red-200"
            >
              End Session
            </button>
          </>
        ) : cameraState !== "requesting" ? (
          <button
            onClick={onEnd}
            className="flex items-center gap-1.5 bg-gray-100 text-gray-700 border-none rounded-xl px-6 py-3 font-semibold text-[0.95rem] cursor-pointer transition-colors hover:bg-gray-200"
          >
            ← Back
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function PracticePage() {
  const [phase, setPhase] = useState("select");
  const [mode, setMode] = useState("free");
  return (
    <div className="max-w-[960px] mx-auto px-5 py-8 pb-16">
      <AnimatePresence mode="wait">
        {phase === "select" ? (
          <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <ModeSelector onStart={(m) => { setMode(m); setPhase("session"); }}/>
          </motion.div>
        ) : (
          <motion.div key="session" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <PracticeSession mode={mode} onEnd={() => setPhase("select")}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}