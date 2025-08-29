import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { scheduleAPI } from '../services/api';

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
  const [scheduleData, setScheduleData] = useState({});
  const [initialSessionData, setInitialSessionData] = useState(null); // Store initial session state
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load schedule data from backend
  const loadSchedule = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const schedule = await scheduleAPI.getSchedule();
      if (schedule) {
        const newScheduleData = { weeklySchedule: schedule };
        setScheduleData(newScheduleData);
        // Store the initial session state if this is the first load
        if (!initialSessionData) {
          setInitialSessionData(newScheduleData);
        }
      } else {
        // Fallback to localStorage if backend fails
        const savedSchedule = localStorage.getItem('shinobi-schedule-data');
        if (savedSchedule) {
          try {
            const parsedData = JSON.parse(savedSchedule);
            setScheduleData(parsedData);
            // Store the initial session state if this is the first load
            if (!initialSessionData) {
              setInitialSessionData(parsedData);
            }
          } catch (parseError) {
            console.error('Error parsing saved schedule:', parseError);
            setScheduleData(defaultSchedule);
            // Store the initial session state if this is the first load
            if (!initialSessionData) {
              setInitialSessionData(defaultSchedule);
            }
          }
        } else {
          setScheduleData(defaultSchedule);
          // Store the initial session state if this is the first load
          if (!initialSessionData) {
            setInitialSessionData(defaultSchedule);
          }
        }
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      setError(error.message);
      // Fallback to localStorage or default
      const savedSchedule = localStorage.getItem('shinobi-schedule-data');
      if (savedSchedule) {
        try {
          const parsedData = JSON.parse(savedSchedule);
          setScheduleData(parsedData);
          // Store the initial session state if this is the first load
          if (!initialSessionData) {
            setInitialSessionData(parsedData);
          }
        } catch (parseError) {
          console.error('Error parsing saved schedule:', parseError);
          setScheduleData(defaultSchedule);
          // Store the initial session state if this is the first load
          if (!initialSessionData) {
            setInitialSessionData(defaultSchedule);
          }
        }
      } else {
        setScheduleData(defaultSchedule);
        // Store the initial session state if this is the first load
        if (!initialSessionData) {
          setInitialSessionData(defaultSchedule);
        }
      }
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, [initialSessionData]);

  // Load schedule data on mount
  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  // Save schedule data to localStorage whenever it changes (backup)
  useEffect(() => {
    if (isLoaded && scheduleData.weeklySchedule) {
      try {
        localStorage.setItem('shinobi-schedule-data', JSON.stringify(scheduleData));
      } catch (error) {
        console.error('Error saving schedule data:', error);
      }
    }
  }, [scheduleData, isLoaded]);

  // Add new schedule entry
  const addScheduleEntry = async (day, entry) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSchedule = await scheduleAPI.addClassToSchedule(day, entry);
      setScheduleData({ weeklySchedule: updatedSchedule });
      return { success: true, data: updatedSchedule };
    } catch (error) {
      console.error('Error adding schedule entry:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing schedule entry
  const updateScheduleEntry = async (day, entryId, updatedData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSchedule = await scheduleAPI.updateClassInSchedule(day, entryId, updatedData);
      setScheduleData({ weeklySchedule: updatedSchedule });
      return { success: true, data: updatedSchedule };
    } catch (error) {
      console.error('Error updating schedule entry:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete schedule entry
  const deleteScheduleEntry = async (day, entryId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await scheduleAPI.removeClassFromSchedule(day, entryId);
      if (response.success) {
        const updatedSchedule = response.data;
        setScheduleData({ weeklySchedule: updatedSchedule });
        return { success: true, data: updatedSchedule };
      }
      return { success: false, message: 'Failed to delete schedule entry' };
    } catch (error) {
      console.error('Error deleting schedule entry:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
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

  // Reset to initial session state (what was loaded when admin session started)
  const resetToDefault = async () => {
    try {
      if (initialSessionData) {
        // Send the reset data to the backend
        const result = await scheduleAPI.resetSchedule(initialSessionData.weeklySchedule);
        if (result) {
          setScheduleData(initialSessionData);
          localStorage.removeItem('shinobi-schedule-data');
          return { success: true, data: result };
        }
      } else {
        // Fallback to hardcoded default if no initial session data
        const result = await scheduleAPI.resetSchedule(defaultSchedule.weeklySchedule);
        if (result) {
          setScheduleData(defaultSchedule);
          localStorage.removeItem('shinobi-schedule-data');
          return { success: true, data: result };
        }
      }
      return { success: false, message: 'Failed to reset schedule' };
    } catch (error) {
      console.error('Error resetting schedule:', error);
      return { success: false, message: error.message };
    }
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
    loadSchedule,
    isLoaded,
    isLoading,
    error
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
