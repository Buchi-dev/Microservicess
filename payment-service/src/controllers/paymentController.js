const Payment = require('../models/Payment');
const { publishMessage, EVENT_TYPES, subscribeToMessages } = require('../../shared/messaging');
const { v4: uuidv4 } = require('uuid');

// Set up subscription to order.created events
const setupSubscriptions = async () => {
  await subscribeToMessages('order.created', async (message) => {
    try {
      console.log('Received order.created event:', message);
      
      // For automatic payment processing, we could process the payment here
      // For now, we'll just create a payment record
      const { orderId, userId, totalAmount, paymentMethod } = message;
      
      // Check if payment already exists
      const existingPayment = await Payment.findOne({ orderId });
      
      if (!existingPayment) {
        await Payment.create({
          orderId,
          userId,
          amount: totalAmount,
          paymentMethod,
          status: 'pending'
        });
        
        console.log(`Created pending payment for order ${orderId}`);
      }
    } catch (error) {
      console.error('Error processing order.created event:', error);
    }
  });
  
  console.log('Subscribed to order.created events');
};

// Call this function when the app starts
setupSubscriptions().catch(err => {
  console.error('Failed to set up subscriptions:', err);
});

// Mock payment processor
const processPaymentWithProvider = async (paymentData) => {
  // In a real implementation, this would call a payment gateway API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success/failure (90% success rate)
      const isSuccessful = Math.random() < 0.9;
      
      if (isSuccessful) {
        resolve({
          success: true,
          transactionId: uuidv4(),
          message: 'Payment processed successfully'
        });
      } else {
        reject({
          success: false,
          errorCode: 'PAYMENT_FAILED',
          message: 'Payment processing failed'
        });
      }
    }, 1000); // Simulate network delay
  });
};

// @desc    Process payment
// @route   POST /api/payments
// @access  Private
exports.processPayment = async (req, res, next) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;
    
    // Validate input
    if (!orderId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide orderId, amount, and paymentMethod'
      });
    }
    
    // Check if payment already exists
    const existingPayment = await Payment.findOne({ orderId });
    
    if (existingPayment && existingPayment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment for this order has already been processed'
      });
    }
    
    let payment;
    
    // Create or update payment record
    if (existingPayment) {
      payment = existingPayment;
    } else {
      payment = new Payment({
        orderId,
        userId: req.userId,
        amount,
        paymentMethod
      });
    }
    
    try {
      // Process payment with provider
      const result = await processPaymentWithProvider({
        amount,
        paymentMethod,
        orderId
      });
      
      // Update payment record
      payment.status = 'completed';
      payment.transactionId = result.transactionId;
      await payment.save();
      
      // Publish payment.success event
      await publishMessage(EVENT_TYPES.PAYMENT_SUCCESS, {
        orderId,
        userId: req.userId,
        paymentId: payment._id,
        transactionId: result.transactionId
      });
      
      return res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      // Update payment record with failure
      payment.status = 'failed';
      payment.failureReason = error.message;
      await payment.save();
      
      // Publish payment.failed event
      await publishMessage(EVENT_TYPES.PAYMENT_FAILED, {
        orderId,
        userId: req.userId,
        reason: error.message
      });
      
      return res.status(400).json({
        success: false,
        message: error.message || 'Payment processing failed'
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get payment status
// @route   GET /api/payments/:orderId
// @access  Private
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ 
      orderId: req.params.orderId,
      userId: req.userId
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: `Payment not found for order ${req.params.orderId}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all payments for user
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.userId }).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    next(err);
  }
}; 