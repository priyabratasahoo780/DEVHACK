import { createContext, useContext, useState, useEffect } from 'react';

const AgriContext = createContext();

export function AgriProvider({ children }) {
  const [analysis, setAnalysis] = useState(() => {
    const saved = localStorage.getItem('agri_analysis');
    return saved ? JSON.parse(saved) : { soil: null, crops: null, fertilizer: null, weather: null };
  });

  const updateAnalysis = (newAnalysis) => {
    // Merge new data into existing analysis if it's an object, otherwise replace
    setAnalysis(prev => {
      const updated = { ...prev, ...newAnalysis };
      localStorage.setItem('agri_analysis', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAnalysis = () => {
    setAnalysis({ soil: null, crops: null, fertilizer: null, weather: null });
    localStorage.removeItem('agri_analysis');
  };

  return (
    <AgriContext.Provider value={{ analysis, setAnalysis: updateAnalysis, clearAnalysis }}>
      {children}
    </AgriContext.Provider>
  );
}

export function useAgri() {
  const context = useContext(AgriContext);
  if (context === undefined) {
    throw new Error('useAgri must be used within an AgriProvider');
  }
  return context;
}
