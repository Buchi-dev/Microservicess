#!/bin/bash

# Colorize terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print banner
echo -e "${GREEN}====================================="
echo -e "  Microservices System Launcher"
echo -e "=====================================${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${YELLOW}Docker is not running. Please start Docker and try again.${NC}"
  exit 1
fi

# Install dependencies for shared module
echo -e "${GREEN}Installing dependencies for shared module...${NC}"
pushd shared > /dev/null
npm install
popd > /dev/null

# Install dependencies for frontend
echo -e "${GREEN}Installing dependencies for frontend...${NC}"
pushd frontend > /dev/null
npm install
popd > /dev/null

# Install dependencies for backend services
echo -e "${GREEN}Installing dependencies for backend services...${NC}"

# User Service
echo -e "${GREEN}Installing dependencies for user-service...${NC}"
pushd server/user-service > /dev/null
npm install
popd > /dev/null

# Product Service
echo -e "${GREEN}Installing dependencies for product-service...${NC}"
pushd server/product-service > /dev/null
npm install
popd > /dev/null

# Order Service
echo -e "${GREEN}Installing dependencies for order-service...${NC}"
pushd server/order-service > /dev/null
npm install
popd > /dev/null

# Payment Service
echo -e "${GREEN}Installing dependencies for payment-service...${NC}"
pushd server/payment-service > /dev/null
npm install
popd > /dev/null

# Stop any existing containers
echo -e "${GREEN}Stopping any existing containers...${NC}"
docker-compose down

# Build and start all services
echo -e "${GREEN}Building and starting all services...${NC}"
docker-compose up --build -d

# Show status
echo -e "${GREEN}Services status:${NC}"
docker-compose ps

echo -e "${GREEN}====================================="
echo -e "All services are now running!"
echo -e " - Frontend: http://localhost:3000"
echo -e " - User API: http://localhost:3001"
echo -e " - Product API: http://localhost:3002"
echo -e " - Order API: http://localhost:3003"
echo -e " - Payment API: http://localhost:3004"
echo -e " - RabbitMQ Dashboard: http://localhost:15672"
echo -e "=====================================${NC}"
echo -e "${YELLOW}To stop all services, run: ./stop.sh${NC}" 