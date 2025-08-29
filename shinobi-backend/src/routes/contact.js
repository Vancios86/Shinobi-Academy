const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Contact = require('../models/Contact');

const router = express.Router();

// GET /api/contact - Get active contact information (public endpoint)
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.getActiveContact();
    
    // Remove sensitive fields for public endpoint
    const publicContact = {
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
      socialMedia: contact.socialMedia,
      businessHours: contact.businessHours
    };
    
    res.json({
      success: true,
      message: 'Contact information retrieved successfully',
      data: publicContact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact information'
    });
  }
});

// GET /api/contact/admin - Get full contact information for admin (including metadata)
router.get('/admin', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const contact = await Contact.getActiveContact();
    
    res.json({
      success: true,
      message: 'Contact information retrieved successfully',
      data: contact
    });
  } catch (error) {
    console.error('Get admin contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact information'
    });
  }
});

// PUT /api/contact - Update contact information (admin only)
router.put('/', [
  authenticateToken,
  requireAdmin,
  body('phone').optional().trim().isLength({ min: 1 }).withMessage('Phone number is required'),
  body('email').optional().trim().isEmail().withMessage('Valid email is required'),
  body('address.street').optional().trim().isLength({ min: 1 }).withMessage('Street is required'),
  body('address.city').optional().trim().isLength({ min: 1 }).withMessage('City is required'),
  body('address.postalCode').optional().trim().isLength({ min: 1 }).withMessage('Postal code is required'),
  body('address.country').optional().trim().isLength({ min: 1 }).withMessage('Country is required'),
  body('socialMedia.instagram.url').optional().trim().isURL().withMessage('Valid Instagram URL is required'),
  body('socialMedia.instagram.display').optional().trim().isLength({ min: 1 }).withMessage('Instagram display is required'),
  body('socialMedia.facebook.url').optional().trim().isURL().withMessage('Valid Facebook URL is required'),
  body('socialMedia.facebook.display').optional().trim().isLength({ min: 1 }).withMessage('Facebook display is required'),
  body('socialMedia.youtube.url').optional().trim().isURL().withMessage('Valid YouTube URL is required'),
  body('socialMedia.youtube.display').optional().trim().isLength({ min: 1 }).withMessage('YouTube display is required'),

], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const contact = await Contact.getActiveContact();
    const updatedContact = await contact.updateContactInfo(req.body, req.user._id);
    
    res.json({
      success: true,
      message: 'Contact information updated successfully',
      data: updatedContact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact information'
    });
  }
});

// POST /api/contact/reset - Reset contact information to default values (admin only)
router.post('/reset', [authenticateToken, requireAdmin], async (req, res) => {
  try {
    const contact = await Contact.getActiveContact();
    const resetContact = await contact.resetToDefault(req.user._id);
    
    res.json({
      success: true,
      message: 'Contact information reset to default values successfully',
      data: resetContact
    });
  } catch (error) {
    console.error('Reset contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset contact information'
    });
  }
});

module.exports = router;
