import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { galleryAPI } from '../services/api';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load gallery data from API
  const loadGalleryData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await galleryAPI.getGalleryImages();
      setGalleryData(data);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading gallery data:', error);
      setError(error.message);
      setGalleryData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load admin gallery data (including inactive images)
  const loadAdminGalleryData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await galleryAPI.getAdminGalleryImages();
      setGalleryData(data);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading admin gallery data:', error);
      setError(error.message);
      setGalleryData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load gallery data on mount
  useEffect(() => {
    loadGalleryData();
  }, [loadGalleryData]);

  // Create new gallery image
  const createImage = async (imageData) => {
    try {
      const newImage = await galleryAPI.createImage(imageData);
      setGalleryData(prev => [...prev, newImage]);
      return newImage;
    } catch (error) {
      console.error('Error creating image:', error);
      throw error;
    }
  };

  // Update gallery image
  const updateImage = async (imageId, imageData) => {
    try {
      const updatedImage = await galleryAPI.updateImage(imageId, imageData);
      setGalleryData(prev => 
        prev.map(img => img.id === imageId ? updatedImage : img)
      );
      return updatedImage;
    } catch (error) {
      console.error('Error updating image:', error);
      throw error;
    }
  };

  // Delete gallery image
  const deleteImage = async (imageId) => {
    try {
      await galleryAPI.deleteImage(imageId);
      setGalleryData(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  // Reorder gallery images
  const reorderImages = async (imageIds) => {
    try {
      const response = await galleryAPI.reorderImages(imageIds);
      // The API returns { success: true, data: [...], message: "..." }
      // We need to extract the data array
      const updatedImages = response.data || response;
      setGalleryData(updatedImages);
      return updatedImages;
    } catch (error) {
      console.error('Error reordering images:', error);
      throw error;
    }
  };

  // Get available categories
  const getCategories = async () => {
    try {
      return await galleryAPI.getCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  const value = {
    galleryData,
    isLoaded,
    isLoading,
    error,
    loadGalleryData,
    loadAdminGalleryData,
    createImage,
    updateImage,
    deleteImage,
    reorderImages,
    getCategories
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};
