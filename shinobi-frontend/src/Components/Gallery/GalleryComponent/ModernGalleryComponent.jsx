import React, { useState, useEffect } from 'react';
import { useGallery } from '../../../contexts/GalleryContext';
import { AiOutlineFilter, AiOutlineClose, AiOutlineSearch, AiOutlineEye } from 'react-icons/ai';
import { BiCategory } from 'react-icons/bi';
import './ModernGalleryComponent.css';

const ModernGalleryComponent = () => {
  const { galleryData, isLoaded, loadGalleryData } = useGallery();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Load gallery data on component mount
  useEffect(() => {
    loadGalleryData();
  }, [loadGalleryData]);

  // Get unique categories from gallery data
  const categories = ['All', ...new Set(galleryData.map(img => img.category).filter(Boolean))];

  // Filter images based on category and search term
  useEffect(() => {
    let filtered = galleryData;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  }, [galleryData, selectedCategory, searchTerm]);

  // Handle image click to open modal
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Navigate to previous image
  const goToPrevious = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const previousIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setSelectedImage(filteredImages[previousIndex]);
  };

  // Navigate to next image
  const goToNext = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(filteredImages[nextIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedImage, filteredImages]);

  if (!isLoaded) {
    return (
      <div className="modern-gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="modern-gallery-component">
      {/* Header Section */}
      <div className="gallery-header">
        <div className="gallery-title">
          <h2>Media Gallery</h2>
          <p>Explore our collection of martial arts moments and training sessions</p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="gallery-controls">
          <div className="search-container">
            <AiOutlineSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <button
            className={`filter-toggle ${isFilterPanelOpen ? 'active' : ''}`}
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          >
            <AiOutlineFilter />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterPanelOpen && (
        <div className="filter-panel">
          <div className="filter-section">
            <h4><BiCategory /> Categories</h4>
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-actions">
            <button 
              className="clear-filters"
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="gallery-content">
        {filteredImages.length === 0 ? (
          <div className="no-images-found">
            <div className="no-images-icon">📸</div>
            <h3>No images found</h3>
            <p>
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filters'
                : 'No images in the gallery yet'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="gallery-stats">
              <span>{filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}</span>
              {selectedCategory !== 'All' && <span>in {selectedCategory}</span>}
              {searchTerm && <span>matching "{searchTerm}"</span>}
            </div>
            
            <div className="gallery-grid">
              {filteredImages.map((image) => (
                <div key={image.id} className="gallery-item">
                  <div className="image-container">
                    <img
                      src={image.src.startsWith('http') ? image.src : `http://localhost:5000${image.src}`}
                      alt={image.title || 'Gallery image'}
                      className="gallery-image"
                      onClick={() => handleImageClick(image)}
                      loading="lazy"
                    />
                    <div className="image-overlay">
                      <button 
                        className="view-image-btn"
                        onClick={() => handleImageClick(image)}
                      >
                        <AiOutlineEye />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="image-info">
                    {image.title && <h4 className="image-title">{image.title}</h4>}
                    {image.category && (
                      <span className="image-category">{image.category}</span>
                    )}
                    {image.description && (
                      <p className="image-description">{image.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <AiOutlineClose />
            </button>
            
            <div className="modal-image-container">
              <img
                src={selectedImage.src.startsWith('http') ? selectedImage.src : `http://localhost:5000${selectedImage.src}`}
                alt={selectedImage.title || 'Gallery image'}
                className="modal-image"
              />
            </div>
            
            <div className="modal-info">
              {selectedImage.title && <h3>{selectedImage.title}</h3>}
              {selectedImage.category && <span className="modal-category">{selectedImage.category}</span>}
              {selectedImage.description && <p>{selectedImage.description}</p>}
            </div>
            
            <div className="modal-navigation">
              <button className="nav-btn prev-btn" onClick={goToPrevious}>
                ← Previous
              </button>
              <span className="image-counter">
                {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} of {filteredImages.length}
              </span>
              <button className="nav-btn next-btn" onClick={goToNext}>
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernGalleryComponent;
