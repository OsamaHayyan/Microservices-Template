#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Microservices Template CI Starting..."

# --- STEP 1: Generate Database .env ---
echo "🔧 Generating Database .env..."
cat <<- EOF > .env
MONGODB_USERNAME=${MONGODB_USERNAME:-microservices_template}
MONGODB_PASSWORD=${MONGODB_PASSWORD:-microservices_template_password}
MONGODB_DB=${MONGODB_DB:-microservices_template}
MACHINE_EXTERNAL_IP=${MACHINE_EXTERNAL_IP:-host.docker.internal}
EOF

# --- STEP 2: Generate Backend .env ---
echo "🔧 Generating Backend .env..."
mkdir -p backend
cat <<- EOF > backend/.env
MONGODB_USERNAME=${MONGODB_USERNAME:-microservices_template}
MONGODB_PASSWORD=${MONGODB_PASSWORD:-microservices_template_password}
MONGODB_DB=${MONGODB_DB:-microservices_template}
MONGODB_MODE=${MONGODB_MODE:-docker}
PORT=${BACKEND_PORT:-3003}
JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET:-microservices_template_access_token_secret}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET:-microservices_template_refresh_token_secret_here}
NODE_ENV=${BACKEND_NODE_ENV:-production}
EOF

# --- STEP 3: Generate Frontend .env ---
echo "🔧 Generating Frontend .env..."
mkdir -p frontend
cat <<- EOF > frontend/.env
VITE_BACKEND_API=${CLIENT_API_BASE_URL:-/backend}
EOF

# --- STEP 4: Install & Build Backend ---
echo "📦 Installing and Building Backend..."
cd backend
npm install
npm run build
# Remove node_modules to slim down deployment artifacts
cd ..

# --- STEP 5: Install & Build Frontend ---
echo "📦 Installing and Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# --- STEP 6: Build and Start Docker Containers ---
echo "🐳 Building and Running Docker Containers..."
docker compose -f docker-prod-compose.yml -p microservices-template up -d --build

echo "✅ CI Script Completed Successfully!"