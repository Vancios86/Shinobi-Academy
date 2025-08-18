import React, { createContext, useContext, useState, useEffect } from 'react';

const ScheduleContext = createContext();

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

// Default schedule structure
const defaultSchedule = {
  // Weekly schedule with time slots
  weeklySchedule: {
    monday: [
      {
        id: 'monday-morning',
        time: '09:00',
        endTime: '10:00',
        classId: 'mma-box-muay-thai',
        className: 'MMA Box Muay-Thai',
        instructor: 'Colin Byrne',
        level: 'All Levels',
        maxStudents: 20,
        isActive: true
      },
      {
        id: 'monday-evening',
        time: '18:00',
        endTime: '19:00',
        classId: 'brazilian-jiu-jitsu',
        className: 'Brazilian Jiu-Jitsu',
        instructor: 'Colin Byrne',
        level: 'All Levels',
        maxStudents: 20,
        isActive: true
      }
    ],
    tuesday: [
      {
        id: 'tuesday-morning',
        time: '09:00',
        endTime: '10:00',
        classId: 'strength-condition',
        className: 'Strength Condition',
        instructor: 'Colin Byrne',
        level: 'All Levels',
        maxStudents: 15,
        isActive: true
      },
      {
        id: 'tuesday-evening',
        time: '18:00',
        endTime: '19:00',
        classId: 'wrestling-judo',
        className: 'Wrestling Judo',
        instructor: 'Colin Byrne',
        level: 'All Levels',
        maxStudents: 20,
        isActive: true
      }
    ],
    wednesday: [
      {
        id: 'wednesday-morning',
        time: '09:00',
        endTime: '10:00',
        classId: 'mma-box-muay-thai',
        className: 'MMA Box Muay-Thai',
        instructor: 'Colin Byrne',
        level: 'All Levels',
        maxStudents: 20,
        isActive: true
      },
      {
        id: 'wednesday-evening',
        time: '18:00',
        endTime: '19:00',
        classId: 'brazilian-jiu-jitsu',
        className: 'Brazilian Jiu-Jitsu',
        instructor: 'Colin Byrne',
        level: 'All Levels',
        maxStudents: 20,
        isActive: true
      }
    ],
    thursday: [
      {
        id: 'thursday-morning',
        time: '09:00',
        endTime: '10:00',
        classId: 'strength-condition',
        className: 'Strength Condition',
        instructor: 'Colin Byrne',
        level: 'All Levels',
        maxStudents: 15,
        isActive: true
      },
      {
        id: 'thursday-evening',
        time: '18:00',
        endTime: '19:00',
        classId: 'wrestling-judo',
        className: 'Wrestling Judo',
        instructor: 'Colin Byrne',
        level: 'All Levels',
        maxStudents: 20,
        isActive: true
      }
    ],
    friday: [
      {
        id: 'friday-morning',
        time: '09:00',
        endTime: '10:00',
        classId: 'mma-box-muay-thai',
        className: 'MMA Box Muay-Thai',
        instructor: 'Colin Byrne',
        level: 'All Levels',
        maxStudents: 20,
        isActive: true
      },
      {
        id: 'friday-evening',
        time: '18:00',
        endTime: '19:00',
        classId: 'brazilian-jiu-jitsu',
        className: 'Brazilian Jiu-Jitsu',
        instructor: 'Colin Byrne',
        level: 'All Levels',
        maxStudents: 20,
        isActive: true
      }
    ],
    saturday: [
      {
        id: 'saturday-morning',
        time: '10:00',
        endTime: '11:00',
        classId: 'private-classes',
        className: 'Private Classes',
        instructor: 'Colin Byrne',
        level: 'All Levels',
        maxStudents: 1,
        isActive: true
      }
    ],
    sunday: [] // No classes on Sunday
  },
  
  // General schedule settings
  settings: {
    timezone: 'Europe/Lisbon',
    defaultClassDuration: 60, // minutes
    breakBetweenClasses: 15, // minutes
    facilityOpenTime: '08:00',
    facilityCloseTime: '22:00',
    showInactiveClasses: false
  }
};

export const ScheduleProvider = ({ children }) => {
  const [scheduleData, setScheduleData] = useState(defaultSchedule);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load schedule data on mount
  useEffect(() => {
    const loadScheduleData = () => {
      try {
        // Try to load from localStorage first
        const savedSchedule = localStorage.getItem('shinobi-schedule-data');
        
        if (savedSchedule) {
          const parsedData = JSON.parse(savedSchedule);
          // Merge with default data to ensure all fields exist
          const mergedData = {
            ...defaultSchedule,
            ...parsedData,
            weeklySchedule: {
              ...defaultSchedule.weeklySchedule,
              ...parsedData.weeklySchedule
            }
          };
          setScheduleData(mergedData);
        } else {
          // Use default schedule data
          setScheduleData(defaultSchedule);
        }
      } catch (error) {
        console.error('Error loading schedule data:', error);
        // Fallback to default schedule data
        setScheduleData(defaultSchedule);
      }
      setIsLoaded(true);
    };

    loadScheduleData();
  }, []);

  // Save schedule data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('shinobi-schedule-data', JSON.stringify(scheduleData));
      } catch (error) {
        console.error('Error saving schedule data:', error);
      }
    }
  }, [scheduleData, isLoaded]);

  // Add new schedule entry
  const addScheduleEntry = (day, entry) => {
    const newEntry = {
      ...entry,
      id: entry.id || `${day}-${Date.now()}-${Math.random()}`
    };
    
    setScheduleData(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: [...(prev.weeklySchedule[day] || []), newEntry]
      }
    }));
  };

  // Update existing schedule entry
  const updateScheduleEntry = (day, entryId, updatedData) => {
    setScheduleData(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: prev.weeklySchedule[day].map(entry => 
          entry.id === entryId ? { ...entry, ...updatedData } : entry
        )
      }
    }));
  };

  // Delete schedule entry
  const deleteScheduleEntry = (day, entryId) => {
    setScheduleData(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: prev.weeklySchedule[day].filter(entry => entry.id !== entryId)
      }
    }));
  };

  // Reorder schedule entries for a specific day
  const reorderDaySchedule = (day, newOrder) => {
    const reorderedEntries = newOrder.map((id, index) => {
      const entry = scheduleData.weeklySchedule[day].find(e => e.id === id);
      return entry ? { ...entry, order: index } : null;
    }).filter(Boolean);
    
    setScheduleData(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: reorderedEntries
      }
    }));
  };

  // Get schedule for specific day
  const getDaySchedule = (day) => {
    return scheduleData.weeklySchedule[day] || [];
  };

  // Get all schedule data
  const getAllScheduleData = () => {
    return scheduleData;
  };

  // Update schedule settings
  const updateScheduleSettings = (newSettings) => {
    setScheduleData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  // Get schedule settings
  const getScheduleSettings = () => {
    return scheduleData.settings;
  };

  // Get classes for a specific time slot
  const getClassesAtTime = (day, time) => {
    return scheduleData.weeklySchedule[day]?.filter(entry => entry.time === time) || [];
  };

  // Check if a class is scheduled
  const isClassScheduled = (classId) => {
    return Object.values(scheduleData.weeklySchedule).some(dayEntries =>
      dayEntries.some(entry => entry.classId === classId)
    );
  };

  // Get all scheduled classes
  const getScheduledClasses = () => {
    const scheduledClasses = new Set();
    Object.values(scheduleData.weeklySchedule).forEach(dayEntries => {
      dayEntries.forEach(entry => {
        scheduledClasses.add(entry.classId);
      });
    });
    return Array.from(scheduledClasses);
  };

  // Reset to default schedule
  const resetToDefault = () => {
    setScheduleData(defaultSchedule);
    localStorage.removeItem('shinobi-schedule-data');
  };

  // Get available time slots
  const getAvailableTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 22; // 10 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    return slots;
  };

  // Get days of the week
  const getDaysOfWeek = () => {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  };

  const value = {
    scheduleData,
    addScheduleEntry,
    updateScheduleEntry,
    deleteScheduleEntry,
    reorderDaySchedule,
    getDaySchedule,
    getAllScheduleData,
    updateScheduleSettings,
    getScheduleSettings,
    getClassesAtTime,
    isClassScheduled,
    getScheduledClasses,
    resetToDefault,
    getAvailableTimeSlots,
    getDaysOfWeek,
    isLoaded
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
