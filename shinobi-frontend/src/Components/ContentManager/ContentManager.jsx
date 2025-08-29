import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContentManager.css';
import logo from '../../assets/logos/logo.png';
import { useContent } from '../../contexts/ContentContext';
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

const ContentManager = () => {
  const navigate = useNavigate();
  const { content, updateContent, resetContent } = useContent();

  const [localContent, setLocalContent] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeSection, setActiveSection] = useState('founder');
  const [toasts, setToasts] = useState([]);
  
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

  // Load content data from context
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Check for changes
  useEffect(() => {
    const hasUnsavedChanges = JSON.stringify(localContent) !== JSON.stringify(content);
    setHasChanges(hasUnsavedChanges);
  }, [localContent, content]);

  const handleBackToDashboard = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) return;
      
      // Reset local data if user confirms leaving
      setLocalContent(content);
      setHasChanges(false);
    }
    navigate('/admin/dashboard');
  };

  const handleInputChange = (section, field, value) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAddAchievement = () => {
    setLocalContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        founderSection: {
          ...prev.about.founderSection,
          achievements: [...prev.about.founderSection.achievements, '']
        }
      }
    }));
  };

  const handleRemoveAchievement = (index) => {
    setLocalContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        founderSection: {
          ...prev.about.founderSection,
          achievements: prev.about.founderSection.achievements.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleDeployChanges = () => {
    setIsDeploying(true);
    
    // Simulate deployment delay
    setTimeout(() => {
      try {
        updateContent(localContent);
        setHasChanges(false);
        addToast('Content updated successfully!');
      } catch (error) {
        console.error('Error updating content data:', error);
        addToast('Failed to update content. Please try again.', 'error');
      } finally {
        setIsDeploying(false);
      }
    }, 1000);
  };

  const handleResetToDefault = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset all content to default values? This action cannot be undone.'
    );
    
    if (confirmReset) {
      resetContent();
      setLocalContent(content);
      setHasChanges(false);
      addToast('Content reset to default values.');
    }
  };

  const renderFounderSection = () => (
    <div className='content-section shadowed-box'>
      <h3 className='subsection-title text-dark'>Founder Section</h3>
      
      <div className='form-group'>
        <label htmlFor='founder-title' className='form-label text-dark'>
          Title
        </label>
        <input
          type='text'
          id='founder-title'
          value={localContent.about.founderSection.title}
          onChange={(e) => handleInputChange('about', 'founderSection', {
            ...localContent.about.founderSection,
            title: e.target.value
          })}
          className='form-input'
          placeholder='e.g., Colin Byrne'
          maxLength={100}
        />
        <small className='char-count'>{localContent.about.founderSection.title.length}/100</small>
      </div>

      <div className='form-group'>
        <label htmlFor='founder-description' className='form-label text-dark'>
          Founder Description
        </label>
        <textarea
          id='founder-description'
          value={localContent.about.founderSection.description}
          onChange={(e) => handleInputChange('about', 'founderSection', {
            ...localContent.about.founderSection,
            description: e.target.value
          })}
          className='form-textarea'
          placeholder='Enter founder description...'
          rows={8}
          maxLength={2000}
        />
        <small className='char-count'>{localContent.about.founderSection.description.length}/2000</small>
      </div>

      <div className='form-group'>
        <label className='form-label text-dark'>
          Achievements & Notable Mentions
        </label>
        <div className='achievements-list'>
          {localContent.about.founderSection.achievements.map((achievement, index) => (
            <div key={index} className='achievement-item'>
              <div className='achievement-bullet'>•</div>
              <textarea
                value={achievement}
                onChange={(e) => {
                  const newAchievements = [...localContent.about.founderSection.achievements];
                  newAchievements[index] = e.target.value;
                  setLocalContent(prev => ({
                    ...prev,
                    about: {
                      ...prev.about,
                      founderSection: {
                        ...prev.about.founderSection,
                        achievements: newAchievements
                      }
                    }
                  }));
                }}
                className='form-textarea achievement-textarea'
                placeholder='Enter achievement...'
                rows={2}
                maxLength={500}
              />
              <button
                type='button'
                onClick={() => handleRemoveAchievement(index)}
                className='remove-achievement-btn'
                title='Remove achievement'
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type='button'
          onClick={handleAddAchievement}
          className='add-achievement-btn'
        >
          + Add Achievement
        </button>
      </div>
    </div>
  );

  const renderCoachesSection = () => (
    <div className='content-section shadowed-box'>
      <h3 className='subsection-title text-dark'>Coaches Section</h3>
      
      <div className='form-group'>
        <label htmlFor='coaches-title' className='form-label text-dark'>
          Section Title
        </label>
        <input
          type='text'
          id='coaches-title'
          value={localContent.about.coachesSection.title}
          onChange={(e) => handleInputChange('about', 'coachesSection', {
            ...localContent.about.coachesSection,
            title: e.target.value
          })}
          className='form-input'
          placeholder='e.g., SHINOBI COACHES'
          maxLength={100}
        />
        <small className='char-count'>{localContent.about.coachesSection.title.length}/100</small>
      </div>

      <div className='form-group'>
        <label htmlFor='coaches-description' className='form-label text-dark'>
          Section Description
        </label>
        <textarea
          id='coaches-description'
          value={localContent.about.coachesSection.description}
          onChange={(e) => handleInputChange('about', 'coachesSection', {
            ...localContent.about.coachesSection,
            description: e.target.value
          })}
          className='form-textarea'
          placeholder='Enter coaches section description...'
          rows={3}
          maxLength={300}
        />
        <small className='char-count'>{localContent.about.coachesSection.description.length}/300</small>
      </div>
    </div>
  );

  const renderAsideSection = () => (
    <div className='content-section shadowed-box'>
      <h3 className='subsection-title text-dark'>Training Camps & Facilities Section</h3>
      
      <div className='form-group'>
        <label htmlFor='aside-title' className='form-label text-dark'>
          Section Title
        </label>
        <input
          type='text'
          id='aside-title'
          value={localContent.about.asideSection.title}
          onChange={(e) => handleInputChange('about', 'asideSection', {
            ...localContent.about.asideSection,
            title: e.target.value
          })}
          className='form-input'
          placeholder='e.g., Training Camps & Facilities'
          maxLength={100}
        />
        <small className='char-count'>{localContent.about.asideSection.title.length}/100</small>
      </div>

      <div className='form-group'>
        <label htmlFor='aside-description' className='form-label text-dark'>
          Description
        </label>
        <textarea
          id='aside-description'
          value={`${localContent.about.asideSection.description}\n\n${localContent.about.founderSection.facilityDescription}`}
          onChange={(e) => {
            const lines = e.target.value.split('\n\n');
            const description = lines[0] || '';
            const facilityDescription = lines.slice(1).join('\n\n') || '';
            
            // Update both sections
            handleInputChange('about', 'asideSection', {
              ...localContent.about.asideSection,
              description: description
            });
            
            handleInputChange('about', 'founderSection', {
              ...localContent.about.founderSection,
              facilityDescription: facilityDescription
            });
          }}
          className='form-textarea'
          placeholder='Enter description...'
          rows={10}
          maxLength={2500}
        />
        <small className='char-count'>{`${localContent.about.asideSection.description}\n\n${localContent.about.founderSection.facilityDescription}`.length}/2500</small>
      </div>
    </div>
  );

  return (
    <div className='content-manager'>
      <header className='manager-header'>
        <div className='manager-header-content'>
          <div className='manager-logo'>
            <img src={logo} alt='Shinobi Academy Logo' className='manager-logo-img' />
            <h1 className='manager-title'>Content Manager</h1>
          </div>
          <button onClick={handleBackToDashboard} className='back-btn'>
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className='manager-main'>
        <div className='manager-container'>
          <div className='section-header'>
            <h2 className='section-title text-red'>Content Management</h2>
            <p className='section-subtitle text-dark'>
              Update text content across your website. Changes will be reflected immediately.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className='content-navigation'>
            <button
              className={`nav-tab ${activeSection === 'founder' ? 'active' : ''}`}
              onClick={() => setActiveSection('founder')}
            >
              Founder Section
            </button>
            <button
              className={`nav-tab ${activeSection === 'coaches' ? 'active' : ''}`}
              onClick={() => setActiveSection('coaches')}
            >
              Coaches Section
            </button>
            <button
              className={`nav-tab ${activeSection === 'aside' ? 'active' : ''}`}
              onClick={() => setActiveSection('aside')}
            >
              Training & Facilities
            </button>
          </div>

          {/* Content Sections */}
          <div className='content-sections'>
            {activeSection === 'founder' && renderFounderSection()}
            {activeSection === 'coaches' && renderCoachesSection()}
            {activeSection === 'aside' && renderAsideSection()}
          </div>

          {/* Action Buttons */}
          <div className='action-buttons'>
            <button 
              onClick={handleDeployChanges} 
              className='btn-primary'
              disabled={!hasChanges || isDeploying}
            >
              {isDeploying ? 'Updating...' : 'Update Content'}
            </button>
            
            <button onClick={handleResetToDefault} className='btn-secondary'>
              Reset to Default
            </button>
          </div>

          {/* Changes Indicator */}
          {hasChanges && (
            <div className='changes-indicator'>
              <p className='changes-text text-dark'>
                ⚠️ You have unsaved changes. Click "Update Content" to save them.
              </p>
            </div>
          )}
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
      </main>
    </div>
  );
};

export default ContentManager;
