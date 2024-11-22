import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles } from 'lucide-react';

interface MicroExerciseProps {
  exercise: {
    title: string;
    description: string;
    steps: string[];
  };
  onRefresh: () => void;
  loading: boolean;
}

export default function MicroExercise({ exercise, onRefresh, loading }: MicroExerciseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card micro-exercise-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-medium">Dankbarkeitsmoment</h3>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Eine einfache Übung für mehr Dankbarkeit im Alltag
      </p>

      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">1</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">Atme tief durch und komme im Moment an</p>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">2</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">Denke an etwas, das dich heute zum Lächeln gebracht hat</p>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">3</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">Spüre die Dankbarkeit dafür in deinem Körper</p>
        </div>
      </div>
    </motion.div>
  );
}