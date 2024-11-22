import { useState } from 'react';
import { generateReflectionPrompt, analyzeEntry, generateMicroExercise } from '../lib/ai';

export function useAICoach() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getReflectionPrompt = async (
    timeOfDay: 'morning' | 'evening',
    previousEntries: string[] = []
  ) => {
    setLoading(true);
    setError(null);
    try {
      const prompt = await generateReflectionPrompt(timeOfDay, previousEntries);
      return prompt;
    } catch (err) {
      setError('Fehler beim Generieren der Reflexionsfrage');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEntryAnalysis = async (entry: string) => {
    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzeEntry(entry);
      return analysis;
    } catch (err) {
      setError('Fehler bei der Analyse des Eintrags');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMicroExercise = async () => {
    setLoading(true);
    setError(null);
    try {
      const exercise = await generateMicroExercise();
      return exercise;
    } catch (err) {
      setError('Fehler beim Generieren der Übung');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getReflectionPrompt,
    getEntryAnalysis,
    getMicroExercise,
    loading,
    error
  };
}