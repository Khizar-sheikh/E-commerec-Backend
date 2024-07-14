
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authmiddleware'); // Assuming you have middleware for auth
const { createSubCategory, getAllSubCategories, getSubCategoryById, updateSubCategory, deleteSubCategory } = require('../controllers/subCategoryController');

router.post('/create', authenticate, authorize(['admin', 'superadmin']), createSubCategory); // Create a category
router.get('/all', getAllSubCategories); // Get all categories
router.get('/:id', getSubCategoryById); // Get category by ID
router.put('/:id', authenticate, authorize(['admin', 'superadmin']), updateSubCategory); // Update category by ID
router.delete('/:id', authenticate, authorize(['admin', 'superadmin']), deleteSubCategory); // Delete category by ID

module.exports = router;
