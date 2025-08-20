const express = require('express');
const { body, validationResult } = require('express-validator');
const Coach = require('../models/Coach');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

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
