const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authmiddleware');
const {
    createProductVariant,
    getVariantsByProductId,
    getProductVariantById,
    updateProductVariant,
    deleteProductVariant
} = require('../controllers/productVariantController');

router.post('/create', authenticate, authorize(['admin', 'superadmin']), createProductVariant);
router.get('/product/:productId', getVariantsByProductId);
router.get('/:id', getProductVariantById);
router.put('/:id', authenticate, authorize(['admin', 'superadmin']), updateProductVariant);
router.delete('/:id', authenticate, authorize(['admin', 'superadmin']), deleteProductVariant);

module.exports = router;
