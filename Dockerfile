FROM node:20-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application files
COPY . .

# Set ownership to node user for security
RUN chown -R node:node /app

# Switch to non-root user
USER node

EXPOSE 6502

CMD ["node", "server.js"]
