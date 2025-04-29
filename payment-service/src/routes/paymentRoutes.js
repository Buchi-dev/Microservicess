const express = require('express');
const {
  processPayment,
  getPaymentStatus,
  getPayments
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Payment routes
router.route('/')
  .get(getPayments)
  .post(processPayment);

router.route('/:orderId')
  .get(getPaymentStatus);

module.exports = router; 