const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Content = require('../models/Content');

const router = express.Router();

// Get content data
router.get('/', async (req, res) => {
  try {
    const content = await Content.getContent();
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content data'
    });
  }
});

// Update content data
router.put('/', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const { about } = req.body;
    
    if (!about) {
      return res.status(400).json({
        success: false,
        message: 'Content data is required'
      });
    }

    // Get or create content document
    let content = await Content.findOne();
    if (!content) {
      content = new Content();
    }

    // Update the about section
    content.about = {
      ...content.about,
      ...about
    };

    await content.save();

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: content
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content data'
    });
  }
});

// Reset content to default values
router.post('/reset', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    // Delete existing content to force recreation with defaults
    await Content.deleteMany({});
    
    // Create new content with default values
    const content = new Content();
    await content.save();

    res.json({
      success: true,
      message: 'Content reset to default values',
      data: content
    });
  } catch (error) {
    console.error('Error resetting content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset content data'
    });
  }
});

module.exports = router;
