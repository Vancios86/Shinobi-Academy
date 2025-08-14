import React, { createContext, useContext, useState, useEffect } from 'react';
import originalCoachesData from '../Components/AboutPage/coaches-data.json';

const CoachesContext = createContext();

export const useCoaches = () => {
  const context = useContext(CoachesContext);
  if (!context) {
    throw new Error('useCoaches must be used within a CoachesProvider');
  }
  return context;
};

export const CoachesProvider = ({ children }) => {
  const [coachesData, setCoachesData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load coaches data on mount
  useEffect(() => {
    const loadCoachesData = () => {
      try {
        // Try to load from localStorage first
        const savedCoaches = localStorage.getItem('shinobi-coaches-data');
        
        if (savedCoaches) {
          const parsedData = JSON.parse(savedCoaches);
          // Migrate existing data to include new fields if they don't exist
          const migratedData = parsedData.map(coach => ({
            ...coach,
            description: coach.description || '',
            specialty: coach.specialty || ''
          }));
          setCoachesData(migratedData);
        } else {
          // Fallback to original coaches data
          setCoachesData([...originalCoachesData.teamMembers]);
        }
      } catch (error) {
        console.error('Error loading coaches data:', error);
        // Fallback to original coaches data
        setCoachesData([...originalCoachesData.teamMembers]);
      }
      setIsLoaded(true);
    };

    loadCoachesData();
  }, []);

  // Save coaches data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && coachesData.length > 0) {
      try {
        localStorage.setItem('shinobi-coaches-data', JSON.stringify(coachesData));
      } catch (error) {
        console.error('Error saving coaches data:', error);
      }
    }
  }, [coachesData, isLoaded]);

  // Update coaches data (used by CoachesManager)
  const updateCoachesData = (newData) => {
    setCoachesData(newData);
  };

  // Delete a specific coach by ID
  const deleteCoach = (coachId) => {
    try {
      const updatedCoaches = coachesData.filter(coach => coach.id !== coachId);
      setCoachesData(updatedCoaches);
      return { success: true, message: 'Coach deleted successfully' };
    } catch (error) {
      console.error('Error deleting coach:', error);
      return { success: false, message: 'Failed to delete coach' };
    }
  };

  // Check if a coach can be safely deleted
  const canDeleteCoach = (coachId) => {
    const coach = coachesData.find(c => c.id === coachId);
    if (!coach) {
      return { canDelete: false, reason: 'Coach not found' };
    }
    
    // Add any business logic here for when coaches cannot be deleted
    // For example, if they have active classes, etc.
    
    return { canDelete: true, reason: null };
  };

  // Reset to original coaches data
  const resetToOriginal = () => {
    setCoachesData([...originalCoachesData.teamMembers]);
    localStorage.removeItem('shinobi-coaches-data');
  };

  // Clear coaches data (for empty state)
  const clearCoaches = () => {
    setCoachesData([]);
    localStorage.removeItem('shinobi-coaches-data');
  };

  const value = {
    coachesData,
    updateCoachesData,
    deleteCoach,
    canDeleteCoach,
    resetToOriginal,
    clearCoaches,
    isLoaded
  };

  return (
    <CoachesContext.Provider value={value}>
      {children}
    </CoachesContext.Provider>
  );
};
