import React, { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Heart, Sun, Moon, Tag, ChevronRight, Edit2, X, Trash2 } from 'lucide-react';
import NewEntryForm from './NewEntryForm';
import { useJournalEntries } from '../hooks/useJournalEntries';

interface JournalEntryProps {
  entry: {
    id: string;
    date: Date;
    timeOfDay: 'morning' | 'evening';
    gratitudes: string[];
    mood: number;
    tags: string[];
    analysis?: {
      mood: string;
      themes: string[];
      suggestions: string[];
    };
  };
}

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function ConfirmDelete({ isOpen, onClose, onConfirm }: ConfirmDeleteProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <Trash2 className="w-6 h-6" />
          <h3 className="text-xl font-medium">Eintrag löschen</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Bist du sicher, dass du diesen Eintrag löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-2.5 font-medium transition-colors"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JournalEntry({ entry }: JournalEntryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteEntry } = useJournalEntries();

  const handleDelete = async () => {
    await deleteEntry(entry.id);
    setShowDeleteConfirm(false);
  };

  if (isEditing) {
    return (
      <div className={`card ${entry.timeOfDay === 'morning' ? 'morning-card' : 'evening-card'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Eintrag bearbeiten</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <NewEntryForm
          initialEntry={entry}
          onSubmit={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className={`card ${entry.timeOfDay === 'morning' ? 'morning-card' : 'evening-card'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {entry.timeOfDay === 'morning' ? (
            <Sun className="w-5 h-5 text-amber-600" />
          ) : (
            <Moon className="w-5 h-5 text-blue-600" />
          )}
          <span className="small-text font-medium">
            {format(entry.date, "EEEE, d. MMMM yyyy", { locale: de })}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white/80 px-3 py-1 rounded-full shadow-sm">
            <Heart className={`w-4 h-4 ${entry.mood > 3 ? 'text-pink-500' : 'text-gray-400'}`} />
            <span className="small-text">{entry.mood}/5</span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            title="Eintrag bearbeiten"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors text-red-500"
            title="Eintrag löschen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {entry.gratitudes.map((gratitude, index) => (
          <p key={index} className="body-text">
            {gratitude}
          </p>
        ))}
      </div>

      {entry.analysis && (
        <div className="mt-4 pt-4 border-t border-black/5">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>KI-Analyse: {entry.analysis.mood}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
        {entry.tags.map((tag, index) => (
          <div key={index} className="pill-tag whitespace-nowrap">
            <Tag className="w-3 h-3" />
            <span>{tag}</span>
          </div>
        ))}
      </div>

      <ConfirmDelete
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}