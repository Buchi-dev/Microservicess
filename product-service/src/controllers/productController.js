const Product = require('../models/Product');
const { publishMessage, EVENT_TYPES, subscribeToMessages } = require('../../shared/messaging');

// Subscribe to order.created events to adjust inventory
const setupSubscriptions = async () => {
  await subscribeToMessages('order.created', async (message) => {
    try {
      console.log('Received order.created event', message);
      
      // Extract order items
      const { items } = message;
      
      // Update inventory for each product
      for (const item of items) {
        const product = await Product.findById(item.productId);
        
        if (product) {
          // Decrement quantity
          product.quantity -= item.quantity;
          
          // Update inStock status if needed
          if (product.quantity <= 0) {
            product.inStock = false;
          }
          
          await product.save();
          
          // Publish product.updated event
          await publishMessage(EVENT_TYPES.PRODUCT_UPDATED, {
            productId: product._id,
            name: product.name,
            inStock: product.inStock,
            quantity: product.quantity
          });
        }
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

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    
    // Fields to exclude from filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // Filter by category if provided
    if (req.query.category) {
      queryObj.category = req.query.category;
    }
    
    // Filter by inStock if provided
    if (req.query.inStock) {
      queryObj.inStock = req.query.inStock === 'true';
    }
    
    // Filter by price range if provided
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
    }
    
    // Search by text if provided
    let query;
    if (req.query.search) {
      query = Product.find({ $text: { $search: req.query.search } });
    } else {
      query = Product.find(queryObj);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const products = await query;
    
    // Count total results
    const total = await Product.countDocuments(queryObj);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    
    // Publish product.updated (created) event
    await publishMessage(EVENT_TYPES.PRODUCT_UPDATED, {
      productId: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      inStock: product.inStock,
      quantity: product.quantity,
      action: 'created'
    });
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${req.params.id}`
      });
    }
    
    // Publish product.updated event
    await publishMessage(EVENT_TYPES.PRODUCT_UPDATED, {
      productId: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      inStock: product.inStock,
      quantity: product.quantity,
      action: 'updated'
    });
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${req.params.id}`
      });
    }
    
    await product.deleteOne();
    
    // Publish product.updated (deleted) event
    await publishMessage(EVENT_TYPES.PRODUCT_UPDATED, {
      productId: product._id,
      name: product.name,
      action: 'deleted'
    });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 