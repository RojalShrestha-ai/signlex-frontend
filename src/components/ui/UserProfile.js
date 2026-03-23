import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userAPI } from '../../services/api';
import { User, Mail, Calendar, Award, TrendingUp, Activity } from 'lucide-react';
import StreakDisplay from '../Gamification/StreakDisplay';
import XPProgressBar from '../Gamification/XPProgressBar';
import AchievementBadges from '../Gamification/AchievementBadges';
import './UserProfile.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getStats()
      ]);
      
      setProfile(profileRes.data);
      setStats(statsRes.data);
      setFormData({
        name: profileRes.data.name,
        email: profileRes.data.email,
        bio: profileRes.data.bio || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await userAPI.updateProfile(formData);
      setEditing(false);
      fetchProfileData();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) {
    return <div className="profile-page loading">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="profile-page error">Failed to load profile</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <motion.div 
          className="profile-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="banner-gradient" />
        </motion.div>

        <div className="profile-info-section">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} />
              ) : (
                <div className="avatar-placeholder">
                  <User size={64} />
                </div>
              )}
            </div>
            <button className="change-avatar-btn">Change Photo</button>
          </div>

          <div className="profile-details">
            {!editing ? (
              <>
                <h1>{profile.name}</h1>
                <div className="profile-meta">
                  <span className="meta-item">
                    <Mail size={16} />
                    {profile.email}
                  </span>
                  <span className="meta-item">
                    <Calendar size={16} />
                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                <button onClick={() => setEditing(true)} className="btn-edit-profile">
                  Edit Profile
                </button>
              </>
            ) : (
              <div className="profile-edit-form">
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    value={formData.bio} 
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="edit-actions">
                  <button onClick={handleUpdateProfile} className="btn-save">
                    Save Changes
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-cancel">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="stats-overview">
          <h2>
            <Activity size={24} />
            Statistics
          </h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total-xp">
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats?.totalXP?.toLocaleString() || 0}</span>
                <span className="stat-label">Total XP</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon signs-learned">
                <Award size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats?.signsLearned || 0}</span>
                <span className="stat-label">Signs Learned</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon practice-time">
                <Activity size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats?.practiceHours || 0}h</span>
                <span className="stat-label">Practice Time</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon tests-taken">
                <Award size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats?.testsTaken || 0}</span>
                <span className="stat-label">Tests Taken</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon accuracy">
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats?.averageAccuracy || 0}%</span>
                <span className="stat-label">Avg Accuracy</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon reviews">
                <Activity size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats?.totalReviews || 0}</span>
                <span className="stat-label">Total Reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div className="gamification-section">
          <div className="section-row">
            <XPProgressBar />
          </div>

          <div className="section-row">
            <StreakDisplay />
          </div>

          <div className="section-row">
            <AchievementBadges />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;