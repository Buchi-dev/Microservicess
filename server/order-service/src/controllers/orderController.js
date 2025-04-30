const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const { publishMessage, EVENT_TYPES, subscribeToMessages } = require('../../shared/messaging');

// Set up subscription to payment success events
const setupSubscriptions = async () => {
  await subscribeToMessages('payment.success', async (message) => {
    try {
      console.log('Received payment.success event:', message);
      
      const { orderId, paymentId } = message;
      
      // Find the order
      const order = await Order.findById(orderId);
      
      if (order) {
        // Update the order status
        order.status = 'paid';
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentId = paymentId;
        
        await order.save();
        
        console.log(`Order ${orderId} marked as paid`);
      }
    } catch (error) {
      console.error('Error processing payment.success event:', error);
    }
  });
  
  await subscribeToMessages('payment.failed', async (message) => {
    try {
      console.log('Received payment.failed event:', message);
      
      const { orderId, reason } = message;
      
      // Find the order
      const order = await Order.findById(orderId);
      
      if (order) {
        // Update the order status
        order.status = 'cancelled';
        order.paymentFailReason = reason;
        
        await order.save();
        
        console.log(`Order ${orderId} marked as cancelled due to payment failure`);
      }
    } catch (error) {
      console.error('Error processing payment.failed event:', error);
    }
  });
  
  console.log('Subscribed to payment events');
};

// Call this function when the app starts
setupSubscriptions().catch(err => {
  console.error('Failed to set up subscriptions:', err);
});

// @desc    Create new order from cart
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    // Get cart items
    const cartItems = await CartItem.find({ userId: req.userId });
    
    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    
    // Create order
    const order = await Order.create({
      userId: req.userId,
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });
    
    // Clear cart after order creation
    await CartItem.deleteMany({ userId: req.userId });
    
    // Publish order.created event
    await publishMessage(EVENT_TYPES.ORDER_CREATED, {
      orderId: order._id,
      userId: order.userId,
      items: order.items,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod
    });
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders for user
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id ${req.params.id}`
      });
    }
    
    // Can only cancel if status is pending
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is ${order.status}`
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
}; 