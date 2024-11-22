import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { JournalEntry } from '../hooks/useJournalEntries';
import JournalEntryModal from './JournalEntryModal';

interface CalendarViewProps {
  entries: JournalEntry[];
  onCreateEntry: () => void;
}

export default function CalendarView({ entries, onCreateEntry }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEntriesForDay = (day: Date) => {
    return entries.filter(entry => isSameDay(new Date(entry.date), day));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Kalender</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium">
            {format(currentDate, 'MMMM yyyy', { locale: de })}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onCreateEntry}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Neuer Eintrag</span>
        </button>
      </div>

      <div className="card bg-white/80">
        <div className="grid grid-cols-7 gap-px mb-2">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
            <div key={day} className="text-center text-sm font-medium py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const dayEntries = getEntriesForDay(day);
            const hasEntries = dayEntries.length > 0;
            
            return (
              <button
                key={day.toString()}
                onClick={() => hasEntries && setSelectedEntry(dayEntries[0])}
                className={`
                  aspect-square rounded-xl p-2 relative group transition-all
                  ${hasEntries ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
                  ${isToday(day) 
                    ? 'bg-gradient-to-br from-[#6B5B95]/90 to-[#9B8BB4]/90 text-white shadow-sm' 
                    : hasEntries 
                      ? 'bg-[#FFDAB9]/50' 
                      : 'bg-white/50'
                  }
                `}
              >
                <span className="text-sm">{format(day, 'd')}</span>
                {hasEntries && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {dayEntries.map((entry, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          entry.timeOfDay === 'morning' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedEntry && (
        <JournalEntryModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
}