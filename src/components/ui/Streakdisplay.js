import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { userAPI } from '../../services/api';
import './StreakDisplay.css';

const StreakDisplay = () => {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      const response = await userAPI.getStreak();
      setStreakData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch streak:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="streak-display loading">Loading...</div>;
  }

  if (!streakData) {
    return null;
  }

  const { currentStreak, longestStreak, lastActive, streakHistory } = streakData;

  return (
    <div className="streak-display">
      <div className="streak-main">
        <motion.div 
          className="streak-icon"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <Flame size={48} />
        </motion.div>
        
        <div className="streak-info">
          <div className="current-streak">
            <span className="streak-number">{currentStreak}</span>
            <span className="streak-label">Day Streak</span>
          </div>
          
          <div className="longest-streak">
            <span className="longest-label">Longest: {longestStreak} days</span>
          </div>
        </div>
      </div>

      {streakHistory && streakHistory.length > 0 && (
        <div className="streak-calendar">
          {streakHistory.map((day, index) => (
            <motion.div
              key={index}
              className={`streak-day ${day.active ? 'active' : 'inactive'}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              title={day.date}
            />
          ))}
        </div>
      )}

      <div className="streak-message">
        {currentStreak === 0 ? (
          <p>Start your streak today!</p>
        ) : currentStreak === 1 ? (
          <p>Great start! Come back tomorrow to keep it going.</p>
        ) : currentStreak < 7 ? (
          <p>You're on fire! Keep it up!</p>
        ) : currentStreak < 30 ? (
          <p>Amazing consistency! You're building a solid habit.</p>
        ) : (
          <p>Incredible dedication! You're a true ASL master in the making!</p>
        )}
      </div>
    </div>
  );
};

export default StreakDisplay;