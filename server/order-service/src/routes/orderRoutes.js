const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrder);

router.route('/:id/cancel')
  .put(cancelOrder);

module.exports = router; 