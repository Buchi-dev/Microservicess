const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be greater than 0']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['credit_card', 'paypal', 'stripe']
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: {
      type: String
    },
    failureReason: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', PaymentSchema); 