import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContentManager.css';
import logo from '../../assets/logos/logo.png';
import { useContent } from '../../contexts/ContentContext';
import { useScrollToTopOnMount } from '../../hooks/useScrollToTop';
import ConfirmationModal from '../Common/ConfirmationModal';

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
  const { contentData, updateContentData, resetToOriginal, isLoaded } = useContent();

  const [localContent, setLocalContent] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [showResetModal, setShowResetModal] = useState(false);
  const [imageSourceType, setImageSourceType] = useState('asset'); // Track image source type
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
    if (isLoaded && contentData) {
      setLocalContent(contentData);

      // Detect image source type
      const facilitiesImage = contentData.about?.asideSection?.facilitiesImage;
      if (facilitiesImage?.startsWith('http')) {
        setImageSourceType('url');
      } else if (facilitiesImage?.startsWith('data:')) {
        setImageSourceType('upload');
      } else {
        setImageSourceType('asset');
      }
    }
  }, [contentData, isLoaded]);

  // Check for changes
  useEffect(() => {
    if (isLoaded && contentData) {
      const hasUnsavedChanges = JSON.stringify(localContent) !== JSON.stringify(contentData);
      setHasChanges(hasUnsavedChanges);
    }
  }, [localContent, contentData, isLoaded]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && showResetModal) {
        setShowResetModal(false);
      }
    };

    if (showResetModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showResetModal]);

  const handleBackToDashboard = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) return;

      // Reset local data if user confirms leaving
      setLocalContent(contentData);
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
    const currentAchievements = localContent.about?.founderSection?.achievements || [];

    // Check if the last achievement is empty
    const lastAchievement = currentAchievements[currentAchievements.length - 1];
    if (lastAchievement !== undefined && (!lastAchievement || lastAchievement.trim() === '')) {
      addToast('Please fill in the current achievement before adding a new one.', 'warning');
      return;
    }

    setLocalContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        founderSection: {
          ...prev.about?.founderSection,
          achievements: [...(prev.about?.founderSection?.achievements || []), '']
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
          ...prev.about?.founderSection,
          achievements: (prev.about?.founderSection?.achievements || []).filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleDeployChanges = async () => {
    setIsDeploying(true);

    try {
      // Filter out empty achievements before saving
      const achievements = localContent.about?.founderSection?.achievements || [];
      const filteredAchievements = achievements.filter(achievement =>
        achievement && achievement.trim() !== ''
      );

      // Update local content with filtered achievements
      const contentToSave = {
        ...localContent,
        about: {
          ...localContent.about,
          founderSection: {
            ...localContent.about?.founderSection,
            achievements: filteredAchievements
          }
        }
      };

      await updateContentData(contentToSave);
      setLocalContent(contentToSave); // Update local state with filtered data
      setHasChanges(false);
      addToast('Content updated successfully!');
    } catch (error) {
      console.error('Error updating content data:', error);
      // Show more specific error message
      const errorMessage = error.message || 'Failed to update content. Please try again.';
      addToast(errorMessage, 'error');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleResetToOriginal = () => {
    setShowResetModal(true);
  };

  const handleResetConfirm = async () => {
    setShowResetModal(false);
    try {
      const result = await resetToOriginal();
      if (result.success) {
        setLocalContent(contentData);
        setHasChanges(false);
        addToast(result.message, 'success');
      } else {
        addToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Error resetting content:', error);
      addToast('Failed to reset content. Please try again.', 'error');
    }
  };

  const handleResetCancel = () => {
    setShowResetModal(false);
  };

  // Don't render until data is loaded
  if (!isLoaded || !localContent.about) {
    return (
      <div className='content-manager'>
        <div className='loading-message'>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

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
          value={localContent.about?.founderSection?.title || ''}
          onChange={(e) => handleInputChange('about', 'founderSection', {
            ...localContent.about?.founderSection,
            title: e.target.value
          })}
          className='form-input'
          placeholder='e.g., Colin Byrne'
          maxLength={100}
        />
        <small className='char-count'>{(localContent.about?.founderSection?.title || '').length}/100</small>
      </div>

      <div className='form-group'>
        <label htmlFor='founder-description' className='form-label text-dark'>
          Founder Description
        </label>
        <textarea
          id='founder-description'
          value={localContent.about?.founderSection?.description || ''}
          onChange={(e) => handleInputChange('about', 'founderSection', {
            ...localContent.about?.founderSection,
            description: e.target.value
          })}
          className='form-textarea'
          placeholder='Enter founder description...'
          rows={8}
          maxLength={2000}
        />
        <small className='char-count'>{(localContent.about?.founderSection?.description || '').length}/2000</small>
      </div>

      <div className='form-group'>
        <label className='form-label text-dark'>
          Achievements & Notable Mentions
        </label>
        <div className='achievements-list'>
          {(localContent.about?.founderSection?.achievements || []).map((achievement, index) => (
            <div key={index} className='achievement-item'>
              <div className='achievement-bullet'>•</div>
              <textarea
                value={achievement}
                onChange={(e) => {
                  const newAchievements = [...(localContent.about?.founderSection?.achievements || [])];
                  newAchievements[index] = e.target.value;
                  setLocalContent(prev => ({
                    ...prev,
                    about: {
                      ...prev.about,
                      founderSection: {
                        ...prev.about?.founderSection,
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
                −
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
          value={localContent.about?.asideSection?.title || ''}
          onChange={(e) => handleInputChange('about', 'asideSection', {
            ...localContent.about?.asideSection,
            title: e.target.value
          })}
          className='form-input'
          placeholder='e.g., Training Camps & Facilities'
          maxLength={100}
        />
        <small className='char-count'>{(localContent.about?.asideSection?.title || '').length}/100</small>
      </div>

      <div className='form-group'>
        <label htmlFor='aside-description' className='form-label text-dark'>
          Description
        </label>
        <textarea
          id='aside-description'
          value={`${localContent.about?.asideSection?.description || ''}\n\n${localContent.about?.founderSection?.facilityDescription || ''}`}
          onChange={(e) => {
            const lines = e.target.value.split('\n\n');
            const description = lines[0] || '';
            const facilityDescription = lines.slice(1).join('\n\n') || '';

            // Update both sections
            handleInputChange('about', 'asideSection', {
              ...localContent.about?.asideSection,
              description: description
            });

            handleInputChange('about', 'founderSection', {
              ...localContent.about?.founderSection,
              facilityDescription: facilityDescription
            });
          }}
          className='form-textarea'
          placeholder='Enter description...'
          rows={10}
          maxLength={2500}
        />
        <small className='char-count'>{`${localContent.about?.asideSection?.description || ''}\n\n${localContent.about?.founderSection?.facilityDescription || ''}`.length}/2500</small>
      </div>

      <div className='form-group'>
        <label className='form-label text-dark'>
          Facilities Image
        </label>

        {/* Image Source Type Selector */}
        <div className='image-source-selector'>
          <div className='source-options'>
            <label className='radio-option'>
              <input
                type='radio'
                name='imageSource'
                value='asset'
                checked={imageSourceType === 'asset'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setImageSourceType('asset');
                    handleInputChange('about', 'asideSection', {
                      ...localContent.about?.asideSection,
                      facilitiesImage: 'shinobi-view.webp'
                    });
                  }
                }}
              />
              <span>Asset Library</span>
            </label>
            <label className='radio-option'>
              <input
                type='radio'
                name='imageSource'
                value='url'
                checked={imageSourceType === 'url'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setImageSourceType('url');
                    handleInputChange('about', 'asideSection', {
                      ...localContent.about?.asideSection,
                      facilitiesImage: ''
                    });
                  }
                }}
              />
              <span>URL</span>
            </label>
            <label className='radio-option'>
              <input
                type='radio'
                name='imageSource'
                value='upload'
                checked={imageSourceType === 'upload'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setImageSourceType('upload');
                    handleInputChange('about', 'asideSection', {
                      ...localContent.about?.asideSection,
                      facilitiesImage: ''
                    });
                  }
                }}
              />
              <span>Upload File</span>
            </label>
          </div>
        </div>

        {/* Asset Library Selector */}
        {imageSourceType === 'asset' && (
          <select
            value={localContent.about?.asideSection?.facilitiesImage || 'shinobi-view.webp'}
            onChange={(e) => handleInputChange('about', 'asideSection', {
              ...localContent.about?.asideSection,
              facilitiesImage: e.target.value
            })}
            className='form-input'
          >
            <option value='shinobi-view.webp'>Shinobi View (Default)</option>
            <option value='colin.webp'>Colin Image</option>
            <option value='top-image.webp'>Top Image</option>
            <option value='camps-background.webp'>Camps Background</option>
          </select>
        )}

        {/* URL Input */}
        {imageSourceType === 'url' && (
          <div className='url-input-container'>
            <input
              type='url'
              value={localContent.about?.asideSection?.facilitiesImage || ''}
              onChange={(e) => handleInputChange('about', 'asideSection', {
                ...localContent.about?.asideSection,
                facilitiesImage: e.target.value
              })}
              className='form-input'
              placeholder='Enter image URL (e.g., https://example.com/image.jpg)'
            />
            {localContent.about?.asideSection?.facilitiesImage?.startsWith('http') && (
              <div className='url-image-preview'>
                <img
                  src={localContent.about?.asideSection?.facilitiesImage}
                  alt='URL preview'
                  className='preview-image'
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className='preview-error' style={{ display: 'none' }}>
                  <span className='error-icon'>⚠️</span>
                  <small className='error-text'>Unable to load image from URL</small>
                </div>
                <small className='preview-text'>URL image preview</small>
              </div>
            )}
          </div>
        )}

        {/* File Upload */}
        {imageSourceType === 'upload' && (
          <div className='file-upload-container'>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageSourceType('upload');
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    handleInputChange('about', 'asideSection', {
                      ...localContent.about?.asideSection,
                      facilitiesImage: event.target.result
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className='file-input'
              id='facilities-image-upload'
            />
            <label htmlFor='facilities-image-upload' className='file-upload-label'>
              <span className='upload-icon'>📁</span>
              <span>Choose Image File</span>
            </label>
            {localContent.about?.asideSection?.facilitiesImage?.startsWith('data:') && (
              <div className='uploaded-image-preview'>
                <img
                  src={localContent.about?.asideSection?.facilitiesImage}
                  alt='Uploaded preview'
                  className='preview-image'
                />
                <small className='preview-text'>Uploaded image preview</small>
              </div>
            )}
          </div>
        )}

        <small className='form-help'>
          Choose from asset library, enter a URL, or upload your own image file
        </small>
      </div>

      <div className='form-group'>
        <label htmlFor='view-description' className='form-label text-dark'>
          Image Caption
        </label>
        <textarea
          id='view-description'
          value={localContent.about?.asideSection?.viewDescription || ''}
          onChange={(e) => handleInputChange('about', 'asideSection', {
            ...localContent.about?.asideSection,
            viewDescription: e.target.value
          })}
          className='form-textarea'
          placeholder='Enter image caption...'
          rows={3}
          maxLength={500}
        />
        <small className='char-count'>{(localContent.about?.asideSection?.viewDescription || '').length}/500</small>
      </div>
    </div>
  );

  const renderAboutGroup = () => (
    <>
      {renderFounderSection()}
      {renderCoachesSection()}
      {renderAsideSection()}
    </>
  );

  const renderTopPageSection = () => (
    <div className='content-section shadowed-box'>
      <h3 className='subsection-title text-dark'>Top Page</h3>
      <div className='form-group'>
        <label htmlFor='top-hero-subtitle' className='form-label text-dark'>Main Subtitle</label>
        <textarea
          id='top-hero-subtitle'
          value={localContent.topPage?.heroSubtitle || ''}
          onChange={(e) => setLocalContent(prev => ({
            ...prev,
            topPage: { ...(prev.topPage || {}), heroSubtitle: e.target.value }
          }))}
          className='form-textarea'
          placeholder='Enter hero subtitle...'
          rows={3}
          maxLength={300}
        />
        <small className='char-count'>{(localContent.topPage?.heroSubtitle || '').length}/300</small>
      </div>

      <div className='form-group'>
        <label className='form-label text-dark'>Main Image</label>

        <div className='image-source-selector'>
          <div className='source-options'>
            <label className='radio-option'>
              <input
                type='radio'
                name='topImageSource'
                value='asset'
                checked={(localContent.topPage?.imageSourceType || 'asset') === 'asset'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setLocalContent(prev => ({
                      ...prev,
                      topPage: { ...(prev.topPage || {}), imageSourceType: 'asset', heroBackgroundImage: 'top-image.webp' }
                    }));
                  }
                }}
              />
              <span>Asset Library</span>
            </label>
            <label className='radio-option'>
              <input
                type='radio'
                name='topImageSource'
                value='url'
                checked={(localContent.topPage?.imageSourceType || 'asset') === 'url'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setLocalContent(prev => ({
                      ...prev,
                      topPage: { ...(prev.topPage || {}), imageSourceType: 'url', heroBackgroundImage: '' }
                    }));
                  }
                }}
              />
              <span>URL</span>
            </label>
            <label className='radio-option'>
              <input
                type='radio'
                name='topImageSource'
                value='upload'
                checked={(localContent.topPage?.imageSourceType || 'asset') === 'upload'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setLocalContent(prev => ({
                      ...prev,
                      topPage: { ...(prev.topPage || {}), imageSourceType: 'upload', heroBackgroundImage: '' }
                    }));
                  }
                }}
              />
              <span>Upload File</span>
            </label>
          </div>
        </div>

        {(!localContent.topPage?.imageSourceType || localContent.topPage?.imageSourceType === 'asset') && (
          <select
            value={localContent.topPage?.heroBackgroundImage || 'top-image.webp'}
            onChange={(e) => setLocalContent(prev => ({
              ...prev,
              topPage: { ...(prev.topPage || {}), heroBackgroundImage: e.target.value }
            }))}
            className='form-input'
          >
            <option value='top-image.webp'>Top Image (Default)</option>
            <option value='shinobi-view.webp'>Shinobi View</option>
            <option value='camps-background.webp'>Camps Background</option>
            <option value='colin.webp'>Colin Image</option>
          </select>
        )}

        {localContent.topPage?.imageSourceType === 'url' && (
          <div className='url-input-container'>
            <input
              type='url'
              value={localContent.topPage?.heroBackgroundImage || ''}
              onChange={(e) => setLocalContent(prev => ({
                ...prev,
                topPage: { ...(prev.topPage || {}), heroBackgroundImage: e.target.value }
              }))}
              className='form-input'
              placeholder='Enter image URL (e.g., https://example.com/image.jpg)'
            />
            {localContent.topPage?.heroBackgroundImage?.startsWith('http') && (
              <div className='url-image-preview'>
                <img
                  src={localContent.topPage?.heroBackgroundImage}
                  alt='URL preview'
                  className='preview-image'
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className='preview-error' style={{ display: 'none' }}>
                  <span className='error-icon'>⚠️</span>
                  <small className='error-text'>Unable to load image from URL</small>
                </div>
                <small className='preview-text'>URL image preview</small>
              </div>
            )}
          </div>
        )}

        {localContent.topPage?.imageSourceType === 'upload' && (
          <div className='file-upload-container'>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setLocalContent(prev => ({
                      ...prev,
                      topPage: { ...(prev.topPage || {}), heroBackgroundImage: event.target.result }
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className='file-input'
              id='top-hero-image-upload'
            />
            <label htmlFor='top-hero-image-upload' className='file-upload-label'>
              <span className='upload-icon'>📁</span>
              <span>Choose Image File</span>
            </label>
            {localContent.topPage?.heroBackgroundImage?.startsWith('data:') && (
              <div className='uploaded-image-preview'>
                <img src={localContent.topPage?.heroBackgroundImage} alt='Uploaded preview' className='preview-image' />
                <small className='preview-text'>Uploaded image preview</small>
              </div>
            )}
          </div>
        )}
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
              className={`nav-tab ${activeSection === 'top' ? 'active' : ''}`}
              onClick={() => setActiveSection('top')}
            >
              Top Page
            </button>
            <button
              className={`nav-tab ${activeSection === 'about' ? 'active' : ''}`}
              onClick={() => setActiveSection('about')}
            >
              About Page
            </button>
          </div>

          {/* Content Sections */}
          <div className='content-sections'>
            {activeSection === 'about' && renderAboutGroup()}
            {activeSection === 'top' && renderTopPageSection()}
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

            <button onClick={handleResetToOriginal} className='btn-secondary'>
              Reset to Original
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

      <ConfirmationModal
        isOpen={showResetModal}
        title="Confirm Reset"
        message="Are you sure you want to reset all content to the original session state from when you logged in? This action cannot be undone."
        onConfirm={handleResetConfirm}
        onCancel={handleResetCancel}
        confirmText="Reset"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

export default ContentManager;
