import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Moon, Shield, LogOut, Sun } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useTheme } from '../hooks/useTheme';
import ProfileEditModal from './ProfileEditModal';

export default function SettingsView() {
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium">Einstellungen</h2>
        <p className="text-gray-600 dark:text-gray-400">Verwalte dein Konto und Präferenzen</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="card bg-white/80 dark:bg-gray-800/80">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-medium">{auth.currentUser?.displayName || auth.currentUser?.email}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kostenloser Account</p>
            </div>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => setShowProfileEdit(true)}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center space-x-3"
            >
              <User className="w-5 h-5" />
              <span>Profil bearbeiten</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center space-x-3">
              <Bell className="w-5 h-5" />
              <span>Benachrichtigungen</span>
            </button>
            <button 
              onClick={toggleTheme}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5" />
                <span>Erscheinungsbild</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {theme === 'light' ? 'Hell' : 'Dunkel'}
                </span>
                {theme === 'light' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center space-x-3">
              <Shield className="w-5 h-5" />
              <span>Datenschutz</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Abmelden</span>
        </button>
      </motion.div>

      {showProfileEdit && (
        <ProfileEditModal onClose={() => setShowProfileEdit(false)} />
      )}
    </div>
  );
}