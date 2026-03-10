const express = require('express');
const router = express.Router();
const {
    addToCart,
    getCartItems,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', auth, addToCart);

// @route   GET /api/cart
// @desc    Get user's cart items
// @access  Private
router.get('/', auth, getCartItems);

// @route   PUT /api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/:itemId', auth, updateCartItem);

// @route   DELETE /api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:itemId', auth, removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', auth, clearCart);

module.exports = router;