const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const GalleryImage = require('../models/Gallery');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/gallery';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
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

// POST /api/gallery/upload - Upload gallery image
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

      // Return the file path that can be used as src
      const imagePath = `/uploads/gallery/${req.file.filename}`;
      
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

// GET /api/gallery - Get all gallery images (public)
router.get('/', async (req, res) => {
  try {
    const { category, tags, limit = 50 } = req.query;
    let query = { isActive: true };

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Filter by tags if provided
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const images = await GalleryImage.find(query)
      .sort({ order: 1, uploadDate: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images'
    });
  }
});

// GET /api/gallery/admin - Get all gallery images for admin (including inactive)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ order: 1, uploadDate: -1 });
    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Error fetching gallery images for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images'
    });
  }
});

// GET /api/gallery/categories - Get all available categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await GalleryImage.distinct('category', { isActive: true });
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// POST /api/gallery - Create new gallery image
router.post('/', 
  authenticateToken, 
  requireAdmin,
  [
    body('title').notEmpty().withMessage('Image title is required'),
    body('src').notEmpty().withMessage('Image source is required'),
    body('description').optional().trim(),
    body('category').optional().trim(),
    body('tags').optional().isArray(),
    body('order').optional().isNumeric()
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

      const { title, src, description, category, tags, order = 0 } = req.body;

      const image = new GalleryImage({
        title,
        src,
        description: description || '',
        category: category || 'General',
        tags: tags || [],
        order
      });

      await image.save();

      res.status(201).json({
        success: true,
        data: image,
        message: 'Gallery image created successfully'
      });
    } catch (error) {
      console.error('Error creating gallery image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create gallery image'
      });
    }
  }
);

// PUT /api/gallery/reorder - Reorder gallery images
router.put('/reorder', 
  authenticateToken, 
  requireAdmin,
  async (req, res) => {
    try {
      console.log('Reorder request received:', req.body);
      const { imageIds } = req.body;

      if (!Array.isArray(imageIds)) {
        console.log('Invalid imageIds format:', typeof imageIds, imageIds);
        return res.status(400).json({
          success: false,
          message: 'Image IDs array is required'
        });
      }

      console.log('Processing reorder for imageIds:', imageIds);

      // Update order for each image
      const updatePromises = imageIds.map((imageId, index) => 
        GalleryImage.findByIdAndUpdate(imageId, { order: index }, { new: true })
      );

      const updatedImages = await Promise.all(updatePromises);
      console.log('Successfully updated images:', updatedImages.length);

      res.json({
        success: true,
        data: updatedImages,
        message: 'Gallery images reordered successfully'
      });
    } catch (error) {
      console.error('Error reordering gallery images:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reorder gallery images'
      });
    }
  }
);

// PUT /api/gallery/:id - Update gallery image
router.put('/:id', 
  authenticateToken, 
  requireAdmin,
  [
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('category').optional().trim(),
    body('tags').optional().isArray(),
    body('order').optional().isNumeric(),
    body('isActive').optional().isBoolean()
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
      const updateData = req.body;

      const image = await GalleryImage.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      );

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Gallery image not found'
        });
      }

      res.json({
        success: true,
        data: image,
        message: 'Gallery image updated successfully'
      });
    } catch (error) {
      console.error('Error updating gallery image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update gallery image'
      });
    }
  }
);

// DELETE /api/gallery/:id - Delete gallery image
router.delete('/:id', 
  authenticateToken, 
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const image = await GalleryImage.findByIdAndDelete(id);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Gallery image not found'
        });
      }

      res.json({
        success: true,
        message: 'Gallery image deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete gallery image'
      });
    }
  }
);

module.exports = router;
