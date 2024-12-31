# Base image for Node.js
FROM node:18

# Set working directory
WORKDIR /dist

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Compile TypeScript
RUN npm run build

# Expose the backend port
EXPOSE 3000

# Start the backend
CMD ["node", "dist/app.js"]
