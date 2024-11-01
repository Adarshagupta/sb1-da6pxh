import React from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileSettings } from './ProfileSettings';

export function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <ProfileHeader />
        <ProfileSettings />
      </div>
    </div>
  );
}