const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    full: {
      type: String,
      required: true,
      trim: true
    }
  },
  socialMedia: {
    instagram: {
      url: {
        type: String,
        required: true,
        trim: true
      },
      display: {
        type: String,
        required: true,
        trim: true
      },
      platform: {
        type: String,
        required: true,
        trim: true
      }
    },
    facebook: {
      url: {
        type: String,
        required: true,
        trim: true
      },
      display: {
        type: String,
        required: true,
        trim: true
      },
      platform: {
        type: String,
        required: true,
        trim: true
      }
    },
    youtube: {
      url: {
        type: String,
        required: true,
        trim: true
      },
      display: {
        type: String,
        required: true,
        trim: true
      },
      platform: {
        type: String,
        required: true,
        trim: true
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
      // Create default contact if none exists
      contact = new this({
        phone: "(+351) 977 777 777",
        email: "shinobiacademy@gmail.com",
        address: {
          street: "R.Convento da Trindade 15",
          city: "Lagos",
          postalCode: "8600-613",
          country: "Portugal",
          full: "R.Convento da Trindade 15, 8600-613 Lagos, Portugal"
        },
        socialMedia: {
          instagram: {
            url: "https://instagram.com/shinobiacademylagos",
            display: "shinobiacademylagos",
            platform: "Instagram"
          },
          facebook: {
            url: "https://www.facebook.com/profile.php?id=100028550547285",
            display: "Shinobi Academy Lagos",
            platform: "Facebook"
          },
          youtube: {
            url: "https://www.youtube.com/c/ShinobiVlog",
            display: "ShinobiVlog",
            platform: "YouTube"
          }
        },

        lastUpdatedBy: undefined // Will be set when first updated
      });
      await contact.save();
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

// Method to reset to default values
contactSchema.methods.resetToDefault = async function(userId) {
  try {
    const defaultData = {
      phone: "(+351) 977 777 777",
      email: "shinobiacademy@gmail.com",
      address: {
        street: "R.Convento da Trindade 15",
        city: "Lagos",
        postalCode: "8600-613",
        country: "Portugal",
        full: "R.Convento da Trindade 15, 8600-613 Lagos, Portugal"
      },
      socialMedia: {
        instagram: {
          url: "https://instagram.com/shinobiacademylagos",
          display: "shinobiacademylagos",
          platform: "Instagram"
        },
        facebook: {
          url: "https://www.facebook.com/profile.php?id=100028550547285",
          display: "Shinobi Academy Lagos",
          platform: "Facebook"
        },
        youtube: {
          url: "https://www.youtube.com/c/ShinobiVlog",
          display: "ShinobiVlog",
          platform: "YouTube"
        }
      },

    };
    
    Object.keys(defaultData).forEach(key => {
      this[key] = defaultData[key];
    });
    
    this.lastUpdatedBy = userId;
    this.lastUpdatedAt = new Date();
    
    await this.save();
    return this;
  } catch (error) {
    console.error('Error resetting contact to default:', error);
    throw error;
  }
};

module.exports = mongoose.model('Contact', contactSchema);
