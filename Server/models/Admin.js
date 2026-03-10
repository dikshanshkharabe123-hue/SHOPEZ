const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    banner: { type: String },
    categories: { type: Array }
}, {
    timestamps: true
});

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;