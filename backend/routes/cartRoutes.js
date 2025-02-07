const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add-to-cart', cartController.addToCart);
router.get('/cart-items', cartController.getCartItems);
router.get('/cart-items/:userId', cartController.getCartItemsByUserId);
router.delete('/remove-from-cart/:id', cartController.removeFromCart);

module.exports = router;
