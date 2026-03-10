const Cart = require('../models/Cart');

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const {
            title,
            description,
            mainImg,
            size,
            quantity,
            price,
            discount
        } = req.body;

        const userId = req.user.userId;

        // Check if item already exists in cart
        const existingItem = await Cart.findOne({
            userId,
            title,
            size
        });

        if (existingItem) {
            // Update quantity if item exists
            existingItem.quantity = (parseInt(existingItem.quantity) + parseInt(quantity)).toString();
            await existingItem.save();

            return res.json({
                success: true,
                message: 'Cart item updated successfully',
                cartItem: existingItem
            });
        }

        // Create new cart item
        const newCartItem = new Cart({
            userId,
            title,
            description,
            mainImg,
            size,
            quantity,
            price,
            discount
        });

        await newCartItem.save();

        res.status(201).json({
            success: true,
            message: 'Item added to cart successfully',
            cartItem: newCartItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding to cart'
        });
    }
};

// Get user's cart items
const getCartItems = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cartItems = await Cart.find({ userId });

        // Calculate total
        const total = cartItems.reduce((sum, item) => {
            const itemTotal = (item.price - item.discount) * parseInt(item.quantity);
            return sum + itemTotal;
        }, 0);

        res.json({
            success: true,
            cartItems,
            total,
            itemCount: cartItems.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching cart items'
        });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.userId;

        const cartItem = await Cart.findOne({
            _id: itemId,
            userId
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.json({
            success: true,
            message: 'Cart item updated successfully',
            cartItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating cart item'
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.userId;

        const deletedItem = await Cart.findOneAndDelete({
            _id: itemId,
            userId
        });

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        res.json({
            success: true,
            message: 'Item removed from cart successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing cart item'
        });
    }
};

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        await Cart.deleteMany({ userId });

        res.json({
            success: true,
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while clearing cart'
        });
    }
};

module.exports = {
    addToCart,
    getCartItems,
    updateCartItem,
    removeFromCart,
    clearCart
};