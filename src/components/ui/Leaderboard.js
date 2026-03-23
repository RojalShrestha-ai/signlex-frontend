import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gamificationAPI } from '../../services/api';
import { Trophy, Medal, TrendingUp, Users } from 'lucide-react';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await gamificationAPI.getLeaderboard(timeframe);
      setLeaderboardData(response.data.rankings || []);
      setCurrentUser(response.data.currentUser || null);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="rank-icon gold" />;
    if (rank === 2) return <Medal className="rank-icon silver" />;
    if (rank === 3) return <Medal className="rank-icon bronze" />;
    return <span className="rank-number">{rank}</span>;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  if (loading) {
    return <div className="leaderboard loading">Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>
          <Trophy size={24} />
          Leaderboard
        </h2>
        
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'daily' ? 'active' : ''}
            onClick={() => setTimeframe('daily')}
          >
            Today
          </button>
          <button 
            className={timeframe === 'weekly' ? 'active' : ''}
            onClick={() => setTimeframe('weekly')}
          >
            This Week
          </button>
          <button 
            className={timeframe === 'monthly' ? 'active' : ''}
            onClick={() => setTimeframe('monthly')}
          >
            This Month
          </button>
          <button 
            className={timeframe === 'all' ? 'active' : ''}
            onClick={() => setTimeframe('all')}
          >
            All Time
          </button>
        </div>
      </div>

      {currentUser && (
        <div className="user-rank-card">
          <div className="user-rank-info">
            <span className="your-rank-label">Your Rank</span>
            <div className="user-rank-display">
              {getRankIcon(currentUser.rank)}
              <span className="rank-position">#{currentUser.rank}</span>
            </div>
          </div>
          
          <div className="user-stats">
            <div className="stat-item">
              <Users size={16} />
              <span>{currentUser.xp.toLocaleString()} XP</span>
            </div>
            <div className="stat-item">
              <TrendingUp size={16} />
              <span>Level {currentUser.level}</span>
            </div>
          </div>
        </div>
      )}

      <div className="leaderboard-table">
        <div className="table-header">
          <span className="col-rank">Rank</span>
          <span className="col-user">User</span>
          <span className="col-level">Level</span>
          <span className="col-xp">XP</span>
        </div>

        <div className="table-body">
          {leaderboardData.map((entry, index) => (
            <motion.div
              key={entry.userId}
              className={`leaderboard-row ${getRankClass(entry.rank)} ${entry.isCurrentUser ? 'current-user' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="col-rank">
                {getRankIcon(entry.rank)}
              </div>
              
              <div className="col-user">
                <div className="user-avatar">
                  {entry.avatarUrl ? (
                    <img src={entry.avatarUrl} alt={entry.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="user-info">
                  <span className="username">
                    {entry.username}
                    {entry.isCurrentUser && <span className="you-badge">You</span>}
                  </span>
                  {entry.streak > 0 && (
                    <span className="user-streak">{entry.streak} day streak</span>
                  )}
                </div>
              </div>
              
              <div className="col-level">
                <span className="level-badge">Lv. {entry.level}</span>
              </div>
              
              <div className="col-xp">
                <span className="xp-value">{entry.xp.toLocaleString()}</span>
                {entry.xpGain && entry.xpGain > 0 && (
                  <span className="xp-gain">+{entry.xpGain}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {leaderboardData.length === 0 && (
          <div className="no-data">
            <p>No rankings available for this timeframe.</p>
          </div>
        )}
      </div>

      {leaderboardData.length > 0 && (
        <div className="leaderboard-footer">
          <p>Showing top {leaderboardData.length} users</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;