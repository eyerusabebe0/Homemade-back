const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  productTitle: { type: String, required: true },
  productImage: { type: String, required: true },
  productPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', purchaseSchema);