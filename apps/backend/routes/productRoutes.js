const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, getMyProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/mine', requireAuth, requireRole('seller'), getMyProducts);
router.get('/:id', getProductById);
router.post('/', requireAuth, requireRole('seller'), createProduct);
router.put('/:id', requireAuth, requireRole('seller'), updateProduct);
router.delete('/:id', requireAuth, requireRole('seller'), deleteProduct);

module.exports = router;
