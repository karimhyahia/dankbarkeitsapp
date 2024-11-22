import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { X, Sun, Moon, Tag, Heart } from 'lucide-react';
import { JournalEntry } from '../hooks/useJournalEntries';

interface JournalEntryModalProps {
  entry: JournalEntry;
  onClose: () => void;
}

export default function JournalEntryModal({ entry, onClose }: JournalEntryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg w-full max-w-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            {entry.timeOfDay === 'morning' ? (
              <Sun className="w-5 h-5 text-amber-600" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
            <span className="text-lg font-medium">
              {format(entry.date, "EEEE, d. MMMM yyyy", { locale: de })}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            {entry.gratitudes.map((gratitude, index) => (
              <p key={index} className="text-lg">{gratitude}</p>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {entry.tags.map((tag, index) => (
                <span key={index} className="pill-tag">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-2 bg-white/80 px-3 py-1.5 rounded-full">
              <Heart className={`w-4 h-4 ${entry.mood > 3 ? 'text-pink-500' : 'text-gray-400'}`} />
              <span className="text-sm">{entry.mood}/5</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}