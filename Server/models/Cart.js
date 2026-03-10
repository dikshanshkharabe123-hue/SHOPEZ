const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    mainImg: { type: String },
    size: { type: String },
    quantity: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;