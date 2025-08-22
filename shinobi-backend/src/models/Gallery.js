const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Image title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  src: {
    type: String,
    required: [true, 'Image source is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    default: 'General'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  fileSize: {
    type: Number,
    default: 0
  },
  dimensions: {
    width: Number,
    height: Number
  }
}, {
  timestamps: true
});

// Index for performance
galleryImageSchema.index({ order: 1 });
galleryImageSchema.index({ category: 1 });
galleryImageSchema.index({ tags: 1 });
galleryImageSchema.index({ isActive: 1 });

// Transform output (ensure id is returned instead of _id)
galleryImageSchema.methods.toJSON = function() {
  const imageObject = this.toObject();
  imageObject.id = imageObject._id;
  delete imageObject._id;
  delete imageObject.__v;
  return imageObject;
};

// Static method to find active images
galleryImageSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ order: 1 });
};

// Static method to find images by category
galleryImageSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ order: 1 });
};

// Static method to find images by tags
galleryImageSchema.statics.findByTags = function(tags) {
  return this.find({ 
    tags: { $in: tags }, 
    isActive: true 
  }).sort({ order: 1 });
};

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);

module.exports = GalleryImage;
