import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import originalCoachesData from '../Components/AboutPage/coaches-data.json';
import { coachesAPI } from '../services/api';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load coaches data from backend (public)
  const loadCoaches = useCallback(async (useAdminAPI = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const coaches = useAdminAPI
        ? await coachesAPI.getAdminCoaches()
        : await coachesAPI.getCoaches();
      if (coaches) {
        setCoachesData(coaches);
      } else {
        // Fallback to localStorage if backend returns null
        const savedCoaches = localStorage.getItem('shinobi-coaches-data');
        if (savedCoaches) {
          try {
            const parsedData = JSON.parse(savedCoaches);
            const migratedData = parsedData.map(coach => ({
              ...coach,
              description: coach.description || '',
              specialty: coach.specialty || ''
            }));
            setCoachesData(migratedData);
          } catch (parseError) {
            console.error('Error parsing saved coaches:', parseError);
            setCoachesData([...originalCoachesData.teamMembers]);
          }
        } else {
          setCoachesData([...originalCoachesData.teamMembers]);
        }
      }
    } catch (error) {
      console.error('Error loading coaches:', error);
      setError(error.message);
      // Fallback to localStorage or default on API error
      const savedCoaches = localStorage.getItem('shinobi-coaches-data');
      if (savedCoaches) {
        try {
          const parsedData = JSON.parse(savedCoaches);
          const migratedData = parsedData.map(coach => ({
            ...coach,
            description: coach.description || '',
            specialty: coach.specialty || ''
          }));
          setCoachesData(migratedData);
        } catch (parseError) {
          console.error('Error parsing saved coaches:', parseError);
          setCoachesData([...originalCoachesData.teamMembers]);
        }
      } else {
        setCoachesData([...originalCoachesData.teamMembers]);
      }
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, []);

  // Load coaches data on mount
  useEffect(() => {
    loadCoaches();
  }, [loadCoaches]);

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

  // Add new coach (async)
  const addCoach = async (coachData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newCoach = await coachesAPI.createCoach(coachData);
      const updatedCoaches = [...coachesData, newCoach];
      setCoachesData(updatedCoaches);
      return { success: true, data: newCoach };
    } catch (error) {
      console.error('Error adding coach:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing coach (async)
  const updateCoach = async (coachId, coachData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCoach = await coachesAPI.updateCoach(coachId, coachData);
      const updatedCoaches = coachesData.map(coach =>
        coach.id === coachId ? updatedCoach : coach
      );
      setCoachesData(updatedCoaches);
      return { success: true, data: updatedCoach };
    } catch (error) {
      console.error('Error updating coach:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a specific coach by ID (async)
  const deleteCoach = async (coachId) => {
    setIsLoading(true);
    setError(null);
    try {
      await coachesAPI.deleteCoach(coachId);
      const updatedCoaches = coachesData.filter(coach => coach.id !== coachId);
      setCoachesData(updatedCoaches);
      return { success: true, message: 'Coach deleted successfully' };
    } catch (error) {
      console.error('Error deleting coach:', error);
      setError(error.message);
      return { success: false, message: 'Failed to delete coach' };
    } finally {
      setIsLoading(false);
    }
  };

  // Reorder coaches (async)
  const reorderCoaches = async (coachIds) => {
    setIsLoading(true);
    setError(null);
    try {
      const reorderedCoaches = await coachesAPI.reorderCoaches(coachIds);
      setCoachesData(reorderedCoaches);
      return { success: true, data: reorderedCoaches };
    } catch (error) {
      console.error('Error reordering coaches:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
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

  // Load admin coaches data (for admin panel)
  const loadAdminCoaches = useCallback(async () => {
    return loadCoaches(true);
  }, [loadCoaches]);

  const value = {
    coachesData,
    updateCoachesData,
    addCoach,
    updateCoach,
    deleteCoach,
    reorderCoaches,
    canDeleteCoach,
    resetToOriginal,
    clearCoaches,
    loadCoaches,
    loadAdminCoaches,
    isLoaded,
    isLoading,
    error
  };

  return (
    <CoachesContext.Provider value={value}>
      {children}
    </CoachesContext.Provider>
  );
};
