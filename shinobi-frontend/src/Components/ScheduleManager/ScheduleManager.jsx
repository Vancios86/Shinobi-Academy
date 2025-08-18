import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScheduleManager.css';
import logo from '../../assets/logos/logo.png';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useClasses } from '../../contexts/ClassesContext';

const ScheduleManager = () => {
  const navigate = useNavigate();
  const { 
    scheduleData, 
    addScheduleEntry, 
    updateScheduleEntry, 
    deleteScheduleEntry, 
    resetToDefault,
    getAvailableTimeSlots,
    getDaysOfWeek,
    isLoaded: scheduleLoaded
  } = useSchedule();
  
  const { getAllClasses, isLoaded: classesLoaded } = useClasses();
  
  const [localScheduleData, setLocalScheduleData] = useState(scheduleData);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedTime, setSelectedTime] = useState('09:00');

  const classes = getAllClasses();
  const daysOfWeek = getDaysOfWeek();
  const timeSlots = getAvailableTimeSlots();

  // Load schedule data from context
  useEffect(() => {
    setLocalScheduleData(scheduleData);
  }, [scheduleData]);

  // Check for changes
  useEffect(() => {
    const hasUnsavedChanges = JSON.stringify(localScheduleData) !== JSON.stringify(scheduleData);
    setHasChanges(hasUnsavedChanges);
  }, [localScheduleData, scheduleData]);

  const handleBackToDashboard = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) return;
      
      // Reset local data if user confirms leaving
      setLocalScheduleData(scheduleData);
      setHasChanges(false);
    }
    navigate('/admin/dashboard');
  };

  const handleInputChange = (day, entryId, field, value) => {
    setLocalScheduleData(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: prev.weeklySchedule[day].map(entry => 
          entry.id === entryId 
            ? { ...entry, [field]: value }
            : entry
        )
      }
    }));
  };

  const handleAddScheduleEntry = () => {
    const newEntry = {
      id: `${selectedDay}-${Date.now()}-${Math.random()}`,
      time: selectedTime,
      endTime: calculateEndTime(selectedTime, 60), // Default 60 minutes
      classId: '',
      className: '',
      instructor: 'Colin Byrne',
      level: 'All Levels',
      maxStudents: 20,
      isActive: true
    };
    
    setLocalScheduleData(prev => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [selectedDay]: [...(prev.weeklySchedule[selectedDay] || []), newEntry]
      }
    }));
    
    setShowAddForm(false);
  };

  const handleUpdateScheduleEntry = (day, entryId) => {
    const entryToUpdate = localScheduleData.weeklySchedule[day].find(e => e.id === entryId);
    if (entryToUpdate) {
      updateScheduleEntry(day, entryId, entryToUpdate);
    }
    setEditingEntry(null);
  };

  const handleDeleteScheduleEntry = (day, entryId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this schedule entry? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      setLocalScheduleData(prev => ({
        ...prev,
        weeklySchedule: {
          ...prev.weeklySchedule,
          [day]: prev.weeklySchedule[day].filter(e => e.id !== entryId)
        }
      }));
    }
  };

  const calculateEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const handleDeployChanges = () => {
    setIsDeploying(true);
    
    // Simulate deployment delay
    setTimeout(() => {
      try {
        // Apply all local changes to the context
        Object.keys(localScheduleData.weeklySchedule).forEach(day => {
          localScheduleData.weeklySchedule[day].forEach(entry => {
            const existingEntry = scheduleData.weeklySchedule[day]?.find(e => e.id === entry.id);
            if (existingEntry) {
              updateScheduleEntry(day, entry.id, entry);
            } else {
              addScheduleEntry(day, entry);
            }
          });
        });
        
        // Remove entries that were deleted locally
        Object.keys(scheduleData.weeklySchedule).forEach(day => {
          scheduleData.weeklySchedule[day].forEach(entry => {
            if (!localScheduleData.weeklySchedule[day]?.find(e => e.id === entry.id)) {
              deleteScheduleEntry(day, entry.id);
            }
          });
        });
        
        setHasChanges(false);
        alert('Schedule updated successfully!');
      } catch (error) {
        console.error('Error updating schedule data:', error);
        alert('Failed to update schedule. Please try again.');
      } finally {
        setIsDeploying(false);
      }
    }, 1000);
  };

  const handleResetToDefault = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset all schedule data to default values? This action cannot be undone.'
    );
    
    if (confirmReset) {
      resetToDefault();
      setLocalScheduleData(scheduleData);
      setHasChanges(false);
      setEditingEntry(null);
      setShowAddForm(false);
    }
  };

  const renderScheduleEntry = (entry, day) => {
    const isEditing = editingEntry === entry.id;
    const selectedClass = classes.find(c => c.id === entry.classId);
    
    return (
      <div key={entry.id} className={`schedule-entry ${isEditing ? 'editing' : ''}`}>
        <div className="entry-header">
          <div className="entry-time">
            <span className="time-display">{entry.time} - {entry.endTime}</span>
          </div>
          <div className="entry-actions">
            {isEditing ? (
              <>
                <button 
                  className="btn-save"
                  onClick={() => handleUpdateScheduleEntry(day, entry.id)}
                >
                  Save
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => setEditingEntry(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn-edit"
                  onClick={() => setEditingEntry(entry.id)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeleteScheduleEntry(day, entry.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="entry-content">
          <div className="form-row">
            <div className="form-group">
              <label>Class:</label>
              <select
                value={entry.classId}
                onChange={(e) => {
                  const selectedClass = classes.find(c => c.id === e.target.value);
                  handleInputChange(day, entry.id, 'classId', e.target.value);
                  if (selectedClass) {
                    handleInputChange(day, entry.id, 'className', selectedClass.name);
                  }
                }}
                disabled={!isEditing}
              >
                <option value="">Select a class</option>
                {classes.map(classItem => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Time:</label>
              <select
                value={entry.time}
                onChange={(e) => {
                  handleInputChange(day, entry.id, 'time', e.target.value);
                  handleInputChange(day, entry.id, 'endTime', calculateEndTime(e.target.value, 60));
                }}
                disabled={!isEditing}
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Instructor:</label>
              <input
                type="text"
                value={entry.instructor}
                onChange={(e) => handleInputChange(day, entry.id, 'instructor', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter instructor name"
              />
            </div>

            <div className="form-group">
              <label>Level:</label>
              <select
                value={entry.level}
                onChange={(e) => handleInputChange(day, entry.id, 'level', e.target.value)}
                disabled={!isEditing}
              >
                <option value="All Levels">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Max Students:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={entry.maxStudents}
                onChange={(e) => handleInputChange(day, entry.id, 'maxStudents', parseInt(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Status:</label>
              <select
                value={entry.isActive ? 'active' : 'inactive'}
                onChange={(e) => handleInputChange(day, entry.id, 'isActive', e.target.value === 'active')}
                disabled={!isEditing}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {selectedClass && (
            <div className="class-info">
              <small className="form-help">
                <strong>Class:</strong> {selectedClass.name} | 
                <strong>Description:</strong> {selectedClass.description.substring(0, 100)}...
              </small>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!scheduleLoaded || !classesLoaded) {
    return (
      <div className='schedule-manager'>
        <div className='loading-message'>
          <p>Loading schedule data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='schedule-manager'>
      <header className='manager-header'>
        <div className='manager-header-content'>
          <div className='manager-logo'>
            <img src={logo} alt='Shinobi Academy Logo' className='manager-logo-img' />
            <h1 className='manager-title'>Schedule Manager</h1>
          </div>
          <button onClick={handleBackToDashboard} className='back-btn'>
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className='manager-main'>
        <div className='manager-container'>
          <div className='welcome-section'>
            <h2 className='welcome-title text-red'>Manage Class Schedule</h2>
            <p className='welcome-subtitle text-dark'>
              Create, edit, and manage the weekly class schedule. Link classes to specific time slots and days.
            </p>
          </div>

          <div className='manager-actions'>
            <button 
              className='btn-primary'
              onClick={() => setShowAddForm(true)}
            >
              + Add Schedule Entry
            </button>
            
            <button 
              className='btn-secondary'
              onClick={handleResetToDefault}
            >
              Reset to Default
            </button>
          </div>

          {showAddForm && (
            <div className='add-entry-section'>
              <h3>Add New Schedule Entry</h3>
              <div className='form-row'>
                <div className='form-group'>
                  <label>Day:</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                  >
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label>Time:</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='add-entry-actions'>
                <button 
                  className='btn-primary'
                  onClick={handleAddScheduleEntry}
                >
                  Add Entry
                </button>
                <button 
                  className='btn-secondary'
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className='schedule-overview'>
            <h3>Weekly Schedule Overview</h3>
            
            {daysOfWeek.map(day => {
              const dayEntries = localScheduleData.weeklySchedule[day] || [];
              const dayName = day.charAt(0).toUpperCase() + day.slice(1);
              
              return (
                <div key={day} className='day-schedule'>
                  <h4 className='day-header'>{dayName}</h4>
                  
                  {dayEntries.length === 0 ? (
                    <p className='no-classes'>No classes scheduled</p>
                  ) : (
                    <div className='day-entries'>
                      {dayEntries
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(entry => renderScheduleEntry(entry, day))
                      }
                    </div>
                  )}
                </div>
              );
            })}
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
                {isDeploying ? 'Updating...' : 'Update Schedule'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScheduleManager;
