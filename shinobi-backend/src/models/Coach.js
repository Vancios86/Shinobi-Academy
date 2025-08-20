const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Coach name is required'],
    trim: true
  },
  imgSrc: {
    type: String,
    required: [true, 'Coach image is required'],
    trim: true
  },
  specialty: {
    type: String,
    required: [true, 'Coach specialty is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Coach description is required'],
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add index for ordering
coachSchema.index({ order: 1 });

// Transform _id to id when converting to JSON
coachSchema.methods.toJSON = function() {
  const coachObject = this.toObject();
  coachObject.id = coachObject._id;
  delete coachObject._id;
  delete coachObject.__v;
  return coachObject;
};

module.exports = mongoose.model('Coach', coachSchema);
