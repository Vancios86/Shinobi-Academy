import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactManager.css';
import logo from '../../assets/logos/logo.png';
import { useContact } from '../../contexts/ContactContext';

const ContactManager = () => {
  const navigate = useNavigate();
  const { contactData, updateContactData, resetToDefault } = useContact();
  const [localContactData, setLocalContactData] = useState(contactData);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  // Load contact data from context
  useEffect(() => {
    setLocalContactData(contactData);
  }, [contactData]);

  // Check for changes
  useEffect(() => {
    const hasUnsavedChanges = JSON.stringify(localContactData) !== JSON.stringify(contactData);
    setHasChanges(hasUnsavedChanges);
  }, [localContactData, contactData]);

  const handleBackToDashboard = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) return;
      
      // Reset local data if user confirms leaving
      setLocalContactData(contactData);
      setHasChanges(false);
    }
    navigate('/admin/dashboard');
  };

  const handleInputChange = (section, field, value) => {
    setLocalContactData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSocialMediaChange = (platform, field, value) => {
    setLocalContactData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: {
          ...prev.socialMedia[platform],
          [field]: value
        }
      }
    }));
  };

  const handleAddressChange = (field, value) => {
    setLocalContactData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleBusinessHoursChange = (day, value) => {
    setLocalContactData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: value
      }
    }));
  };

  const handleDeployChanges = () => {
    setIsDeploying(true);
    
    // Simulate deployment delay
    setTimeout(() => {
      try {
        updateContactData(localContactData);
        setHasChanges(false);
        alert('Contact information updated successfully!');
      } catch (error) {
        console.error('Error updating contact data:', error);
        alert('Failed to update contact information. Please try again.');
      } finally {
        setIsDeploying(false);
      }
    }, 1000);
  };

  const handleResetToDefault = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset all contact information to default values? This action cannot be undone.'
    );
    
    if (confirmReset) {
      resetToDefault();
      setLocalContactData(contactData);
      setHasChanges(false);
      alert('Contact information reset to default values.');
    }
  };

  // Update full address whenever address components change
  useEffect(() => {
    const street = localContactData.address.street;
    const city = localContactData.address.city;
    const postalCode = localContactData.address.postalCode;
    const country = localContactData.address.country;
    const currentFull = localContactData.address.full;
    
    const newFullAddress = `${street}, ${postalCode} ${city}, ${country}`;
    
    // Only update if the full address has actually changed
    if (currentFull !== newFullAddress) {
      setLocalContactData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          full: newFullAddress
        }
      }));
    }
  }, [localContactData.address.street, localContactData.address.city, localContactData.address.postalCode, localContactData.address.country, localContactData.address.full]);

  return (
    <div className='contact-manager'>
      <header className='manager-header'>
        <div className='manager-header-content'>
          <div className='manager-logo'>
            <img src={logo} alt='Shinobi Academy Logo' className='manager-logo-img' />
            <h1 className='manager-title'>Contact Manager</h1>
          </div>
          <button onClick={handleBackToDashboard} className='back-btn'>
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className='manager-main'>
        <div className='manager-container'>
          <div className='section-header'>
            <h2 className='section-title text-red'>Contact Information Management</h2>
            <p className='section-subtitle text-dark'>
              Update your contact details, address, and social media links. Changes will be reflected across the website.
            </p>
          </div>

          {/* Contact Details Section */}
          <div className='contact-section shadowed-box'>
            <h3 className='subsection-title text-dark'>Contact Details</h3>
            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='phone-display' className='form-label text-dark'>
                  Phone Number (Display)
                </label>
                <input
                  type='text'
                  id='phone-display'
                  value={localContactData.phone.display}
                  onChange={(e) => handleInputChange('phone', 'display', e.target.value)}
                  className='form-input'
                  placeholder='e.g., (+351) 977 777 777'
                  maxLength={25}
                />
                <small className='char-count'>{localContactData.phone.display.length}/25</small>
              </div>
              <div className='form-group'>
                <label htmlFor='phone-value' className='form-label text-dark'>
                  Phone Number (Clickable)
                </label>
                <input
                  type='tel'
                  id='phone-value'
                  value={localContactData.phone.value}
                  onChange={(e) => handleInputChange('phone', 'value', e.target.value)}
                  className='form-input'
                  placeholder='e.g., +351977777777'
                  maxLength={20}
                />
                <small className='char-count'>{localContactData.phone.value.length}/20</small>
              </div>
            </div>
            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='email' className='form-label text-dark'>
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  value={localContactData.email.value}
                  onChange={(e) => handleInputChange('email', 'value', e.target.value)}
                  className='form-input'
                  placeholder='e.g., shinobiacademy@gmail.com'
                  maxLength={50}
                />
                <small className='char-count'>{localContactData.email.value.length}/50</small>
              </div>
              <div className='form-group'>
                <label htmlFor='email-display' className='form-label text-dark'>
                  Email Display
                </label>
                <input
                  type='text'
                  id='email-display'
                  value={localContactData.email.display}
                  onChange={(e) => handleInputChange('email', 'display', e.target.value)}
                  className='form-input'
                  placeholder='e.g., shinobiacademy@gmail.com'
                  maxLength={50}
                />
                <small className='char-count'>{localContactData.email.display.length}/50</small>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className='address-section shadowed-box'>
            <h3 className='subsection-title text-dark'>Address Information</h3>
            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='street' className='form-label text-dark'>
                  Street Address
                </label>
                <input
                  type='text'
                  id='street'
                  value={localContactData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className='form-input'
                  placeholder='e.g., R.Convento da Trindade 15'
                  maxLength={100}
                />
                <small className='char-count'>{localContactData.address.street.length}/100</small>
              </div>
              <div className='form-group'>
                <label htmlFor='city' className='form-label text-dark'>
                  City
                </label>
                <input
                  type='text'
                  id='city'
                  value={localContactData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className='form-input'
                  placeholder='e.g., Lagos'
                  maxLength={50}
                />
                <small className='char-count'>{localContactData.address.city.length}/50</small>
              </div>
            </div>
            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='postal-code' className='form-label text-dark'>
                  Postal Code
                </label>
                <input
                  type='text'
                  id='postal-code'
                  value={localContactData.address.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  className='form-input'
                  placeholder='e.g., 8600-613'
                  maxLength={20}
                />
                <small className='char-count'>{localContactData.address.postalCode.length}/20</small>
              </div>
              <div className='form-group'>
                <label htmlFor='country' className='form-label text-dark'>
                  Country
                </label>
                <input
                  type='text'
                  id='country'
                  value={localContactData.address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className='form-input'
                  placeholder='e.g., Portugal'
                  maxLength={50}
                />
                <small className='char-count'>{localContactData.address.country.length}/50</small>
              </div>
            </div>
            <div className='form-row'>
              <div className='form-group full-width'>
                <label htmlFor='full-address' className='form-label text-dark'>
                  Full Address (Auto-generated)
                </label>
                <input
                  type='text'
                  id='full-address'
                  value={localContactData.address.full}
                  className='form-input'
                  readOnly
                  style={{ backgroundColor: '#f5f5f5' }}
                />
                <small className='help-text'>This field is automatically generated from the address components above.</small>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className='social-media-section shadowed-box'>
            <h3 className='subsection-title text-dark'>Social Media Links</h3>
            
            {/* Instagram */}
            <div className='social-media-item'>
              <h4 className='platform-title text-dark'>Instagram</h4>
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='instagram-url' className='form-label text-dark'>
                    Profile URL
                  </label>
                  <input
                    type='url'
                    id='instagram-url'
                    value={localContactData.socialMedia.instagram.url}
                    onChange={(e) => handleSocialMediaChange('instagram', 'url', e.target.value)}
                    className='form-input'
                    placeholder='https://instagram.com/username'
                    maxLength={100}
                  />
                  <small className='char-count'>{localContactData.socialMedia.instagram.url.length}/100</small>
                </div>
                <div className='form-group'>
                  <label htmlFor='instagram-display' className='form-label text-dark'>
                    Display Name
                  </label>
                  <input
                    type='text'
                    id='instagram-display'
                    value={localContactData.socialMedia.instagram.display}
                    onChange={(e) => handleSocialMediaChange('instagram', 'display', e.target.value)}
                    className='form-input'
                    placeholder='e.g., shinobiacademylagos'
                    maxLength={50}
                  />
                  <small className='char-count'>{localContactData.socialMedia.instagram.display.length}/50</small>
                </div>
              </div>
            </div>

            {/* Facebook */}
            <div className='social-media-item'>
              <h4 className='platform-title text-dark'>Facebook</h4>
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='facebook-url' className='form-label text-dark'>
                    Profile URL
                  </label>
                  <input
                    type='url'
                    id='facebook-url'
                    value={localContactData.socialMedia.facebook.url}
                    onChange={(e) => handleSocialMediaChange('facebook', 'url', e.target.value)}
                    className='form-input'
                    placeholder='https://facebook.com/profile'
                    maxLength={100}
                />
                  <small className='char-count'>{localContactData.socialMedia.facebook.url.length}/100</small>
                </div>
                <div className='form-group'>
                  <label htmlFor='facebook-display' className='form-label text-dark'>
                    Display Name
                  </label>
                  <input
                    type='text'
                    id='facebook-display'
                    value={localContactData.socialMedia.facebook.display}
                    onChange={(e) => handleSocialMediaChange('facebook', 'display', e.target.value)}
                    className='form-input'
                    placeholder='e.g., Shinobi Academy Lagos'
                    maxLength={50}
                  />
                  <small className='char-count'>{localContactData.socialMedia.facebook.display.length}/50</small>
                </div>
              </div>
            </div>

            {/* YouTube */}
            <div className='social-media-item'>
              <h4 className='platform-title text-dark'>YouTube</h4>
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='youtube-url' className='form-label text-dark'>
                    Channel URL
                  </label>
                  <input
                    type='url'
                    id='youtube-url'
                    value={localContactData.socialMedia.youtube.url}
                    onChange={(e) => handleSocialMediaChange('youtube', 'url', e.target.value)}
                    className='form-input'
                    placeholder='https://youtube.com/c/channelname'
                    maxLength={100}
                  />
                  <small className='char-count'>{localContactData.socialMedia.youtube.url.length}/100</small>
                </div>
                <div className='form-group'>
                  <label htmlFor='youtube-display' className='form-label text-dark'>
                    Display Name
                  </label>
                  <input
                    type='text'
                    id='youtube-display'
                    value={localContactData.socialMedia.youtube.display}
                    onChange={(e) => handleSocialMediaChange('youtube', 'display', e.target.value)}
                    className='form-input'
                    placeholder='e.g., ShinobiVlog'
                    maxLength={50}
                  />
                  <small className='char-count'>{localContactData.socialMedia.youtube.display.length}/50</small>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours Section */}
          <div className='business-hours-section shadowed-box'>
            <h3 className='subsection-title text-dark'>Business Hours</h3>
            <div className='business-hours-grid'>
              {Object.entries(localContactData.businessHours).map(([day, hours]) => (
                <div key={day} className='business-hour-item'>
                  <label htmlFor={`hours-${day}`} className='form-label text-dark'>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </label>
                  <input
                    type='text'
                    id={`hours-${day}`}
                    value={hours}
                    onChange={(e) => handleBusinessHoursChange(day, e.target.value)}
                    className='form-input'
                    placeholder='e.g., 9:00 AM - 9:00 PM'
                    maxLength={25}
                  />
                  <small className='char-count'>{hours.length}/25</small>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='action-buttons'>
            <button 
              onClick={handleDeployChanges} 
              className={`deploy-btn ${!hasChanges ? 'disabled' : ''}`}
              disabled={!hasChanges || isDeploying}
            >
              {isDeploying ? 'Updating...' : 'Update Contact Information'}
            </button>
            
            <button onClick={handleResetToDefault} className='reset-btn'>
              Reset to Default
            </button>
          </div>

          {/* Changes Indicator */}
          {hasChanges && (
            <div className='changes-indicator'>
              <p className='changes-text text-dark'>
                ⚠️ You have unsaved changes. Click "Update Contact Information" to save them.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContactManager;
