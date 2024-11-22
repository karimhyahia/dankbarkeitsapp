import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { useJournalEntries } from './hooks/useJournalEntries';
import { useAICoach } from './hooks/useAICoach';
import AuthScreen from './components/AuthScreen';
import Navigation from './components/Navigation';
import NewEntryForm from './components/NewEntryForm';
import EmptyState from './components/EmptyState';
import JournalEntry from './components/JournalEntry';
import CalendarView from './components/CalendarView';
import FavoritesView from './components/FavoritesView';
import SettingsView from './components/SettingsView';
import MicroExercise from './components/MicroExercise';
import Header from './components/Header';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { entries, loading: entriesLoading, addEntry } = useJournalEntries();
  const { getMicroExercise, loading: aiLoading } = useAICoach();
  const [currentView, setCurrentView] = useState<'home' | 'calendar' | 'favorites' | 'settings'>('home');
  const [isWriting, setIsWriting] = useState(false);
  const [exercise, setExercise] = useState<any>(null);

  useEffect(() => {
    if (user) {
      refreshExercise();
    }
  }, [user]);

  const refreshExercise = async () => {
    try {
      const newExercise = await getMicroExercise();
      setExercise(newExercise);
    } catch (error) {
      console.error('Error fetching exercise:', error);
    }
  };

  const handleCreateEntry = async (entry: any) => {
    await addEntry(entry);
    setIsWriting(false);
  };

  const renderView = () => {
    if (isWriting) {
      return (
        <div className="max-w-2xl mx-auto px-4 pb-24">
          <NewEntryForm
            onSubmit={handleCreateEntry}
            onCancel={() => setIsWriting(false)}
          />
        </div>
      );
    }

    switch (currentView) {
      case 'calendar':
        return (
          <div className="max-w-4xl mx-auto px-4 pb-24">
            <CalendarView entries={entries} onCreateEntry={() => setIsWriting(true)} />
          </div>
        );
      case 'favorites':
        return (
          <div className="max-w-4xl mx-auto px-4 pb-24">
            <FavoritesView entries={entries} />
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto px-4 pb-24">
            <SettingsView />
          </div>
        );
      default:
        return (
          <div className="max-w-2xl mx-auto px-4 pb-24 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-medium">Dein Journal</h1>
              <button
                onClick={() => setIsWriting(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Neuer Eintrag</span>
              </button>
            </div>

            <MicroExercise
              exercise={{
                title: "Dankbarkeitsmoment",
                description: "Eine einfache Übung für mehr Dankbarkeit im Alltag",
                steps: [
                  "Atme tief durch und komme im Moment an",
                  "Denke an etwas, das dich heute zum Lächeln gebracht hat",
                  "Spüre die Dankbarkeit dafür in deinem Körper"
                ]
              }}
              onRefresh={refreshExercise}
              loading={aiLoading}
            />

            {entries.length === 0 ? (
              <EmptyState onCreateEntry={() => setIsWriting(true)} />
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <JournalEntry key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  if (authLoading) {
    return <div className="min-h-screen grid place-items-center">Laden...</div>;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <AnimatePresence>
      <div className="min-h-screen pb-20">
        <Header setCurrentView={setCurrentView} />
        {renderView()}
        <Navigation
          currentView={currentView}
          setCurrentView={setCurrentView}
          isWriting={isWriting}
          setIsWriting={setIsWriting}
        />
      </div>
    </AnimatePresence>
  );
}