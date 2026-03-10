const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Get admin data (banner and categories)
const getAdminData = async (req, res) => {
    try {
        const adminData = await Admin.findOne();
        
        if (!adminData) {
            // Create default admin data if none exists
            const defaultAdmin = new Admin({
                banner: '',
                categories: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports']
            });
            await defaultAdmin.save();
            
            return res.json({
                success: true,
                adminData: defaultAdmin
            });
        }

        res.json({
            success: true,
            adminData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching admin data'
        });
    }
};

// Update admin data (banner and categories)
const updateAdminData = async (req, res) => {
    try {
        const { banner, categories } = req.body;

        let adminData = await Admin.findOne();

        if (!adminData) {
            adminData = new Admin({ banner, categories });
        } else {
            if (banner !== undefined) adminData.banner = banner;
            if (categories !== undefined) adminData.categories = categories;
        }

        await adminData.save();

        res.json({
            success: true,
            message: 'Admin data updated successfully',
            adminData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating admin data'
        });
    }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Get recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5);

        // Get orders by status
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Calculate total revenue
        const revenue = await Order.aggregate([
            {
                $match: {
                    orderStatus: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $multiply: [
                                { $subtract: ['$price', '$discount'] },
                                '$quantity'
                            ]
                        }
                    }
                }
            }
        ]);

        const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                recentOrders,
                ordersByStatus
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching dashboard stats'
        });
    }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        };

        const users = await User.find()
            .select('-password')
            .limit(options.limit)
            .skip((options.page - 1) * options.limit)
            .sort(options.sort);

        const totalUsers = await User.countDocuments();

        res.json({
            success: true,
            users,
            pagination: {
                currentPage: options.page,
                totalPages: Math.ceil(totalUsers / options.limit),
                totalUsers,
                hasNext: options.page < Math.ceil(totalUsers / options.limit),
                hasPrev: options.page > 1
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users'
        });
    }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting user'
        });
    }
};

module.exports = {
    getAdminData,
    updateAdminData,
    getDashboardStats,
    getAllUsers,
    deleteUser
};