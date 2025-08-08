import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GalleryManager.css';
import logo from '../../assets/logos/logo.png';
import { useGallery } from '../../contexts/GalleryContext';

const GalleryManager = () => {
  const navigate = useNavigate();
  const { galleryData, updateGalleryData, clearGallery } = useGallery();
  const [localGalleryData, setLocalGalleryData] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newImage, setNewImage] = useState({
    title: '',
    src: '',
    description: ''
  });

  // Load initial gallery data - start with empty gallery
  useEffect(() => {
    setLocalGalleryData([]);
  }, []);

  // Check for changes
  useEffect(() => {
    const hasUnsavedChanges = localGalleryData.length > 0;
    setHasChanges(hasUnsavedChanges);
  }, [localGalleryData]);

  const handleBackToDashboard = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    navigate('/dashboard');
  };

  const handleAddImage = () => {
    if (!newImage.title || !newImage.src) {
      alert('Please fill in both title and image URL');
      return;
    }

    const newId = Math.max(...localGalleryData.map(img => img.id), 0) + 1;
    const imageToAdd = {
      id: newId,
      title: newImage.title,
      src: newImage.src,
      description: newImage.description || ''
    };

    setLocalGalleryData([...localGalleryData, imageToAdd]);
    setNewImage({ title: '', src: '', description: '' });
  };

  const handleEditImage = (id) => {
    setEditingId(id);
  };

  const handleSaveEdit = (id) => {
    const updatedData = localGalleryData.map(img => 
      img.id === id ? { ...img, title: img.title, description: img.description } : img
    );
    setLocalGalleryData(updatedData);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteImage = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (confirmDelete) {
      setLocalGalleryData(localGalleryData.filter(img => img.id !== id));
    }
  };

  const handleMoveImage = (id, direction) => {
    const currentIndex = localGalleryData.findIndex(img => img.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= localGalleryData.length) return;

    const newData = [...localGalleryData];
    [newData[currentIndex], newData[newIndex]] = [newData[newIndex], newData[currentIndex]];
    setLocalGalleryData(newData);
  };

  const handleDeployChanges = async () => {
    setIsDeploying(true);
    
    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the global gallery data
      updateGalleryData(localGalleryData);
      
      alert('Gallery changes deployed successfully!');
      setHasChanges(false);
    } catch (error) {
      alert('Error deploying changes. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setLocalGalleryData(localGalleryData.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    ));
  };

  const handleNewImageChange = (field, value) => {
    setNewImage({ ...newImage, [field]: value });
  };

  return (
    <div className='gallery-manager'>
      <header className='manager-header'>
        <div className='manager-header-content'>
          <div className='manager-logo'>
            <img src={logo} alt='Shinobi Academy Logo' className='manager-logo-img' />
            <h1 className='manager-title'>Gallery Manager</h1>
          </div>
          <div className='manager-actions'>
            <button onClick={handleBackToDashboard} className='back-btn'>
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className='manager-main'>
        <div className='manager-container'>
          {/* Add New Image Section */}
          <div className='add-image-section shadowed-box'>
            <h2 className='section-title text-red'>Add New Image</h2>
            <div className='add-image-form'>
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='new-title' className='form-label text-dark'>
                    Image Title
                  </label>
                  <input
                    type='text'
                    id='new-title'
                    value={newImage.title}
                    onChange={(e) => handleNewImageChange('title', e.target.value)}
                    className='form-input'
                    placeholder='Enter image title'
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='new-url' className='form-label text-dark'>
                    Image URL
                  </label>
                  <input
                    type='url'
                    id='new-url'
                    value={newImage.src}
                    onChange={(e) => handleNewImageChange('src', e.target.value)}
                    className='form-input'
                    placeholder='Enter image URL'
                  />
                </div>
              </div>
              <div className='form-group'>
                <label htmlFor='new-description' className='form-label text-dark'>
                  Description (Optional)
                </label>
                <textarea
                  id='new-description'
                  value={newImage.description}
                  onChange={(e) => handleNewImageChange('description', e.target.value)}
                  className='form-textarea'
                  placeholder='Enter image description'
                  rows='3'
                />
              </div>
              <button onClick={handleAddImage} className='add-btn'>
                Add Image
              </button>
            </div>
          </div>

          {/* Gallery Images Section */}
          <div className='gallery-images-section'>
            <h2 className='section-title text-red'>
              Gallery Images ({localGalleryData.length})
            </h2>
            
            {localGalleryData.length === 0 ? (
              <div className='empty-gallery shadowed-box'>
                <div className='empty-gallery-icon'>
                  <svg viewBox="0 0 24 24" fill="currentColor" className='empty-icon-svg'>
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
                <h3 className='empty-gallery-title text-dark'>Your Gallery is Empty</h3>
                <p className='empty-gallery-text text-dark'>
                  Start building your gallery by adding your first photo above!
                </p>
              </div>
            ) : (
              <div className='images-grid'>
                {localGalleryData.map((image, index) => (
                  <div key={image.id} className='image-card shadowed-box'>
                    <div className='image-preview'>
                      <img 
                        src={image.src} 
                        alt={image.title} 
                        className='preview-img'
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xMDAgMTUwQzExMS4wNDYgMTUwIDEyMCAxNDEuMDQ2IDEyMCAxMzBDMTIwIDExOC45NTQgMTExLjA0NiAxMTAgMTAwIDExMEM4OC45NTQgMTEwIDgwIDExOC45NTQgODAgMTMwQzgwIDE0MS4wNDYgODguOTU0IDE1MCAxMDAgMTUwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
                        }}
                      />
                    </div>
                    
                    <div className='image-info'>
                      {editingId === image.id ? (
                        <div className='edit-form'>
                          <input
                            type='text'
                            value={image.title}
                            onChange={(e) => handleInputChange(image.id, 'title', e.target.value)}
                            className='edit-input'
                          />
                          <textarea
                            value={image.description || ''}
                            onChange={(e) => handleInputChange(image.id, 'description', e.target.value)}
                            className='edit-textarea'
                            placeholder='Add description...'
                            rows='2'
                          />
                          <div className='edit-actions'>
                            <button onClick={() => handleSaveEdit(image.id)} className='save-btn'>
                              Save
                            </button>
                            <button onClick={handleCancelEdit} className='cancel-btn'>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className='image-details'>
                          <h3 className='image-title'>{image.title}</h3>
                          {image.description && (
                            <p className='image-description'>{image.description}</p>
                          )}
                          <div className='image-actions'>
                            <button onClick={() => handleEditImage(image.id)} className='edit-btn'>
                              Edit
                            </button>
                            <button onClick={() => handleDeleteImage(image.id)} className='delete-btn'>
                              Delete
                            </button>
                            <div className='move-buttons'>
                              <button 
                                onClick={() => handleMoveImage(image.id, 'up')}
                                disabled={index === 0}
                                className='move-btn'
                                title='Move Up'
                              >
                                ↑
                              </button>
                              <button 
                                onClick={() => handleMoveImage(image.id, 'down')}
                                disabled={index === localGalleryData.length - 1}
                                className='move-btn'
                                title='Move Down'
                              >
                                ↓
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deploy Changes Section */}
          <div className='deploy-section'>
            <button 
              onClick={handleDeployChanges}
              disabled={!hasChanges || isDeploying}
              className='deploy-btn'
            >
              {isDeploying ? 'Deploying Changes...' : 'Deploy Changes!'}
            </button>
            {hasChanges && (
              <p className='changes-notice'>
                You have unsaved changes. Click "Deploy Changes!" to save them.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GalleryManager;
