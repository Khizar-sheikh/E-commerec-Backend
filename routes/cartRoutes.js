const express = require('express');
const router = express.Router();
const manageCart = require('../middleware/manageCart');
const { addItemToCart, getCart, removeItemFromCart, updateCartItemQuantity } = require('../controllers/cartController');

router.post('/add', manageCart ,  addItemToCart);
router.get('/', manageCart,  getCart);
router.delete('/:itemId', manageCart ,  removeItemFromCart);
router.put('/:itemId/quantity', manageCart , updateCartItemQuantity);

module.exports = router;
