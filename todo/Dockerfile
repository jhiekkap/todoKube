# FROM node:latest
# WORKDIR /mydir
# EXPOSE 5000
# COPY . .
# RUN npm install
# RUN npm run build
# RUN npm install -g serve 
# CMD ["serve", "-s", "-l", "5000", "build"]



# Multi-stage
# # 1) Node image for building frontend assets
# # 2) nginx stage to serve frontend assets

# # Name the node stage "builder"
# FROM node:10 AS builder
# # Set working directory
# WORKDIR /app
# # Copy all files from current directory to working dir in image
# COPY . .
# # install node modules and build assets
# RUN yarn install && yarn build

# # nginx state for serving content
# FROM nginx:alpine
# # Set working directory to nginx asset directory
# WORKDIR /usr/share/nginx/html
# # Remove default nginx static assets
# RUN rm -rf ./*
# # Copy static assets from builder stage
# COPY --from=builder /app/build .
# # Containers run nginx with global directives and daemon off
# ENTRYPOINT ["nginx", "-g", "daemon off;"]

FROM node:10 AS ui-build
WORKDIR /usr/src/app
COPY . .
COPY my-app/ ./my-app/
RUN cd my-app && npm install && npm run build 

FROM node:10 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/my-app/build ./my-app/build 
COPY api/package*.json ./api/
RUN cd api && npm install
COPY api/server.js ./api/

EXPOSE 3000

CMD ["node", "./api/server.js"]