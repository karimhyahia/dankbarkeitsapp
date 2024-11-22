import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

interface AICoachResponse {
  reflectionPrompt?: string;
  analysis?: {
    mood: string;
    themes: string[];
    suggestions: string[];
  };
  exercise?: {
    title: string;
    description: string;
    steps: string[];
  };
}

const DEFAULT_PROMPTS = {
  morning: [
    'Wofür bist du heute besonders dankbar?',
    'Was möchtest du heute bewusst wertschätzen?',
    'Welcher kleine Moment hat deinen Morgen bereits bereichert?'
  ],
  evening: [
    'Was hat deinen Tag heute bereichert?',
    'Welche schönen Begegnungen hattest du heute?',
    'Wofür kannst du am Ende dieses Tages dankbar sein?'
  ]
};

export async function analyzeEntry(entry: string): Promise<AICoachResponse['analysis']> {
  if (!entry?.trim()) {
    return {
      mood: 'neutral',
      themes: [],
      suggestions: []
    };
  }

  const prompt = `
    Analysiere den folgenden Dankbarkeits-Journal-Eintrag und erstelle eine Zusammenfassung im JSON-Format:
    
    {
      "mood": "Eine der folgenden Optionen: positiv, neutral, nachdenklich",
      "themes": ["Thema 1", "Thema 2", "Thema 3"],
      "suggestions": ["Vorschlag 1", "Vorschlag 2"]
    }

    Eintrag: "${entry}"

    Wichtig:
    - Mood muss einer der drei Werte sein
    - Maximal 3 Themes
    - Maximal 2 Suggestions
    - Alles auf Deutsch
    - Strikt JSON-Format
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return getDefaultAnalysis();
    }
    
    if (!parsed || typeof parsed !== 'object') {
      return getDefaultAnalysis();
    }

    const allowedMoods = ['positiv', 'neutral', 'nachdenklich'];
    const mood = parsed.mood && allowedMoods.includes(parsed.mood) ? parsed.mood : 'neutral';
    
    return {
      mood,
      themes: Array.isArray(parsed.themes) ? parsed.themes.slice(0, 3) : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 2) : []
    };
  } catch (error) {
    console.error('Error analyzing entry:', error);
    return getDefaultAnalysis();
  }
}

function getDefaultAnalysis(): AICoachResponse['analysis'] {
  return {
    mood: 'neutral',
    themes: [],
    suggestions: []
  };
}

export async function generateReflectionPrompt(
  timeOfDay: 'morning' | 'evening'
): Promise<string> {
  const defaultPrompts = DEFAULT_PROMPTS[timeOfDay];
  const randomDefault = defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)];

  const prompt = `
    Generiere eine kurze, persönliche Reflexionsfrage für ein Dankbarkeits-Journal.
    Tageszeit: ${timeOfDay === 'morning' ? 'Morgen' : 'Abend'}
    
    Die Frage sollte:
    - Maximal 2 Sätze lang sein
    - Zum Nachdenken anregen
    - Positiv formuliert sein
    - Auf Deutsch sein
    - Keine JSON-Struktur, nur die Frage als Text
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Validate the response
    if (!text || text.length < 10 || text.includes('{') || text.includes('}')) {
      return randomDefault;
    }

    return text;
  } catch (error) {
    console.error('Error generating reflection prompt:', error);
    return randomDefault;
  }
}

const DEFAULT_EXERCISES = [
  {
    title: 'Dankbarkeitsmoment',
    description: 'Eine kurze Übung für mehr Achtsamkeit im Alltag',
    steps: [
      'Atme dreimal tief durch und komme im Moment an',
      'Schaue dich um und finde drei Dinge, für die du dankbar bist',
      'Lächle bewusst und spüre die positive Energie'
    ]
  },
  {
    title: 'Kleine Freuden',
    description: 'Entdecke die schönen Momente des Tages',
    steps: [
      'Schließe die Augen und denke an den bisherigen Tag zurück',
      'Erinnere dich an einen Moment, der dich zum Lächeln gebracht hat',
      'Nimm dir vor, heute noch einen weiteren solchen Moment zu schaffen'
    ]
  }
];

export async function generateMicroExercise(): Promise<AICoachResponse['exercise']> {
  const defaultExercise = DEFAULT_EXERCISES[Math.floor(Math.random() * DEFAULT_EXERCISES.length)];

  const prompt = `
    Generiere eine kurze Dankbarkeitsübung im JSON-Format:
    
    {
      "title": "Titel der Übung",
      "description": "Kurze Beschreibung",
      "steps": ["Schritt 1", "Schritt 2", "Schritt 3"]
    }

    Wichtig:
    - Übung sollte in 5 Minuten durchführbar sein
    - Maximal 3 Schritte
    - Alles auf Deutsch
    - Fokus auf Dankbarkeit und Achtsamkeit
    - Strikt JSON-Format
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse AI exercise response:', e);
      return defaultExercise;
    }
    
    if (!parsed || typeof parsed !== 'object') {
      return defaultExercise;
    }

    return {
      title: parsed.title || defaultExercise.title,
      description: parsed.description || defaultExercise.description,
      steps: Array.isArray(parsed.steps) ? parsed.steps.slice(0, 3) : defaultExercise.steps
    };
  } catch (error) {
    console.error('Error generating micro exercise:', error);
    return defaultExercise;
  }
}