import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { tronGrid } from "./TronGridContext";

// Adjust the context to hold both adapters and selectedIndex
const AdaptersContext = createContext<{adapters: any[], selectedIndex: number, setSelectedIndex: (index: number) => void}>({
  adapters: [],
  selectedIndex: 0,
  setSelectedIndex: () => {}
});

export const useAdapters = () => {
  const context = useContext(AdaptersContext);
  if (!context) {
    throw new Error('useAdapters must be used within an AdaptersProvider');
  }
  return context;
};

interface AdaptersProviderProps {
  adapters: any[];
  children: React.ReactNode;
}

export const AdaptersProvider: React.FC<AdaptersProviderProps> = ({ adapters, children }) => {
  const memoizedAdapters = useMemo(() => adapters, [adapters]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Example useEffect, assuming you want to fetch or observe changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await tronGrid.get(`/contract/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "_"}`);
        // Process your response or update state as needed here
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Dependency array empty means this runs once on mount

  // Provide both adapters and selectedIndex in context value
  const contextValue = useMemo(() => ({
    adapters: memoizedAdapters,
    selectedIndex,
    setSelectedIndex,
  }), [memoizedAdapters, selectedIndex]);

  return <AdaptersContext.Provider value={contextValue}>{children}</AdaptersContext.Provider>;
};
