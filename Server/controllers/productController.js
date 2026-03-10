const Product = require('../models/Product');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const { category, gender, page = 1, limit = 10, search } = req.query;
        
        // Build filter object
        const filter = {};
        if (category) filter.category = category;
        if (gender) filter.gender = gender;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        };

        const products = await Product.find(filter)
            .limit(options.limit * 1)
            .skip((options.page - 1) * options.limit)
            .sort(options.sort);

        const totalProducts = await Product.countDocuments(filter);

        res.json({
            success: true,
            products,
            pagination: {
                currentPage: options.page,
                totalPages: Math.ceil(totalProducts / options.limit),
                totalProducts,
                hasNext: options.page < Math.ceil(totalProducts / options.limit),
                hasPrev: options.page > 1
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products'
        });
    }
};

// Get single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching product'
        });
    }
};

// Create new product (Admin only)
const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            mainImg,
            carousel,
            sizes,
            category,
            gender,
            price,
            discount
        } = req.body;

        const newProduct = new Product({
            title,
            description,
            mainImg,
            carousel,
            sizes,
            category,
            gender,
            price,
            discount
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating product'
        });
    }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating product'
        });
    }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting product'
        });
    }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });

        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products by category'
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory
};