import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  selectedDisorder: string | null;
  setSelectedDisorder: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSymptoms: string[];
  setSelectedSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
  selectedApproach: string | null;
  setSelectedApproach: React.Dispatch<React.SetStateAction<string | null>>;
  selectedGoals: string[];
  setSelectedGoals: React.Dispatch<React.SetStateAction<string[]>>;
  selectedObjectives: string[];
  setSelectedObjectives: React.Dispatch<React.SetStateAction<string[]>>;
  allObjectives: string[];
  setAllObjectives: React.Dispatch<React.SetStateAction<string[]>>;
  showSummary: boolean;
  setShowSummary: React.Dispatch<React.SetStateAction<boolean>>;
  showSheets: boolean;
  setShowSheets: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedDisorder, setSelectedDisorder] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedApproach, setSelectedApproach] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [allObjectives, setAllObjectives] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [showSheets, setShowSheets] = useState<boolean>(false);

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
        showSummary,
        setShowSummary,
        showSheets,
        setShowSheets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
