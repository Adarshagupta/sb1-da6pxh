import React, { useState, useEffect } from 'react';
import { Settings2, Save, Bell, Moon, Sun, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Notification } from '../ui/Notification';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
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
  notifications: true,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Settings2 className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-sm text-gray-600">Customize your experience</p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-8">
            {/* Appearance */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Appearance
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {['light', 'dark', 'system'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSettings({ ...settings, theme: theme as 'light' | 'dark' | 'system' })}
                    className={`p-4 rounded-lg border ${
                      settings.theme === theme
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    <div className="font-medium text-gray-800 capitalize">{theme}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Notifications */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h2>
              <div className="space-y-4">
                {Object.entries(settings.emailNotifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            emailNotifications: {
                              ...settings.emailNotifications,
                              [key]: e.target.checked
                            }
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </section>

            {/* Language */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language
              </h2>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </section>

            {/* Add this section before the Account section */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                API Configuration
              </h2>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Together AI API Key
                </label>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={settings.togetherApiKey || ''}
                    onChange={(e) => setSettings({ ...settings, togetherApiKey: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your Together AI API key (optional)"
                  />
                  <p className="text-xs text-gray-500">
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

            {/* Add this section before the save button */}
            <section className="space-y-4 pt-6 border-t">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Account
              </h2>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </section>

            {/* Save Button */}
            <div className="pt-6 border-t mt-8">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
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
  );
}; 