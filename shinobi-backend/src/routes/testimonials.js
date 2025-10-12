const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Testimonial = require('../models/Testimonial');

const router = express.Router();

// Public: list active testimonials
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
        res.json({ success: true, data: testimonials });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
    }
});

// Admin: list all testimonials
router.get('/admin', [authenticateToken, requireAdmin], async (req, res) => {
    try {
        const testimonials = await Testimonial.find({}).sort({ order: 1, createdAt: 1 });
        res.json({ success: true, data: testimonials });
    } catch (error) {
        console.error('Error fetching admin testimonials:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
    }
});

// Admin: reorder testimonials (must be before '/:id' routes)
router.put('/reorder', [authenticateToken, requireAdmin], async (req, res) => {
    try {
        const { order } = req.body; // [{id, order}, ...]
        if (!Array.isArray(order)) return res.status(400).json({ success: false, message: 'Invalid order payload' });
        const bulkOps = order.map(item => ({
            updateOne: { filter: { _id: item.id }, update: { $set: { order: item.order } } }
        }));
        if (bulkOps.length) await Testimonial.bulkWrite(bulkOps);
        res.json({ success: true, message: 'Order updated' });
    } catch (error) {
        console.error('Error reordering testimonials:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Admin: create testimonial
router.post('/', [authenticateToken, requireAdmin], async (req, res) => {
    try {
        const testimonial = new Testimonial(req.body);
        await testimonial.save();
        res.json({ success: true, data: testimonial });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Admin: update testimonial
router.put('/:id', [authenticateToken, requireAdmin], async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Testimonial.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        res.json({ success: true, data: updated });
    } catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// Admin: delete testimonial
router.delete('/:id', [authenticateToken, requireAdmin], async (req, res) => {
    try {
        const { id } = req.params;
        await Testimonial.findByIdAndDelete(id);
        res.json({ success: true, message: 'Testimonial deleted' });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// (reorder route moved above)

module.exports = router;


