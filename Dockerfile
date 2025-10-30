# Use a lightweight Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy project files
COPY public ./public

# Install http-server globally
RUN npm install -g http-server


# Expose port
EXPOSE 8080

# Run http-server when container starts
CMD ["http-server", "-p", "8080", "-c-1"]