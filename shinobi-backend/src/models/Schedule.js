const mongoose = require('mongoose');

// Individual schedule entry schema
const scheduleEntrySchema = new mongoose.Schema({
  time: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  classId: {
    type: String,
    required: [true, 'Class ID is required']
  },
  className: {
    type: String,
    required: [true, 'Class name is required'],
    maxlength: [100, 'Class name cannot exceed 100 characters']
  },
  instructor: {
    type: String,
    required: [true, 'Instructor name is required'],
    maxlength: [100, 'Instructor name cannot exceed 100 characters']
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'All Levels'
  },
  maxStudents: {
    type: Number,
    required: [true, 'Maximum students is required'],
    min: [1, 'Maximum students must be at least 1'],
    max: [50, 'Maximum students cannot exceed 50']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  _id: true // Each entry gets its own ID
});

// Transform schedule entry output to use 'id' instead of '_id'
scheduleEntrySchema.methods.toJSON = function() {
  const entryObject = this.toObject();
  entryObject.id = entryObject._id;
  delete entryObject._id;
  return entryObject;
};

// Main schedule schema
const scheduleSchema = new mongoose.Schema({
  // Weekly schedule structure
  weeklySchedule: {
    monday: [scheduleEntrySchema],
    tuesday: [scheduleEntrySchema],
    wednesday: [scheduleEntrySchema],
    thursday: [scheduleEntrySchema],
    friday: [scheduleEntrySchema],
    saturday: [scheduleEntrySchema],
    sunday: [scheduleEntrySchema]
  },
  
  // Business hours and general settings
  businessHours: {
    weekdays: {
      open: {
        type: String,
        default: '08:00',
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
      },
      close: {
        type: String,
        default: '21:00',
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
      }
    },
    weekends: {
      open: {
        type: String,
        default: '09:00',
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
      },
      close: {
        type: String,
        default: '17:00',
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
      }
    }
  },
  
  // Special announcements or notices
  announcements: [{
    title: {
      type: String,
      maxlength: [100, 'Announcement title cannot exceed 100 characters']
    },
    message: {
      type: String,
      maxlength: [500, 'Announcement message cannot exceed 500 characters']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    expiresAt: {
      type: Date
    }
  }],
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
scheduleSchema.index({ 'weeklySchedule.monday.time': 1 });
scheduleSchema.index({ 'weeklySchedule.tuesday.time': 1 });
scheduleSchema.index({ 'weeklySchedule.wednesday.time': 1 });
scheduleSchema.index({ 'weeklySchedule.thursday.time': 1 });
scheduleSchema.index({ 'weeklySchedule.friday.time': 1 });
scheduleSchema.index({ 'weeklySchedule.saturday.time': 1 });
scheduleSchema.index({ 'weeklySchedule.sunday.time': 1 });
scheduleSchema.index({ isActive: 1 });

// Static method to get the current active schedule
scheduleSchema.statics.getActiveSchedule = function() {
  return this.findOne({ isActive: true }).populate('lastUpdatedBy', 'username');
};

// Instance method to add a class to a specific day
scheduleSchema.methods.addClassToDay = function(day, classData) {
  if (!this.weeklySchedule[day.toLowerCase()]) {
    throw new Error('Invalid day of week');
  }
  
  // Check for time conflicts
  const existingClass = this.weeklySchedule[day.toLowerCase()].find(entry => 
    (classData.time >= entry.time && classData.time < entry.endTime) ||
    (classData.endTime > entry.time && classData.endTime <= entry.endTime) ||
    (classData.time <= entry.time && classData.endTime >= entry.endTime)
  );
  
  if (existingClass) {
    throw new Error('Time conflict with existing class');
  }
  
  this.weeklySchedule[day.toLowerCase()].push(classData);
  return this.save();
};

// Instance method to remove a class from a specific day
scheduleSchema.methods.removeClassFromDay = function(day, entryId) {
  if (!this.weeklySchedule[day.toLowerCase()]) {
    throw new Error('Invalid day of week');
  }
  
  this.weeklySchedule[day.toLowerCase()] = this.weeklySchedule[day.toLowerCase()]
    .filter(entry => entry._id.toString() !== entryId.toString());
  
  return this.save();
};

// Instance method to update a class on a specific day
scheduleSchema.methods.updateClassOnDay = function(day, entryId, updateData) {
  if (!this.weeklySchedule[day.toLowerCase()]) {
    throw new Error('Invalid day of week');
  }
  
  const entryIndex = this.weeklySchedule[day.toLowerCase()]
    .findIndex(entry => entry._id.toString() === entryId.toString());
  
  if (entryIndex === -1) {
    throw new Error('Schedule entry not found');
  }
  
  // Check for time conflicts if time is being updated
  if (updateData.time || updateData.endTime) {
    const updatedEntry = { 
      ...this.weeklySchedule[day.toLowerCase()][entryIndex].toObject(), 
      ...updateData 
    };
    
    const conflictingClass = this.weeklySchedule[day.toLowerCase()].find((entry, index) => 
      index !== entryIndex && (
        (updatedEntry.time >= entry.time && updatedEntry.time < entry.endTime) ||
        (updatedEntry.endTime > entry.time && updatedEntry.endTime <= entry.endTime) ||
        (updatedEntry.time <= entry.time && updatedEntry.endTime >= entry.endTime)
      )
    );
    
    if (conflictingClass) {
      throw new Error('Time conflict with existing class');
    }
  }
  
  // Update the entry
  Object.assign(this.weeklySchedule[day.toLowerCase()][entryIndex], updateData);
  return this.save();
};

// Instance method to get classes for a specific day
scheduleSchema.methods.getClassesForDay = function(day) {
  if (!this.weeklySchedule[day.toLowerCase()]) {
    throw new Error('Invalid day of week');
  }
  
  return this.weeklySchedule[day.toLowerCase()]
    .filter(entry => entry.isActive)
    .sort((a, b) => a.time.localeCompare(b.time));
};

// Instance method to get all classes sorted by day and time
scheduleSchema.methods.getAllClassesSorted = function() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const sortedSchedule = {};
  
  days.forEach(day => {
    sortedSchedule[day] = this.getClassesForDay(day);
  });
  
  return sortedSchedule;
};

// Transform output
scheduleSchema.methods.toJSON = function() {
  const scheduleObject = this.toObject();
  scheduleObject.id = scheduleObject._id;
  delete scheduleObject._id;
  delete scheduleObject.__v;
  return scheduleObject;
};

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
