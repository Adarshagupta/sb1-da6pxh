import React, { useState } from 'react';
import { auth } from '../../lib/firebase';
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Notification } from '../ui/Notification';
import { Loader } from '../ui/Loader';
import { Mail, Lock, User, Shield } from 'lucide-react';
import { SEO } from '../common/SEO';

export function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [email, setEmail] = useState(auth.currentUser?.email || '');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName
      });
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setNotification({ 
        type: 'error', 
        message: err instanceof Error ? err.message : 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !currentPassword) return;

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, email);
      setNotification({ type: 'success', message: 'Email updated successfully!' });
    } catch (err) {
      setNotification({ 
        type: 'error', 
        message: err instanceof Error ? err.message : 'Failed to update email'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !currentPassword || !newPassword) return;

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setNotification({ type: 'success', message: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setNotification({ 
        type: 'error', 
        message: err instanceof Error ? err.message : 'Failed to update password'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Profile Settings | BookAI"
        description="Manage your BookAI profile settings. Update your account information, email, and security preferences."
        ogType="profile"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* Profile Information */}
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 md:p-3 bg-indigo-100 rounded-lg">
                <User className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Profile Information</h3>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 text-sm md:text-base"
              >
                {loading ? <Loader size="small" /> : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Email Settings */}
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 md:p-3 bg-indigo-100 rounded-lg">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Email Settings</h3>
            </div>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 text-sm md:text-base"
              >
                {loading ? <Loader size="small" /> : 'Update Email'}
              </button>
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 md:p-3 bg-indigo-100 rounded-lg">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Security Settings</h3>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 text-sm md:text-base"
              >
                {loading ? <Loader size="small" /> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </>
  );
}