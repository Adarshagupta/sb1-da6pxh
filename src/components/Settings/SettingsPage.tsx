import React, { useState, useEffect } from 'react';
import { Settings2, Save, Bell, Moon, Sun, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Notification } from '../ui/Notification';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../common/SEO';
import { auth } from '../../lib/firebase';
import { requestNotificationPermission, scheduleBookReminders } from '../../utils/notifications';
import { Switch } from '../ui/Switch';

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    enabled: boolean;
    morningReminder: boolean;
    afternoonReminder: boolean;
  };
  language: string;
  emailNotifications: {
    bookGenerated: boolean;
    tokensPurchased: boolean;
    weeklyNewsletter: boolean;
  };
  togetherApiKey?: string;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  notifications: {
    enabled: true,
    morningReminder: true,
    afternoonReminder: true,
  },
  language: 'en',
  emailNotifications: {
    bookGenerated: true,
    tokensPurchased: true,
    weeklyNewsletter: false,
  },
  togetherApiKey: ''
};

export const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme: currentTheme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentTheme) {
      setSettings(prev => ({
        ...prev,
        theme: currentTheme
      }));
    }
  }, [currentTheme]);

  useEffect(() => {
    loadUserSettings();
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (userData?.settings) {
        setSettings(userData.settings as UserSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setNotification({
        type: 'error',
        message: 'Failed to load settings'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        settings: settings
      });
      
      // Update theme
      setTheme(settings.theme);

      // Store API key in localStorage if provided
      if (settings.togetherApiKey) {
        localStorage.setItem('togetherApiKey', settings.togetherApiKey);
      } else {
        localStorage.removeItem('togetherApiKey');
      }

      setNotification({
        type: 'success',
        message: 'Settings saved successfully!'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification({
        type: 'error',
        message: 'Failed to save settings'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      setNotification({
        type: 'error',
        message: 'Failed to sign out'
      });
    }
  };

  const handleNotificationChange = async (setting: string, value: boolean) => {
    if (value && setting === 'enabled') {
      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) {
        setNotification({
          type: 'error',
          message: 'Please enable notifications in your browser settings'
        });
        return;
      }
      scheduleBookReminders();
    }

    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Account Settings | BookAI"
        description="Manage your BookAI account settings. Customize your writing preferences, API configurations, notification settings, and more."
        ogType="website"
        imageAlt="BookAI Settings Dashboard"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2 md:p-6 pt-20 md:pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-8 border border-white/20">
            {/* Header */}
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="p-2 md:p-3 bg-indigo-100 rounded-xl">
                <Settings2 className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-xs md:text-sm text-gray-600">Customize your experience</p>
              </div>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6 md:space-y-8">
              {/* Appearance */}
              <section className="space-y-3 md:space-y-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Sun className="w-4 h-4 md:w-5 md:h-5" />
                  Appearance
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  {['light', 'dark', 'system'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSettings({ ...settings, theme: theme as 'light' | 'dark' | 'system' })}
                      className={`p-3 md:p-4 rounded-lg border transition-colors ${
                        settings.theme === theme
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200'
                      }`}
                    >
                      <div className="font-medium text-sm md:text-base text-gray-800 capitalize">{theme}</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Notifications */}
              <section className="space-y-3 md:space-y-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Bell className="w-4 h-4 md:w-5 md:h-5" />
                  Notifications
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm md:text-base text-gray-700">
                      Enable Notifications
                    </label>
                    <Switch
                      checked={settings.notifications.enabled}
                      onChange={(value) => handleNotificationChange('enabled', value)}
                    />
                  </div>
                  {settings.notifications.enabled && (
                    <>
                      <div className="flex items-center justify-between">
                        <label className="text-sm md:text-base text-gray-700">
                          Morning Reminder (10 AM)
                        </label>
                        <Switch
                          checked={settings.notifications.morningReminder}
                          onChange={(value) => handleNotificationChange('morningReminder', value)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm md:text-base text-gray-700">
                          Afternoon Reminder (4 PM)
                        </label>
                        <Switch
                          checked={settings.notifications.afternoonReminder}
                          onChange={(value) => handleNotificationChange('afternoonReminder', value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Language */}
              <section className="space-y-3 md:space-y-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Globe className="w-4 h-4 md:w-5 md:h-5" />
                  Language
                </h2>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full max-w-xs px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </section>

              {/* API Configuration */}
              <section className="space-y-3 md:space-y-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Settings2 className="w-4 h-4 md:w-5 md:h-5" />
                  API Configuration
                </h2>
                <div className="space-y-2">
                  <label className="block text-sm md:text-base font-medium text-gray-700">
                    Together AI API Key
                  </label>
                  <div className="space-y-2">
                    <input
                      type="password"
                      value={settings.togetherApiKey || ''}
                      onChange={(e) => setSettings({ ...settings, togetherApiKey: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Enter your Together AI API key (optional)"
                    />
                    <p className="text-xs md:text-sm text-gray-500">
                      Leave empty to use the default API key. Get your own API key from{' '}
                      <a 
                        href="https://www.together.ai/api" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Together AI
                      </a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Account Section */}
              <section className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                  Account
                </h2>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm md:text-base"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </section>

              {/* Save Button */}
              <div className="pt-4 md:pt-6 border-t">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm md:text-base"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
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
}; 