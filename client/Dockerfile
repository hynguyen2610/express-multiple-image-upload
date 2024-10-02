# Stage 1: Build the React app
FROM node:alpine

RUN apk add --no-cache curl

# Set the working directory
WORKDIR /app/

# Copy only package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Now copy the rest of the client files and build
COPY src ./src
COPY public ./public

RUN npm run build

CMD ["npm", "start"]