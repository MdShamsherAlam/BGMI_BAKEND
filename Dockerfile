# Use the official Node.js version 16 image from Docker Hub
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port that your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
