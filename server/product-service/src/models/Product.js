const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price must be greater than 0']
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
      enum: [
        'Electronics',
        'Clothing',
        'Home & Kitchen',
        'Books',
        'Toys',
        'Sports',
        'Beauty',
        'Health',
        'Automotive',
        'Other'
      ]
    },
    image: {
      type: String,
      default: 'no-image.jpg'
    },
    inStock: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide product quantity'],
      min: [0, 'Quantity cannot be negative']
    },
    features: {
      type: [String],
      default: []
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    reviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Create index for search
ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', ProductSchema); 