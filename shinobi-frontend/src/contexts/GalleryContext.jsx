import React, { createContext, useContext, useState, useEffect } from 'react';
import { galleryImages } from '../assets/gallery-assets/gallery-assets.js';

const GalleryContext = createContext();

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

export const GalleryProvider = ({ children }) => {
  const [galleryData, setGalleryData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load gallery data on mount
  useEffect(() => {
    const loadGalleryData = () => {
      try {
        // Try to load from localStorage first
        const savedGallery = localStorage.getItem('shinobi-gallery-data');
        
        if (savedGallery) {
          const parsedData = JSON.parse(savedGallery);
          setGalleryData(parsedData);
        } else {
          // Fallback to original gallery data
          setGalleryData([...galleryImages]);
        }
      } catch (error) {
        console.error('Error loading gallery data:', error);
        // Fallback to original gallery data
        setGalleryData([...galleryImages]);
      }
      setIsLoaded(true);
    };

    loadGalleryData();
  }, []);

  // Save gallery data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && galleryData.length > 0) {
      try {
        localStorage.setItem('shinobi-gallery-data', JSON.stringify(galleryData));
      } catch (error) {
        console.error('Error saving gallery data:', error);
      }
    }
  }, [galleryData, isLoaded]);

  // Update gallery data (used by GalleryManager)
  const updateGalleryData = (newData) => {
    setGalleryData(newData);
  };

  // Reset to original gallery data
  const resetToOriginal = () => {
    setGalleryData([...galleryImages]);
    localStorage.removeItem('shinobi-gallery-data');
  };

  // Clear gallery data (for empty state)
  const clearGallery = () => {
    setGalleryData([]);
    localStorage.removeItem('shinobi-gallery-data');
  };

  const value = {
    galleryData,
    updateGalleryData,
    resetToOriginal,
    clearGallery,
    isLoaded
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};
