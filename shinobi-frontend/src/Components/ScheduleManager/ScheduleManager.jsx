import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScheduleManager.css';
import logo from '../../assets/logos/logo.png';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useClasses } from '../../contexts/ClassesContext';
import { useCoaches } from '../../contexts/CoachesContext';
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
    loadSchedule,
    isLoaded: scheduleLoaded,
    isLoading: scheduleLoading,
    error: scheduleError
  } = useSchedule();
  
  const { getAllClasses, isLoaded: classesLoaded } = useClasses();
  const { coachesData, isLoaded: coachesLoaded } = useCoaches();
  
  const [localScheduleData, setLocalScheduleData] = useState(scheduleData);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedEndTime, setSelectedEndTime] = useState('10:00');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedCoachId, setSelectedCoachId] = useState('colin-byrne');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [toasts, setToasts] = useState([]);

  // Toast management
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const classes = getAllClasses();
  const daysOfWeek = getDaysOfWeek();
  const timeSlots = getAvailableTimeSlots();

  // Load schedule data from context
  useEffect(() => {
    setLocalScheduleData(scheduleData);
  }, [scheduleData]);

  // Force reload schedule data on component mount
  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]); // loadSchedule is stable from context

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showResetModal) {
        setShowResetModal(false);
      }
    };

    // Prevent body scroll when modal is open
    if (showResetModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showResetModal]);

  // Update end time when start time changes
  useEffect(() => {
    const availableEndTimes = getAvailableEndTimes(selectedTime);
    if (availableEndTimes.length > 0) {
      // Set end time to 1 hour after start time, or the first available time if that's not possible
      const oneHourLater = calculateEndTime(selectedTime, 60);
      const newEndTime = availableEndTimes.includes(oneHourLater) ? oneHourLater : availableEndTimes[0];
      setSelectedEndTime(newEndTime);
    }
  }, [selectedTime]);



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

  const handleAddScheduleEntry = async () => {
    if (!selectedClassId) {
      addToast('Please select a class', 'error');
      return;
    }

    if (!selectedCoachId) {
      addToast('Please select a coach', 'error');
      return;
    }

    const selectedClass = classes.find(c => c.id === selectedClassId);
    if (!selectedClass) {
      addToast('Selected class not found', 'error');
      return;
    }

    let selectedCoach;
    if (selectedCoachId === 'colin-byrne') {
      selectedCoach = { name: 'Colin Byrne' };
    } else {
      selectedCoach = coachesData.find(c => c.id === selectedCoachId);
      if (!selectedCoach) {
        addToast('Selected coach not found', 'error');
        return;
      }
    }

    const newEntry = {
      time: selectedTime,
      endTime: selectedEndTime,
      classId: selectedClassId,
      className: selectedClass.name,
      instructor: selectedCoach.name,
      description: selectedDescription.trim() || undefined, // Only include if not empty
      level: 'All Levels', // Default level
      maxStudents: 20,
      isActive: true
    };
    
    try {
      const result = await addScheduleEntry(selectedDay, newEntry);
      if (result.success) {
        setShowAddForm(false);
        setSelectedClassId(''); // Reset form
        setSelectedEndTime('10:00'); // Reset end time
        setSelectedCoachId('colin-byrne'); // Reset coach selection to Colin Byrne
        setSelectedDescription(''); // Reset description
        addToast('Schedule entry added successfully!', 'success');
        // Data will be updated via context
      } else {
        addToast(`Failed to add schedule entry: ${result.message}`, 'error');
      }
    } catch (error) {
      addToast(`Error adding schedule entry: ${error.message}`, 'error');
    }
  };

  const handleUpdateScheduleEntry = async (day, entryId) => {
    const dayEntries = (localScheduleData.weeklySchedule && localScheduleData.weeklySchedule[day]) || [];
    const entryToUpdate = dayEntries.find(e => e.id === entryId);
    if (entryToUpdate) {
      try {
        const result = await updateScheduleEntry(day, entryId, entryToUpdate);
        if (result.success) {
          setEditingEntry(null);
          addToast('Schedule entry updated successfully!', 'success');
          // Data will be updated via context
        } else {
          addToast(`Failed to update schedule entry: ${result.message}`, 'error');
        }
      } catch (error) {
        addToast(`Error updating schedule entry: ${error.message}`, 'error');
      }
    }
  };

  const handleDeleteScheduleEntry = async (day, entryId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this schedule entry? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      try {
        const result = await deleteScheduleEntry(day, entryId);
        if (result.success) {
          addToast('Schedule entry deleted successfully!', 'success');
          // Data will be updated via context
        } else {
          addToast(`Failed to delete schedule entry: ${result.message}`, 'error');
        }
      } catch (error) {
        addToast(`Error deleting schedule entry: ${error.message}`, 'error');
      }
    }
  };

  const calculateEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  // Get available end times based on selected start time
  const getAvailableEndTimes = (startTime) => {
    const endTimes = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    
    // Generate end times from 30 minutes to 3 hours after start time
    for (let duration = 30; duration <= 180; duration += 30) {
      const endTotalMinutes = startTotalMinutes + duration;
      const endHour = Math.floor(endTotalMinutes / 60);
      const endMinute = endTotalMinutes % 60;
      
      // Only add times that are within the facility hours (8 AM to 10 PM)
      if (endHour >= 8 && endHour < 22) {
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        endTimes.push(endTime);
      }
    }
    
    return endTimes;
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
        addToast('Schedule updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating schedule data:', error);
        addToast('Failed to update schedule. Please try again.', 'error');
      } finally {
        setIsDeploying(false);
      }
    }, 1000);
  };

  const handleResetToDefault = async () => {
    try {
      const result = await resetToDefault();
      if (result.success) {
        setLocalScheduleData(scheduleData);
        setHasChanges(false);
        setEditingEntry(null);
        setShowAddForm(false);
        addToast('Schedule reset to initial session state successfully!', 'success');
      } else {
        addToast(`Failed to reset schedule: ${result.message}`, 'error');
      }
    } catch (error) {
      addToast(`Error resetting schedule: ${error.message}`, 'error');
    }
    setShowResetModal(false);
  };

  const openResetModal = () => {
    setShowResetModal(true);
  };

  const renderScheduleEntry = (entry, day) => {
    const isEditing = editingEntry === entry.id;
    // Try to find class by ID first, then by slug/name match
    let selectedClass = classes.find(c => c.id === entry.classId);
    if (!selectedClass) {
      // Fallback: try to match by slug or name
      selectedClass = classes.find(c => {
        const classSlug = c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return classSlug === entry.classId || c.name === entry.className;
      });
    }
    
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

          {entry.description ? (
            <div className='form-row'>
              <div className='form-group'>
                <label>Description:</label>
                <textarea
                  value={entry.description}
                  onChange={(e) => handleInputChange(day, entry.id, 'description', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter class description..."
                  rows="3"
                  maxLength="500"
                />
                <div className="form-help">
                  {entry.description.length}/500 characters
                </div>
              </div>
            </div>
          ) : isEditing && (
            <div className='form-row'>
              <div className='form-group'>
                <label>Description (Optional):</label>
                <textarea
                  value=""
                  onChange={(e) => handleInputChange(day, entry.id, 'description', e.target.value)}
                  placeholder="Enter class description..."
                  rows="3"
                  maxLength="500"
                />
                <div className="form-help">
                  0/500 characters
                </div>
              </div>
            </div>
          )}

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
          {scheduleError && (
            <div className='error-message' style={{ 
              background: '#ffebee', 
              color: '#c62828', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              border: '1px solid #ffcdd2'
            }}>
              <strong>Error:</strong> {scheduleError}
              <button 
                onClick={loadSchedule} 
                style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem' }}
              >
                Retry
              </button>
            </div>
          )}

          {scheduleLoading && (
            <div className='loading-message' style={{ 
              background: '#e3f2fd', 
              color: '#1565c0', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              border: '1px solid #bbdefb',
              textAlign: 'center'
            }}>
              Loading schedule data...
            </div>
          )}

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
              onClick={openResetModal}
            >
              Reset to Session Start
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
                  <label>Start Time:</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label>End Time:</label>
                  <select
                    value={selectedEndTime}
                    onChange={(e) => setSelectedEndTime(e.target.value)}
                  >
                    {getAvailableEndTimes(selectedTime).map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label>Class:</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    required
                    disabled={!classesLoaded}
                  >
                    <option value="">
                      {classesLoaded ? 'Select a class...' : 'Loading classes...'}
                    </option>
                    {classesLoaded && classes.map(classItem => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label>Coach:</label>
                  <select
                    value={selectedCoachId}
                    onChange={(e) => setSelectedCoachId(e.target.value)}
                    required
                    disabled={!coachesLoaded}
                  >
                    <option value="">
                      {coachesLoaded ? 'Select a coach...' : 'Loading coaches...'}
                    </option>
                    <option value="colin-byrne">Colin Byrne</option>
                    {coachesLoaded && coachesData.map(coach => (
                      <option key={coach.id} value={coach.id}>
                        {coach.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label>Description (Optional):</label>
                  <textarea
                    value={selectedDescription}
                    onChange={(e) => setSelectedDescription(e.target.value)}
                    placeholder="Enter class description, special requirements, or notes..."
                    rows="3"
                    maxLength="500"
                  />
                  <div className="form-help">
                    {selectedDescription.length}/500 characters
                  </div>
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
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedClassId(''); // Reset form
                    setSelectedEndTime('10:00'); // Reset end time
                    setSelectedCoachId('colin-byrne'); // Reset coach selection to Colin Byrne
                    setSelectedDescription(''); // Reset description
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className='schedule-overview'>
            <h3>Weekly Schedule Overview</h3>
            
            {daysOfWeek.map(day => {
              const dayEntries = (localScheduleData.weeklySchedule && localScheduleData.weeklySchedule[day]) || [];
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
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      
      <ConfirmationModal
        isOpen={showResetModal}
        title="Reset Schedule"
        message="Are you sure you want to reset all schedule data to the initial state from when you started this admin session? This action cannot be undone."
        onConfirm={handleResetToDefault}
        onCancel={() => setShowResetModal(false)}
        confirmText="Reset Schedule"
        cancelText="Cancel"
        type="warning"
        showIcon={true}
      />
    </div>
  );
};

export default ScheduleManager;
