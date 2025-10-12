import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { classesAPI } from '../services/api';

const ClassesContext = createContext();

export const useClasses = () => {
  const context = useContext(ClassesContext);
  if (!context) {
    throw new Error('useClasses must be used within a ClassesProvider');
  }
  return context;
};

export const ClassesProvider = ({ children }) => {
  const [classesData, setClassesData] = useState([]);
  const [initialSessionData, setInitialSessionData] = useState([]); // Store initial session state
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load classes data from backend
  const loadClasses = useCallback(async (forceUpdateInitial = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const classes = await classesAPI.getClasses();
      setClassesData(classes);
      // Store the initial session state (only on first load or when forced)
      if (initialSessionData.length === 0 || forceUpdateInitial) {
        setInitialSessionData(classes);
      }
      setIsLoaded(true); // Add this line to fix infinite loading
    } catch (error) {
      console.error('Error loading classes:', error);
      setError(error.message);
      // Fallback to localStorage if backend fails
      const savedClasses = localStorage.getItem('shinobi-classes-data');
      if (savedClasses) {
        try {
          const parsedData = JSON.parse(savedClasses);
          setClassesData(parsedData);
          if (initialSessionData.length === 0 || forceUpdateInitial) {
            setInitialSessionData(parsedData);
          }
          setIsLoaded(true); // Add this line for fallback case too
        } catch (parseError) {
          console.error('Error parsing saved classes:', parseError);
          setClassesData([]);
          setInitialSessionData([]);
          setIsLoaded(true); // Add this line for error case too
        }
      } else {
        setClassesData([]);
        setInitialSessionData([]);
        setIsLoaded(true); // Add this line for empty case too
      }
    } finally {
      setIsLoading(false);
    }
  }, [initialSessionData.length]);

  // Load classes data on mount
  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  // Save classes data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && classesData.length > 0) {
      try {
        localStorage.setItem('shinobi-classes-data', JSON.stringify(classesData));
      } catch (error) {
        console.error('Error saving classes data:', error);
      }
    }
  }, [classesData, isLoaded]);

  // Add new class
  const addClass = async (classData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newClass = await classesAPI.createClass(classData);
      setClassesData(prev => [...prev, newClass]);
      return { success: true, data: newClass };
    } catch (error) {
      console.error('Error adding class:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing class
  const updateClass = async (id, updatedData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedClass = await classesAPI.updateClass(id, updatedData);
      setClassesData(prev =>
        prev.map(classItem =>
          classItem.id === id ? updatedClass : classItem
        )
      );
      return { success: true, data: updatedClass };
    } catch (error) {
      console.error('Error updating class:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete class
  const deleteClass = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await classesAPI.deleteClass(id);
      setClassesData(prev => prev.filter(classItem => classItem.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting class:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Reorder classes
  const reorderClasses = async (newOrder) => {
    setIsLoading(true);
    setError(null);
    try {
      const reorderedClasses = await classesAPI.reorderClasses(newOrder);
      setClassesData(reorderedClasses);
      return { success: true, data: reorderedClasses };
    } catch (error) {
      console.error('Error reordering classes:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Get class by ID
  const getClassById = (id) => {
    return classesData.find(classItem => classItem.id === id);
  };

  // Get all classes (sorted by order)
  const getAllClasses = () => {
    return [...classesData].sort((a, b) => a.order - b.order);
  };

  // Reset to original session state
  const resetToOriginal = async () => {
    try {
      // First, update the database with the original session data
      // We need to update each class to match the original state
      const updatePromises = initialSessionData.map(async (originalClass) => {
        const currentClass = classesData.find(c => c.id === originalClass.id);
        if (currentClass && JSON.stringify(currentClass) !== JSON.stringify(originalClass)) {
          return await classesAPI.updateClass(originalClass.id, originalClass);
        }
        return originalClass;
      });

      // Wait for all updates to complete
      const updatedClasses = await Promise.all(updatePromises);

      // Update both the current data and the initial session data
      setClassesData([...updatedClasses]);
      setInitialSessionData([...updatedClasses]);

      // Update localStorage with the new state
      localStorage.setItem('shinobi-classes-data', JSON.stringify(updatedClasses));

      // Reload classes from the database to ensure consistency
      // Force update the initial session data to reflect the new "original" state
      await loadClasses(true);

      return { success: true, message: 'Classes reset to original state successfully' };
    } catch (error) {
      console.error('Error resetting classes:', error);
      setError(error.message);
      return { success: false, message: `Failed to reset classes: ${error.message}` };
    }
  };

  const value = {
    classesData,
    addClass,
    updateClass,
    deleteClass,
    reorderClasses,
    getClassById,
    getAllClasses,
    resetToOriginal,
    loadClasses,
    isLoaded,
    isLoading,
    error
  };

  return (
    <ClassesContext.Provider value={value}>
      {children}
    </ClassesContext.Provider>
  );
};
