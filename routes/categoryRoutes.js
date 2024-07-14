const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authmiddleware'); // Assuming you have middleware for auth
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// Routes for categories
router.post('/create', authenticate, authorize(['admin', 'superadmin']), createCategory); // Create a category
router.get('/all', getAllCategories); // Get all categories
router.get('/:id', getCategoryById); // Get category by ID
router.put('/:id', authenticate, authorize(['admin', 'superadmin']), updateCategory); // Update category by ID
router.delete('/:id', authenticate, authorize(['admin', 'superadmin']), deleteCategory); // Delete category by ID

module.exports = router;
