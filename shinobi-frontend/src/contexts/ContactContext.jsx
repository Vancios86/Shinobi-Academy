import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { contactAPI } from '../services/api';

const ContactContext = createContext();

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};

// Default contact information


export const ContactProvider = ({ children }) => {
  const [contactData, setContactData] = useState(null);
  const [initialSessionData, setInitialSessionData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load contact data from API
  const loadContactData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await contactAPI.getContact();
      if (data) {
        setContactData(data);
        // Set initial session data on first load
        if (!initialSessionData) {
          setInitialSessionData(data);
        }
      } else {
        // If no data from API, set empty state
        setContactData(null);
        if (!initialSessionData) {
          setInitialSessionData(null);
        }
      }
    } catch (error) {
      console.error('Error loading contact data:', error);
      setError('Failed to load contact information');
      // Don't set any data on error, keep current state
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, [initialSessionData]);

  // Load contact data on mount
  useEffect(() => {
    loadContactData();
  }, [loadContactData]);

  // Update contact data
  const updateContactData = async (newData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedData = await contactAPI.updateContact(newData);
      if (updatedData) {
        setContactData(updatedData);
        return { success: true, data: updatedData };
      } else {
        throw new Error('Failed to update contact information');
      }
    } catch (error) {
      console.error('Error updating contact data:', error);
      setError('Failed to update contact information');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset contact data to initial session state
  const resetToDefault = async () => {
    try {
      console.log('Reset to default called with initialSessionData:', initialSessionData);
      
      if (initialSessionData) {
        // First, update the backend with the initial session data
        console.log('Calling backend API to reset contact data...');
        const updatedData = await contactAPI.updateContact(initialSessionData);
        console.log('Backend API response:', updatedData);
        
        if (updatedData) {
          // Then update the local state
          console.log('Updating local state with reset data');
          setContactData(updatedData);
          return { success: true, data: updatedData };
        } else {
          throw new Error('Failed to update contact information on backend');
        }
      } else {
        // No initial session data available
        console.log('No initial session data available for reset');
        setError('No initial session data available for reset');
        return { success: false, message: 'No initial session data available for reset' };
      }
    } catch (error) {
      console.error('Error resetting contact data:', error);
      setError('Failed to reset contact information');
      return { success: false, message: error.message };
    }
  };

  // Refresh contact data
  const refreshContactData = () => {
    loadContactData();
  };



  const value = {
    contactData,
    updateContactData,
    resetToDefault,
    refreshContactData,
    isLoaded,
    isLoading,
    error
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};
