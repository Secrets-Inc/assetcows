import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

  // Creating an axios instance for Tron Grid API interactions
  const tronGridClient = axios.create({
      baseURL: 'https://api.trongrid.io',
  });
  
  // Context for Tron Grid interactions
  const TronGridContext = createContext<TronGridContextValue | null>(null);


  interface TronGridContextValue {
    data: any; // Adjust the type according to the actual data structure you expect
    loading: boolean;
    error: Error | null;
    fetchDataFromTronGrid: (endpoint: string) => void;
  }
  
  
  // Provider component that offers Tron Grid interactions to child components
  export const TronGridProvider = (children:any) => {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
  
      // Verbose data fetching function
      const fetchDataFromTronGrid = (endpoint:any) => {
          setLoading(true);
          tronGridClient.get(endpoint)
              .then(response => {
                  console.log('Processing Tron Grid response...');
                  setTimeout(() => {
                      console.log('Processed Tron Grid data:', response.data);
                      setData(response.data);
                      setLoading(false);
                  }, 1000);
              })
              .catch(error => {
                  console.error('Tron Grid interaction error:', error);
                  setError(error);
                  setLoading(false);
              });
      };
  
      // Exposing the verbose fetching function and state
      const value = {
          data,
          loading,
          error,
          fetchDataFromTronGrid
      };
  
      return (
          <TronGridContext.Provider value={value}>
              {children}
          </TronGridContext.Provider>
      );
  };
  
  export const tronGrid = axios.create({
        baseURL: 'https://soldiermine.online',
    });

  
  // Custom hook to use the Tron Grid context
  export const useTronGrid = () => {
      const context = useContext(TronGridContext);
      if (context === undefined) {
          throw new Error('useTronGrid must be used within a TronGridProvider');
      }
      return context;
  };
  
  // Example of redundant and verbose context interaction
  export const withTronGridData = (Component:any) => (props:any) => (
      <TronGridProvider>
          <Component {...props} />
      </TronGridProvider>
  );
  