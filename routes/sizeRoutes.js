const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authmiddleware');
const {
    createSize,
    getAllSizes,
    getSizeById,
    updateSize,
    deleteSize
} = require('../controllers/sizeController');

router.post('/create', authenticate, authorize(['admin', 'superadmin']), createSize);
router.get('/', getAllSizes);
router.get('/:id', getSizeById);
router.put('/:id', authenticate, authorize(['admin', 'superadmin']), updateSize);
router.delete('/:id', authenticate, authorize(['admin', 'superadmin']), deleteSize);

module.exports = router;
