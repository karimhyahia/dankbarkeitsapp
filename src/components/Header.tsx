import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../lib/firebase';

interface HeaderProps {
  setCurrentView: (view: 'home' | 'calendar' | 'favorites' | 'settings') => void;
}

export default function Header({ setCurrentView }: HeaderProps) {
  const { user } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
              title="Abmelden"
            >
              <LogOut className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setCurrentView('settings')}
              className="flex items-center space-x-2 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>
      <div className="h-4" />
    </>
  );
}