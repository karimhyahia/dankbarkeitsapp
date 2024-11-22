import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Plus, X, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { useAICoach } from '../hooks/useAICoach';
import { useJournalEntries } from '../hooks/useJournalEntries';

interface NewEntryFormProps {
  onSubmit: (entry: any) => void;
  onCancel: () => void;
  initialEntry?: any;
  isEditing?: boolean;
}

const MOODS = [
  { value: 1, emoji: '😔', label: 'Nicht so gut' },
  { value: 2, emoji: '😕', label: 'Geht so' },
  { value: 3, emoji: '😊', label: 'Gut' },
  { value: 4, emoji: '😃', label: 'Sehr gut' },
  { value: 5, emoji: '🥰', label: 'Fantastisch' },
];

export default function NewEntryForm({ onSubmit, onCancel, initialEntry, isEditing = false }: NewEntryFormProps) {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>(initialEntry?.timeOfDay || 'morning');
  const [gratitudes, setGratitudes] = useState(initialEntry?.gratitudes || ['']);
  const [mood, setMood] = useState(initialEntry?.mood || 3);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reflectionPrompt, setReflectionPrompt] = useState<string>('');
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  
  const { getEntryAnalysis, getReflectionPrompt } = useAICoach();
  const { updateEntry } = useJournalEntries();

  const handleRefreshPrompt = async () => {
    setLoadingPrompt(true);
    try {
      const prompt = await getReflectionPrompt(timeOfDay);
      setReflectionPrompt(prompt);
    } catch (error) {
      console.error('Error loading prompt:', error);
    } finally {
      setLoadingPrompt(false);
    }
  };

  const handleAddGratitude = () => {
    if (gratitudes.length < 5) {
      setGratitudes([...gratitudes, '']);
    }
  };

  const handleRemoveGratitude = (index: number) => {
    const newGratitudes = gratitudes.filter((_, i) => i !== index);
    setGratitudes(newGratitudes.length ? newGratitudes : ['']);
  };

  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitudes = [...gratitudes];
    newGratitudes[index] = value;
    setGratitudes(newGratitudes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const validGratitudes = gratitudes.filter(g => g.trim());
      
      if (validGratitudes.length === 0) {
        setError('Bitte gib mindestens eine Dankbarkeit ein');
        return;
      }

      const entryText = validGratitudes.join('\n');
      let analysisResult = null;

      try {
        analysisResult = await getEntryAnalysis(entryText);
      } catch (error) {
        console.error('Error analyzing entry:', error);
        // Continue without analysis if it fails
      }

      const entryData = {
        date: initialEntry?.date || new Date(),
        timeOfDay,
        gratitudes: validGratitudes,
        mood,
        tags: [], // Initialize empty tags array
        ...(analysisResult && { analysis: analysisResult })
      };
      
      if (isEditing && initialEntry?.id) {
        await updateEntry(initialEntry.id, entryData);
      }
      
      onSubmit(entryData);
    } catch (error) {
      console.error('Error saving entry:', error);
      setError('Fehler beim Speichern des Eintrags');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isEditing && (
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm">
            <button
              onClick={() => setTimeOfDay('morning')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                timeOfDay === 'morning' ? 'bg-black text-white' : 'hover:bg-black/5'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Morgen</span>
            </button>
            <button
              onClick={() => setTimeOfDay('evening')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                timeOfDay === 'evening' ? 'bg-black text-white' : 'hover:bg-black/5'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Abend</span>
            </button>
          </div>
        </div>
      )}

      {!isEditing && (
        <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
          <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <p className="text-gray-700 dark:text-gray-300 flex-1">
            {reflectionPrompt || 'Klicke auf den Button, um einen Prompt zu generieren'}
          </p>
          <button
            onClick={handleRefreshPrompt}
            className="p-2 hover:bg-black/5 rounded-full transition-colors flex-shrink-0"
            disabled={loadingPrompt}
          >
            <RefreshCw className={`w-4 h-4 ${loadingPrompt ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {gratitudes.map((gratitude, index) => (
            <div key={index} className="flex items-start space-x-2">
              <input
                type="text"
                value={gratitude}
                onChange={(e) => handleGratitudeChange(index, e.target.value)}
                placeholder={`Ich bin dankbar für...`}
                className="flex-1"
              />
              {gratitudes.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGratitude(index)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {gratitudes.length < 5 && (
            <button
              type="button"
              onClick={handleAddGratitude}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Weitere Dankbarkeit hinzufügen</span>
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-4">
            Wie fühlst du dich heute?
          </label>
          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`relative group ${
                  mood === m.value 
                    ? 'bg-white shadow-lg scale-110 z-10' 
                    : 'bg-white/50 hover:bg-white/80 hover:scale-105'
                } rounded-2xl p-4 transition-all duration-200`}
              >
                <span className="block text-3xl mb-2">{m.emoji}</span>
                <span className={`text-xs ${
                  mood === m.value ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } transition-opacity absolute bottom-2 left-0 right-0 text-center`}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
            disabled={loading}
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Speichern...
              </span>
            ) : (
              isEditing ? 'Aktualisieren' : 'Speichern'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}