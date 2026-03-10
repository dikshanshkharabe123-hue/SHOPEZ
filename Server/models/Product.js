const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    mainImg: { type: String, required: true },
    carousel: { type: Array },
    sizes: { type: Array },
    category: { type: String, required: true },
    gender: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;