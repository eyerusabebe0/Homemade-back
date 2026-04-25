const express = require('express');
const {
  createProduct,
  getProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { createPurchase, getMyPurchases } = require('../controllers/purchaseController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/my-products', auth, getMyProducts);
router.get('/:id', getProductById);
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);
router.post('/:id/purchase', auth, createPurchase);
router.get('/my-purchases', auth, getMyPurchases);

module.exports = router;