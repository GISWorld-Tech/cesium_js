# Use an official Node.js runtime as the base image
FROM node

# Set the working directory in the container
WORKDIR /cesiumjs

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the entire src directory to the working directory
COPY ./src/ ./src/

# Install webpack and necessary plugins
RUN npm install webpack webpack-cli webpack-dev-server -g html-webpack-plugin copy-webpack-plugin style-loader css-loader url-loader

# Copy webpack configuration file
COPY webpack.config.js ./

# Bundle the app

RUN npm run build

# Expose the port that your app will run on
EXPOSE 8080

# Define the command to run your app
CMD ["npm", "start"]
