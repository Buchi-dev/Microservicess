#!/bin/bash

echo "==========================================="
echo "     Microservices Teardown Script         "
echo "==========================================="

# Stop and remove all Docker containers
echo "Stopping and removing Docker containers..."
docker-compose down

# Remove Docker volumes (optional)
read -p "Do you want to remove Docker volumes as well? (y/n): " REMOVE_VOLUMES
if [[ "$REMOVE_VOLUMES" =~ ^[Yy]$ ]]; then
    echo "Removing Docker volumes..."
    docker-compose down -v
    echo "Docker volumes removed."
fi

# Remove Docker images (optional) 
read -p "Do you want to remove Docker images as well? (y/n): " REMOVE_IMAGES
if [[ "$REMOVE_IMAGES" =~ ^[Yy]$ ]]; then
    echo "Removing Docker images..."
    docker rmi $(docker images -q microservices_* 2>/dev/null) 2>/dev/null
    echo "Docker images removed."
fi

echo "==========================================="
echo "           Teardown completed!             "
echo "===========================================" 