# Microservices E-Commerce Application

A fully-featured e-commerce application built with a microservices architecture.

## Architecture Overview

This application consists of the following services:

- **User Service** (Port 3001): Handles user authentication, registration, and profile management
- **Product Service** (Port 3002): Manages product catalog, inventory, and product details
- **Order Service** (Port 3003): Processes order creation and management
- **Payment Service** (Port 3004): Handles payment processing and verification
- **Frontend** (Port 3000): React-based client application
- **RabbitMQ** (Port 5672, UI: 15672): Message broker for inter-service communication

## Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local development)
- Git

## Quick Start

### Setup with Batch Scripts (Windows)

1. Clone the repository:
   ```
   git clone <repository-url>
   cd microservices
   ```

2. Run the setup script:
   ```
   setup.bat
   ```

3. Access the application at http://localhost:3000

4. To stop the application:
   ```
   teardown.bat
   ```

### Setup with Makefile (Linux/macOS)

1. Clone the repository:
   ```
   git clone <repository-url>
   cd microservices
   ```

2. Run the setup command:
   ```
   make setup
   ```

3. Access the application at http://localhost:3000

4. To stop the application:
   ```
   make teardown
   ```

### Manual Setup

1. Clone the repository
2. Copy `.env.example` files to `.env` in each service directory
3. Build and start services:
   ```
   docker-compose build
   docker-compose up -d
   ```

## Development

### Service Structure

Each service follows a similar structure:
- `/src/controllers`: Request handlers
- `/src/models`: Database models
- `/src/routes`: API endpoints
- `/src/services`: Business logic
- `/src/utils`: Helper functions
- `/src/queue`: Message queue consumers/publishers

### Environment Variables

Each service has its own `.env` file with the following common variables:
- `NODE_ENV`: development/production
- `PORT`: Service port
- `MONGODB_URI`: MongoDB connection string
- `RABBITMQ_URL`: RabbitMQ connection string

Additionally:
- User Service: `JWT_SECRET`, `JWT_EXPIRATION`

### Frontend Configuration

The frontend uses environment variables to connect to the backend services:
- `VITE_API_USER_URL`
- `VITE_API_PRODUCT_URL`
- `VITE_API_ORDER_URL`
- `VITE_API_PAYMENT_URL`

## Maintenance and Cleanup

### Codebase Cleanup

We provide utilities to help maintain a clean codebase:

#### Cleanup Scripts

##### Windows
```
cleanup.bat
```

##### Linux/macOS
```
chmod +x cleanup.sh
./cleanup.sh
```

These utilities help you:
- Remove `node_modules` directories and build artifacts
- Find large files that might be accidentally committed
- Identify potentially unused files in the codebase
- Clean up Docker containers, volumes, and images

Always review the results before deleting any files, especially when using the unused file detection feature, as it may have false positives.

#### Dependency Cleaner

The dependency cleaner helps identify potentially unused npm dependencies in your services:

```
node dep-cleaner.js [service-directory]
```

If no service directory is specified, it will check all services.

Example:
```
node dep-cleaner.js frontend
```

This tool scans your JavaScript/TypeScript files and looks for import statements or require calls that reference each dependency listed in your package.json files. It then suggests which dependencies might be safely removed.

**Note:** Always verify before removing any dependency as the tool uses heuristics and may not detect all usage patterns.

## API Documentation

### User Service
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Product Service
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Order Service
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)

### Payment Service
- `POST /api/payments` - Process payment
- `GET /api/payments/:orderId` - Get payment status

## Troubleshooting

### Common Issues

1. **Services can't communicate**: Ensure the RabbitMQ service is healthy. Check logs with `docker-compose logs rabbitmq`.

2. **Database connection issues**: Verify MongoDB connection strings in each service's `.env` file.

3. **Frontend can't connect to backend**: Ensure the frontend environment variables are pointing to the correct service URLs.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit changes: `git commit -m "feat: add new feature"`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Submit a pull request

Follow conventional commit messages (feat:, fix:, refactor:, etc.) and keep the codebase clean.

## License

[MIT License](LICENSE) 