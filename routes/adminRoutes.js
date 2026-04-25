const express = require('express');
const {
  approveProduct,
  rejectProduct,
  getAllUsers,
  getAllPurchases,
  getDashboardStats
} = require('../controllers/adminController');
const { getPendingProducts } = require('../controllers/productController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(auth, isAdmin);

router.get('/pending-products', getPendingProducts);
router.put('/approve-product/:id', approveProduct);
router.put('/reject-product/:id', rejectProduct);
router.get('/users', getAllUsers);
router.get('/purchases', getAllPurchases);
router.get('/stats', getDashboardStats);

module.exports = router;