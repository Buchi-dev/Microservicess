FROM node:18-alpine

# Set Node.js memory limits
ENV NODE_OPTIONS="--max-old-space-size=256"

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    # Install dev dependencies separately (for build tools)
    npm install --only=development && \
    # Cache cleanup
    npm cache clean --force

# Copy application code
COPY . .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"] 