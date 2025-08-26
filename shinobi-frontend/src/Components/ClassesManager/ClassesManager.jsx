import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClassesManager.css';
import logo from '../../assets/logos/logo.png';
import { useClasses } from '../../contexts/ClassesContext';

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

const ClassesManager = () => {
  const navigate = useNavigate();
  const { 
    classesData, 
    addClass, 
    updateClass, 
    deleteClass, 
    reorderClasses,
    resetToDefault,
    isLoading,
    error,
    loadClasses
  } = useClasses();
  
  const [localClassesData, setLocalClassesData] = useState(classesData);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClassData, setNewClassData] = useState({
    name: 'New Class',
    description: 'Class description',
    image: '',
    imageType: 'upload',
    order: 0
  });
  const [toasts, setToasts] = useState([]);

  // Toast management
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

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
    if (classId === 'new-class') {
      // Update the new class form data
      setNewClassData(prev => ({ ...prev, [field]: value }));
      return;
    }
    
    // Special handling for order changes to prevent conflicts
    if (field === 'order') {
      handleOrderChange(classId, value);
      return;
    }
    
    setLocalClassesData(prev => 
      prev.map(classItem => 
        classItem.id === classId 
          ? { ...classItem, [field]: value }
          : classItem
      )
    );
  };

  const handleOrderChange = (classId, newOrder) => {
    // Limit order to valid range (1 to total number of classes)
    const maxOrder = localClassesData.length;
    if (newOrder < 1) newOrder = 1;
    if (newOrder > maxOrder) newOrder = maxOrder;

    // Get the current class and its old order
    const currentClass = localClassesData.find(c => c.id === classId);
    if (!currentClass) return;
    
    const oldOrder = currentClass.order;
    
    // If the order hasn't changed, do nothing
    if (oldOrder === newOrder) return;

    setLocalClassesData(prev => {
      const updated = [...prev];
      
      // Update the current class order
      const classIndex = updated.findIndex(c => c.id === classId);
      if (classIndex !== -1) {
        updated[classIndex] = { ...updated[classIndex], order: newOrder };
      }
      
      // Shift other classes to accommodate the order change
      if (oldOrder < newOrder) {
        // Moving to a higher order: shift classes between old and new down by 1
        updated.forEach(classItem => {
          if (classItem.id !== classId && 
              classItem.order > oldOrder && 
              classItem.order <= newOrder) {
            classItem.order = classItem.order - 1;
          }
        });
      } else {
        // Moving to a lower order: shift classes between new and old up by 1
        updated.forEach(classItem => {
          if (classItem.id !== classId && 
              classItem.order >= newOrder && 
              classItem.order < oldOrder) {
            classItem.order = classItem.order + 1;
          }
        });
      }
      
      return updated;
    });
  };

  const resolveOrderConflicts = (classes) => {
    // Remove duplicates first (in case the same class appears multiple times)
    const uniqueClasses = classes.filter((classItem, index, self) => 
      index === self.findIndex(c => c.id === classItem.id)
    );
    
    // Create a map to track used orders
    const usedOrders = new Set();
    const resolvedClasses = [];
    
    // First pass: handle classes with unique orders
    uniqueClasses.forEach(classItem => {
      if (!usedOrders.has(classItem.order)) {
        usedOrders.add(classItem.order);
        resolvedClasses.push({ ...classItem });
      }
    });
    
    // Second pass: handle classes with conflicting orders
    uniqueClasses.forEach(classItem => {
      if (usedOrders.has(classItem.order)) {
        // Find the next available order
        let nextOrder = classItem.order;
        while (usedOrders.has(nextOrder)) {
          nextOrder++;
        }
        usedOrders.add(nextOrder);
        resolvedClasses.push({ ...classItem, order: nextOrder });
      }
    });
    
    // Sort by final order for consistency and return only unique classes
    return resolvedClasses
      .sort((a, b) => a.order - b.order)
      .filter((classItem, index, self) => 
        index === self.findIndex(c => c.id === classItem.id)
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

  const handleAddClass = async () => {
    // New class gets the next available order number
    const newOrder = localClassesData.length + 1;
    
    const newClass = {
      ...newClassData,
      order: newOrder
    };
    
    try {
      const result = await addClass(newClass);
      if (result.success) {
        setShowAddForm(false);
        // Reset new class form data
        setNewClassData({
          name: 'New Class',
          description: 'Class description',
          image: '',
          imageType: 'upload',
          order: 0
        });
        // Local data will be updated via context
        addToast('Class added successfully!', 'success');
      } else {
        addToast(`Failed to add class: ${result.message}`, 'error');
      }
    } catch (error) {
      addToast(`Error adding class: ${error.message}`, 'error');
    }
  };

  const handleUpdateClass = async (classId) => {
    let classToUpdate;
    
    // Handle new class creation
    if (classId === 'new-class') {
      classToUpdate = {
        id: 'new-class',
        ...newClassData,
        order: localClassesData.length + 1
      };
    } else {
      // Handle existing class updates
      classToUpdate = localClassesData.find(c => c.id === classId);
    }
    
    if (classToUpdate) {
      try {
        // Handle new class creation
        if (classId === 'new-class') {
          const result = await addClass(classToUpdate);
          if (result.success) {
            setShowAddForm(false);
            setEditingClass(null);
            // Reset new class form data
            setNewClassData({
              name: 'New Class',
              description: 'Class description',
              image: '',
              imageType: 'upload',
              order: 0
            });
            addToast('Class added successfully!', 'success');
          } else {
            addToast(`Failed to add class: ${result.message}`, 'error');
          }
          return;
        }

        // Handle existing class updates
        const originalClass = classesData.find(c => c.id === classId);
        const isOrderChange = originalClass && originalClass.order !== classToUpdate.order;
        
        if (isOrderChange) {
          // If it's an order change, we need to handle potential conflicts
          // Get all existing classes that might be affected
          const existingClassesToUpdate = localClassesData.filter(classItem => 
            classesData.find(c => c.id === classItem.id)
          );
          
          // Resolve order conflicts
          const orderedClasses = resolveOrderConflicts(existingClassesToUpdate);
          
          // Update all classes together to avoid conflicts
          await reorderClasses(orderedClasses);
          
          // Update local data with resolved orders
          setLocalClassesData(prev => {
            const updated = prev.map(classItem => {
              const resolved = orderedClasses.find(c => c.id === classItem.id);
              return resolved ? { ...classItem, order: resolved.order } : classItem;
            });
            return updated;
          });
          
          setEditingClass(null);
          addToast('Class order updated successfully!', 'success');
        } else {
          // If it's not an order change, just update the single class
          const result = await updateClass(classId, classToUpdate);
          if (result.success) {
            setEditingClass(null);
            // Local data will be updated via context
          } else {
            addToast(`Failed to update class: ${result.message}`, 'error');
          }
        }
      } catch (error) {
        addToast(`Error updating class: ${error.message}`, 'error');
      }
    }
  };

  const handleDeleteClass = async (classId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this class? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      try {
        const result = await deleteClass(classId);
        if (result.success) {
          // Local data will be updated via context
          addToast('Class deleted successfully!', 'success');
        } else {
          addToast(`Failed to delete class: ${result.message}`, 'error');
        }
      } catch (error) {
        addToast(`Error deleting class: ${error.message}`, 'error');
      }
    }
  };

  const handleDeployChanges = async () => {
    setIsDeploying(true);
    
    try {
      // First, handle any new classes that need to be added
      const newClasses = localClassesData.filter(classItem => 
        !classesData.find(c => c.id === classItem.id)
      );
      
      for (const newClass of newClasses) {
        await addClass(newClass);
      }
      
      // Then, handle any classes that need to be deleted
      const classesToDelete = classesData.filter(classItem => 
        !localClassesData.find(c => c.id === classItem.id)
      );
      
      for (const classToDelete of classesToDelete) {
        await deleteClass(classToDelete.id);
      }
      
      // Now handle the reordering logic for existing classes
      const existingClassesToUpdate = localClassesData.filter(classItem => 
        classesData.find(c => c.id === classItem.id)
      );
      
      if (existingClassesToUpdate.length > 0) {
        // Create a properly ordered array by resolving conflicts
        const orderedClasses = resolveOrderConflicts(existingClassesToUpdate);
        
        // Debug: Log what we're sending to the backend
        console.log('Sending to reorderClasses:', orderedClasses);
        console.log('Unique class IDs being sent:', [...new Set(orderedClasses.map(c => c.id))]);
        
        // Update local data with the resolved orders to prevent duplicates
        setLocalClassesData(prev => {
          const updated = prev.map(classItem => {
            const resolved = orderedClasses.find(c => c.id === classItem.id);
            return resolved ? { ...classItem, order: resolved.order } : classItem;
          });
          return updated;
        });
        
        // Use reorderClasses to update all classes with their final orders
        await reorderClasses(orderedClasses);
      }
      
      setHasChanges(false);
      addToast('Classes updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating classes data:', error);
      addToast(`Failed to update classes: ${error.message}`, 'error');
    } finally {
      setIsDeploying(false);
    }
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
      addToast('Classes reset to default!', 'info');
    }
  };

  const renderImageSelector = (classItem) => {
    const isEditing = editingClass === classItem.id || classItem.id === 'new-class';
    
    return (
      <div className="image-selector">
        <div className="image-input-type-selector">
          <label>Image Source:</label>
          <select
            name="imageType"
            value={classItem.imageType || 'upload'}
            onChange={(e) => {
              handleInputChange(classItem.id, 'imageType', e.target.value);
            }}
            disabled={!isEditing}
          >
            <option value="upload">Upload Local Image</option>
            <option value="url">Online Image URL</option>
          </select>
        </div>



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
              name="image"
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
    const isEditing = isNew || editingClass === classItem.id;
    
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
              name="name"
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
              name="description"
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
              <label>Display Order:</label>
              <input
                name="order"
                type="number"
                min="1"
                max={localClassesData.length}
                value={classItem.order}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    handleInputChange(classItem.id, 'order', value);
                  }
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value);
                  if (isNaN(value) || value < 1 || value > localClassesData.length) {
                    // Reset to current order if invalid
                    e.target.value = classItem.order;
                  }
                }}
                disabled={!isEditing}
                placeholder={`Enter display order (1 to ${localClassesData.length})`}
                style={{
                  borderColor: classItem.order < 1 || classItem.order > localClassesData.length ? '#ff6b6b' : '#ddd'
                }}
              />
              <small className="form-help">
                Lower numbers appear first. Valid range: 1 to {localClassesData.length}.
              </small>
            </div>
          </div>

          <small className="form-help">Lower numbers appear first. Order conflicts are automatically resolved by shifting other classes.</small>
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
          {error && (
            <div className='error-message' style={{ 
              background: '#ffebee', 
              color: '#c62828', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              border: '1px solid #ffcdd2'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {isLoading && (
            <div className='loading-message' style={{ 
              background: '#e3f2fd', 
              color: '#1565c0', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              border: '1px solid #bbdefb',
              textAlign: 'center'
            }}>
              Loading classes...
            </div>
          )}

          <div className='welcome-section'>
            <h2 className='welcome-title text-red'>Manage Classes</h2>
            <p className='welcome-subtitle text-dark'>
              Add, edit, delete, and reorder classes. Upload local images or use online URLs.
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
                ...newClassData,
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
                  onClick={() => {
                    setShowAddForm(false);
                    // Reset new class form data
                    setNewClassData({
                      name: 'New Class',
                      description: 'Class description',
                      image: '',
                      imageType: 'upload',
                      order: 0
                    });
                  }}
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
              .sort((a, b) => {
                // During editing, maintain the original order from classesData
                // This prevents jumping around while editing
                const originalA = classesData.find(c => c.id === a.id);
                const originalB = classesData.find(c => c.id === b.id);
                if (originalA && originalB) {
                  return originalA.order - originalB.order;
                }
                return 0;
              })
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

          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ClassesManager;
