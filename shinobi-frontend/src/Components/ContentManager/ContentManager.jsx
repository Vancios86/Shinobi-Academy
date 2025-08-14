import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContentManager.css';
import logo from '../../assets/logos/logo.png';
import { useContent } from '../../contexts/ContentContext';

const ContentManager = () => {
  const navigate = useNavigate();
  const { contentData, updateContentData, resetToDefault } = useContent();
  const [localContentData, setLocalContentData] = useState(contentData);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeSection, setActiveSection] = useState('founder');

  // Load content data from context
  useEffect(() => {
    setLocalContentData(contentData);
  }, [contentData]);

  // Check for changes
  useEffect(() => {
    const hasUnsavedChanges = JSON.stringify(localContentData) !== JSON.stringify(contentData);
    setHasChanges(hasUnsavedChanges);
  }, [localContentData, contentData]);

  const handleBackToDashboard = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) return;
      
      // Reset local data if user confirms leaving
      setLocalContentData(contentData);
      setHasChanges(false);
    }
    navigate('/admin/dashboard');
  };

  const handleInputChange = (section, field, value) => {
    setLocalContentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAddAchievement = () => {
    setLocalContentData(prev => ({
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
    setLocalContentData(prev => ({
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
        updateContentData(localContentData);
        setHasChanges(false);
        alert('Content updated successfully!');
      } catch (error) {
        console.error('Error updating content data:', error);
        alert('Failed to update content. Please try again.');
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
      resetToDefault();
      setLocalContentData(contentData);
      setHasChanges(false);
      alert('Content reset to default values.');
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
          value={localContentData.about.founderSection.title}
          onChange={(e) => handleInputChange('about', 'founderSection', {
            ...localContentData.about.founderSection,
            title: e.target.value
          })}
          className='form-input'
          placeholder='e.g., Colin Byrne'
          maxLength={100}
        />
        <small className='char-count'>{localContentData.about.founderSection.title.length}/100</small>
      </div>

      <div className='form-group'>
        <label htmlFor='founder-description' className='form-label text-dark'>
          Founder Description
        </label>
        <textarea
          id='founder-description'
          value={localContentData.about.founderSection.description}
          onChange={(e) => handleInputChange('about', 'founderSection', {
            ...localContentData.about.founderSection,
            description: e.target.value
          })}
          className='form-textarea'
          placeholder='Enter founder description...'
          rows={8}
          maxLength={2000}
        />
        <small className='char-count'>{localContentData.about.founderSection.description.length}/2000</small>
      </div>

      <div className='form-group'>
        <label className='form-label text-dark'>
          Achievements & Notable Mentions
        </label>
        <div className='achievements-list'>
          {localContentData.about.founderSection.achievements.map((achievement, index) => (
            <div key={index} className='achievement-item'>
              <div className='achievement-bullet'>•</div>
              <textarea
                value={achievement}
                onChange={(e) => {
                  const newAchievements = [...localContentData.about.founderSection.achievements];
                  newAchievements[index] = e.target.value;
                  setLocalContentData(prev => ({
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
          value={localContentData.about.coachesSection.title}
          onChange={(e) => handleInputChange('about', 'coachesSection', {
            ...localContentData.about.coachesSection,
            title: e.target.value
          })}
          className='form-input'
          placeholder='e.g., SHINOBI COACHES'
          maxLength={100}
        />
        <small className='char-count'>{localContentData.about.coachesSection.title.length}/100</small>
      </div>

      <div className='form-group'>
        <label htmlFor='coaches-description' className='form-label text-dark'>
          Section Description
        </label>
        <textarea
          id='coaches-description'
          value={localContentData.about.coachesSection.description}
          onChange={(e) => handleInputChange('about', 'coachesSection', {
            ...localContentData.about.coachesSection,
            description: e.target.value
          })}
          className='form-textarea'
          placeholder='Enter coaches section description...'
          rows={3}
          maxLength={300}
        />
        <small className='char-count'>{localContentData.about.coachesSection.description.length}/300</small>
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
          value={localContentData.about.asideSection.title}
          onChange={(e) => handleInputChange('about', 'asideSection', {
            ...localContentData.about.asideSection,
            title: e.target.value
          })}
          className='form-input'
          placeholder='e.g., Training Camps & Facilities'
          maxLength={100}
        />
        <small className='char-count'>{localContentData.about.asideSection.title.length}/100</small>
      </div>

      <div className='form-group'>
        <label htmlFor='aside-description' className='form-label text-dark'>
          Description
        </label>
        <textarea
          id='aside-description'
          value={`${localContentData.about.asideSection.description}\n\n${localContentData.about.founderSection.facilityDescription}`}
          onChange={(e) => {
            const lines = e.target.value.split('\n\n');
            const description = lines[0] || '';
            const facilityDescription = lines.slice(1).join('\n\n') || '';
            
            // Update both sections
            handleInputChange('about', 'asideSection', {
              ...localContentData.about.asideSection,
              description: description
            });
            
            handleInputChange('about', 'founderSection', {
              ...localContentData.about.founderSection,
              facilityDescription: facilityDescription
            });
          }}
          className='form-textarea'
          placeholder='Enter description...'
          rows={10}
          maxLength={2500}
        />
        <small className='char-count'>{`${localContentData.about.asideSection.description}\n\n${localContentData.about.founderSection.facilityDescription}`.length}/2500</small>
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
              className={`deploy-btn ${!hasChanges ? 'disabled' : ''}`}
              disabled={!hasChanges || isDeploying}
            >
              {isDeploying ? 'Updating...' : 'Update Content'}
            </button>
            
            <button onClick={handleResetToDefault} className='reset-btn'>
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
      </main>
    </div>
  );
};

export default ContentManager;
