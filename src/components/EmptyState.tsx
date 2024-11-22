import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateEntry: () => void;
}

export default function EmptyState({ onCreateEntry }: EmptyStateProps) {
  return (
    <div className="rounded-2xl bg-white/50 backdrop-blur-sm p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-black/5 rounded-full p-4">
          <BookOpen className="w-8 h-8 text-gray-600" />
        </div>
      </div>
      <h3 className="text-xl font-medium mb-2">Starte dein Dankbarkeits-Journal</h3>
      <p className="text-gray-600 mb-6">
        Beginne deinen Tag mit Dankbarkeit und reflektiere über die schönen Momente.
      </p>
      <button
        onClick={onCreateEntry}
        className="btn-primary inline-flex items-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Ersten Eintrag erstellen</span>
      </button>
    </div>
  );
}