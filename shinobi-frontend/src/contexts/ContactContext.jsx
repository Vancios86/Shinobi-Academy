import React, { createContext, useContext, useState, useEffect } from 'react';

const ContactContext = createContext();

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};

// Default contact information
const defaultContactData = {
  phone: {
    display: "(+351) 977 777 777",
    value: "+351977777777",
    countryCode: "+351"
  },
  email: {
    display: "shinobiacademy@gmail.com",
    value: "shinobiacademy@gmail.com"
  },
  address: {
    street: "R.Convento da Trindade 15",
    city: "Lagos",
    postalCode: "8600-613",
    country: "Portugal",
    full: "R.Convento da Trindade 15, 8600-613 Lagos, Portugal"
  },
  socialMedia: {
    instagram: {
      url: "https://instagram.com/shinobiacademylagos",
      display: "shinobiacademylagos",
      platform: "Instagram"
    },
    facebook: {
      url: "https://www.facebook.com/profile.php?id=100028550547285",
      display: "Shinobi Academy Lagos",
      platform: "Facebook"
    },
    youtube: {
      url: "https://www.youtube.com/c/ShinobiVlog",
      display: "ShinobiVlog",
      platform: "YouTube"
    }
  },
  businessHours: {
    monday: "9:00 AM - 9:00 PM",
    tuesday: "9:00 AM - 9:00 PM",
    wednesday: "9:00 AM - 9:00 PM",
    thursday: "9:00 AM - 9:00 PM",
    friday: "9:00 AM - 9:00 PM",
    saturday: "9:00 AM - 6:00 PM",
    sunday: "Closed"
  }
};

export const ContactProvider = ({ children }) => {
  const [contactData, setContactData] = useState(defaultContactData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load contact data on mount
  useEffect(() => {
    const loadContactData = () => {
      try {
        // Try to load from localStorage first
        const savedContact = localStorage.getItem('shinobi-contact-data');
        
        if (savedContact) {
          const parsedData = JSON.parse(savedContact);
          // Merge with default data to ensure all fields exist
          const mergedData = {
            ...defaultContactData,
            ...parsedData,
            socialMedia: {
              ...defaultContactData.socialMedia,
              ...parsedData.socialMedia
            }
          };
          setContactData(mergedData);
        } else {
          // Use default contact data
          setContactData(defaultContactData);
        }
      } catch (error) {
        console.error('Error loading contact data:', error);
        // Fallback to default contact data
        setContactData(defaultContactData);
      }
      setIsLoaded(true);
    };

    loadContactData();
  }, []);

  // Save contact data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('shinobi-contact-data', JSON.stringify(contactData));
      } catch (error) {
        console.error('Error saving contact data:', error);
      }
    }
  }, [contactData, isLoaded]);

  // Update contact data (used by ContactManager)
  const updateContactData = (newData) => {
    setContactData(newData);
  };

  // Update specific contact field
  const updateContactField = (field, value) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update social media link
  const updateSocialMedia = (platform, data) => {
    setContactData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: data
      }
    }));
  };

  // Reset to default contact data
  const resetToDefault = () => {
    setContactData(defaultContactData);
    localStorage.removeItem('shinobi-contact-data');
  };

  // Get formatted phone number for display
  const getFormattedPhone = () => {
    return contactData.phone.display;
  };

  // Get clickable phone number
  const getClickablePhone = () => {
    return contactData.phone.value;
  };

  // Get formatted address
  const getFormattedAddress = () => {
    return contactData.address.full;
  };

  // Get email for mailto links
  const getEmail = () => {
    return contactData.email.value;
  };

  const value = {
    contactData,
    updateContactData,
    updateContactField,
    updateSocialMedia,
    resetToDefault,
    getFormattedPhone,
    getClickablePhone,
    getFormattedAddress,
    getEmail,
    isLoaded
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};
