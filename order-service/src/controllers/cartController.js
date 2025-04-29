const CartItem = require('../models/CartItem');

// @desc    Get cart items for a user
// @route   GET /api/cart
// @access  Private
exports.getCartItems = async (req, res, next) => {
  try {
    const cartItems = await CartItem.find({ userId: req.userId });
    
    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: cartItems
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addCartItem = async (req, res, next) => {
  try {
    const { productId, name, price, quantity, image } = req.body;
    
    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({ 
      userId: req.userId,
      productId: productId
    });
    
    if (cartItem) {
      // Update quantity if item exists
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        userId: req.userId,
        productId,
        name,
        price,
        quantity: quantity || 1,
        image
      });
    }
    
    res.status(201).json({
      success: true,
      data: cartItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/:id
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    
    // Ensure positive quantity
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    // Find cart item and ensure it belongs to the user
    let cartItem = await CartItem.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: `Cart item not found with id ${req.params.id}`
      });
    }
    
    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();
    
    res.status(200).json({
      success: true,
      data: cartItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
exports.removeCartItem = async (req, res, next) => {
  try {
    // Find cart item and ensure it belongs to the user
    const cartItem = await CartItem.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: `Cart item not found with id ${req.params.id}`
      });
    }
    
    await cartItem.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    await CartItem.deleteMany({ userId: req.userId });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 