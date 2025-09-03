const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    default: ''
  },
  address: {
    street: {
      type: String,
      required: false,
      trim: true,
      default: ''
    },
    city: {
      type: String,
      required: false,
      trim: true,
      default: ''
    },
    postalCode: {
      type: String,
      required: false,
      trim: true,
      default: ''
    },
    country: {
      type: String,
      required: false,
      trim: true,
      default: ''
    },
    full: {
      type: String,
      required: false,
      trim: true,
      default: ''
    }
  },
  socialMedia: {
    instagram: {
      url: {
        type: String,
        required: false,
        trim: true,
        default: ''
      },
      display: {
        type: String,
        required: false,
        trim: true,
        default: ''
      },
      platform: {
        type: String,
        required: false,
        trim: true,
        default: 'instagram'
      }
    },
    facebook: {
      url: {
        type: String,
        required: false,
        trim: true,
        default: ''
      },
      display: {
        type: String,
        required: false,
        trim: true,
        default: ''
      },
      platform: {
        type: String,
        required: false,
        trim: true,
        default: 'facebook'
      }
    },
    youtube: {
      url: {
        type: String,
        required: false,
        trim: true,
        default: ''
      },
      display: {
        type: String,
        required: false,
        trim: true,
        default: ''
      },
      platform: {
        type: String,
        required: false,
        trim: true,
        default: 'youtube'
      }
    }
  },

  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Static method to get active contact information
contactSchema.statics.getActiveContact = async function() {
  try {
    let contact = await this.findOne().sort({ createdAt: -1 });
    
    if (!contact) {
      // Return null if no contact exists - let the frontend handle empty state
      return null;
    }
    
    return contact;
  } catch (error) {
    console.error('Error getting active contact:', error);
    throw error;
  }
};

  // Method to update contact information
  contactSchema.methods.updateContactInfo = async function(updateData, userId) {
    try {
      // Update all fields
      Object.keys(updateData).forEach(key => {
        if (key === 'phone' || key === 'email') {
          // Handle simplified phone and email structure
          this[key] = updateData[key];
        } else if (key === 'address' || key === 'socialMedia') {
          // Handle nested structure for address and social media
          this[key] = { ...this[key], ...updateData[key] };
        }
      });
      
      // Update metadata
      this.lastUpdatedBy = userId;
      this.lastUpdatedAt = new Date();
      
      // Auto-generate full address if address components changed
      if (updateData.address) {
        const { street, city, postalCode, country } = this.address;
        this.address.full = `${street}, ${postalCode} ${city}, ${country}`;
      }
      
      await this.save();
      return this;
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  };



module.exports = mongoose.model('Contact', contactSchema);
