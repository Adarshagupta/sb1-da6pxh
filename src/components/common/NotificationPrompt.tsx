import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { requestNotificationPermission, scheduleBookReminders } from '../../utils/notifications';

export const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  const sendWelcomeNotification = () => {
    new Notification('Welcome to BookAI! 🎉', {
      body: "Thank you for enabling notifications. We'll keep you updated about your book generation progress.",
      icon: '/logo.png',
      badge: '/logo.png',
      tag: 'welcome',
      data: {
        url: window.location.origin
      }
    });
  };

  useEffect(() => {
    // Show prompt immediately if notifications are not granted or denied
    if (Notification.permission === 'default') {
      setShowPrompt(true);
      // Directly trigger browser's notification permission prompt
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          scheduleBookReminders();
          sendWelcomeNotification();
          setShowPrompt(false);
        }
      });
    }
  }, []);

  const handleEnable = async () => {
    // This will trigger the browser's native permission prompt
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      scheduleBookReminders();
      sendWelcomeNotification();
      setShowPrompt(false);
    } else {
      alert('Please enable notifications in your browser settings to receive updates.');
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 z-50">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 max-w-sm mx-auto md:mx-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Bell className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Enable Notifications</h3>
          </div>
          <button 
            onClick={() => setShowPrompt(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Get notified about your book generation progress and daily writing reminders.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPrompt(false)}
            className="flex-1 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Not now
          </button>
          <button
            onClick={handleEnable}
            className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Enable
          </button>
        </div>
      </div>
    </div>
  );
}; 