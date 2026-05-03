# Build stage
FROM node:20-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the app
COPY . .
# Inject API key at build time via .env.production (CRA reads this automatically)
ARG REACT_APP_GEMINI_API_KEY
RUN if [ -n "$REACT_APP_GEMINI_API_KEY" ]; then \
      echo "REACT_APP_GEMINI_API_KEY=$REACT_APP_GEMINI_API_KEY" > .env.production; \
    fi && npm run build

# Production stage
FROM nginx:alpine

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets to the Nginx server directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
