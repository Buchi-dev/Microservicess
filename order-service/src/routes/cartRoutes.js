const express = require('express');
const {
  getCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getCartItems)
  .post(addCartItem)
  .delete(clearCart);

router.route('/:id')
  .put(updateCartItem)
  .delete(removeCartItem);

module.exports = router; 