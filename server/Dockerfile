FROM node:alpine

# Set the working directory for the server
WORKDIR /app

# Copy server code (if needed)
COPY server.js ./
COPY package.json package-lock.json ./
COPY routes ./routes

# Install server dependencies (if needed)
RUN npm install

CMD ["npm", "start"]
