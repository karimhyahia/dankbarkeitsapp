import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export interface JournalEntry {
  id: string;
  date: Date;
  timeOfDay: 'morning' | 'evening';
  gratitudes: string[];
  mood: number;
  tags: string[];
  userId: string;
  analysis?: {
    mood: string;
    themes: string[];
    suggestions: string[];
  };
}

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'entries'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newEntries = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        }))
        .filter(entry => entry.userId === user.uid) as JournalEntry[];

      setEntries(newEntries);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addEntry = async (entry: Omit<JournalEntry, 'id' | 'userId'>) => {
    if (!user) return;

    const cleanAnalysis = entry.analysis ? {
      mood: entry.analysis.mood || '',
      themes: entry.analysis.themes || [],
      suggestions: entry.analysis.suggestions || []
    } : null;

    const cleanEntry = {
      date: Timestamp.fromDate(entry.date),
      timeOfDay: entry.timeOfDay,
      gratitudes: entry.gratitudes,
      mood: entry.mood,
      tags: entry.tags,
      userId: user.uid,
      ...(cleanAnalysis ? { analysis: cleanAnalysis } : {})
    };

    await addDoc(collection(db, 'entries'), cleanEntry);
  };

  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    if (!user) return;

    const cleanUpdates = {
      ...updates,
      ...(updates.date && { date: Timestamp.fromDate(updates.date) })
    };

    await updateDoc(doc(db, 'entries', id), cleanUpdates);
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'entries', id));
  };

  return { entries, loading, addEntry, updateEntry, deleteEntry };
}