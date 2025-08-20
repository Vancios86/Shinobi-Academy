import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CoachesManager.css';
import logo from '../../assets/logos/logo.png';
import { useCoaches } from '../../contexts/CoachesContext';

const CoachesManager = () => {
  const navigate = useNavigate();
  const { 
    coachesData, 
    updateCoachesData, 
    addCoach,
    updateCoach,
    deleteCoach,
    reorderCoaches,
    canDeleteCoach,
    loadCoaches,
    loadAdminCoaches,
    isLoading,
    error
  } = useCoaches();
  const [localCoachesData, setLocalCoachesData] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [coachesMarkedForDeletion, setCoachesMarkedForDeletion] = useState(new Set());
  const [deletedCoaches, setDeletedCoaches] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [draggedCoachId, setDraggedCoachId] = useState(null);
  const fileInputRef = useRef(null);
  const [newCoach, setNewCoach] = useState({
    name: '',
    imgSrc: '',
    description: '',
    specialty: ''
  });

  // Load initial coaches data from global context
  useEffect(() => {
    setLocalCoachesData([...coachesData]);
  }, [coachesData]);

  // Load admin coaches data on component mount
  useEffect(() => {
    loadAdminCoaches();
  }, [loadAdminCoaches]);

  // Check for changes
  useEffect(() => {
    const hasUnsavedChanges = JSON.stringify(localCoachesData) !== JSON.stringify(coachesData);
    setHasChanges(hasUnsavedChanges);
  }, [localCoachesData, coachesData]);

  const handleBackToDashboard = () => {
    if (hasChanges) {
      let message = 'You have unsaved changes.';
      
      if (deletedCoaches.length > 0) {
        message += `\n\n⚠️ ${deletedCoaches.length} coach(es) are marked for deletion.`;
        message += '\n\nIf you leave now, these deletions will be lost.';
      }
      
      message += '\n\nAre you sure you want to leave?';
      
      const confirmLeave = window.confirm(message);
      if (!confirmLeave) return;
      
      // Clear pending changes if user confirms leaving
      if (deletedCoaches.length > 0) {
        setDeletedCoaches([]);
        setCoachesMarkedForDeletion(new Set());
        setLocalCoachesData([...coachesData]);
        setHasChanges(false);
      }
    }
    navigate('/admin/dashboard');
  };

  const handleAddCoach = async () => {
    if (!newCoach.name || !newCoach.imgSrc) {
      alert('Please fill in both name and image URL');
      return;
    }

    // Validate character limits
    if (newCoach.name.length > 25) {
      alert('Coach name cannot exceed 25 characters');
      return;
    }
    
    if (newCoach.specialty && newCoach.specialty.length > 25) {
      alert('Specialty cannot exceed 25 characters');
      return;
    }
    
    if (newCoach.description && newCoach.description.length > 1000) {
      alert('Description cannot exceed 1000 characters');
      return;
    }

    const coachToAdd = {
      name: newCoach.name,
      imgSrc: newCoach.imgSrc,
      description: newCoach.description || '',
      specialty: newCoach.specialty || '',
      order: coachesData.length // Set order to add at the end
    };

    try {
      const result = await addCoach(coachToAdd);
      if (result.success) {
        setNewCoach({ name: '', imgSrc: '', description: '', specialty: '' });
        // Data will be updated via context
      } else {
        alert(`Failed to add coach: ${result.message}`);
      }
    } catch (error) {
      alert(`Error adding coach: ${error.message}`);
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
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image. Please upload only image files.`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        // Simulate upload progress
        await new Promise(resolve => {
          const interval = setInterval(() => {
            setUploadProgress(prev => {
              const newProgress = prev + Math.random() * 20;
              if (newProgress >= 100) {
                clearInterval(interval);
                resolve();
                return 100;
              }
              return newProgress;
            });
          }, 200);
        });

        // Create coach object from file
        const existingIds = localCoachesData.map(coach => coach.id);
        const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
        
        const coachToAdd = {
          id: newId,
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for name
          imgSrc: URL.createObjectURL(file),
          description: `Coach uploaded on ${new Date().toLocaleDateString()}`,
          specialty: ''
        };

        setLocalCoachesData(prev => [...prev, coachToAdd]);
      }

      alert(`${files.length} coach image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred during upload. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Drag & Drop Reordering Functions
  const handleDragStart = (e, coachId) => {
    setDraggedCoachId(coachId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverCoach = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropCoach = (e, targetCoachId) => {
    e.preventDefault();
    
    if (draggedCoachId === targetCoachId) return;

    const draggedIndex = localCoachesData.findIndex(coach => coach.id === draggedCoachId);
    const targetIndex = localCoachesData.findIndex(coach => coach.id === targetCoachId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newData = [...localCoachesData];
    const [draggedItem] = newData.splice(draggedIndex, 1);
    newData.splice(targetIndex, 0, draggedItem);
    
    setLocalCoachesData(newData);
    setDraggedCoachId(null);
  };

  const handleDragEnd = () => {
    setDraggedCoachId(null);
  };

  const handleEditCoach = (id) => {
    setEditingId(id);
  };

  const handleSaveEdit = async (id) => {
    // Try to find coach in local data first, then fallback to context data
    const coach = localCoachesData.find(c => c.id === id) || coachesData.find(c => c.id === id);
    if (!coach) {
      alert('Coach not found. Please refresh the page and try again.');
      return;
    }

    // Validate character limits
    if (coach.name.length > 25) {
      alert('Coach name cannot exceed 25 characters');
      return;
    }
    
    if (coach.specialty && coach.specialty.length > 25) {
      alert('Specialty cannot exceed 25 characters');
      return;
    }
    
    if (coach.description && coach.description.length > 1000) {
      alert('Description cannot exceed 1000 characters');
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
        alert(`Failed to update coach: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating coach:', error);
      alert('An error occurred while updating the coach. Please try again.');
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
    const coachToDelete = coachesData.find(coach => coach.id === id);
    if (!coachToDelete) {
      alert('Coach not found. Please refresh the page and try again.');
      return;
    }

    // Prevent deleting the last coach
    if (coachesData.length === 1) {
      alert('Cannot delete the last coach. Your team must have at least one coach.');
      return;
    }

    // Check if coach can be deleted using context function
    const { canDelete, reason } = canDeleteCoach(id);
    if (!canDelete) {
      alert(`Cannot delete coach: ${reason}`);
      return;
    }

    // Enhanced confirmation dialog with more details and warnings
    const confirmDelete = window.confirm(
      `⚠️ WARNING: You are about to delete "${coachToDelete.name}"\n\n` +
      `This action will:\n` +
      `• Immediately remove the coach from your team\n` +
      `• Cannot be undone\n\n` +
      `Are you absolutely sure you want to continue?`
    );
    
    if (confirmDelete) {
      try {
        const result = await deleteCoach(id);
        if (result.success) {
          // Success - data will be updated via context
          alert('Coach deleted successfully!');
        } else {
          alert(`Failed to delete coach: ${result.message}`);
        }
      } catch (error) {
        console.error('Error deleting coach:', error);
        alert('An error occurred while deleting the coach. Please try again.');
      }
    }
  };

  const handleUndoDelete = (coachId) => {
    const coachToRestore = deletedCoaches.find(coach => coach.id === coachId);
    if (!coachToRestore) return;

    // Remove from deleted coaches
    setDeletedCoaches(prev => prev.filter(coach => coach.id !== coachId));
    
    // Remove from marked for deletion
    setCoachesMarkedForDeletion(prev => {
      const newSet = new Set(prev);
      newSet.delete(coachId);
      return newSet;
    });
    
    // Restore to local coaches data
    setLocalCoachesData(prev => [...prev, coachToRestore]);
    
    alert(`Coach "${coachToRestore.name}" has been restored.`);
  };

  const handleClearAllDeletions = () => {
    if (deletedCoaches.length === 0) return;
    
    const confirmClear = window.confirm(
      `Are you sure you want to restore all ${deletedCoaches.length} deleted coaches?\n\n` +
      `This will undo all pending deletions.`
    );
    
    if (confirmClear) {
      // Restore all deleted coaches
      setLocalCoachesData(prev => [...prev, ...deletedCoaches]);
      
      // Clear all deletion tracking
      setDeletedCoaches([]);
      setCoachesMarkedForDeletion(new Set());
      
      alert(`All ${deletedCoaches.length} coaches have been restored.`);
    }
  };

  const handleMoveCoach = async (id, direction) => {
    const currentIndex = coachesData.findIndex(coach => coach.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= coachesData.length) return;

    // Create new order array with swapped positions
    const newData = [...coachesData];
    [newData[currentIndex], newData[newIndex]] = [newData[newIndex], newData[currentIndex]];
    
    // Extract just the IDs in the new order
    const coachIds = newData.map(coach => coach.id);

    try {
      const result = await reorderCoaches(coachIds);
      if (!result.success) {
        alert(`Failed to reorder coaches: ${result.message}`);
      }
      // Data will be updated via context on success
    } catch (error) {
      console.error('Error reordering coaches:', error);
      alert('An error occurred while reordering coaches. Please try again.');
    }
  };

  const handleDeployChanges = async () => {
    setIsDeploying(true);
    
    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the global coaches data
      updateCoachesData(localCoachesData);
      
      // Clear the deletion tracking
      setCoachesMarkedForDeletion(new Set());
      setDeletedCoaches([]);
      
      alert('Coaches changes deployed successfully!');
      setHasChanges(false);
    } catch (error) {
      alert('Error deploying changes. Please try again.');
    } finally {
      setIsDeploying(false);
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
            
            {/* Drag & Drop Upload Area */}
            <div className='upload-section'>
              <div 
                className={`upload-area ${dragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className='upload-content'>
                  <div className='upload-icon'>
                    <svg viewBox="0 0 24 24" fill="currentColor" className='upload-icon-svg'>
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </div>
                  <h3 className='upload-title'>Drop coach images here or click to browse</h3>
                  <p className='upload-subtitle'>
                    Supports: JPG, PNG, GIF, WebP • Max size: 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    accept='image/*'
                    onChange={handleFileSelect}
                    className='file-input'
                  />
                </div>
              </div>

              {isUploading && (
                <div className='upload-progress'>
                  <div className='progress-bar'>
                    <div 
                      className='progress-fill' 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className='progress-text'>Uploading... {Math.round(uploadProgress)}%</p>
                </div>
              )}
            </div>

            <div className='upload-divider'>
              <span>OR</span>
            </div>

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
                    Image URL
                  </label>
                  <input
                    type='url'
                    id='new-url'
                    value={newCoach.imgSrc}
                    onChange={(e) => handleNewCoachChange('imgSrc', e.target.value)}
                    className='form-input'
                    placeholder='Enter image URL'
                  />
                </div>
              </div>
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
                Coaches ({localCoachesData.length})
              </h2>
              {localCoachesData.length > 0 && (
                <div className='drag-instructions'>
                  <span className='drag-hint'>💡 Drag coaches to reorder them</span>
                </div>
              )}
            </div>
            
            {localCoachesData.length === 0 ? (
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
                {coachesData.map((coach, index) => (
                  <div
                    key={coach.id}
                    className={`coach-card ${
                      draggedCoachId === coach.id ? 'dragging' : ''
                    }`}

                  >
                    <div className='coach-preview'>
                      <img 
                        src={coach.imgSrc} 
                        alt={coach.name} 
                        className='preview-img'
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xMDAgMTUwQzExMS4wNDYgMTUwIDEyMCAxNDEuMDQ2IDEyMCAxMzBDMTIwIDExOC45NTQgMTExLjA0NiAxMTAgMTAwIDExMEM4OC45NTQgMTEwIDgwIDExOC45NTQgODAgMTMwQzgwIDE0MS4wNDYgODguOTU0IDE1MCAxMDAgMTUwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
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
                                disabled={index === coachesData.length - 1}
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
            {deletedCoaches.length > 0 && (
              <div className='deleted-coaches-section shadowed-box'>
                <div className='deleted-coaches-header'>
                  <h3 className='section-title text-red'>Coaches Marked for Deletion</h3>
                  <button 
                    onClick={handleClearAllDeletions}
                    className='clear-all-deletions-btn'
                    title='Restore all deleted coaches'
                  >
                    Restore All
                  </button>
                </div>
                <p className='deletion-warning'>
                  The following coaches will be permanently deleted when you deploy changes:
                </p>
                <div className='deleted-coaches-list'>
                  {deletedCoaches.map(coach => (
                    <div key={coach.id} className='deleted-coach-item'>
                      <div className='deleted-coach-info'>
                        <img 
                          src={coach.imgSrc} 
                          alt={coach.name} 
                          className='deleted-coach-img'
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xMDAgMTUwQzExMS4wNDYgMTUwIDEyMCAxNDEuMDQ2IDEyMCAxMzBDMTIwIDExOC45NTQgMTExLjA0NiAxMTAgMTAwIDExMEM4OC45NTQgMTEwIDgwIDExOC45NTQgODAgMTMwQzgwIDE0MS4wNDYgODguOTU0IDE1MCAxMDAgMTUwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
                          }}
                        />
                        <div className='deleted-coach-details'>
                          <h4 className='deleted-coach-name'>{coach.name}</h4>
                          {coach.specialty && (
                            <p className='deleted-coach-specialty'>{coach.specialty}</p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleUndoDelete(coach.id)}
                        className='restore-btn'
                        title='Restore this coach'
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button 
              onClick={handleDeployChanges}
              disabled={!hasChanges || isDeploying}
              className='deploy-btn'
            >
              {isDeploying ? 'Deploying Changes...' : 'Deploy Changes!'}
            </button>
            {hasChanges && (
              <div className='changes-notice'>
                <p className='changes-text'>
                  You have unsaved changes. Click "Deploy Changes!" to save them.
                </p>
                {coachesMarkedForDeletion.size > 0 && (
                  <p className='deletion-notice'>
                    ⚠️ {coachesMarkedForDeletion.size} coach(es) marked for deletion
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoachesManager;
