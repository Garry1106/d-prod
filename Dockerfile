# Simple development Dockerfile - with glibc for ONNX compatibility
FROM node:20-slim

# Install necessary dependencies for Prisma and ONNX Runtime
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Copy prisma directory to make schema files available during install
COPY prisma/ ./prisma/

# Install dependencies
RUN npm install

# Copy remaining project files
COPY . .

# Generate Prisma clients manually
RUN npx prisma generate --schema=./prisma/schema1.prisma
RUN npx prisma generate --schema=./prisma/schema2.prisma

# Install ts-node globally for the server
RUN npm install -g ts-node

# Expose port
EXPOSE 3000

# Start the app in development mode with socket server
CMD ["npm", "run", "dev:socket"]