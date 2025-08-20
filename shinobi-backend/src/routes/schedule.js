const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Schedule = require('../models/Schedule');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/schedule - Get active schedule (public endpoint)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const schedule = await Schedule.getActiveSchedule();
    
    if (!schedule) {
      return res.json({
        success: true,
        data: null,
        message: 'No active schedule found'
      });
    }

    res.json({
      success: true,
      data: schedule.getAllClassesSorted()
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch schedule'
    });
  }
});

// GET /api/schedule/admin - Get full schedule for admin
router.get('/admin', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const schedule = await Schedule.getActiveSchedule();
    
    if (!schedule) {
      return res.json({
        success: true,
        data: null,
        message: 'No active schedule found'
      });
    }

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Get admin schedule error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch schedule'
    });
  }
});

// GET /api/schedule/day/:day - Get classes for specific day
router.get('/day/:day', [
  param('day').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day of week')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const schedule = await Schedule.getActiveSchedule();
    
    if (!schedule) {
      return res.json({
        success: true,
        data: [],
        message: 'No active schedule found'
      });
    }

    const dayClasses = schedule.getClassesForDay(req.params.day);

    res.json({
      success: true,
      data: dayClasses,
      day: req.params.day
    });
  } catch (error) {
    console.error('Get day schedule error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch day schedule'
    });
  }
});

// POST /api/schedule/class - Add class to schedule (admin only)
router.post('/class', [
  authenticateToken,
  requireAdmin,
  body('day').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day of week'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:MM)'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid end time format (HH:MM)'),
  body('classId').notEmpty().withMessage('Class ID is required'),
  body('className').trim().notEmpty().withMessage('Class name is required')
    .isLength({ max: 100 }).withMessage('Class name cannot exceed 100 characters'),
  body('instructor').trim().notEmpty().withMessage('Instructor name is required')
    .isLength({ max: 100 }).withMessage('Instructor name cannot exceed 100 characters'),
  body('level').isIn(['Beginner', 'Intermediate', 'Advanced', 'All Levels'])
    .withMessage('Invalid level'),
  body('maxStudents').isInt({ min: 1, max: 50 })
    .withMessage('Max students must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    let schedule = await Schedule.getActiveSchedule();
    
    // Create schedule if none exists
    if (!schedule) {
      schedule = new Schedule({
        weeklySchedule: {
          monday: [], tuesday: [], wednesday: [], thursday: [],
          friday: [], saturday: [], sunday: []
        },
        lastUpdatedBy: req.user._id
      });
      await schedule.save();
    }

    const { day, ...classData } = req.body;
    classData.lastUpdatedBy = req.user._id;

    await schedule.addClassToDay(day, classData);

    res.status(201).json({
      success: true,
      message: 'Class added to schedule successfully',
      data: schedule.getAllClassesSorted()
    });
  } catch (error) {
    console.error('Add class to schedule error:', error);
    
    if (error.message === 'Time conflict with existing class') {
      return res.status(400).json({
        error: 'Schedule conflict',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to add class to schedule'
    });
  }
});

// PUT /api/schedule/class/:day/:entryId - Update class in schedule (admin only)
router.put('/class/:day/:entryId', [
  authenticateToken,
  requireAdmin,
  param('day').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day of week'),
  param('entryId').isMongoId().withMessage('Invalid entry ID'),
  body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:MM)'),
  body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid end time format (HH:MM)'),
  body('className').optional().trim().notEmpty().withMessage('Class name cannot be empty')
    .isLength({ max: 100 }).withMessage('Class name cannot exceed 100 characters'),
  body('instructor').optional().trim().notEmpty().withMessage('Instructor name cannot be empty')
    .isLength({ max: 100 }).withMessage('Instructor name cannot exceed 100 characters'),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'All Levels'])
    .withMessage('Invalid level'),
  body('maxStudents').optional().isInt({ min: 1, max: 50 })
    .withMessage('Max students must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const schedule = await Schedule.getActiveSchedule();
    
    if (!schedule) {
      return res.status(404).json({
        error: 'Not found',
        message: 'No active schedule found'
      });
    }

    const updateData = { ...req.body, lastUpdatedBy: req.user._id };
    await schedule.updateClassOnDay(req.params.day, req.params.entryId, updateData);

    res.json({
      success: true,
      message: 'Class updated successfully',
      data: schedule.getAllClassesSorted()
    });
  } catch (error) {
    console.error('Update class in schedule error:', error);
    
    if (error.message === 'Time conflict with existing class') {
      return res.status(400).json({
        error: 'Schedule conflict',
        message: error.message
      });
    }

    if (error.message === 'Schedule entry not found') {
      return res.status(404).json({
        error: 'Not found',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update class in schedule'
    });
  }
});

// DELETE /api/schedule/class/:day/:entryId - Remove class from schedule (admin only)
router.delete('/class/:day/:entryId', [
  authenticateToken,
  requireAdmin,
  param('day').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day of week'),
  param('entryId').isMongoId().withMessage('Invalid entry ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const schedule = await Schedule.getActiveSchedule();
    
    if (!schedule) {
      return res.status(404).json({
        error: 'Not found',
        message: 'No active schedule found'
      });
    }

    await schedule.removeClassFromDay(req.params.day, req.params.entryId);

    res.json({
      success: true,
      message: 'Class removed from schedule successfully',
      data: schedule.getAllClassesSorted()
    });
  } catch (error) {
    console.error('Remove class from schedule error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to remove class from schedule'
    });
  }
});

// PUT /api/schedule/settings - Update schedule settings (admin only)
router.put('/settings', [
  authenticateToken,
  requireAdmin,
  body('businessHours.weekdays.open').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid weekday open time format'),
  body('businessHours.weekdays.close').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid weekday close time format'),
  body('businessHours.weekends.open').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid weekend open time format'),
  body('businessHours.weekends.close').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid weekend close time format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    let schedule = await Schedule.getActiveSchedule();
    
    if (!schedule) {
      schedule = new Schedule({
        weeklySchedule: {
          monday: [], tuesday: [], wednesday: [], thursday: [],
          friday: [], saturday: [], sunday: []
        }
      });
    }

    // Update settings
    if (req.body.businessHours) {
      schedule.businessHours = { ...schedule.businessHours, ...req.body.businessHours };
    }
    
    if (req.body.announcements) {
      schedule.announcements = req.body.announcements;
    }

    schedule.lastUpdatedBy = req.user._id;
    await schedule.save();

    res.json({
      success: true,
      message: 'Schedule settings updated successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Update schedule settings error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update schedule settings'
    });
  }
});

module.exports = router;
