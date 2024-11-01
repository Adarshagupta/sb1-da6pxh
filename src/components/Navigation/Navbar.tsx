import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Library, PenTool, Settings2, Book, Download } from 'lucide-react';
import { auth, getUserTokens } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const Navbar = () => {
  const { user } = useAuth();
  const [tokens, setTokens] = useState<number>(0);
  const location = useLocation();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  useEffect(() => {
    const loadTokens = async () => {
      if (user) {
        const userTokens = await getUserTokens(user.uid);
        setTokens(userTokens);
      }
    };
    loadTokens();
  }, [user]);

  const navigationItems = [
    { path: '/', icon: PenTool, label: 'Create' },
    { path: '/library', icon: Library, label: 'Library' },
    { path: '/tools', icon: Book, label: 'Tools' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings2, label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo.png" 
                  alt="BookAI Logo" 
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="token-display flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                <span className="font-medium">{tokens.toLocaleString()}</span>
                <span className="text-xs text-gray-500">tokens</span>
              </div>

              {navigationItems.map(({ path, icon: Icon, label }) => (
                <Link 
                  key={path}
                  to={path} 
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                    location.pathname === path ? 'bg-gray-100 text-indigo-600' : 'text-gray-600'
                  }`}
                  title={label}
                >
                  <Icon className="w-6 h-6" />
                </Link>
              ))}

              {isInstallable && (
                <button
                  onClick={handleInstallClick}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-indigo-600"
                  title="Install App"
                >
                  <Download className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {navigationItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                location.pathname === path ? 'text-indigo-600' : 'text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex flex-col items-center justify-center w-full h-full text-indigo-600"
            >
              <Download className="w-5 h-5" />
              <span className="text-xs mt-1">Install</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex justify-between items-center h-16 px-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="BookAI Logo" 
              className="h-8 w-auto"
            />
          </Link>
          <div className="token-display flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
            <span className="font-medium">{tokens.toLocaleString()}</span>
            <span className="text-gray-500">tokens</span>
          </div>
        </div>
      </div>

      {/* Add padding to main content for mobile */}
      <div className="md:hidden h-16"></div>
      <div className="md:hidden h-16 mb-16"></div>
    </>
  );
};