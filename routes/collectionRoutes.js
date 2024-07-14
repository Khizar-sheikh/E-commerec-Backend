const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authmiddleware');
const {
    createCollection,
    getAllCollections,
    getCollectionById,
    updateCollection,
    deleteCollection
} = require('../controllers/collectionController');

router.post('/create', authenticate, authorize(['admin', 'superadmin']), createCollection);
router.get('/all', getAllCollections);
router.get('/:id', getCollectionById);
router.put('/:id', authenticate, authorize(['admin', 'superadmin']), updateCollection);
router.delete('/:id', authenticate, authorize(['admin', 'superadmin']), deleteCollection);

module.exports = router;
