#!/bin/bash

# Make script exit on error
set -e

echo "========================================"
echo "Microservices Codebase Cleanup Utility"
echo "========================================"
echo

echo "This utility will help you clean the codebase by:"
echo " - Removing node_modules folders"
echo " - Clearing build artifacts and cache"
echo " - Finding and optionally removing unused files"
echo

# Basic cleanup function
basic_cleanup() {
  echo "Running basic cleanup..."
  
  echo "Removing node_modules folders..."
  find . -name "node_modules" -type d -prune -exec rm -rf {} \; 2>/dev/null || true
  
  echo "Removing build artifacts..."
  find . -name "build" -type d -prune -exec rm -rf {} \; 2>/dev/null || true
  find . -name "dist" -type d -prune -exec rm -rf {} \; 2>/dev/null || true
  find . -name ".next" -type d -prune -exec rm -rf {} \; 2>/dev/null || true
  find . -name "out" -type d -prune -exec rm -rf {} \; 2>/dev/null || true
  
  echo "Removing cache folders..."
  find . -name ".cache" -type d -prune -exec rm -rf {} \; 2>/dev/null || true
  find . -name ".parcel-cache" -type d -prune -exec rm -rf {} \; 2>/dev/null || true
  
  echo "Removing log files..."
  find . -name "*.log" -type f -delete 2>/dev/null || true
  
  echo "Basic cleanup complete!"
  echo
}

# Find large files
find_large_files() {
  echo "Finding large files (greater than 10MB)..."
  echo "Results will be saved to large_files.txt"
  echo
  
  # Find files larger than 10MB excluding node_modules and .git
  find . -type f -size +10M -not -path "*/node_modules/*" -not -path "*/.git/*" | xargs du -h > large_files.txt
  
  # Display the results
  cat large_files.txt
  
  echo
  echo "Large files have been listed in large_files.txt"
  echo
}

# Find potentially unused files
find_unused_files() {
  echo "This will attempt to find potentially unused files by checking:"
  echo " - JavaScript files not imported anywhere"
  echo " - Components that might not be used"
  echo
  echo "NOTE: This is a heuristic approach and might have false positives."
  echo "      Manual review is recommended before deletion."
  echo
  
  read -p "Continue? (y/n): " confirm
  if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    return
  fi
  
  echo "Searching for potentially unused files..."
  echo "Results will be saved to unused_files.txt"
  echo
  
  # Remove previous file if it exists
  rm -f unused_files.txt
  
  # Find all JS/TS/JSX/TSX files and check if they're imported anywhere
  find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/.git/*" | while read file; do
    filename=$(basename "$file" | cut -d. -f1)
    
    # Check if this file is imported or required anywhere else
    if ! grep -r --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" -l "import.*$filename\b" . | grep -v "$file" > /dev/null && ! grep -r --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" -l "require.*$filename\b" . | grep -v "$file" > /dev/null; then
      echo "$file" >> unused_files.txt
      echo "Potentially unused: $file"
    fi
  done
  
  echo
  echo "Potentially unused files have been listed in unused_files.txt"
  echo "Please review this file carefully before deleting anything!"
  echo
}

# Docker cleanup
docker_cleanup() {
  echo "This will remove Docker containers, volumes, and images related to the project."
  echo
  read -p "Continue? (y/n): " confirm
  if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    return
  fi
  
  echo "Stopping and removing containers..."
  docker-compose down
  
  read -p "Remove volumes? (y/n): " remove_volumes
  if [[ "$remove_volumes" == "y" || "$remove_volumes" == "Y" ]]; then
    echo "Removing volumes..."
    docker-compose down -v
  fi
  
  read -p "Remove project images? (y/n): " remove_images
  if [[ "$remove_images" == "y" || "$remove_images" == "Y" ]]; then
    echo "Removing project images..."
    docker images "microservices_*" -q | xargs -r docker rmi
  fi
  
  echo "Docker cleanup complete!"
  echo
}

# Full cleanup
full_cleanup() {
  echo "Running full cleanup process..."
  echo
  
  echo "Step 1: Basic cleanup..."
  basic_cleanup
  
  echo "Step 2: Finding large files..."
  find_large_files
  
  echo "Step 3: Finding potentially unused files..."
  # Skip confirmation for full cleanup
  echo "y" | find_unused_files
  
  echo "Step 4: Docker cleanup..."
  # Skip confirmation for full cleanup
  echo "Stopping and removing containers..."
  docker-compose down
  
  echo "Full cleanup complete!"
  echo "Please review large_files.txt and unused_files.txt before deleting any files."
  echo
}

# Main menu
while true; do
  echo "Select an operation:"
  echo "1. Basic cleanup (node_modules, build files, logs)"
  echo "2. Find large files"
  echo "3. Find potentially unused files"
  echo "4. Remove Docker containers, volumes, and images"
  echo "5. Full cleanup (all of the above)"
  echo "6. Exit"
  echo
  
  read -p "Enter your choice (1-6): " choice
  echo
  
  case $choice in
    1) basic_cleanup ;;
    2) find_large_files ;;
    3) find_unused_files ;;
    4) docker_cleanup ;;
    5) full_cleanup ;;
    6) echo "Exiting cleanup utility..."; exit 0 ;;
    *) echo "Invalid choice. Please try again." ;;
  esac
done 