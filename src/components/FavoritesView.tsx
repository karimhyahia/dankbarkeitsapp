import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { JournalEntry } from '../hooks/useJournalEntries';
import JournalEntryCard from './JournalEntry';

interface FavoritesViewProps {
  entries: JournalEntry[];
}

export default function FavoritesView({ entries }: FavoritesViewProps) {
  const favoriteEntries = entries.filter(entry => entry.mood >= 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Beste Momente</h2>
          <p className="text-gray-600">Deine schönsten Erinnerungen</p>
        </div>
      </div>

      {favoriteEntries.length === 0 ? (
        <div className="card bg-white/80 text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="bg-pink-50 rounded-full p-4">
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
          </div>
          <h3 className="text-xl font-medium mb-2">Noch keine Favoriten</h3>
          <p className="text-gray-600">
            Einträge mit einer Stimmung von 4 oder 5 erscheinen hier automatisch.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {favoriteEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <JournalEntryCard entry={entry} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}