const express = require('express');
const router = express.Router();
const {
    getAdminData,
    updateAdminData,
    getDashboardStats,
    getAllUsers,
    deleteUser
} = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET /api/admin/data
// @desc    Get admin data (banner and categories)
// @access  Public (for categories)
router.get('/data', getAdminData);

// @route   PUT /api/admin/data
// @desc    Update admin data
// @access  Private (Admin only)
router.put('/data', auth, adminAuth, updateAdminData);

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', auth, adminAuth, getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', auth, adminAuth, getAllUsers);

// @route   DELETE /api/admin/users/:userId
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:userId', auth, adminAuth, deleteUser);

module.exports = router;