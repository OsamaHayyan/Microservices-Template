<!-- TOC -->
* [Project Overview](#project-overview)
    * [Purpose](#purpose)
    * [Main modules](#main-modules)
    * [Features](#features)
* [API Documentation](#api-documentation)
* [Development Setup](#development-setup)
    * [Prerequisites](#prerequisites)
    * [Running All Systems](#running-all-systems)
    * [Running All Systems With Docker](#running-all-systems-with-docker)
    * [CI/CD Production Script Simulator for Local Development](#cicd-production-script-simulator-for-local-development)
      * [Script Usage](#script-usage)
* [To connect to MongoDB running in Docker:](#to-connect-to-mongodb-running-in-docker)
    * [Access via MongoDB Compass](#access-via-mongodb-compass)
* [MongoDB Replica Set Configuration](#mongodb-replica-set-configuration)
    * [Replica Set Requirements _(pre-configured in docker-compose)_](#replica-set-requirements-_pre-configured-in-docker-compose_)
    * [Initialization Process](#initialization-process)
* [CI/CD Configuration](#cicd-configuration)
    * [GitHub Actions Secrets](#github-actions-secrets)
    * [GitHub Actions Environment Variables](#github-actions-environment-variables)
    * [Default GitHub Environments](#default-github-environments)
* [Deployment](#deployment)
    * [Prerequisites](#prerequisites-1)
    * [Deployment Steps](#deployment-steps)
<!-- TOC -->

# Project Overview

### Purpose
This project serves as a template for building microservices using Docker, NestJS, ReactJs, and MongoDB. It is designed to be
### Main modules

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

# API Documentation

The API documentation is available at the following URLs depending on your environment:

- **Demo Environment**: [http://130.61.130.252:8080/backend/api-docs](http://130.61.130.252:8080/backend/api-docs)
- **Local Development**: [http://localhost:3003/api-docs](http://localhost:3003/api-docs)
- **Local Production Simulation**: [http://localhost:8080/backend/api-docs](http://localhost:8080/backend/api-docs)

The demo site is accessible at: [http://130.61.130.252:8080/](http://130.61.130.252:8080/)

---
# Development Setup

### Prerequisites

1. **Ports `27017`, `27018`, `27019` should be free for database replica sets**.
2. **Install Docker and Docker Compose**: Ensure you have Docker and Docker Compose installed on your machine.

### Running All Systems

1. **Install MongoDB**
2. **Generate .env file for backend and set the env**.
   ```bash
   cd backend
   cat <<- EOF > .env
   MONGODB_DB=microservices_template
   MONGODB_MODE=local
   PORT=3003
   JWT_ACCESS_SECRET=microservices_template_access_token_secret
   JWT_REFRESH_SECRET=microservices_template_refresh_token_secret_here
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
   MONGODB_USERNAME=microservices_template
   MONGODB_PASSWORD=microservices_template_password
   MONGODB_DB=microservices_template
   MONGODB_MODE=docker
   PORT=3003
   JWT_ACCESS_SECRET=microservices_template_access_token_secret
   JWT_REFRESH_SECRET=microservices_template_refresh_token_secret_here
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
   MONGODB_USERNAME=microservices_template
   MONGODB_PASSWORD=microservices_template_password
   MONGODB_DB=microservices_template
   MACHINE_EXTERNAL_IP=host.docker.internal
   EOF
   ```  
4. **Use the following command to start the entire environment in development mode with hot reload mode:**

   ```bash
   docker compose watch
   ```

### CI/CD Production Script Simulator for Local Development

To simulate the CI/CD production deployment process locally, a script named `ci_build_and_run.sh` is provided. This script replicates the steps performed in the CI/CD pipeline, including generating `.env` files, building the backend and frontend, and starting the Docker containers.

#### Script Usage
1. Ensure all prerequisites are met (e.g., Docker is installed, required ports are free).
2. Run the script:
   ```bash
   ./ci_build_and_run.sh
   ```
3. The script will:
   - Generate `.env` files for the database, backend, and frontend.
   - Build the backend and frontend applications.
   - Start the Docker containers in production mode.

This script is useful for testing the production deployment process locally before pushing changes to the CI/CD pipeline.

---

# To connect to MongoDB running in Docker:

### Access via MongoDB Compass

1. Stop any MongoDB instances running on your local machine.
2. Open MongoDB Compass.
3. Connect to the database using the following connection string:
    - **Connection String**:
      `mongodb://microservices_template:microservices_template_password@127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/`

**It's important to do the Prerequisites to run MongodDB Replica sets correctly or the backend and database won't run.**

---

# MongoDB Replica Set Configuration

The application uses a MongoDB replica set with one primary and two secondary nodes for high availability and data redundancy. The replica set is configured in the Docker Compose file with the following rules:

### Replica Set Requirements _(pre-configured in docker-compose)_
- All replicas must use the same keyfile for internal authentication
- The primary replica (mongo-primary) must be the first in the list with priority 1
- Secondary replicas (mongo-secondary-2, mongo-secondary-3) have priority 0.5
- All members point to the host machine's external IP address for proper communication

### Initialization Process
The replica set is automatically initialized by the `mongo-primary` container using a healthcheck command that configures the replica set topology. For proper operation in both development and production environments, you must specify these environment variables and secrets in your GitHub workflow:

- `MONGODB_USERNAME` and `MONGODB_PASSWORD`: For authentication (defined as secrets)
- `MONGODB_DB`: Database name
- `MACHINE_EXTERNAL_IP`: For proper replica set communication

To see all environment click here: [Environment](#cicd-configuration)

---

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

| Variable              | Description                                  | Example                                                                            |
|-----------------------|----------------------------------------------|------------------------------------------------------------------------------------|
| `MONGODB_DB`          | Name of the MongoDB database                 | `microservices_template`                                                           |
| `MONGODB_MODE`        | local or docker                              | `local`                                                                            |
| `MACHINE_EXTERNAL_IP` | External IP address of the deployment server | `123.45.67.89`                                                                     |
| `BACKEND_PORT`        | Port on which the backend will run           | `3003`                                                                             |
| `BACKEND_NODE_ENV`    | Node.js environment                          | `production` or `development`                                                      |
| `CLIENT_API_BASE_URL` | Base URL for frontend API calls              | `http://localhost:3003` or `/backend` consider editing nginx template to change it |
| `REMOTE_HOST`         | Hostname or IP of deployment server          | `123.45.67.89`                                                                     |
| `REMOTE_USER`         | SSH username for deployment                  | `ubuntu`                                                                           |
| `REMOTE_TARGET`       | Target directory on server                   | `/home/ubuntu/app`                                                                 |

### Default GitHub Environments

The CI/CD pipeline is configured to use `development` and `production` as the default environments. These environments are automatically selected based on the branch being pushed:
- **`development`**: Used when pushing to the `development` branch.
- **`production`**: Used when pushing to the `production` branch.

If you need to change the default environments or add new ones, you can manually update the workflow file located at `.github/workflows/deploy.yml`. Modify the `environment` variable in the workflow to match your desired environment setup.

For example:
```yaml
environment: ${{ github.ref == 'refs/heads/production' && 'production' || 'development' }}
```

This logic ensures that the correct environment is selected based on the branch name.

---

# Deployment

### Prerequisites

1. **MongoDB Replica Set Configuration**:  
   Ensure the MongoDB replica set is properly configured. Refer to the [MongoDB Replica Set Configuration](#mongodb-replica-set-configuration) section for details.

2. **Virtual Cloud Network (VCN) Security Rules**:  
   Configure the Virtual Cloud Network (VCN) on your cloud platform with the following security rules:

   #### Ingress Rules:
   1. **Allow TCP traffic for MongoDB replica sets for internal communication**:  
      - Protocol: `TCP`
      - Ports: `27017`, `27018`, `27019`  
      - CIDR: `MACHINE_EXTERNAL_IP/32` 
      
   2. **Allow general access on port 8080 for client side**:
       - Protocol: `TCP`
       - Port: `8080`
       - CIDR: `0.0.0.0/0`
      
   3. **Restrict access to MongoDB replica sets externally via Static VPN IP (Optional)**:  
      - Protocol: `TCP`
      - Ports: `27017`, `27018`, `27019`
      - CIDR: `STATIC_VPN_IP/32`

   These rules ensure proper communication for `MongoDB replica sets`, secure access via OpenVPN, and allow traffic on port 8080 for TCP protocol.

### Deployment Steps
Deployment is automated through the CI/CD pipeline:
1. Create development and production environment in GitHub workflow and add below secrets and env.
2. push to the development or production branches to start the deployment process.