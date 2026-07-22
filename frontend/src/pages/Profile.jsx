import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Phone, Lock, AlertCircle, CheckCircle, KeyRound } from 'lucide-react';

const Profile = () => {
  const { user, updateStoredUser } = useAuth();

  // Profile fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setName(res.data.name);
        setEmail(res.data.email);
        setPhone(res.data.phone || '');
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);
    try {
      const res = await api.put('/users/profile', { name, email, phone });
      updateStoredUser({ name: res.data.name, email: res.data.email });
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match");
      return;
    }

    setPassLoading(true);
    try {
      await api.put('/users/change-password', { oldPassword, newPassword });
      setPassSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="qf-page flex-1 px-6 py-12 max-w-5xl mx-auto w-full space-y-8">
      <div className="flex flex-col space-y-2 border-b border-[var(--ink-line)] pb-4">
        <h1 className="text-3xl qf-heading uppercase flex items-center gap-2">
          <User className="text-[var(--brass)]" /> Account Profile
        </h1>
        <p className="text-[var(--muted-on-ink)] text-sm">Update your information and manage password security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Update Profile Card */}
        <div className="qf-panel p-8 space-y-6">
          <h3 className="text-lg font-bold text-[var(--paper)] flex items-center gap-2 border-b border-[var(--ink-line)] pb-3" style={{ fontFamily: 'var(--font-display)' }}>
            <User size={18} className="text-[var(--brass)]" /> Profile Information
          </h3>

          {profileError && (
            <div className="qf-alert qf-alert-error">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{profileError}</span>
            </div>
          )}

          {profileSuccess && (
            <div className="qf-alert qf-alert-success">
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="qf-label">Full Name</label>
              <div className="qf-input-wrap">
                <User className="qf-input-icon" size={16} />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="qf-input" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="qf-label">Email Address</label>
              <div className="qf-input-wrap">
                <Mail className="qf-input-icon" size={16} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="qf-input" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="qf-label">Phone Number</label>
              <div className="qf-input-wrap">
                <Phone className="qf-input-icon" size={16} />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="qf-input" />
              </div>
            </div>

            <button type="submit" disabled={profileLoading} className="btn-brass px-6 py-3 flex items-center justify-center gap-2 cursor-pointer">
              {profileLoading ? (
                <span className="h-4 w-4 border-2 border-[var(--charcoal)]/30 border-t-[var(--charcoal)] rounded-full animate-spin" />
              ) : (
                'Save Profile'
              )}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="qf-panel p-8 space-y-6">
          <h3 className="text-lg font-bold text-[var(--paper)] flex items-center gap-2 border-b border-[var(--ink-line)] pb-3" style={{ fontFamily: 'var(--font-display)' }}>
            <KeyRound size={18} className="text-[var(--brass)]" /> Security Password
          </h3>

          {passError && (
            <div className="qf-alert qf-alert-error">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{passError}</span>
            </div>
          )}

          {passSuccess && (
            <div className="qf-alert qf-alert-success">
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{passSuccess}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="qf-label">Current Password</label>
              <div className="qf-input-wrap">
                <Lock className="qf-input-icon" size={16} />
                <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="••••••••" className="qf-input" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="qf-label">New Password</label>
              <div className="qf-input-wrap">
                <Lock className="qf-input-icon" size={16} />
                <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" className="qf-input" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="qf-label">Confirm New Password</label>
              <div className="qf-input-wrap">
                <Lock className="qf-input-icon" size={16} />
                <input type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="qf-input" />
              </div>
            </div>

            <button type="submit" disabled={passLoading} className="btn-brass px-6 py-3 flex items-center justify-center gap-2 cursor-pointer">
              {passLoading ? (
                <span className="h-4 w-4 border-2 border-[var(--charcoal)]/30 border-t-[var(--charcoal)] rounded-full animate-spin" />
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;