FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application
COPY . .

# Compile TypeScript
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
