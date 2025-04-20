<!-- TOC -->
* [Project Overview](#project-overview)
    * [This project consists of three main modules:](#this-project-consists-of-three-main-modules)
    * [Features](#features)
* [API Documentation is available at the following link after starting the backend server:](#api-documentation-is-available-at-the-following-link-after-starting-the-backend-server)
* [Development Setup](#development-setup)
    * [Prerequisites](#prerequisites)
    * [Running All Systems](#running-all-systems)
    * [Running All Systems With Docker](#running-all-systems-with-docker)
* [To connect to MongoDB running in Docker:](#to-connect-to-mongodb-running-in-docker)
    * [Access via MongoDB Compass](#access-via-mongodb-compass)
* [MongoDB Replica Set Configuration](#mongodb-replica-set-configuration)
    * [Replica Set Requirements _(pre-configured in docker-compose)_](#replica-set-requirements-_pre-configured-in-docker-compose_)
    * [Network Configuration](#network-configuration)
    * [Initialization Process](#initialization-process)
* [Deployment](#deployment)
    * [Prerequisites](#prerequisites-1)
    * [Deployment Steps](#deployment-steps)
* [CI/CD Configuration](#cicd-configuration)
    * [GitHub Actions Secrets](#github-actions-secrets)
    * [GitHub Actions Environment Variables](#github-actions-environment-variables)
<!-- TOC -->

# Project Overview

### This project consists of three main modules:

1. **Client-side Application**: Built with React and Vite.
2. **NestJS Server**: As the backend server and authentication server for client side.
3. **MongoDB**: Used as the database for the application.

All modules are containerized with Docker and managed using Docker Compose. Multi-stage builds are implemented to
streamline development and production environments. The project also includes a CI/CD pipeline with Docker for
production deployment and ready to use with SSH on cloud virtual machine.

### Features

- **Documentation**: Comprehensive documentation for all APIs.
- **Dockerization**: All modules are containerized for easy deployment and management.
- **Optimized Docker Images**: Ensured minimal image sizes for production.
- **Multi-stage Builds**: Used for different environment local, development and production.
- **CI/CD Pipeline**: Automated deployment process using GitHub Actions.
- **MongoDB Replica sets**: Configured for high availability and data redundancy.
- **Hot Reloading**: Enabled for development across all systems.
- **Reverse Proxy**: Configured in production for efficient routing.
- **JWT Authentication**: Used for secure user authentication.
- **Refresh Token Rotation**: Implemented for enhanced security.
- **Environment Variables**: Configured, hosted and secured for both development and production environments in GitHub workflow.
- **Fully Customizable**: The application is designed to be easily customizable for .
- **Security**: Implemented best practices for securing the application and its data.

---

# API Documentation is available at the following link after starting the backend server:
[API Documentation](http://localhost:3003/api-docs)

---
# Development Setup

### Prerequisites

1. **Add the `*.docker.internal` names to the host's /etc/hosts file:**
   ```
   127.0.0.1 host.docker.internal
   127.0.0.1 gateway.docker.internal
   ```
2. **Ports `27017`, `27018`, `27019` should be free for database replica sets**.
3. **Install Docker and Docker Compose**: Ensure you have Docker and Docker Compose installed on your machine.

### Running All Systems

1. **Install MongoDB**
2. **Generate .env file for backend and set the env**.
   ```bash
   cd backend
   cat <<- EOF > .env
   MONGODB_DB=easygenerator
   MONGODB_MODE=local
   PORT=3003
   JWT_ACCESS_SECRET=easygenerator_access_token_secret
   JWT_REFRESH_SECRET=easygenerator_refresh_token_secret_here
   NODE_ENV=development
   EOF
   ``` 
3. **Generate .env file for frontend and set the env**
   ```bash
   cd frontend
   cat <<- EOF > .env
   VITE_BACKEND_API=http://localhost:3003
   EOF
   ```
4. **Start Backend:**
   ```bash
   npm run start:dev --prefix backend
   ```
5. **Start Frontend:**
   ```bash
   npm run dev --prefix frontend
   ```
### Running All Systems With Docker

1. **Generate .env file for backend and set the env**.
   ```bash
   cd backend
   cat <<- EOF > .env
   MONGODB_USERNAME=easygenerator
   MONGODB_PASSWORD=easygenerator_password
   MONGODB_DB=easygenerator
   MONGODB_MODE=docker
   PORT=3003
   JWT_ACCESS_SECRET=easygenerator_access_token_secret
   JWT_REFRESH_SECRET=easygenerator_refresh_token_secret_here
   NODE_ENV=development
   EOF
   ``` 
2. **Generate .env file for frontend and set the env**
   ```bash
   cd frontend
   cat <<- EOF > .env
   VITE_BACKEND_API=http://localhost:3003
   EOF
   ```
3. **Generate .env file for database and set the env**
   ```bash
   cat <<- EOF > .env
   MONGODB_USERNAME=easygenerator
   MONGODB_PASSWORD=easygenerator_password
   MONGODB_DB=easygenerator
   MACHINE_EXTERNAL_IP=host.docker.internal
   MACHINE_INTERNAL_IP=0.0.0.0
   EOF
   ```  
4. **Use the following command to start the entire environment in development mode with hot reload mode:**

   ```bash
   docker compose watch
   ```

---

# To connect to MongoDB running in Docker:

### Access via MongoDB Compass

1. Stop any MongoDB instances running on your local machine.
2. Open MongoDB Compass.
3. Connect to the database using the following connection string:
    - **Connection String**:
      `mongodb://easygenerator:easygenerator_password@127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/`

**It's important to do the Prerequisites to run MongodDB Replica sets correctly or the backend and database won't run.**

---

# MongoDB Replica Set Configuration

The application uses a MongoDB replica set with one primary and two secondary nodes for high availability and data redundancy. The replica set is configured in the Docker Compose file with the following rules:

### Replica Set Requirements _(pre-configured in docker-compose)_
- All replicas must use the same keyfile for internal authentication
- The primary replica (mongo-primary) must be the first in the list with priority 1
- Secondary replicas (mongo-secondary-2, mongo-secondary-3) have priority 0.5
- All members point to the host machine's external IP address for proper communication

### Network Configuration
To run the MongoDB replica set properly, you must add the following to your host machine's `/etc/hosts` file:
```
0.0.0.0 host.docker.internal      # Change to the internal IP of your host machine
0.0.0.0 gateway.docker.internal   # Change to the internal IP of your host machine
```

### Initialization Process
The replica set is automatically initialized by the `mongo-primary` container using a healthcheck command that configures the replica set topology. For proper operation in both development and production environments, you must specify these environment variables and secrets in your GitHub workflow:

- `MONGODB_USERNAME` and `MONGODB_PASSWORD`: For authentication (defined as secrets)
- `MONGODB_DB`: Database name
- `MACHINE_EXTERNAL_IP` and `MACHINE_INTERNAL_IP`: For proper replica set communication

---

# Deployment

### Prerequisites
[MongoDB Replica Set Configuration](#mongodb-replica-set-configuration)

### Deployment Steps
Deployment is automated through the CI/CD pipeline:
1. Create development and production environment in GitHub workflow and add below secrets and env.
2. push to the development or production branches to start the deployment process.

# CI/CD Configuration

### GitHub Actions Secrets

The following secrets need to be configured in your GitHub repository settings:

| Secret                       | Description                                                 |
|------------------------------|-------------------------------------------------------------|
| `SERVER_PRIVATE_KEY`         | The SSH private key for connecting to the deployment server |
| `MONGODB_USERNAME`           | Username for MongoDB database access                        |
| `MONGODB_PASSWORD`           | Password for MongoDB database access                        |
| `BACKEND_JWT_ACCESS_SECRET`  | Secret key used to sign JWT access tokens                   |
| `BACKEND_JWT_REFRESH_SECRET` | Secret key used to sign JWT refresh tokens                  |

### GitHub Actions Environment Variables

The following environment variables are used in the workflow:

| Variable              | Description                                  | Example                       |
|-----------------------|----------------------------------------------|-------------------------------|
| `MONGODB_DB`          | Name of the MongoDB database                 | `easygenerator`               |
| `MONGODB_MODE`        | local or docker                              | `local`                       |
| `MACHINE_EXTERNAL_IP` | External IP address of the deployment server | `123.45.67.89`                |
| `MACHINE_INTERNAL_IP` | Internal IP address of the deployment server | `172.16.0.1`                  |
| `BACKEND_PORT`        | Port on which the backend will run           | `3000`                        |
| `BACKEND_NODE_ENV`    | Node.js environment                          | `production` or `development` |
| `CLIENT_API_BASE_URL` | Base URL for frontend API calls              | `https://api.example.com`     |
| `REMOTE_HOST`         | Hostname or IP of deployment server          | `123.45.67.89`                |
| `REMOTE_USER`         | SSH username for deployment                  | `ubuntu`                      |
| `REMOTE_TARGET`       | Target directory on server                   | `/home/ubuntu/app`            |

These variables are used to dynamically generate configuration files during deployment and ensure proper setup of both development and production environments. The workflow automatically selects the correct environment based on the branch being pushed.

