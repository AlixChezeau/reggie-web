'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeChoice = 'system' | 'dark' | 'light';

interface ThemeContextType {
  choice: ThemeChoice;
  setChoice: (choice: ThemeChoice) => void;
}

const ThemeContext = createContext<ThemeContextType>({ choice: 'system', setChoice: () => {} });

const STORAGE_KEY = 'reggie-theme';

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Script lu avant l'affichage de la page : applique le bon thème sans flash.
 * Par défaut, le site suit le réglage du téléphone, comme l'app.
 */
export const themeInitScript = `(function(){try{var c=localStorage.getItem('${STORAGE_KEY}');var l=c==='light'||(c!=='dark'&&window.matchMedia('(prefers-color-scheme: light)').matches);document.documentElement.classList.toggle('light',l);}catch(e){}})();`;

function applyTheme(choice: ThemeChoice) {
  const light = choice === 'light' || (choice === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);
  document.documentElement.classList.toggle('light', light);
}

function readChoice(): ThemeChoice {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Stockage bloqué (navigation privée) : on suit le système
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>('system');

  useEffect(() => {
    // Synchronise l'état React avec le choix enregistré (lu après l'affichage pour éviter un écart d'hydratation)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoiceState(readChoice());
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      if (readChoice() === 'system') applyTheme('system');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const setChoice = useCallback((next: ThemeChoice) => {
    setChoiceState(next);
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sans stockage, le choix vaut pour cette visite seulement
    }
    applyTheme(next);
  }, []);

  return <ThemeContext.Provider value={{ choice, setChoice }}>{children}</ThemeContext.Provider>;
}
