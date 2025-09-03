const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Contact = require('../models/Contact');

const router = express.Router();

// GET /api/contact - Get active contact information (public endpoint)
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.getActiveContact();
    
    if (!contact) {
      // Return empty contact data if none exists
      return res.json({
        success: true,
        message: 'No contact information found',
        data: {
          phone: '',
          email: '',
          address: {
            street: '',
            city: '',
            postalCode: '',
            country: '',
            full: ''
          },
          socialMedia: {
            instagram: { url: '', display: '' },
            facebook: { url: '', display: '' },
            youtube: { url: '', display: '' }
          }
        }
      });
    }
    
    // Remove sensitive fields for public endpoint
    const publicContact = {
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
      socialMedia: contact.socialMedia
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
    
    if (!contact) {
      return res.json({
        success: true,
        message: 'No contact information found',
        data: null
      });
    }
    
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

// PUT /api/contact - Update or create contact information (admin only)
router.put('/', [
  authenticateToken,
  requireAdmin,
  body('phone').optional().trim().custom((value) => {
    if (value && value.length > 0) {
      // Remove all non-digit characters for validation
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        throw new Error('Phone number must be between 7 and 15 digits');
      }
    }
    return true;
  }),
  body('email').optional().trim().custom((value) => {
    if (value && value.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error('Valid email is required');
      }
    }
    return true;
  }),
  body('address.street').optional().trim().custom((value) => {
    if (value && value.length > 0) {
      if (value.length < 3 || value.length > 100) {
        throw new Error('Street address must be between 3 and 100 characters');
      }
      // Check for invalid characters in street address
      const invalidChars = /[@!<?\/{}[\]\\|`~$%^&*()+=;:"'<>]/;
      if (invalidChars.test(value)) {
        throw new Error('Street address contains invalid characters. Only letters, numbers, spaces, hyphens, periods, commas, #, /, and & are allowed');
      }
    }
    return true;
  }),
  body('address.city').optional().trim().custom((value) => {
    if (value && value.length > 0) {
      // Allow letters, spaces, hyphens, and apostrophes for city names
      const cityRegex = /^[A-Za-z\s\-']{2,50}$/;
      if (!cityRegex.test(value)) {
        throw new Error('City name must be 2-50 characters (letters, spaces, hyphens, or apostrophes)');
      }
    }
    return true;
  }),
  body('address.postalCode').optional().trim().custom((value) => {
    if (value && value.length > 0) {
      // Allow alphanumeric postal codes (US, UK, Canada, etc.)
      const postalCodeRegex = /^[A-Za-z0-9\s-]{3,10}$/;
      if (!postalCodeRegex.test(value)) {
        throw new Error('Postal code must be 3-10 characters (letters, numbers, spaces, or hyphens)');
      }
    }
    return true;
  }),
  body('address.country').optional().trim().custom((value) => {
    if (value && value.length > 0) {
      // Allow letters, spaces, hyphens, and apostrophes for country names
      const countryRegex = /^[A-Za-z\s\-']{2,50}$/;
      if (!countryRegex.test(value)) {
        throw new Error('Country name must be 2-50 characters (letters, spaces, hyphens, or apostrophes)');
      }
    }
    return true;
  }),
  body('socialMedia.instagram.url').optional().trim().custom((value) => {
    if (value && value.length > 0) {
      try {
        const url = new URL(value);
        if (!url.hostname.includes('instagram.com')) {
          throw new Error('Instagram URL must be from instagram.com');
        }
        return true;
      } catch {
        throw new Error('Valid Instagram URL is required (e.g., https://instagram.com/username)');
      }
    }
    return true;
  }),
  body('socialMedia.instagram.display').optional().trim().custom((value) => {
    if (value && value.length > 0) {
      return value.length >= 1;
    }
    return true;
  }),
  body('socialMedia.facebook.url').optional().trim().custom((value) => {
    if (value && value.length > 0) {
      try {
        const url = new URL(value);
        if (!url.hostname.includes('facebook.com')) {
          throw new Error('Facebook URL must be from facebook.com');
        }
        return true;
      } catch {
        throw new Error('Valid Facebook URL is required (e.g., https://facebook.com/username)');
      }
    }
    return true;
  }),
  body('socialMedia.facebook.display').optional().trim().custom((value) => {
    if (value && value.length > 0) {
      return value.length >= 1;
    }
    return true;
  }),
  body('socialMedia.youtube.url').optional().trim().custom((value) => {
    if (value && value.length > 0) {
      try {
        const url = new URL(value);
        if (!url.hostname.includes('youtube.com') && !url.hostname.includes('youtu.be')) {
          throw new Error('YouTube URL must be from youtube.com or youtu.be');
        }
        return true;
      } catch {
        throw new Error('Valid YouTube URL is required (e.g., https://youtube.com/channel/... or https://youtu.be/...)');
      }
    }
    return true;
  }),
  body('socialMedia.youtube.display').optional().trim().custom((value) => {
    if (value && value.length > 0) {
      return value.length >= 1;
    }
    return true;
  }),

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

    console.log('PUT /api/contact - Request body:', req.body);
    
    let contact = await Contact.getActiveContact();
    console.log('Existing contact from database:', contact);
    
    if (!contact) {
      // Create new contact if none exists
      console.log('Creating new contact...');
      contact = new Contact(req.body);
      contact.lastUpdatedBy = req.user._id;
      contact.lastUpdatedAt = new Date();
      
      // Auto-generate full address
      if (req.body.address) {
        const { street, city, postalCode, country } = req.body.address;
        contact.address.full = `${street}, ${postalCode} ${city}, ${country}`;
      }
      
      await contact.save();
      console.log('New contact created:', contact);
      
      res.json({
        success: true,
        message: 'Contact information created successfully',
        data: contact
      });
    } else {
      // Update existing contact
      console.log('Updating existing contact...');
      const updatedContact = await contact.updateContactInfo(req.body, req.user._id);
      console.log('Contact updated:', updatedContact);
      
      res.json({
        success: true,
        message: 'Contact information updated successfully',
        data: updatedContact
      });
    }
  } catch (error) {
    console.error('Update/create contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update/create contact information'
    });
  }
});



module.exports = router;
