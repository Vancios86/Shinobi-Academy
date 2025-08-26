import React, { createContext, useContext, useState, useEffect } from 'react';
import { classesAPI } from '../services/api';

const ClassesContext = createContext();

export const useClasses = () => {
  const context = useContext(ClassesContext);
  if (!context) {
    throw new Error('useClasses must be used within a ClassesProvider');
  }
  return context;
};

// Default classes data structure
const defaultClasses = [
  {
    id: 'mma-box-muay-thai',
    name: 'MMA Box Muay-Thai',
    description: 'We will help you develop a strong and fluid striking foundation based on techniques from the most efficient disciplines in the world',
    image: 'mma.webp',
    imageType: 'predefined',
    imagePosition: '18%',
    alignment: 'right',
    speed: 9,
    order: 1
  },
  {
    id: 'brazilian-jiu-jitsu',
    name: 'Brazilian Jiu-Jitsu',
    description: 'Self-defense practice emphasizing grappling fighting. A good workout that doesn\'t allow striking and teaches numerous life-changing lessons, including discipline, consistency, and combat methods',
    image: 'bjj.webp',
    imageType: 'predefined',
    imagePosition: '66%',
    alignment: 'left',
    speed: 11,
    order: 2
  },
  {
    id: 'wrestling-judo',
    name: 'Wrestling Judo',
    description: 'Combat sports involving grappling-type techniques such as clinch fighting, throws and takedowns, joint locks, pins and other grappling holds which have been incorporated into martial arts, combat sports and military systems',
    image: 'wj.webp',
    imageType: 'predefined',
    imagePosition: '11%',
    alignment: 'right',
    speed: 13,
    order: 3
  },
  {
    id: 'strength-condition',
    name: 'Strength Condition',
    description: 'The practical application of sports science to enhance movement quality, grounded in evidence-based research and physiology of exercise and anatomy',
    image: 'sc.webp',
    imageType: 'predefined',
    imagePosition: 'center',
    alignment: 'left',
    speed: 15,
    order: 4
  },
  {
    id: 'private-classes',
    name: 'Private classes',
    description: 'One-on-one training with a coach, tailored to your needs and at a time that suits you best - perfect for those who want to get the most out of their training',
    image: 'private.webp',
    imageType: 'predefined',
    imagePosition: '18%',
    alignment: 'right',
    speed: 17,
    order: 5
  }
];

export const ClassesProvider = ({ children }) => {
  const [classesData, setClassesData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load classes data from backend
  const loadClasses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const classes = await classesAPI.getClasses();
      setClassesData(classes);
    } catch (error) {
      console.error('Error loading classes:', error);
      setError(error.message);
      // Fallback to localStorage if backend fails
      const savedClasses = localStorage.getItem('shinobi-classes-data');
      if (savedClasses) {
        try {
          const parsedData = JSON.parse(savedClasses);
          setClassesData(parsedData);
        } catch (parseError) {
          console.error('Error parsing saved classes:', parseError);
          setClassesData(defaultClasses);
        }
      } else {
        setClassesData(defaultClasses);
      }
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  };

  // Load classes data on mount
  useEffect(() => {
    loadClasses();
  }, []);

  // Save classes data to localStorage whenever it changes (backup)
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
  const addClass = async (newClass) => {
    setIsLoading(true);
    setError(null);
    try {
      const createdClass = await classesAPI.createClass(newClass);
      setClassesData(prev => [...prev, createdClass]);
      return { success: true, data: createdClass };
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

  // Reset to default classes
  const resetToDefault = () => {
    setClassesData(defaultClasses);
    localStorage.removeItem('shinobi-classes-data');
  };



  const value = {
    classesData,
    addClass,
    updateClass,
    deleteClass,
    reorderClasses,
    getClassById,
    getAllClasses,
    resetToDefault,
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
