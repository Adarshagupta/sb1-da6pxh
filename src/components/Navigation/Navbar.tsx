import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, BookOpen, Library } from 'lucide-react';
import { auth, getUserTokens } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { user } = useAuth();
  const [tokens, setTokens] = useState<number>(0);

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
              to="/library" 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Library"
            >
              <Library className="w-6 h-6 text-gray-600" />
            </Link>

            <Link 
              to="/profile" 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Profile"
            >
              <User className="w-6 h-6 text-gray-600" />
            </Link>

            <button
              onClick={() => auth.signOut()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};