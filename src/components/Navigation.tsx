import React from 'react';
import { Home, PenLine, Calendar, Heart, Settings } from 'lucide-react';

interface NavigationProps {
  currentView: 'home' | 'calendar' | 'favorites' | 'settings';
  setCurrentView: (view: 'home' | 'calendar' | 'favorites' | 'settings') => void;
  isWriting: boolean;
  setIsWriting: (value: boolean) => void;
}

export default function Navigation({ currentView, setCurrentView, isWriting, setIsWriting }: NavigationProps) {
  const handleViewChange = (view: 'home' | 'calendar' | 'favorites' | 'settings') => {
    setCurrentView(view);
    if (isWriting) {
      setIsWriting(false);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-lg rounded-t-[20px] px-6 py-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <button 
          onClick={() => handleViewChange('home')}
          className={`nav-icon group ${currentView === 'home' ? 'text-black' : 'text-gray-400'}`}
          aria-label="Home"
        >
          <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        <button 
          onClick={() => setIsWriting(true)}
          className={`nav-icon group ${isWriting ? 'text-blue-600' : 'text-gray-400'}`}
          aria-label="Neuer Eintrag"
        >
          <PenLine className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        <button 
          onClick={() => handleViewChange('calendar')}
          className={`nav-icon group ${currentView === 'calendar' ? 'text-black' : 'text-gray-400'}`}
          aria-label="Kalender"
        >
          <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        <button 
          onClick={() => handleViewChange('favorites')}
          className={`nav-icon group ${currentView === 'favorites' ? 'text-black' : 'text-gray-400'}`}
          aria-label="Favoriten"
        >
          <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        <button 
          onClick={() => handleViewChange('settings')}
          className={`nav-icon group ${currentView === 'settings' ? 'text-black' : 'text-gray-400'}`}
          aria-label="Einstellungen"
        >
          <Settings className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </nav>
  );
}