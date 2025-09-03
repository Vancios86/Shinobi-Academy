import React, { createContext, useContext, useState, useEffect } from 'react';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

// Default content for the About page
const defaultAboutContent = {
  pageTitle: "About us",
  founderSection: {
    title: "Colin Byrne",
    subtitle: "Founder & Head Coach",
    description: `Colin Byrne is a martial artist. Started training in 1997 in
    Ninjutsu and became a 3rd Dan Black Belt under Brian McCarthy. He
    has trained with Brian McCarthy with the US Marine corp and Police
    in arrest and constraint. As well he trained and fought Muay Thai
    in Thailand, has a brown belt in Brazilian Jiu Jitsu, obtained a
    silver medal in the European Jiu-Jitsu championships and has
    trained and fought in MMA since 2001. He is part of Team Conor
    McGregor for the last 7 years and has been a corner man for his
    last 3 fights. He is a founding member of McGregor FAST. He
    established Shinobi Academy in 2001 in Lagos Portugal and over the
    years he has welcomed several BJJ, MMA and Kick boxing teams. Many
    great names have trained and coached here:`,
    achievements: [
      "Conor McGregor chose Shinobi to host his 10 week camp for the Justin Porrier 2 fight",
      "Andy Ryan brings a squad of over 50 people every year from Team Ryano",
      "Silverback Jiu-Jitsu with Mario",
      "Paddy Holohan and Holohan Martial Arts",
      "Mike Russell with MMA Clinic",
      "Dawid Blaszke with Naas Kickboxing",
      "Gunnar Nelson with Mjolnir",
      "Team Kaobon with Mike Melby and Tom Aspinall",
      "ISI running strength and condition camps...and I appologise to those whom I might've forgot about when wrighting this description."
    ],
    facilityDescription: `The Facility has 2 large matted rooms for martial arts as well as
    an assortment of bags for striking. The strength and conditioning
    room has 2 Olympic lifting platforms , 2 lifting racks, hack squat
    machine, reverse hyper machine, sleds, Wattbike, Concept 2 rower ,
    inversion table and more.`
  },
  coachesSection: {
    title: "SHINOBI COACHES",
    description: "Our team of experienced coaches dedicated to your martial arts journey."
  },
  asideSection: {
    title: "Training Camps & Facilities",
    description: `The Dojo is available for training camps for teams and clubs.
    The strength and conditioning room is also available for small
    groups . We also run our own training camps. MMA and Grappling
    with guest coaches throughout the year.`,
    viewDescription: `Shinobi Academy is as well known for having one the best views
    in the entire world. If you don't believe me, check out this
    capture and I dare you to prove me wrong:).`
  }
};

// Default content for other pages (expandable)
const defaultContent = {
  about: defaultAboutContent,
  // Future content sections can be added here
  // classes: { ... },
  // camps: { ... },
  // contact: { ... }
};

export const ContentProvider = ({ children }) => {
  const [contentData, setContentData] = useState(defaultContent);
  const [initialSessionData, setInitialSessionData] = useState(null); // Store initial session state
  const [isLoaded, setIsLoaded] = useState(false);

  // Load content data on mount
  useEffect(() => {
    const loadContentData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Merge with default data to ensure all fields exist
            const mergedData = {
              ...defaultContent,
              ...result.data,
              about: {
                ...defaultContent.about,
                ...result.data.about
              }
            };
            setContentData(mergedData);
            // Store the initial session state (only on first load)
            if (!initialSessionData) {
              setInitialSessionData(mergedData);
            }
          } else {
            // Fallback to default content data
            setContentData(defaultContent);
            if (!initialSessionData) {
              setInitialSessionData(defaultContent);
            }
          }
        } else {
          // Fallback to default content data
          setContentData(defaultContent);
          if (!initialSessionData) {
            setInitialSessionData(defaultContent);
          }
        }
      } catch (error) {
        console.error('Error loading content data:', error);
        // Fallback to default content data
        setContentData(defaultContent);
        if (!initialSessionData) {
          setInitialSessionData(defaultContent);
        }
      }
      setIsLoaded(true);
    };

    loadContentData();
  }, []);

  // Save content data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('shinobi-content-data', JSON.stringify(contentData));
      } catch (error) {
        console.error('Error saving content data:', error);
      }
    }
  }, [contentData, isLoaded]);

  // Update content data (used by ContentManager)
  const updateContentData = async (newData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setContentData(result.data);
        } else {
          throw new Error(result.message || 'Failed to update content');
        }
      } else {
        const errorResult = await response.json();
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(errorResult.message || `Failed to update content (${response.status})`);
        }
      }
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  // Update specific content section
  const updateContentSection = (section, newData) => {
    setContentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...newData
      }
    }));
  };

  // Update specific field within a section
  const updateContentField = (section, field, value) => {
    setContentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Update array field (like achievements)
  const updateContentArray = (section, field, index, value) => {
    setContentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].map((item, i) => 
          i === index ? value : item
        )
      }
    }));
  };

  // Add new item to array field
  const addContentArrayItem = (section, field, value) => {
    setContentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], value]
      }
    }));
  };

  // Remove item from array field
  const removeContentArrayItem = (section, field, index) => {
    setContentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index)
      }
    }));
  };

  // Reset to original session state
  const resetToOriginal = async () => {
    try {
      if (!initialSessionData) {
        throw new Error('No original session data available');
      }

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(initialSessionData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setContentData(result.data);
          return { success: true, message: 'Content reset to original session state' };
        } else {
          throw new Error(result.message || 'Failed to reset content');
        }
      } else {
        const errorResult = await response.json();
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(errorResult.message || `Failed to reset content (${response.status})`);
        }
      }
    } catch (error) {
      console.error('Error resetting content:', error);
      return { success: false, message: error.message };
    }
  };

  // Get content for specific section
  const getContent = (section) => {
    return contentData[section] || {};
  };

  // Get specific field value
  const getContentField = (section, field) => {
    return contentData[section]?.[field] || '';
  };

  const value = {
    contentData,
    updateContentData,
    updateContentSection,
    updateContentField,
    updateContentArray,
    addContentArrayItem,
    removeContentArrayItem,
    resetToOriginal,
    getContent,
    getContentField,
    isLoaded
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};
