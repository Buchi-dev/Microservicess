# Microservices eCommerce Platform

A full-stack eCommerce platform built with microservices architecture using Node.js, Express, MongoDB, RabbitMQ, and React.

## Services Overview

The platform consists of the following services:

1. **User Service** (Port 3001): Handles user authentication, registration, and profile management.
2. **Product Service** (Port 3002): Manages product catalog, inventory, and product-related operations.
3. **Order Service** (Port 3003): Manages shopping cart, checkout process, and order history.
4. **Payment Service** (Port 3004): Handles payment processing and transaction recording.
5. **Frontend** (Port 3000): React application for the user interface.

## Architecture

- **Backend**: Node.js with Express
- **Database**: MongoDB Atlas
- **Message Broker**: RabbitMQ
- **Frontend**: React with Ant Design
- **Containerization**: Docker and Docker Compose

## Events

Services communicate asynchronously through these RabbitMQ events:

- `user.created`: Published when a new user is registered
- `product.updated`: Published when product details or inventory changes
- `order.created`: Published when a new order is placed
- `payment.success`: Published when payment is successfully processed
- `payment.failed`: Published when payment processing fails

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- npm or yarn

### Environment Variables

Each service requires specific environment variables. Example `.env` files are provided in each service directory.

### Running with Docker

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ecommerce-microservices
   ```

2. Start all services:
   ```
   docker-compose up
   ```

3. Access the application at `http://localhost:3000`

### Running Services Individually

Each service can be run individually for development:

1. Navigate to the service directory:
   ```
   cd <service-name>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the service:
   ```
   npm run dev
   ```

## API Endpoints

### User Service (http://localhost:3001)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Product Service (http://localhost:3002)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product (admin)
- `PUT /api/products/:id` - Update a product (admin)
- `DELETE /api/products/:id` - Delete a product (admin)

### Order Service (http://localhost:3003)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove cart item
- `POST /api/orders` - Create an order from cart
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order

### Payment Service (http://localhost:3004)
- `POST /api/payments` - Process payment
- `GET /api/payments/:orderId` - Get payment status for an order

## Contributing

Follow the conventional commit message format: feat:, fix:, refactor:, etc. Pull requests should target the development branch. 