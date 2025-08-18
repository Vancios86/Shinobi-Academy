import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [classesData, setClassesData] = useState(defaultClasses);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load classes data on mount
  useEffect(() => {
    const loadClassesData = () => {
      try {
        // Try to load from localStorage first
        const savedClasses = localStorage.getItem('shinobi-classes-data');
        
        if (savedClasses) {
          const parsedData = JSON.parse(savedClasses);
          // Ensure all required fields exist
          const validatedData = parsedData.map(classItem => ({
            id: classItem.id || `class-${Date.now()}-${Math.random()}`,
            name: classItem.name || 'New Class',
            description: classItem.description || 'Class description',
            image: classItem.image || 'default.webp',
            imageType: classItem.imageType || 'predefined',
            imagePosition: classItem.imagePosition || 'center',
            alignment: classItem.alignment || 'left',
            speed: classItem.speed || 10,
            order: classItem.order || parsedData.length + 1
          }));
          setClassesData(validatedData);
        } else {
          // Use default classes data
          setClassesData(defaultClasses);
        }
      } catch (error) {
        console.error('Error loading classes data:', error);
        // Fallback to default classes data
        setClassesData(defaultClasses);
      }
      setIsLoaded(true);
    };

    loadClassesData();
  }, []);

  // Save classes data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('shinobi-classes-data', JSON.stringify(classesData));
      } catch (error) {
        console.error('Error saving classes data:', error);
      }
    }
  }, [classesData, isLoaded]);

  // Add new class
  const addClass = (newClass) => {
    const classWithId = {
      ...newClass,
      id: newClass.id || `class-${Date.now()}-${Math.random()}`,
      order: newClass.order || classesData.length + 1
    };
    setClassesData(prev => [...prev, classWithId]);
  };

  // Update existing class
  const updateClass = (id, updatedData) => {
    setClassesData(prev => 
      prev.map(classItem => 
        classItem.id === id ? { ...classItem, ...updatedData } : classItem
      )
    );
  };

  // Delete class
  const deleteClass = (id) => {
    setClassesData(prev => prev.filter(classItem => classItem.id !== id));
  };

  // Reorder classes
  const reorderClasses = (newOrder) => {
    const reorderedClasses = newOrder.map((id, index) => {
      const classItem = classesData.find(c => c.id === id);
      return classItem ? { ...classItem, order: index + 1 } : null;
    }).filter(Boolean);
    
    setClassesData(reorderedClasses);
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

  // Get available image options
  const getAvailableImages = () => {
    return [
      'mma.webp',
      'bjj.webp', 
      'wj.webp',
      'sc.webp',
      'private.webp'
    ];
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
    getAvailableImages,
    isLoaded
  };

  return (
    <ClassesContext.Provider value={value}>
      {children}
    </ClassesContext.Provider>
  );
};
