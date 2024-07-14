const express = require('express');
const { authenticate, authorize } = require('../middleware/authmiddleware');
const { createAddress, getAddressByUserId, getUserAddress, updateAddress } = require('../controllers/addressController');
const router = express.Router();

// Create a new address
router.post('/', createAddress);

// Get address by user ID (Admin and Super Admin)
router.get('/user/:userId', authenticate, authorize(['admin', 'superadmin']), getAddressByUserId);

// Get address for the logged-in user
router.get('/', authenticate, getUserAddress);

// Update address for the logged-in user
router.put('/', authenticate, updateAddress);

module.exports = router;
