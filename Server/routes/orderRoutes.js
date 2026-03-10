const express = require('express');
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, createOrder);

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, getUserOrders);

// @route   GET /api/orders/all
// @desc    Get all orders (Admin only)
// @access  Private (Admin)
router.get('/all', auth, adminAuth, getAllOrders);

// @route   GET /api/orders/:orderId
// @desc    Get single order
// @access  Private
router.get('/:orderId', auth, getOrderById);

// @route   PUT /api/orders/:orderId/status
// @desc    Update order status (Admin only)
// @access  Private (Admin)
router.put('/:orderId/status', auth, adminAuth, updateOrderStatus);

// @route   PUT /api/orders/:orderId/cancel
// @desc    Cancel order
// @access  Private
router.put('/:orderId/cancel', auth, cancelOrder);

module.exports = router;