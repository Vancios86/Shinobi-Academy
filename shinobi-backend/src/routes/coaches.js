const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Coach = require('../models/Coach');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/coaches';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'coach-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const router = express.Router();

// POST /api/coaches/upload - Upload coach image
router.post('/upload', 
  authenticateToken, 
  requireAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Return the file path that can be used as imgSrc
      const imagePath = `/uploads/coaches/${req.file.filename}`;
      
      res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          filename: req.file.filename,
          path: imagePath,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload image'
      });
    }
  }
);

// GET /api/coaches - Get all coaches (public)
router.get('/', async (req, res) => {
  try {
    const coaches = await Coach.find({ isActive: true }).sort({ order: 1 });
    res.json({
      success: true,
      data: coaches
    });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coaches'
    });
  }
});

// GET /api/coaches/admin - Get all coaches for admin (including inactive)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const coaches = await Coach.find().sort({ order: 1 });
    res.json({
      success: true,
      data: coaches
    });
  } catch (error) {
    console.error('Error fetching coaches for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coaches'
    });
  }
});

// POST /api/coaches - Create new coach
router.post('/', 
  authenticateToken, 
  requireAdmin,
  [
    body('name').notEmpty().withMessage('Coach name is required'),
    body('imgSrc').notEmpty().withMessage('Coach image is required'),
    body('specialty').optional().trim(),
    body('description').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, imgSrc, specialty, description, order = 0 } = req.body;

      const coach = new Coach({
        name,
        imgSrc,
        specialty,
        description,
        order
      });

      await coach.save();

      res.status(201).json({
        success: true,
        data: coach,
        message: 'Coach created successfully'
      });
    } catch (error) {
      console.error('Error creating coach:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create coach'
      });
    }
  }
);

// PUT /api/coaches/reorder - Reorder coaches
router.put('/reorder', 
  authenticateToken, 
  requireAdmin,
  async (req, res) => {
  try {
    const { coachIds } = req.body;

    if (!Array.isArray(coachIds)) {
      return res.status(400).json({
        success: false,
        message: 'coachIds must be an array'
      });
    }

    // Update order for each coach
    const updatePromises = coachIds.map((coachId, index) => 
      Coach.findByIdAndUpdate(coachId, { order: index })
    );

    await Promise.all(updatePromises);

    // Return updated coaches list
    const coaches = await Coach.find().sort({ order: 1 });

    res.json({
      success: true,
      data: coaches,
      message: 'Coaches reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering coaches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder coaches'
    });
  }
});

// PUT /api/coaches/:id - Update coach
router.put('/:id',
  authenticateToken,
  requireAdmin,
  [
    body('name').notEmpty().withMessage('Coach name is required'),
    body('imgSrc').notEmpty().withMessage('Coach image is required'),
    body('specialty').notEmpty().withMessage('Coach specialty is required'),
    body('description').notEmpty().withMessage('Coach description is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { name, imgSrc, specialty, description, order, isActive } = req.body;

      const coach = await Coach.findByIdAndUpdate(
        id,
        { name, imgSrc, specialty, description, order, isActive },
        { new: true, runValidators: true }
      );

      if (!coach) {
        return res.status(404).json({
          success: false,
          message: 'Coach not found'
        });
      }

      res.json({
        success: true,
        data: coach,
        message: 'Coach updated successfully'
      });
    } catch (error) {
      console.error('Error updating coach:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update coach'
      });
    }
  }
);

// DELETE /api/coaches/:id - Delete coach
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const coach = await Coach.findByIdAndDelete(id);

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    res.json({
      success: true,
      message: 'Coach deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting coach:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete coach'
    });
  }
});

module.exports = router;
