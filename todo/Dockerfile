# FROM node:latest
# WORKDIR /mydir
# EXPOSE 5000
# COPY . .
# RUN npm install
# RUN npm run build
# RUN npm install -g serve 
# CMD ["serve", "-s", "-l", "5000", "build"]



# Multi-stage
# 1) Node image for building frontend assets
# 2) nginx stage to serve frontend assets

# Name the node stage "builder"
FROM node:latest AS builder
# Set working directory
WORKDIR /mydir
# Copy all files from current directory to working dir in image
COPY . .
# install node modules and build assets
RUN npm install && npm run build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /mydir/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]