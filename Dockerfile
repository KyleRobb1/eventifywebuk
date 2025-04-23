FROM node:16-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend code
COPY backend/ ./

# Copy website files to a public directory
COPY website/ ./public/

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["node", "server.js"]
