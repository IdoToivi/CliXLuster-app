# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build for production
COPY . .
RUN npm run build

# Stage 2: Serve the static files using Nginx
FROM nginx:1.25-alpine

# Copy the compiled assets from the build stage to Nginx's default html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for traffic
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]