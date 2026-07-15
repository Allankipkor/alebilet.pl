# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Create the runtime image for backend and static frontend
FROM node:20-alpine
WORKDIR /app

# Copy root package.json & install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy backend package.json & install backend dependencies
COPY backend/package*.json ./backend/
RUN npm ci --prefix backend --only=production

# Copy backend application files
COPY backend/ ./backend/

# Copy statically built frontend assets from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the server port
EXPOSE 5000
ENV PORT=5000
ENV NODE_ENV=production

# Run the backend server
CMD ["node", "backend/server.js"]
