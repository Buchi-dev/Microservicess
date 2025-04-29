const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { connect: connectRabbitMQ } = require('../shared/messaging');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Connect to RabbitMQ
connectRabbitMQ().catch(err => {
  console.error('Failed to connect to RabbitMQ:', err);
});

// Route files
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/payments', paymentRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'payment-service' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3004;

const server = app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
}); 