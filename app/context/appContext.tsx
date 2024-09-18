import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  selectedDisorder: string | null;
  setSelectedDisorder: (value: string | null) => void;
  selectedSymptoms: string[];
  setSelectedSymptoms: (value: string[]) => void;
  selectedApproach: string | null;
  setSelectedApproach: (value: string | null) => void;
  selectedGoals: string[];
  setSelectedGoals: (value: string[]) => void;
  selectedObjectives: string[];
  setSelectedObjectives: (value: string[]) => void;
  allObjectives: string[];
  setAllObjectives: (value: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDisorder, setSelectedDisorder] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedApproach, setSelectedApproach] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [allObjectives, setAllObjectives] = useState<string[]>([]);

  return (
    <AppContext.Provider
      value={{
        selectedDisorder,
        setSelectedDisorder,
        selectedSymptoms,
        setSelectedSymptoms,
        selectedApproach,
        setSelectedApproach,
        selectedGoals,
        setSelectedGoals,
        selectedObjectives,
        setSelectedObjectives,
        allObjectives,
        setAllObjectives,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
