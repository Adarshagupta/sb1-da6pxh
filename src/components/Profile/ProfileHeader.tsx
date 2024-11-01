import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { User, Settings, LogOut } from 'lucide-react';
import { Loader } from '../ui/Loader';

export function ProfileHeader() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg mb-6">
      <div className="flex items-center gap-4">
        {user?.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{user?.displayName || user?.email}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}