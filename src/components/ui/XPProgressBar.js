import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gamificationAPI } from '../../services/api';
import { Star, TrendingUp } from 'lucide-react';
import './XPProgressBar.css';

const XPProgressBar = () => {
  const [xpData, setXpData] = useState(null);
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchXPData();
  }, []);

  const fetchXPData = async () => {
    try {
      const [xpResponse, levelResponse] = await Promise.all([
        gamificationAPI.getXP(),
        gamificationAPI.getLevel()
      ]);
      
      setXpData(xpResponse.data);
      setLevelData(levelResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch XP data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="xp-progress-bar loading">Loading...</div>;
  }

  if (!xpData || !levelData) {
    return null;
  }

  const { currentXP, xpForNextLevel, totalXP } = xpData;
  const { currentLevel, nextLevel, levelTitle } = levelData;
  
  const progress = (currentXP / xpForNextLevel) * 100;
  const xpRemaining = xpForNextLevel - currentXP;

  return (
    <div className="xp-progress-bar">
      <div className="xp-header">
        <div className="level-badge">
          <Star size={20} />
          <span>Level {currentLevel}</span>
        </div>
        
        <div className="level-title">{levelTitle}</div>
        
        <div className="total-xp">
          <TrendingUp size={16} />
          <span>{totalXP.toLocaleString()} XP</span>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-track">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <motion.div 
              className="progress-shine"
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
          </motion.div>
        </div>
        
        <div className="progress-labels">
          <span className="current-xp">{currentXP.toLocaleString()} XP</span>
          <span className="next-level-xp">{xpForNextLevel.toLocaleString()} XP</span>
        </div>
      </div>

      <div className="xp-footer">
        <div className="xp-remaining">
          <span>{xpRemaining.toLocaleString()} XP to Level {nextLevel}</span>
        </div>
        
        <div className="level-perks">
          {levelData.upcomingPerks && levelData.upcomingPerks.length > 0 && (
            <div className="perks-preview">
              <span className="perks-label">Next unlock:</span>
              <span className="perk-item">{levelData.upcomingPerks[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default XPProgressBar;