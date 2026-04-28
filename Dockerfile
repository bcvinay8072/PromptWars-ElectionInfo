# Build stage
FROM node:20-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the app
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built assets to the Nginx server directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for Cloud Run
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
