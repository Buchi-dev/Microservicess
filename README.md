# Microservices E-Commerce System

A complete microservices-based e-commerce platform with optimized Docker configuration. This system provides a scalable architecture for building and running a modern e-commerce application.

## System Architecture

![Microservices Architecture](https://via.placeholder.com/800x400?text=Microservices+Architecture)

### Components

- **Frontend**: React application with Vite (port 3000)
- **User Service**: Authentication and user management (port 3001)
- **Product Service**: Product catalog and inventory (port 3002)
- **Order Service**: Order processing and management (port 3003)
- **Payment Service**: Payment processing (port 3004)
- **Message Broker**: RabbitMQ for service communication (ports 5672, 15672)
- **Shared Modules**: Common code shared between services

## Quick Start

### Prerequisites

- Docker Desktop
- Node.js 18+
- npm 8+

### Starting the System

#### For Windows (PowerShell):

```powershell
# Start all services
.\run.ps1

# Stop all services
.\stop.ps1

# Clean up Docker resources
.\docker-cleanup.ps1
```

#### For Linux/macOS:

```bash
# Make the scripts executable
chmod +x run.sh stop.sh

# Start all services
./run.sh

# Stop all services
./stop.sh
```

## Accessing Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React user interface |
| User API | http://localhost:3001 | Authentication & user management |
| Product API | http://localhost:3002 | Product catalog & inventory |
| Order API | http://localhost:3003 | Order processing |
| Payment API | http://localhost:3004 | Payment processing |
| RabbitMQ Dashboard | http://localhost:15672 | Message broker admin (guest/guest) |

## Project Structure

```
microservices/
├── frontend/                # React frontend application
│   ├── src/                 # Frontend source code
│   └── Dockerfile           # Optimized Node.js container configuration
├── server/                  # Backend microservices
│   ├── user-service/        # Authentication and user management
│   ├── product-service/     # Product catalog and inventory
│   ├── order-service/       # Order processing
│   └── payment-service/     # Payment processing
├── shared/                  # Shared modules used by all services
│   └── messaging/           # RabbitMQ messaging utilities
├── docker-compose.yml       # Container orchestration with resource limits
├── run.ps1                  # PowerShell startup script
├── stop.ps1                 # PowerShell shutdown script
└── docker-cleanup.ps1       # Docker resource cleanup script
```

## Development

Each service can be developed independently. The system uses Docker for local development and deployment.

### Architecture Patterns

- **Service Independence**: Each microservice is independent with its own database
- **Message-Based Communication**: Services communicate via RabbitMQ
- **API Gateway Pattern**: Each service exposes its own REST API
- **Database per Service**: Each service has dedicated MongoDB collection
- **Shared Code via Modules**: Common functionality in shared directory

### Memory Optimization

The system includes memory optimization for Docker:

- Memory limits for each service (256MB for backend, 512MB for frontend/RabbitMQ)
- Optimized Node.js memory settings in Dockerfiles
- Connection pooling for database connections
- Proper connection management for RabbitMQ
- Cleanup scripts to prevent resource leaks

## API Documentation

### User Service (Port 3001)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/register | POST | Register new user |
| /api/auth/login | POST | User login |
| /api/users | GET | Get all users (admin) |
| /api/users/:id | GET | Get user by ID |

### Product Service (Port 3002)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/products | GET | Get all products |
| /api/products/:id | GET | Get product by ID |
| /api/products | POST | Create product (admin) |
| /api/products/:id | PUT | Update product (admin) |

### Order Service (Port 3003)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/orders | GET | Get user orders |
| /api/orders/:id | GET | Get order by ID |
| /api/orders | POST | Create new order |
| /api/orders/:id | PUT | Update order status |

### Payment Service (Port 3004)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/payments | POST | Process payment |
| /api/payments/:id | GET | Get payment status |

## Messaging System

Services communicate through RabbitMQ using the following events:

| Event | Producer | Consumers | Description |
|-------|----------|-----------|-------------|
| user.created | User Service | - | User registration |
| product.created | Product Service | - | New product added |
| product.updated | Product Service | - | Product updated |
| order.created | Order Service | Product Service, Payment Service | New order created |
| order.paid | Payment Service | Order Service | Payment successful |
| order.fulfilled | Order Service | - | Order completed |

## Troubleshooting

### Common Issues

1. **Memory Issues**: If Docker Desktop shows high memory usage:
   - Run `.\docker-cleanup.ps1` to clean unused resources
   - Check container stats with `docker stats`
   - Adjust memory limits in docker-compose.yml

2. **Connection Issues**: If services can't connect to RabbitMQ:
   - Ensure RabbitMQ is running with `docker ps`
   - Check logs with `docker logs [rabbitmq-container-id]`

3. **Service Startup Failure**: If a service fails to start:
   - Check service logs: `docker-compose logs [service-name]`
   - Verify MongoDB connection string

## Deployment

The system is designed for both local development and cloud deployment:

- **Local**: Run with Docker Compose
- **Cloud**: Deploy to Kubernetes, AWS ECS, or other container orchestration platforms

## License

[MIT License](LICENSE)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 