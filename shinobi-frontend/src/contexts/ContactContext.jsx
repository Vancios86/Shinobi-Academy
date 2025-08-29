import React, { createContext, useContext, useState, useEffect } from 'react';
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
const defaultContactData = {
  phone: "(+351) 977 777 777",
  email: "shinobiacademy@gmail.com",
  address: {
    street: "R.Convento da Trindade 15",
    city: "Lagos",
    postalCode: "8600-613",
    country: "Portugal",
    full: "R.Convento da Trindade 15, 8600-613 Lagos, Portugal"
  },
  socialMedia: {
    instagram: {
      url: "https://instagram.com/shinobiacademylagos",
      display: "shinobiacademylagos",
      platform: "Instagram"
    },
    facebook: {
      url: "https://www.facebook.com/profile.php?id=100028550547285",
      display: "Shinobi Academy Lagos",
      platform: "Facebook"
    },
    youtube: {
      url: "https://www.youtube.com/c/ShinobiVlog",
      display: "ShinobiVlog",
      platform: "YouTube"
    }
  },

};

export const ContactProvider = ({ children }) => {
  const [contactData, setContactData] = useState(defaultContactData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load contact data from API
  const loadContactData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await contactAPI.getContact();
      if (data) {
        setContactData(data);
      } else {
        // Fallback to default data if API returns nothing
        setContactData(defaultContactData);
      }
    } catch (error) {
      console.error('Error loading contact data:', error);
      setError('Failed to load contact information');
      // Fallback to default contact data
      setContactData(defaultContactData);
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  };

  // Load contact data on mount
  useEffect(() => {
    loadContactData();
  }, []);

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

  // Reset contact data to default
  const resetToDefault = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const resetData = await contactAPI.resetContact();
      if (resetData) {
        setContactData(resetData);
        return { success: true, data: resetData };
      } else {
        throw new Error('Failed to reset contact information');
      }
    } catch (error) {
      console.error('Error resetting contact data:', error);
      setError('Failed to reset contact information');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
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
