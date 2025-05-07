# Base image: node:hydrogen-slim
FROM node:hydrogen-slim AS base
LABEL authors="osamahayyan"
WORKDIR /app
COPY ./package*.json ./

FROM base AS development
RUN npm ci
COPY . .
COPY .env .env
EXPOSE 5173

FROM nginx:stable-alpine3.19-slim AS production

ENV NEST_URL=http://backend:3003

COPY .nginx/templates /etc/nginx/templates/
COPY ./dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
