import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userAPI } from '../../services/api';
import { Award, Lock, Check } from 'lucide-react';
import './AchievementBadges.css';

const AchievementBadges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await userAPI.getAchievements();
      setBadges(response.data.badges || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
      setLoading(false);
    }
  };

  const filteredBadges = badges.filter(badge => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return badge.unlocked;
    if (filter === 'locked') return !badge.unlocked;
    return true;
  });

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;

  if (loading) {
    return <div className="achievement-badges loading">Loading badges...</div>;
  }

  return (
    <div className="achievement-badges">
      <div className="badges-header">
        <h2>
          <Award size={24} />
          Achievements
        </h2>
        
        <div className="badges-stats">
          <span>{unlockedCount}/{totalCount} Unlocked</span>
        </div>
      </div>

      <div className="badges-filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({totalCount})
        </button>
        <button 
          className={filter === 'unlocked' ? 'active' : ''}
          onClick={() => setFilter('unlocked')}
        >
          Unlocked ({unlockedCount})
        </button>
        <button 
          className={filter === 'locked' ? 'active' : ''}
          onClick={() => setFilter('locked')}
        >
          Locked ({totalCount - unlockedCount})
        </button>
      </div>

      <div className="badges-grid">
        {filteredBadges.map((badge, index) => (
          <motion.div
            key={badge._id}
            className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'} ${badge.rarity}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedBadge(badge)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="badge-icon">
              {badge.unlocked ? (
                <img src={badge.iconUrl} alt={badge.name} />
              ) : (
                <Lock size={32} />
              )}
            </div>
            
            <div className="badge-info">
              <h3>{badge.name}</h3>
              <p className="badge-description">{badge.description}</p>
              
              {badge.unlocked && badge.unlockedAt && (
                <div className="badge-unlocked">
                  <Check size={14} />
                  <span>Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}</span>
                </div>
              )}
              
              {!badge.unlocked && badge.progress && (
                <div className="badge-progress">
                  <div className="progress-bar-mini">
                    <div 
                      className="progress-fill-mini" 
                      style={{ width: `${(badge.progress.current / badge.progress.target) * 100}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {badge.progress.current}/{badge.progress.target}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className="no-badges">
          <p>No badges in this category yet.</p>
        </div>
      )}

      <AnimatePresence>
        {selectedBadge && (
          <motion.div 
            className="badge-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div 
              className="badge-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`modal-badge-icon ${selectedBadge.unlocked ? 'unlocked' : 'locked'}`}>
                {selectedBadge.unlocked ? (
                  <img src={selectedBadge.iconUrl} alt={selectedBadge.name} />
                ) : (
                  <Lock size={64} />
                )}
              </div>
              
              <h2>{selectedBadge.name}</h2>
              <p className="rarity-label">{selectedBadge.rarity}</p>
              <p className="modal-description">{selectedBadge.description}</p>
              
              {selectedBadge.unlocked ? (
                <div className="modal-unlocked-info">
                  <p>Unlocked on {new Date(selectedBadge.unlockedAt).toLocaleDateString()}</p>
                  <p className="xp-reward">+{selectedBadge.xpReward} XP</p>
                </div>
              ) : (
                <div className="modal-locked-info">
                  <p className="how-to-unlock">How to unlock:</p>
                  <p>{selectedBadge.unlockCriteria}</p>
                  
                  {selectedBadge.progress && (
                    <div className="modal-progress">
                      <div className="progress-bar-large">
                        <div 
                          className="progress-fill-large" 
                          style={{ width: `${(selectedBadge.progress.current / selectedBadge.progress.target) * 100}%` }}
                        />
                      </div>
                      <p>{selectedBadge.progress.current}/{selectedBadge.progress.target}</p>
                    </div>
                  )}
                </div>
              )}
              
              <button onClick={() => setSelectedBadge(null)} className="close-modal">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementBadges;