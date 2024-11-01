import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { BookGenerator } from './components/BookGenerator';
import { ProfilePage } from './components/Profile/ProfilePage';
import { Navbar } from './components/Navigation/Navbar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';
import { Loader } from './components/ui/Loader';
import { AuthProvider } from './context/AuthContext';
import { LibraryPage } from './components/Library/LibraryPage';
import { SettingsPage } from './components/Settings/SettingsPage';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import { StoryTools } from './components/StoryTools/StoryTools';
import { InstallPWA } from './components/common/InstallPWA';


function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthForm />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <BookGenerator />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/library"
                element={
                  <PrivateRoute>
                    <LibraryPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tools"
                element={
                  <PrivateRoute>
                    <StoryTools />
                  </PrivateRoute>
                }
              />
            </Routes>
            <InstallPWA />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
    
  );


}

export default App;