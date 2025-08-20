const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    maxlength: [100, 'Class name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Class description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String,
    required: [true, 'Class image is required']
  },
  imageType: {
    type: String,
    enum: ['predefined', 'upload', 'url'],
    required: [true, 'Image type is required'],
    default: 'predefined'
  },
  imagePosition: {
    type: String,
    default: 'center',
    maxlength: [50, 'Image position cannot exceed 50 characters']
  },
  alignment: {
    type: String,
    enum: ['left', 'right', 'center'],
    default: 'left'
  },
  speed: {
    type: Number,
    min: [-10, 'Speed cannot be less than -10'],
    max: [10, 'Speed cannot be greater than 10'],
    default: 0
  },
  order: {
    type: Number,
    required: [true, 'Display order is required'],
    min: [0, 'Order cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true
  },
  metadata: {
    views: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [30, 'Tag cannot exceed 30 characters']
    }]
  }
}, {
  timestamps: true
});

// Indexes for performance
classSchema.index({ order: 1 });
classSchema.index({ isActive: 1 });
classSchema.index({ slug: 1 });
classSchema.index({ 'metadata.featured': 1 });

// Pre-save middleware to generate slug
classSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  }
  next();
});

// Static method to get active classes in order
classSchema.statics.getActiveClasses = function() {
  return this.find({ isActive: true }).sort({ order: 1 });
};

// Static method to get next available order
classSchema.statics.getNextOrder = async function() {
  const lastClass = await this.findOne().sort({ order: -1 });
  return lastClass ? lastClass.order + 1 : 1;
};

// Instance method to increment views
classSchema.methods.incrementViews = function() {
  this.metadata.views += 1;
  return this.save();
};

// Static method to reorder classes
classSchema.statics.reorderClasses = async function(classIds) {
  const bulkOps = classIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { order: index + 1 }
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

// Virtual for display order (1-based instead of 0-based)
classSchema.virtual('displayOrder').get(function() {
  return this.order;
});

// Transform output
classSchema.methods.toJSON = function() {
  const classObject = this.toObject();
  classObject.id = classObject._id;
  delete classObject._id;
  delete classObject.__v;
  return classObject;
};

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
