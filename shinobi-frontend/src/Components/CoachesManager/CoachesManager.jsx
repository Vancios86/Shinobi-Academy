import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CoachesManager.css';
import logo from '../../assets/logos/logo.png';
import { useCoaches } from '../../contexts/CoachesContext';
import { coachesAPI } from '../../services/api';
import ConfirmationModal from '../Common/ConfirmationModal';
import { useScrollToTopOnMount } from '../../hooks/useScrollToTop';

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

const CoachesManager = () => {
  const navigate = useNavigate();
  const { 
    coachesData, 
    addCoach,
    updateCoach,
    deleteCoach,
    reorderCoaches,
    canDeleteCoach,
    loadAdminCoaches,
    isLoading,
    error
  } = useCoaches();
  const [localCoachesData, setLocalCoachesData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [coachToDelete, setCoachToDelete] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [newCoach, setNewCoach] = useState({
    name: '',
    imgSrc: '',
    description: '',
    specialty: ''
  });
  
  // Scroll to top when component mounts
  useScrollToTopOnMount();

  // Toast management
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Load initial coaches data from global context
  useEffect(() => {
    if (coachesData && coachesData.length > 0) {
      setLocalCoachesData([...coachesData]);
    }
  }, [coachesData]);

  // Load admin coaches data on component mount
  useEffect(() => {
    loadAdminCoaches();
  }, [loadAdminCoaches]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && showDeleteModal) {
        setShowDeleteModal(false);
        setCoachToDelete(null);
      }
    };

    if (showDeleteModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showDeleteModal]);


  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleAddCoach = async () => {
    if (!newCoach.name || !newCoach.imgSrc) {
      addToast('Please fill in both name and image URL', 'error');
      return;
    }

    // Validate character limits
    if (newCoach.name.length > 25) {
      addToast('Coach name cannot exceed 25 characters', 'error');
      return;
    }
    
    if (newCoach.specialty && newCoach.specialty.length > 25) {
      addToast('Specialty cannot exceed 25 characters', 'error');
      return;
    }
    
    if (newCoach.description && newCoach.description.length > 1000) {
      addToast('Description cannot exceed 1000 characters', 'error');
      return;
    }

    const coachToAdd = {
      name: newCoach.name,
      imgSrc: newCoach.imgSrc,
      description: newCoach.description || '',
      specialty: newCoach.specialty || '',
      order: (coachesData?.length || 0) + 1 // Set order to add at the end
    };

    try {
      const result = await addCoach(coachToAdd);
      if (result.success) {
        setNewCoach({ name: '', imgSrc: '', description: '', specialty: '' });
        // Data will be updated via context
        addToast('Coach added successfully!', 'success');
      } else {
        addToast(`Failed to add coach: ${result.message}`, 'error');
      }
    } catch (error) {
      addToast(`Error adding coach: ${error.message}`, 'error');
    }
  };



  const handleImageFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file.', 'error');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      addToast('File is too large. Maximum size is 10MB.', 'error');
      return;
    }

    try {
      // Upload image to backend
      const uploadResult = await coachesAPI.uploadImage(file);
      
      if (uploadResult.success) {
        // Update the form with the uploaded image URL
        const imageUrl = `http://localhost:5000${uploadResult.data.path}`;
        setNewCoach(prev => ({
          ...prev,
          imgSrc: imageUrl
        }));
        addToast('Image uploaded successfully!', 'success');
      } else {
        addToast(`Failed to upload image: ${uploadResult.message}`, 'error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      addToast(`Error uploading image: ${error.message}`, 'error');
    } finally {
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleEditImageSelect = async (coachId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file.', 'error');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      addToast('File is too large. Maximum size is 10MB.', 'error');
      return;
    }

    try {
      // Upload image to backend
      const uploadResult = await coachesAPI.uploadImage(file);
      
      if (uploadResult.success) {
        // Update the local coach data with the new image URL
        const imageUrl = `http://localhost:5000${uploadResult.data.path}`;
        setLocalCoachesData(prev => prev.map(coach => 
          coach.id === coachId 
            ? { ...coach, imgSrc: imageUrl }
            : coach
        ));
        addToast('New image uploaded successfully! It will be applied when you save the changes.', 'success');
      } else {
        addToast(`Failed to upload image: ${uploadResult.message}`, 'error');
      }
    } catch (error) {
      console.error('Error uploading image for edit:', error);
      addToast(`Error uploading image: ${error.message}`, 'error');
    } finally {
      // Clear the file input
      event.target.value = '';
    }
  };





  const handleEditCoach = (id) => {
    setEditingId(id);
  };

  const handleSaveEdit = async (id) => {
    // Try to find coach in local data first, then fallback to context data
    const coach = localCoachesData.find(c => c.id === id) || coachesData.find(c => c.id === id);
    if (!coach) {
      addToast('Coach not found. Please refresh the page and try again.', 'error');
      return;
    }

    // Validate character limits
    if (coach.name.length > 25) {
      addToast('Coach name cannot exceed 25 characters', 'error');
      return;
    }
    
    if (coach.specialty && coach.specialty.length > 25) {
      addToast('Specialty cannot exceed 25 characters', 'error');
      return;
    }
    
    if (coach.description && coach.description.length > 1000) {
      addToast('Description cannot exceed 1000 characters', 'error');
      return;
    }

    const coachData = {
      name: coach.name,
      imgSrc: coach.imgSrc,
      specialty: coach.specialty || '',
      description: coach.description || '',
      order: coach.order,
      isActive: coach.isActive !== false
    };

    try {
      const result = await updateCoach(id, coachData);
      if (result.success) {
        setEditingId(null);
        // Data will be updated via context
      } else {
        addToast(`Failed to update coach: ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('Error updating coach:', error);
      addToast('An error occurred while updating the coach. Please try again.', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    // Reset local changes by reloading from context
    setLocalCoachesData([...coachesData]);
  };

  const handleInputChange = (id, field, value) => {
    setLocalCoachesData(localCoachesData.map(coach => 
      coach.id === id ? { ...coach, [field]: value } : coach
    ));
  };

  const handleDeleteCoach = async (id) => {
    const coach = coachesData.find(coach => coach.id === id);
    if (!coach) {
      addToast('Coach not found. Please refresh the page and try again.', 'error');
      return;
    }

    // Prevent deleting the last coach
    if (coachesData && coachesData.length === 1) {
      addToast('Cannot delete the last coach. Your team must have at least one coach.', 'error');
      return;
    }

    // Check if coach can be deleted using context function
    const { canDelete, reason } = canDeleteCoach(id);
    if (!canDelete) {
      addToast(`Cannot delete coach: ${reason}`, 'error');
      return;
    }

    // Set the coach to delete and show the confirmation modal
    setCoachToDelete(coach);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!coachToDelete) return;

    try {
      const result = await deleteCoach(coachToDelete.id);
      if (result.success) {
        // Success - data will be updated via context
        addToast('Coach deleted successfully!', 'success');
      } else {
        addToast(`Failed to delete coach: ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting coach:', error);
      addToast('An error occurred while deleting the coach. Please try again.', 'error');
    } finally {
      // Close modal and reset state
      setShowDeleteModal(false);
      setCoachToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCoachToDelete(null);
  };


  const handleMoveCoach = async (id, direction) => {
    const currentIndex = coachesData.findIndex(coach => coach.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || (coachesData && newIndex >= coachesData.length)) return;

    // Create new order array with swapped positions
    const newData = [...coachesData];
    [newData[currentIndex], newData[newIndex]] = [newData[newIndex], newData[currentIndex]];
    
    // Extract just the IDs in the new order
    const coachIds = newData.map(coach => coach.id);

    try {
      const result = await reorderCoaches(coachIds);
      if (!result.success) {
        addToast(`Failed to reorder coaches: ${result.message}`, 'error');
      }
      // Data will be updated via context on success
    } catch (error) {
      console.error('Error reordering coaches:', error);
      addToast('An error occurred while reordering coaches. Please try again.', 'error');
    }
  };



  const handleNewCoachChange = (field, value) => {
    setNewCoach({ ...newCoach, [field]: value });
  };

  return (
    <div className='coaches-manager'>
      <header className='manager-header'>
        <div className='manager-header-content'>
          <div className='manager-logo'>
            <img src={logo} alt='Shinobi Academy Logo' className='manager-logo-img' />
            <h1 className='manager-title'>Coaches Manager</h1>
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
          {error && (
            <div className='error-message'>
              <p>❌ Error loading coaches: {error}</p>
              <button onClick={loadAdminCoaches} className='retry-btn'>
                Retry
              </button>
            </div>
          )}
          
          {isLoading && (
            <div className='loading-message'>
              <p>🔄 Loading coaches...</p>
            </div>
          )}
          {/* Add New Coach Section */}
          <div className='add-coach-section'>
            <h2 className='section-title text-red'>Add New Coach</h2>
            


            {/* Manual Form */}
            <div className='add-coach-form'>
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='new-name' className='form-label text-dark'>
                    Coach Name
                  </label>
                  <input
                    type='text'
                    id='new-name'
                    value={newCoach.name}
                    onChange={(e) => handleNewCoachChange('name', e.target.value)}
                    className='form-input'
                    placeholder='Enter coach name'
                    maxLength={25}
                  />
                  <small className={`char-count ${newCoach.name.length > 20 ? 'char-count-warning' : ''} ${newCoach.name.length === 25 ? 'char-count-max' : ''}`}>
                    {newCoach.name.length}/25
                  </small>
                </div>
                <div className='form-group'>
                  <label htmlFor='new-url' className='form-label text-dark'>
                    Image URL or File
                  </label>
                  <div className='image-input-group'>
                    <input
                      type='url'
                      id='new-url'
                      value={newCoach.imgSrc}
                      onChange={(e) => handleNewCoachChange('imgSrc', e.target.value)}
                      className='form-input'
                      placeholder='Enter image URL'
                    />
                    <span className='image-input-divider'>OR</span>
                    <input
                      type='file'
                      id='new-image-file'
                      accept='image/*'
                      onChange={(e) => handleImageFileSelect(e)}
                      className='form-file-input'
                    />
                    <label htmlFor='new-image-file' className='form-file-label'>
                      Choose File
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Image Preview */}
              {newCoach.imgSrc && (
                <div className='image-preview-section'>
                  <label className='form-label text-dark'>Image Preview:</label>
                  <div className='image-preview-container'>
                    <img 
                      src={newCoach.imgSrc} 
                      alt="Coach preview" 
                      className='form-image-preview'
                      onError={(e) => {
                        console.error('Image failed to load:', newCoach.imgSrc);
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='new-specialty' className='form-label text-dark'>
                    Specialty
                  </label>
                  <input
                    type='text'
                    id='new-specialty'
                    value={newCoach.specialty}
                    onChange={(e) => handleNewCoachChange('specialty', e.target.value)}
                    className='form-input'
                    placeholder='e.g., BJJ, MMA, Wrestling'
                    maxLength={25}
                  />
                  <small className={`char-count ${newCoach.specialty.length > 20 ? 'char-count-warning' : ''} ${newCoach.specialty.length === 25 ? 'char-count-max' : ''}`}>
                    {newCoach.specialty.length}/25
                  </small>
                </div>
                <div className='form-group'>
                  <label htmlFor='new-description' className='form-label text-dark'>
                    Description (Optional)
                  </label>
                  <textarea
                    id='new-description'
                    value={newCoach.description}
                    onChange={(e) => handleNewCoachChange('description', e.target.value)}
                    className='form-textarea'
                    placeholder='Enter coach description'
                    rows='3'
                    maxLength={1000}
                  />
                  <small className={`char-count ${newCoach.description.length > 800 ? 'char-count-warning' : ''} ${newCoach.description.length === 1000 ? 'char-count-max' : ''}`}>
                    {newCoach.description.length}/1000
                  </small>
                </div>
              </div>
              <button onClick={handleAddCoach} className='add-btn'>
                Add Coach
              </button>
            </div>
          </div>

          {/* Coaches Section */}
          <div className='coaches-section'>
            <div className='section-header'>
              <h2 className='section-title text-red'>
                Coaches ({localCoachesData?.length || 0})
              </h2>

            </div>
            
            {!localCoachesData || localCoachesData.length === 0 ? (
              <div className='empty-coaches shadowed-box'>
                <div className='empty-coaches-icon'>
                  <svg viewBox="0 0 24 24" fill="currentColor" className='empty-icon-svg'>
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.99 2.5V8c0-.55-.45-1-1-1s-1 .45-1 1v8c0 .55.45 1 1 1h1v-2.5l1.99-2.5c.47-.63 1.21-1 2.01-1h1.54c.8 0 1.54.37 2.01 1L22.5 16H20v6h2z"/>
                  </svg>
                </div>
                <h3 className='empty-coaches-title text-dark'>Your Team is Empty</h3>
                <p className='empty-coaches-text text-dark'>
                  Start building your team by adding your first coach above!
                </p>
              </div>
            ) : (
              <div className='coaches-grid'>
                {coachesData && coachesData.map((coach, index) => (
                  <div
                    key={coach.id}
                    className='coach-card'

                  >
                    <div className='coach-preview'>
                      <img 
                        src={coach.imgSrc} 
                        alt={coach.name} 
                        className='preview-img'
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xMDAgMTUwQzExMS4wNDYgMTUwIDEyMCAxNDEuMDQ2IDEyMCAxMzBDMTIwIDExOC45NTQgMTEwLjA0NiAxMTAgMTAwIDExMEM4OC45NTQgMTEwIDgwIDExOC45NTQgODAgMTMwQzgwIDE0MS4wNDYgODguOTU0IDE1MCAxMDAgMTUwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
                        }}
                      />
                    </div>
                    
                    <div className='coach-info'>
                      {editingId === coach.id ? (
                        <div className='edit-form'>
                          <input
                            type='text'
                            value={localCoachesData.find(c => c.id === coach.id)?.name || coach.name}
                            onChange={(e) => handleInputChange(coach.id, 'name', e.target.value)}
                            className='edit-input'
                            placeholder='Coach name'
                            maxLength={25}
                          />
                          <small className={`char-count ${(localCoachesData.find(c => c.id === coach.id)?.name || coach.name).length > 20 ? 'char-count-warning' : ''} ${(localCoachesData.find(c => c.id === coach.id)?.name || coach.name).length === 25 ? 'char-count-max' : ''}`}>
                            {(localCoachesData.find(c => c.id === coach.id)?.name || coach.name).length}/25
                          </small>
                          <input
                            type='text'
                            value={localCoachesData.find(c => c.id === coach.id)?.specialty || coach.specialty || ''}
                            onChange={(e) => handleInputChange(coach.id, 'specialty', e.target.value)}
                            className='edit-input'
                            placeholder='Specialty'
                            maxLength={25}
                          />
                          <small className={`char-count ${(localCoachesData.find(c => c.id === coach.id)?.specialty || coach.specialty || '').length > 20 ? 'char-count-warning' : ''} ${(localCoachesData.find(c => c.id === coach.id)?.specialty || coach.specialty || '').length === 25 ? 'char-count-max' : ''}`}>
                            {(localCoachesData.find(c => c.id === coach.id)?.specialty || coach.specialty || '').length}/25
                          </small>
                          <textarea
                            value={localCoachesData.find(c => c.id === coach.id)?.description || coach.description || ''}
                            onChange={(e) => handleInputChange(coach.id, 'description', e.target.value)}
                            className='edit-textarea'
                            placeholder='Add description...'
                            rows='2'
                            maxLength={1000}
                          />
                          <small className={`char-count ${(localCoachesData.find(c => c.id === coach.id)?.description || coach.description || '').length > 800 ? 'char-count-warning' : ''} ${(localCoachesData.find(c => c.id === coach.id)?.description || coach.description || '').length === 1000 ? 'char-count-max' : ''}`}>
                            {(localCoachesData.find(c => c.id === coach.id)?.description || coach.description || '').length}/1000
                          </small>
                          
                          {/* Image Upload Section for Edit */}
                          <div className='edit-image-section'>
                            <label className='edit-image-label'>Current Image:</label>
                            <div className='current-image-display'>
                              <img 
                                src={coach.imgSrc} 
                                alt={`Current ${coach.name}`} 
                                className='current-image-img'
                              />
                            </div>
                            
                            <label className='edit-image-label'>Change Image:</label>
                            <div className='edit-image-input-group'>
                              <input
                                type='file'
                                id={`edit-image-${coach.id}`}
                                accept='image/*'
                                onChange={(e) => handleEditImageSelect(coach.id, e)}
                                className='edit-file-input'
                              />
                              <label htmlFor={`edit-image-${coach.id}`} className='edit-file-label'>
                                Choose New Image
                              </label>
                            </div>
                            
                            {localCoachesData.find(c => c.id === coach.id)?.imgSrc && localCoachesData.find(c => c.id === coach.id)?.imgSrc !== coach.imgSrc && (
                              <div className='edit-image-preview'>
                                <label className='edit-image-preview-label'>New Image Preview:</label>
                                                            <img 
                              src={localCoachesData.find(c => c.id === coach.id)?.imgSrc} 
                              alt="New preview" 
                              className='edit-image-preview-img'
                            />
                                <small className='edit-image-note'>New image will be applied when saved</small>
                              </div>
                            )}
                          </div>
                          <div className='edit-actions'>
                            <button onClick={() => handleSaveEdit(coach.id)} className='save-btn'>
                              Save
                            </button>
                            <button onClick={handleCancelEdit} className='cancel-btn'>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className='coach-details'>
                          <h3 className='coach-name'>{coach.name}</h3>
                          {coach.specialty && (
                            <p className='coach-specialty'>{coach.specialty}</p>
                          )}
                          {coach.description && (
                            <p className='coach-description'>{coach.description}</p>
                          )}
                          <div className='coach-actions'>
                            <button onClick={() => handleEditCoach(coach.id)} className='edit-btn'>
                              Edit
                            </button>
                            <button onClick={() => handleDeleteCoach(coach.id)} className='delete-btn'>
                              Delete
                            </button>
                            <div className='move-buttons'>
                              <button 
                                onClick={() => handleMoveCoach(coach.id, 'up')}
                                disabled={index === 0}
                                className='move-btn'
                                title='Move Up'
                              >
                                ↑
                              </button>
                              <button 
                                onClick={() => handleMoveCoach(coach.id, 'down')}
                                disabled={coachesData && index === coachesData.length - 1}
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
            
            {/* Auto-save status */}
            <div className='auto-save-status'>
              <div className='status-message'>
                <span className='status-icon'>✅</span>
                <span className='status-text'>All changes are saved automatically</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Delete Coach"
          message={`Are you sure you want to delete "${coachToDelete?.name}"? This action cannot be undone and the coach will be permanently removed from your team.`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          confirmText="Delete Coach"
          cancelText="Cancel"
          type="danger"
          showIcon={true}
        />
      )}

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
  );
};

export default CoachesManager;
