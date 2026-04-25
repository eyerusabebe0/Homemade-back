// backend/controllers/adminController.js (Updated)
const Product = require('../models/Product');
const User = require('../models/User');
const Purchase = require('../models/Purchase');

const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const commission = product.price * 0.01;
    product.status = 'approved';
    product.paymentReceived = false;
    product.updatedAt = new Date();
    await product.save();
    
    res.json({ 
      success: true, 
      product,
      message: `Product approved. Commission to collect: ${commission} ETB`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rejectProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.status = 'rejected';
    product.updatedAt = new Date();
    await product.save();
    
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markPaymentReceived = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.paymentReceived = true;
    await product.save();
    
    res.json({ success: true, message: 'Payment marked as received' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.json({ success: true, purchases });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ deletedAt: null });
    const pendingProducts = await Product.countDocuments({ status: 'pending', deletedAt: null });
    const approvedProducts = await Product.countDocuments({ status: 'approved', deletedAt: null });
    const totalUsers = await User.countDocuments();
    const totalPurchases = await Purchase.countDocuments();
    
    const purchases = await Purchase.find();
    const totalRevenue = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
    
    res.json({
      success: true,
      stats: {
        totalProducts,
        pendingProducts,
        approvedProducts,
        totalUsers,
        totalPurchases,
        totalRevenue
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  approveProduct,
  rejectProduct,
  markPaymentReceived,
  getAllUsers,
  getAllPurchases,
  getDashboardStats
};