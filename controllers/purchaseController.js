const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

const createPurchase = async (req, res) => {
  try {
    const { productId, quantity, total } = req.body;
    
    const product = await Product.findById(productId);
    if (!product || product.status !== 'approved') {
      return res.status(404).json({ message: 'Product not available' });
    }
    
    const purchase = new Purchase({
      productId,
      userId: req.user.id,
      userName: req.user.name,
      productTitle: product.title,
      productImage: product.image,
      productPrice: product.price,
      quantity,
      total
    });
    
    await purchase.save();
    res.status(201).json({ success: true, purchase });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, purchases });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPurchase, getMyPurchases };