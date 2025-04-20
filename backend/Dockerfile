FROM node:hydrogen-alpine AS dependencies

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node ./package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM dependencies AS local

# Create app directory
WORKDIR /usr/src/app

# Set the user to the node user
RUN chown -R node:node /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node .env .env

# Bundle app source
COPY --chown=node:node . ./

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:hydrogen-alpine AS build

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

# Copy the pre-built backend from the CI/CD pipeline
COPY --chown=node:node package*.json ./
COPY --chown=node:node .env .env
COPY --chown=node:node --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --chown=node:node dist ./dist

ENV NODE_ENV=production

USER node

EXPOSE 3003

CMD ["npm","run", "start:prod"]