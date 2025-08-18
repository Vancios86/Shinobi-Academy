import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClassesManager.css';
import logo from '../../assets/logos/logo.png';
import { useClasses } from '../../contexts/ClassesContext';

const ClassesManager = () => {
  const navigate = useNavigate();
  const { 
    classesData, 
    addClass, 
    updateClass, 
    deleteClass, 
    resetToDefault,
    getAvailableImages 
  } = useClasses();
  
  const [localClassesData, setLocalClassesData] = useState(classesData);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load classes data from context
  useEffect(() => {
    setLocalClassesData(classesData);
  }, [classesData]);

  // Check for changes
  useEffect(() => {
    const hasUnsavedChanges = JSON.stringify(localClassesData) !== JSON.stringify(classesData);
    setHasChanges(hasUnsavedChanges);
  }, [localClassesData, classesData]);

  const handleBackToDashboard = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) return;
      
      // Reset local data if user confirms leaving
      setLocalClassesData(classesData);
      setHasChanges(false);
    }
    navigate('/admin/dashboard');
  };

  const handleInputChange = (classId, field, value) => {
    setLocalClassesData(prev => 
      prev.map(classItem => 
        classItem.id === classId 
          ? { ...classItem, [field]: value }
          : classItem
      )
    );
  };

  const handleImageUpload = (classId, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Store the image as a data URL for now
        // In the future, this would be uploaded to a server/database
        handleInputChange(classId, 'image', e.target.result);
        handleInputChange(classId, 'imageType', 'upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (classId, url) => {
    handleInputChange(classId, 'image', url);
    handleInputChange(classId, 'imageType', 'url');
  };

  const handleAddClass = () => {
    const newClass = {
      id: `class-${Date.now()}-${Math.random()}`,
      name: 'New Class',
      description: 'Class description',
      image: 'mma.webp',
      imageType: 'predefined',
      imagePosition: 'center',
      alignment: 'left',
      speed: 10,
      order: localClassesData.length + 1
    };
    
    setLocalClassesData(prev => [...prev, newClass]);
    setShowAddForm(false);
  };

  const handleUpdateClass = (classId) => {
    const classToUpdate = localClassesData.find(c => c.id === classId);
    if (classToUpdate) {
      updateClass(classId, classToUpdate);
    }
    setEditingClass(null);
  };

  const handleDeleteClass = (classId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this class? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      setLocalClassesData(prev => prev.filter(c => c.id !== classId));
    }
  };

  const handleDeployChanges = () => {
    setIsDeploying(true);
    
    // Simulate deployment delay
    setTimeout(() => {
      try {
        // Apply all local changes to the context
        localClassesData.forEach(classItem => {
          const existingClass = classesData.find(c => c.id === classItem.id);
          if (existingClass) {
            updateClass(classItem.id, classItem);
          } else {
            addClass(classItem);
          }
        });
        
        // Remove classes that were deleted locally
        classesData.forEach(classItem => {
          if (!localClassesData.find(c => c.id === classItem.id)) {
            deleteClass(classItem.id);
          }
        });
        
        setHasChanges(false);
        alert('Classes updated successfully!');
      } catch (error) {
        console.error('Error updating classes data:', error);
        alert('Failed to update classes. Please try again.');
      } finally {
        setIsDeploying(false);
      }
    }, 1000);
  };

  const handleResetToDefault = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset all classes to default values? This action cannot be undone.'
    );
    
    if (confirmReset) {
      resetToDefault();
      setLocalClassesData(classesData);
      setHasChanges(false);
      setEditingClass(null);
      setShowAddForm(false);
    }
  };

  const renderImageSelector = (classItem) => {
    const isEditing = editingClass === classItem.id;
    
    return (
      <div className="image-selector">
        <div className="image-input-type-selector">
          <label>Image Source:</label>
          <select
            value={classItem.imageType || 'predefined'}
            onChange={(e) => {
              handleInputChange(classItem.id, 'imageType', e.target.value);
            }}
            disabled={!isEditing}
          >
            <option value="predefined">Predefined Images</option>
            <option value="upload">Upload Local Image</option>
            <option value="url">Online Image URL</option>
          </select>
        </div>

        {classItem.imageType === 'predefined' && (
          <div className="form-group">
            <label>Background Image:</label>
            <select
              value={classItem.image}
              onChange={(e) => handleInputChange(classItem.id, 'image', e.target.value)}
              disabled={!isEditing}
            >
              {getAvailableImages().map(img => (
                <option key={img} value={img}>{img}</option>
              ))}
            </select>
          </div>
        )}

        {classItem.imageType === 'upload' && (
          <div className="form-group">
            <label>Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(classItem.id, e.target.files[0])}
              disabled={!isEditing}
            />
            <small className="form-help">Supported formats: JPG, PNG, WebP. Max size: 5MB</small>
            {classItem.image && classItem.imageType === 'upload' && (
              <div className="image-preview">
                <img src={classItem.image} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px' }} />
              </div>
            )}
          </div>
        )}

        {classItem.imageType === 'url' && (
          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="url"
              value={classItem.image}
              onChange={(e) => handleImageUrlChange(classItem.id, e.target.value)}
              disabled={!isEditing}
              placeholder="https://example.com/image.jpg"
            />
            <small className="form-help">Enter a valid image URL (JPG, PNG, WebP, etc.)</small>
            {classItem.image && classItem.imageType === 'url' && (
              <div className="image-preview">
                <img src={classItem.image} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px' }} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderClassForm = (classItem, isNew = false) => {
    const isEditing = editingClass === classItem.id;
    
    return (
      <div key={classItem.id} className={`class-form ${isEditing ? 'editing' : ''}`}>
        <div className="class-form-header">
          <h3>{isNew ? 'New Class' : classItem.name}</h3>
          <div className="class-form-actions">
            {isEditing ? (
              <>
                <button 
                  className="btn-save"
                  onClick={() => handleUpdateClass(classItem.id)}
                >
                  Save
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => setEditingClass(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn-edit"
                  onClick={() => setEditingClass(classItem.id)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeleteClass(classItem.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="class-form-content">
          <div className="form-group">
            <label>Class Name:</label>
            <input
              type="text"
              value={classItem.name}
              onChange={(e) => handleInputChange(classItem.id, 'name', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter class name"
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={classItem.description}
              onChange={(e) => handleInputChange(classItem.id, 'description', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter class description"
              rows="3"
            />
          </div>

          {renderImageSelector(classItem)}

          <div className="form-row">
            <div className="form-group">
              <label>Image Position:</label>
              <select
                value={classItem.imagePosition}
                onChange={(e) => handleInputChange(classItem.id, 'imagePosition', e.target.value)}
                disabled={!isEditing}
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="18%">18%</option>
                <option value="66%">66%</option>
                <option value="11%">11%</option>
              </select>
            </div>

            <div className="form-group">
              <label>Text Alignment:</label>
              <select
                value={classItem.alignment}
                onChange={(e) => handleInputChange(classItem.id, 'alignment', e.target.value)}
                disabled={!isEditing}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Parallax Speed:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={classItem.speed}
                onChange={(e) => handleInputChange(classItem.id, 'speed', parseInt(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Display Order:</label>
              <input
                type="number"
                min="1"
                value={classItem.order}
                onChange={(e) => handleInputChange(classItem.id, 'order', parseInt(e.target.value))}
                disabled={!isEditing}
                placeholder="Enter display order (1, 2, 3...)"
              />
            </div>
          </div>

          <small className="form-help">Lower numbers appear first. Classes with the same order will be sorted alphabetically.</small>
        </div>
      </div>
    );
  };

  return (
    <div className='classes-manager'>
      <header className='manager-header'>
        <div className='manager-header-content'>
          <div className='manager-logo'>
            <img src={logo} alt='Shinobi Academy Logo' className='manager-logo-img' />
            <h1 className='manager-title'>Classes Manager</h1>
          </div>
          <button onClick={handleBackToDashboard} className='back-btn'>
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className='manager-main'>
        <div className='manager-container'>
          <div className='welcome-section'>
            <h2 className='welcome-title text-red'>Manage Classes</h2>
            <p className='welcome-subtitle text-dark'>
              Add, edit, delete, and reorder classes. Choose from predefined images, upload local files, or use online URLs.
            </p>
          </div>

          <div className='manager-actions'>
            <button 
              className='btn-primary'
              onClick={() => setShowAddForm(true)}
            >
              + Add New Class
            </button>
            
            <button 
              className='btn-secondary'
              onClick={handleResetToDefault}
            >
              Reset to Default
            </button>
          </div>

          {showAddForm && (
            <div className='add-class-section'>
              <h3>Add New Class</h3>
              {renderClassForm({
                id: 'new-class',
                name: 'New Class',
                description: 'Class description',
                image: 'mma.webp',
                imageType: 'predefined',
                imagePosition: 'center',
                alignment: 'left',
                speed: 10,
                order: localClassesData.length + 1
              }, true)}
              <div className='add-class-actions'>
                <button 
                  className='btn-primary'
                  onClick={handleAddClass}
                >
                  Add Class
                </button>
                <button 
                  className='btn-secondary'
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className='classes-list'>
            <h3>Existing Classes</h3>
            <p className='order-instruction'>Change the display order numbers to reorder classes. Lower numbers appear first.</p>
            
            {localClassesData
              .sort((a, b) => a.order - b.order)
              .map((classItem) => (
                <div key={classItem.id} className='class-item'>
                  {renderClassForm(classItem)}
                </div>
              ))}
          </div>

          {hasChanges && (
            <div className='deploy-section'>
              <div className='deploy-warning'>
                <p>⚠️ You have unsaved changes</p>
              </div>
              <button 
                className='btn-deploy'
                onClick={handleDeployChanges}
                disabled={isDeploying}
              >
                {isDeploying ? 'Updating...' : 'Update Classes'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClassesManager;
