const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Class = require('../models/Class');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/classes - Get all active classes (public endpoint)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const classes = await Class.getActiveClasses();
    
    res.json({
      success: true,
      data: classes,
      count: classes.length
    });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch classes'
    });
  }
});

// GET /api/classes/admin - Get all classes for admin (including inactive)
router.get('/admin', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const classes = await Class.find().sort({ order: 1 });
    
    res.json({
      success: true,
      data: classes,
      count: classes.length
    });
  } catch (error) {
    console.error('Get admin classes error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch classes'
    });
  }
});

// GET /api/classes/:id - Get single class by ID
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid class ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const classItem = await Class.findById(req.params.id);
    
    if (!classItem) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Class not found'
      });
    }

    // Increment views if not admin request
    if (!req.user || req.user.role !== 'admin') {
      await classItem.incrementViews();
    }

    res.json({
      success: true,
      data: classItem
    });
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch class'
    });
  }
});

// POST /api/classes - Create new class (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Class name is required')
    .isLength({ max: 100 })
    .withMessage('Class name cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Class description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('image')
    .notEmpty()
    .withMessage('Class image is required'),
  body('imageType')
    .isIn(['upload', 'url'])
    .withMessage('Invalid image type'),
  body('order')
    .isInt({ min: 0 })
    .withMessage('Order must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const classData = req.body;

    // Check if order already exists
    const existingClass = await Class.findOne({ order: classData.order });
    if (existingClass) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'A class with this order already exists'
      });
    }

    const newClass = new Class(classData);
    await newClass.save();

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: newClass
    });
  } catch (error) {
    console.error('Create class error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create class'
    });
  }
});

// PUT /api/classes/:id - Update class (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  param('id').isMongoId().withMessage('Invalid class ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Class name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Class name cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Class description cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('imageType')
    .optional()
    .isIn(['upload', 'url'])
    .withMessage('Invalid image type'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const classItem = await Class.findById(req.params.id);
    
    if (!classItem) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Class not found'
      });
    }

    // If order is being changed, check for conflicts
    if (req.body.order && req.body.order !== classItem.order) {
      const existingClass = await Class.findOne({ 
        order: req.body.order, 
        _id: { $ne: req.params.id } 
      });
      if (existingClass) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'A class with this order already exists'
        });
      }
    }

    // Update class
    Object.assign(classItem, req.body);
    await classItem.save();

    res.json({
      success: true,
      message: 'Class updated successfully',
      data: classItem
    });
  } catch (error) {
    console.error('Update class error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update class'
    });
  }
});

// DELETE /api/classes/:id - Delete class (admin only)
router.delete('/:id', [
  authenticateToken,
  requireAdmin,
  param('id').isMongoId().withMessage('Invalid class ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const classItem = await Class.findById(req.params.id);
    
    if (!classItem) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Class not found'
      });
    }

    await Class.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete class'
    });
  }
});

// POST /api/classes/reorder - Reorder classes (admin only)
router.post('/reorder', [
  authenticateToken,
  requireAdmin,
  body('classes')
    .isArray()
    .withMessage('Classes must be an array')
    .custom((value) => {
      if (!value.every(item => 
        item.id && 
        /^[0-9a-fA-F]{24}$/.test(item.id) && 
        typeof item.order === 'number' && 
        item.order > 0
      )) {
        throw new Error('Each class must have a valid ID and order number');
      }
      return true;
    })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { classes } = req.body;
    
    // Debug: Log what we're receiving
    console.log('Backend received classes:', classes);

    // Verify all classes exist
    const classIds = classes.map(c => c.id);
    console.log('Extracted class IDs:', classIds);
    const existingClasses = await Class.find({ _id: { $in: classIds } });
    console.log('Found existing classes:', existingClasses.length, 'vs expected:', classIds.length);
    if (existingClasses.length !== classIds.length) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Some class IDs are invalid'
      });
    }

    // Reorder classes with their specific orders
    await Class.reorderClasses(classes);

    // Get updated classes
    const updatedClasses = await Class.getActiveClasses();

    res.json({
      success: true,
      message: 'Classes reordered successfully',
      data: updatedClasses
    });
  } catch (error) {
    console.error('Reorder classes error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to reorder classes'
    });
  }
});

module.exports = router;
