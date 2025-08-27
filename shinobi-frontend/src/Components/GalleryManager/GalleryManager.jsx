import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './GalleryManager.css';
import logo from '../../assets/logos/logo.png';
import { useGallery } from '../../contexts/GalleryContext';
import { galleryAPI } from '../../services/api';

// Toast Notification Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-dismiss after 4 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

const GalleryManager = () => {
  const navigate = useNavigate();
  const { 
    galleryData, 
    isLoading, 
    error, 
    loadAdminGalleryData,
    createImage,
    updateImage,
    deleteImage,
    reorderImages
  } = useGallery();
  
  const [localGalleryData, setLocalGalleryData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState(null);
  const [newImage, setNewImage] = useState({
    title: '',
    src: '',
    category: 'General',
    file: null
  });
  const [toasts, setToasts] = useState([]);

  const fileInputRef = useRef(null);

  // Toast management
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Handle image file selection for new images
  const handleImageFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('File is too large. Maximum size is 10MB.', 'error');
      return;
    }

    // Create local preview immediately
    const localPreviewUrl = URL.createObjectURL(file);
    setNewImage(prev => ({ 
      ...prev, 
      src: localPreviewUrl,
      file: file // Store the file for later upload
    }));
  };

  // Load initial gallery data from global context
  useEffect(() => {
    loadAdminGalleryData();
  }, [loadAdminGalleryData]);

  // Update local data when global data changes
  useEffect(() => {
    setLocalGalleryData([...galleryData]);
  }, [galleryData]);

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleAddImage = async () => {
    if (!newImage.src) {
      addToast('Please select an image', 'error');
      return;
    }

    try {
      let finalImageData = { ...newImage };
      
      // If we have a file to upload, upload it first
      if (newImage.file) {
        setIsUploading(true);
        const uploadResult = await galleryAPI.uploadImage(newImage.file);
        finalImageData.src = uploadResult.data.path;
      }

      // Create the image in the database with default values for missing fields
      const imageDataToCreate = {
        title: finalImageData.title || 'Untitled Image',
        src: finalImageData.src,
        description: '',
        category: finalImageData.category || 'General',
        tags: [],
        order: 0 // Set to 0 to place at the top
      };
      
      await createImage(imageDataToCreate);
      
      // Refresh the gallery data to show the new image at the top
      await loadAdminGalleryData();
      
      // Reset form
      setNewImage({ title: '', src: '', category: 'General', file: null });
      
      // Clean up the local preview URL
      if (newImage.src && newImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(newImage.src);
      }
      
      addToast('Image added successfully!', 'success');
    } catch (error) {
      addToast(`Error adding image: ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag & Drop File Upload Functions
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          addToast(`File ${file.name} is not an image. Please upload only image files.`, 'error');
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          addToast(`File ${file.name} is too large. Maximum size is 10MB.`, 'error');
          continue;
        }

        // Upload image
        const uploadResult = await galleryAPI.uploadImage(file);
        
        // Create image object
        const imageData = {
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for title
          src: uploadResult.data.path,
          description: '', // No default description
          category: 'General',
          tags: [],
          order: 0 // Set to 0 to place at the top
        };

        await createImage(imageData);
      }

      addToast(`${files.length} image(s) uploaded successfully!`, 'success');
      
      // Refresh the gallery data to show the new images at the top
      await loadAdminGalleryData();
    } catch (error) {
      console.error('Upload error:', error);
      addToast('An error occurred during upload. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag & Drop Reordering Functions
  const handleDragStart = (e, imageId) => {
    setDraggedImageId(imageId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverImage = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropImage = async (e, targetImageId) => {
    e.preventDefault();
    
    if (draggedImageId === targetImageId) return;

    const draggedIndex = localGalleryData.findIndex(img => img.id === draggedImageId);
    const targetIndex = localGalleryData.findIndex(img => img.id === targetImageId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newData = [...localGalleryData];
    const [draggedItem] = newData.splice(draggedIndex, 1);
    newData.splice(targetIndex, 0, draggedItem);
    
    setLocalGalleryData(newData);
    setDraggedImageId(null);

    // Update order in backend
    try {
      const imageIds = newData.map(img => img.id);
      
      // Validate imageIds array
      if (!imageIds || imageIds.length === 0) {
        throw new Error('No valid image IDs found for reordering');
      }
      
      // Check if all IDs are valid
      if (imageIds.some(id => !id)) {
        throw new Error('Invalid image IDs found in the array');
      }
      
      console.log('Reordering images with IDs:', imageIds);
      await reorderImages(imageIds);
      console.log('Images reordered successfully');
    } catch (error) {
      console.error('Error reordering images:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      addToast(`Error saving new order: ${error.message}. Please try again.`, 'error');
      
      // Revert the local state change on error
      setLocalGalleryData([...galleryData]);
    }
  };

  const handleDragEnd = () => {
    setDraggedImageId(null);
  };

  const handleEditImage = (id) => {
    setEditingId(id);
  };

  const handleSaveEdit = async (id) => {
    const imageToUpdate = localGalleryData.find(img => img.id === id);
    if (!imageToUpdate) return;

    try {
      await updateImage(id, {
        title: imageToUpdate.title,
        description: imageToUpdate.description,
        category: imageToUpdate.category,
        tags: imageToUpdate.tags
      });
      setEditingId(null);
      addToast('Image updated successfully!', 'success');
    } catch (error) {
      addToast(`Error updating image: ${error.message}`, 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteImage = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (confirmDelete) {
      try {
        await deleteImage(id);
        addToast('Image deleted successfully!', 'success');
      } catch (error) {
        addToast(`Error deleting image: ${error.message}`, 'error');
      }
    }
  };

  const handleInputChange = (id, field, value) => {
    setLocalGalleryData(prev => 
      prev.map(img => 
        img.id === id ? { ...img, [field]: value } : img
      )
    );
  };

  const handleNewImageChange = (field, value) => {
    setNewImage(prev => ({ ...prev, [field]: value }));
  };



  const handleEditImageSelect = async (imageId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('File is too large. Maximum size is 10MB.', 'error');
    }

    try {
      setIsUploading(true);
      const uploadResult = await galleryAPI.uploadImage(file);
      
      // Update the image source in local data
      setLocalGalleryData(prev => 
        prev.map(img => 
          img.id === imageId ? { ...img, src: uploadResult.data.path } : img
        )
      );
      
      addToast('Image updated successfully!', 'success');
    } catch (error) {
      addToast(`Error updating image: ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="gallery-manager">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-manager">
        <div className="error-container">
          <h3>Error Loading Gallery</h3>
          <p>{error}</p>
          <button onClick={loadAdminGalleryData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-manager">
      <header className="manager-header">
        <div className="manager-header-content">
          <div className="manager-logo">
            <img src={logo} alt="Shinobi Academy Logo" className="manager-logo-img" />
            <h1 className="manager-title">Gallery Manager</h1>
          </div>
          <div className="manager-actions">
            <button onClick={handleBackToDashboard} className="back-btn">
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

            <main className="manager-main">
        <div className="manager-container">

                {/* Add New Image Section */}
          <div className="add-image-section">
        <h3>Add New Image</h3>
        <div className="add-image-form">
          <div className="form-group">
            <label htmlFor="new-title" className="form-label text-dark">
              Image Title (Optional)
            </label>
            <input
              type="text"
              id="new-title"
              value={newImage.title}
              onChange={(e) => handleNewImageChange('title', e.target.value)}
              className="form-input"
              placeholder="Enter image title (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-category" className="form-label text-dark">
              Category *
            </label>
            <select
              id="new-category"
              value={newImage.category}
              onChange={(e) => handleNewImageChange('category', e.target.value)}
              className="form-select"
            >
              <option value="General">General</option>
              <option value="Training">Training</option>
              <option value="Classes">Classes</option>
              <option value="Events">Events</option>
              <option value="Competitions">Competitions</option>
              <option value="Camps">Camps</option>
              <option value="Connor">Connor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="new-url" className="form-label text-dark">
              Image URL or File
            </label>
            <div className="image-input-group">
              <input
                type="url"
                id="new-url"
                value={newImage.src}
                onChange={(e) => handleNewImageChange('src', e.target.value)}
                className="form-input"
                placeholder="Enter image URL"
              />
              <span className="image-input-divider">OR</span>
              <input
                type="file"
                id="new-image-file"
                accept="image/*"
                onChange={(e) => handleImageFileSelect(e)}
                className="form-file-input"
              />
              <label htmlFor="new-image-file" className="form-file-label">
                Choose File
              </label>
            </div>
            {newImage.src && (
              <div className="image-preview-section">
                <label className="form-label text-dark">Image Preview:</label>
                <div className="image-preview-container">
                  <img 
                    src={newImage.src} 
                    alt="Preview" 
                    className="form-image-preview"
                    onError={(e) => {
                      console.error('Image failed to load:', newImage.src);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleAddImage} 
            className="add-button"
            disabled={isUploading}
          >
            {isUploading ? 'Adding Image...' : 'Add Image'}
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Section */}
      <div className="upload-section">
        <h3>Bulk Upload Images</h3>
        <div 
          className={`upload-area ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <h4 className="upload-title">Drag & Drop Images Here</h4>
            <p className="upload-subtitle">or click to select files</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
            />
            {isUploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
                <p className="progress-text">Uploading...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Images Display */}
      <div className="gallery-images-section">
        <h3>Gallery Images ({localGalleryData.length})</h3>
        {localGalleryData.length === 0 ? (
          <div className="empty-gallery">
            <p>No images in the gallery yet. Add some images to get started!</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {localGalleryData
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((image) => (
              <div 
                key={image.id} 
                className={`gallery-image-card ${draggedImageId === image.id ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, image.id)}
                onDragOver={handleDragOverImage}
                onDrop={(e) => handleDropImage(e, image.id)}
                onDragEnd={handleDragEnd}
              >
                <div className="image-container">
                  <img 
                    src={image.src.startsWith('http') ? image.src : `http://localhost:5000${image.src}`}
                    alt={image.title || 'Gallery image'}
                    className="gallery-image"
                    onError={(e) => {
                      console.error('Image failed to load:', image.src);
                      e.target.style.display = 'none';
                      e.target.style.border = '2px solid red';
                      e.target.style.backgroundColor = '#ffe6e6';
                    }}
                  />
                  <div className="image-overlay">
                    <div className="overlay-buttons">
                      <button 
                        onClick={() => handleEditImage(image.id)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteImage(image.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {editingId === image.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={localGalleryData.find(img => img.id === image.id)?.title || ''}
                      onChange={(e) => handleInputChange(image.id, 'title', e.target.value)}
                      className="edit-input"
                      placeholder="Image title"
                    />
                    <textarea
                      value={localGalleryData.find(img => img.id === image.id)?.description || ''}
                      onChange={(e) => handleInputChange(image.id, 'description', e.target.value)}
                      className="edit-textarea"
                      placeholder="Image description"
                      rows="2"
                    />
                    <select
                      value={localGalleryData.find(img => img.id === image.id)?.category || 'General'}
                      onChange={(e) => handleInputChange(image.id, 'category', e.target.value)}
                      className="edit-select"
                    >
                      <option value="General">General</option>
                      <option value="Training">Training</option>
                      <option value="Classes">Classes</option>
                      <option value="Events">Events</option>
                      <option value="Competitions">Competitions</option>
                      <option value="Camps">Camps</option>
                      <option value="Connor">Connor</option>
                    </select>
                    <div className="edit-buttons">
                      <button 
                        onClick={() => handleSaveEdit(image.id)}
                        className="save-button"
                      >
                        Save
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="image-info">
                    <h4 className="image-title">{image.title}</h4>
                    {image.description && (
                      <p className="image-description">{image.description}</p>
                    )}
                    {image.category && (
                      <span className="image-category">{image.category}</span>
                    )}
                    {image.tags && image.tags.length > 0 && (
                      <div className="image-tags">
                        {image.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Image Upload Section for Edit */}
                <div className="edit-image-section">
                  <label className="edit-image-label">Change Image:</label>
                  <div className="edit-image-input-group">
                    <input
                      type="file"
                      id={`edit-image-${image.id}`}
                      accept="image/*"
                      onChange={(e) => handleEditImageSelect(image.id, e)}
                      className="edit-file-input"
                    />
                    <label htmlFor={`edit-image-${image.id}`} className="edit-file-label">
                      Choose New Image
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Status Message */}
        <div className="auto-save-status">
          <div className="status-message">
            <span className="status-icon">✓</span>
            <span className="status-text">All changes are saved automatically</span>
          </div>
        </div>

        {/* Toast Notifications */}
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
        </div>
        </div>
      </main>

    </div>
  );
};

export default GalleryManager;
