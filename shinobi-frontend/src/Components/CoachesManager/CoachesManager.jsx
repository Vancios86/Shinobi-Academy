import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CoachesManager.css';
import logo from '../../assets/logos/logo.png';
import { useCoaches } from '../../contexts/CoachesContext';

const CoachesManager = () => {
  const navigate = useNavigate();
  const { coachesData, updateCoachesData, clearCoaches } = useCoaches();
  const [localCoachesData, setLocalCoachesData] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCoach, setNewCoach] = useState({
    name: '',
    imgSrc: '',
    description: '',
    specialty: ''
  });

  // Load initial coaches data - start with empty coaches
  useEffect(() => {
    setLocalCoachesData([]);
  }, []);

  // Check for changes
  useEffect(() => {
    const hasUnsavedChanges = localCoachesData.length > 0;
    setHasChanges(hasUnsavedChanges);
  }, [localCoachesData]);

  const handleBackToDashboard = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    navigate('/dashboard');
  };

  const handleAddCoach = () => {
    if (!newCoach.name || !newCoach.imgSrc) {
      alert('Please fill in both name and image URL');
      return;
    }

    const newId = Math.max(...localCoachesData.map(coach => coach.id), 0) + 1;
    const coachToAdd = {
      id: newId,
      name: newCoach.name,
      imgSrc: newCoach.imgSrc,
      description: newCoach.description || '',
      specialty: newCoach.specialty || ''
    };

    setLocalCoachesData([...localCoachesData, coachToAdd]);
    setNewCoach({ name: '', imgSrc: '', description: '', specialty: '' });
  };

  const handleEditCoach = (id) => {
    setEditingId(id);
  };

  const handleSaveEdit = (id) => {
    const updatedData = localCoachesData.map(coach => 
      coach.id === id ? { ...coach, name: coach.name, description: coach.description, specialty: coach.specialty } : coach
    );
    setLocalCoachesData(updatedData);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteCoach = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this coach?');
    if (confirmDelete) {
      setLocalCoachesData(localCoachesData.filter(coach => coach.id !== id));
    }
  };

  const handleMoveCoach = (id, direction) => {
    const currentIndex = localCoachesData.findIndex(coach => coach.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= localCoachesData.length) return;

    const newData = [...localCoachesData];
    [newData[currentIndex], newData[newIndex]] = [newData[newIndex], newData[currentIndex]];
    setLocalCoachesData(newData);
  };

  const handleDeployChanges = async () => {
    setIsDeploying(true);
    
    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the global coaches data
      updateCoachesData(localCoachesData);
      
      alert('Coaches changes deployed successfully!');
      setHasChanges(false);
    } catch (error) {
      alert('Error deploying changes. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setLocalCoachesData(localCoachesData.map(coach => 
      coach.id === id ? { ...coach, [field]: value } : coach
    ));
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
          {/* Add New Coach Section */}
          <div className='add-coach-section shadowed-box'>
            <h2 className='section-title text-red'>Add New Coach</h2>
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
                  />
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
                  />
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
                  />
                </div>
              </div>
              <button onClick={handleAddCoach} className='add-btn'>
                Add Coach
              </button>
            </div>
          </div>

          {/* Coaches Section */}
          <div className='coaches-section'>
            <h2 className='section-title text-red'>
              Coaches ({localCoachesData.length})
            </h2>
            
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
                {localCoachesData.map((coach, index) => (
                  <div key={coach.id} className='coach-card shadowed-box'>
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
                            value={coach.name}
                            onChange={(e) => handleInputChange(coach.id, 'name', e.target.value)}
                            className='edit-input'
                            placeholder='Coach name'
                          />
                          <input
                            type='text'
                            value={coach.specialty || ''}
                            onChange={(e) => handleInputChange(coach.id, 'specialty', e.target.value)}
                            className='edit-input'
                            placeholder='Specialty'
                          />
                          <textarea
                            value={coach.description || ''}
                            onChange={(e) => handleInputChange(coach.id, 'description', e.target.value)}
                            className='edit-textarea'
                            placeholder='Add description...'
                            rows='2'
                          />
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
                                disabled={index === localCoachesData.length - 1}
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

export default CoachesManager;
