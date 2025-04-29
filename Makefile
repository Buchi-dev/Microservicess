.PHONY: setup teardown logs restart status build

# Setup the application
setup:
	@echo "Setting up Microservices application..."
	@echo "Checking if Docker is running..."
	@docker info > /dev/null 2>&1 || (echo "Docker is not running! Please start Docker and try again." && exit 1)
	
	@echo "Setting up environment files..."
	@[ -f user-service/.env ] || ([ -f user-service/.env.example ] && cp user-service/.env.example user-service/.env && echo "Created user-service/.env")
	@[ -f product-service/.env ] || ([ -f product-service/.env.example ] && cp product-service/.env.example product-service/.env && echo "Created product-service/.env")
	@[ -f order-service/.env ] || ([ -f order-service/.env.example ] && cp order-service/.env.example order-service/.env && echo "Created order-service/.env")
	@[ -f payment-service/.env ] || ([ -f payment-service/.env.example ] && cp payment-service/.env.example payment-service/.env && echo "Created payment-service/.env")
	
	@if [ ! -f frontend/.env ]; then \
		if [ -f frontend/.env.example ]; then \
			cp frontend/.env.example frontend/.env; \
			echo "Created frontend/.env"; \
		else \
			echo "VITE_API_USER_URL=http://localhost:3001" > frontend/.env; \
			echo "VITE_API_PRODUCT_URL=http://localhost:3002" >> frontend/.env; \
			echo "VITE_API_ORDER_URL=http://localhost:3003" >> frontend/.env; \
			echo "VITE_API_PAYMENT_URL=http://localhost:3004" >> frontend/.env; \
			echo "Created frontend/.env with default values"; \
		fi; \
	fi
	
	@echo "Building and starting services..."
	@docker-compose up -d
	
	@echo "Setup complete! Services are starting..."
	@echo "The application should be accessible at: http://localhost:3000"
	@echo "RabbitMQ Management UI: http://localhost:15672 (guest/guest)"

# Build docker images
build:
	@echo "Building Docker images..."
	@docker-compose build

# Start all services
start:
	@echo "Starting all services..."
	@docker-compose up -d

# Stop and remove containers, networks, and volumes
teardown:
	@echo "Stopping and removing all containers..."
	@docker-compose down
	
	@read -p "Do you want to remove Docker volumes? (y/n): " remove_volumes; \
	if [ "$$remove_volumes" = "y" ]; then \
		echo "Removing Docker volumes..."; \
		docker-compose down -v; \
	fi
	
	@read -p "Do you want to remove Docker images? (y/n): " remove_images; \
	if [ "$$remove_images" = "y" ]; then \
		echo "Removing Docker images..."; \
		docker images "microservices_*" -q | xargs -r docker rmi; \
	fi
	
	@echo "Teardown completed!"

# View logs of all services
logs:
	@docker-compose logs -f

# View specific service logs
log-%:
	@docker-compose logs -f $*

# Restart all services
restart:
	@echo "Restarting all services..."
	@docker-compose restart

# Restart a specific service
restart-%:
	@echo "Restarting $* service..."
	@docker-compose restart $*

# View the status of all services
status:
	@docker-compose ps

# Help command
help:
	@echo "Available commands:"
	@echo "  make setup      - Set up the application (copy env files and start services)"
	@echo "  make build      - Build all Docker images"
	@echo "  make start      - Start all services"
	@echo "  make teardown   - Stop and remove containers (with option for volumes and images)"
	@echo "  make logs       - View logs of all services"
	@echo "  make log-X      - View logs of service X (e.g., make log-user-service)"
	@echo "  make restart    - Restart all services"
	@echo "  make restart-X  - Restart service X (e.g., make restart-frontend)"
	@echo "  make status     - View status of all services"
	@echo "  make help       - Display this help message"

# Default target
.DEFAULT_GOAL := help 