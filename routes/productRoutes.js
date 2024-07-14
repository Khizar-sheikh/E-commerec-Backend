const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authmiddleware');
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct, 
    getProductsByCategory,
    getProductsByCollection,
    getProductsBySubcategory
} = require('../controllers/productController');

router.post('/create', authenticate, authorize(['admin', 'superadmin']), createProduct);
router.get('/all', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', authenticate, authorize(['admin', 'superadmin']), updateProduct);
router.delete('/:id', authenticate, authorize(['admin', 'superadmin']), deleteProduct);
router.get('/products/category/:categoryId', getProductsByCategory);
router.get('/products/collection/:collectionId', getProductsByCollection);
router.get('/products/subcategory/:subcategoryId', getProductsBySubcategory);


module.exports = router;
