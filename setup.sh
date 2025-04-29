#!/bin/bash

# Display header
echo "========================================="
echo "Microservices Application Setup Script"
echo "========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker and Docker Compose first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Install dependencies for each service
echo "Installing dependencies for all services..."

# User Service
echo "Installing dependencies for User Service..."
cd ./user-service
npm install
cd ..

# Product Service
echo "Installing dependencies for Product Service..."
cd ./product-service
npm install
cd ..

# Order Service
echo "Installing dependencies for Order Service..."
cd ./order-service
npm install
cd ..

# Payment Service
echo "Installing dependencies for Payment Service..."
cd ./payment-service
npm install
cd ..

# Frontend
echo "Installing dependencies for Frontend..."
cd ./frontend
npm install
cd ..

# Build and start Docker containers
echo "Building and starting Docker containers..."
docker-compose build
docker-compose up -d

echo "========================================="
echo "Setup completed!"
echo "The following services are now running:"
echo "- User Service: http://localhost:3001"
echo "- Product Service: http://localhost:3002"
echo "- Order Service: http://localhost:3003"
echo "- Payment Service: http://localhost:3004"
echo "- Frontend: http://localhost:3000"
echo "- RabbitMQ Management UI: http://localhost:15672"
echo "=========================================" 