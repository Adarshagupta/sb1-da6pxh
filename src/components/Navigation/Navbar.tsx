import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, BookOpen, Library, PenTool, Settings2, Book } from 'lucide-react';
import { auth, getUserTokens } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { user } = useAuth();
  const [tokens, setTokens] = useState<number>(0);
  const location = useLocation();

  useEffect(() => {
    const loadTokens = async () => {
      if (user) {
        const userTokens = await getUserTokens(user.uid);
        setTokens(userTokens);
      }
    };
    loadTokens();
  }, [user]);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800">
              <BookOpen className="w-6 h-6" />
              <span className="font-bold text-xl">AI Book Generator</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="token-display flex items-center gap-1.5">
              <span>{tokens.toLocaleString()}</span>
              <span className="text-sm opacity-75">tokens</span>
            </div>

            <Link 
              to="/" 
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                location.pathname === '/' ? 'bg-gray-100 text-indigo-600' : 'text-gray-600'
              }`}
              title="Generate Book"
            >
              <PenTool className="w-6 h-6" />
            </Link>

            <Link 
              to="/library" 
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                location.pathname === '/library' ? 'bg-gray-100 text-indigo-600' : 'text-gray-600'
              }`}
              title="Library"
            >
              <Library className="w-6 h-6" />
            </Link>

            <Link 
              to="/profile" 
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                location.pathname === '/profile' ? 'bg-gray-100 text-indigo-600' : 'text-gray-600'
              }`}
              title="Profile"
            >
              <User className="w-6 h-6" />
            </Link>

            <Link 
              to="/settings" 
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                location.pathname === '/settings' ? 'bg-gray-100 text-indigo-600' : 'text-gray-600'
              }`}
              title="Settings"
            >
              <Settings2 className="w-6 h-6" />
            </Link>

            <Link 
              to="/tools" 
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                location.pathname === '/tools' ? 'bg-gray-100 text-indigo-600' : 'text-gray-600'
              }`}
              title="Story Tools"
            >
              <Book className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};