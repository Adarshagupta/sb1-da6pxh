import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!promptEvent) return;

    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    } finally {
      setShowPrompt(false);
    }
  };

  if (!supportsPWA || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 z-50">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 max-w-sm mx-auto md:mx-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="BookAI Logo" className="w-8 h-8" />
            <h3 className="font-semibold text-gray-800">Install BookAI</h3>
          </div>
          <button 
            onClick={() => setShowPrompt(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Install BookAI for a better experience with quick access and offline features.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPrompt(false)}
            className="flex-1 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Not now
          </button>
          <button
            onClick={handleInstallClick}
            className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}; 