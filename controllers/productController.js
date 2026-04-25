const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      ownerId: req.user.id,
      ownerName: req.user.name,
      status: 'pending'
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      status: 'approved',
      deletedAt: null 
    }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      status: 'pending',
      deletedAt: null 
    }).populate('ownerId', 'name email');
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      ownerId: req.user.id,
      deletedAt: null
    }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.deletedAt) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.deletedAt) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(product, req.body);
    product.updatedAt = new Date();
    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    product.deletedAt = new Date();
    await product.save();

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getPendingProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct
};