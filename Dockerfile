# ---------- Build stage ----------
FROM node:22-alpine AS build

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# copy source code
COPY . .

# build the vite app
RUN npm run build


# ---------- Serve stage ----------
FROM nginx:alpine

# remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run requires port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]