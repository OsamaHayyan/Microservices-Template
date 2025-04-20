# Base image: node:hydrogen-slim
FROM node:hydrogen-slim AS base
LABEL authors="osamahayyan"
WORKDIR /app
COPY ./package*.json ./

FROM base AS development
RUN npm ci
COPY . .
COPY .env.local .env
EXPOSE 5173

FROM base AS build
COPY . .
COPY --from=development /app/node_modules ./node_modules
COPY .env.production .env

RUN npm run build

RUN npm ci --omit=dev && npm cache clean --force

FROM nginx:stable-alpine3.19-slim AS production

ENV NEST_URL=http://backend:3003

COPY .nginx/templates /etc/nginx/templates/
COPY --from=build app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
