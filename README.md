# Microservices System

A full-stack e-commerce application built with a microservices architecture.

## System Components

- **Frontend**: React application (port 3000)
- **User Service**: Authentication and user management (port 3001)
- **Product Service**: Product catalog and inventory (port 3002)
- **Order Service**: Order processing and management (port 3003)
- **Payment Service**: Payment processing (port 3004)
- **Message Broker**: RabbitMQ for service communication (ports 5672, 15672)
- **Shared Modules**: Common code shared between services

## Quick Start

### For Windows (PowerShell - Recommended):

```powershell
# Start all services
.\run.ps1

# Stop all services
.\stop.ps1
```

### For Windows (Batch):

```cmd
# Start all services
run.bat

# Stop all services
stop.bat
```

### For Linux/macOS:

```bash
# Make the scripts executable
chmod +x run.sh stop.sh

# Start all services
./run.sh

# Stop all services
./stop.sh
```

## Accessing Services

- Frontend: http://localhost:3000
- User API: http://localhost:3001
- Product API: http://localhost:3002
- Order API: http://localhost:3003
- Payment API: http://localhost:3004
- RabbitMQ Dashboard: http://localhost:15672 (user: guest, password: guest)

## Project Structure

```
microservices/
├── frontend/              # React frontend application
├── server/                # Backend microservices
│   ├── user-service/      # Authentication and user management
│   ├── product-service/   # Product catalog and inventory
│   ├── order-service/     # Order processing
│   └── payment-service/   # Payment processing
├── shared/                # Shared modules used by all services
│   └── messaging/         # RabbitMQ messaging utilities
└── docker-compose.yml     # Docker Compose configuration
```

## Development

Each service can be developed independently. See the README in each service directory for detailed information. 