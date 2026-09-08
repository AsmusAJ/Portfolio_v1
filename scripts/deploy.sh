#!/bin/bash
# Deployment script for portfolio backend to DigitalOcean
# Usage: ./deploy.sh [host] [user] [port]
# Example: ./deploy.sh api.yourdomain.com portfolio 2222

set -euo pipefail

HOST="${1:-api.anthonyasmus.com}"
DEPLOY_USER="${2:-portfolio}"
DEPLOY_PORT="${3:-22}"
APP_DIR="/opt/portfolio/server"
DATA_DIR="/var/lib/portfolio"

echo "Deploying portfolio API to ${HOST}:${DEPLOY_PORT}"
echo "Deploy user: ${DEPLOY_USER}"
echo "App directory: ${APP_DIR}"
echo ""

# Build release locally
echo "Building release..."
cd "$(dirname "$0")/.."
cd server
dotnet clean -c Release --verbosity quiet 2>/dev/null || true
dotnet publish -c Release -o ./publish-staging --verbosity quiet

if [[ ! -d "./publish-staging" ]]; then
    echo "Error: Build failed"
    exit 1
fi

echo "Build completed successfully"
echo ""

# Archive the build
echo "Creating deployment archive..."
DEPLOY_ARCHIVE="/tmp/portfolio-api-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "${DEPLOY_ARCHIVE}" -C ./publish-staging .
echo "Archive created: ${DEPLOY_ARCHIVE}"
echo ""

# Upload to server
echo "Uploading to ${HOST}..."
scp -P "${DEPLOY_PORT}" "${DEPLOY_ARCHIVE}" "${DEPLOY_USER}@${HOST}:/tmp/"
ARCHIVE_NAME=$(basename "${DEPLOY_ARCHIVE}")
echo "Upload completed"
echo ""

# Deploy on remote server
echo "Deploying on remote server..."
ssh -p "${DEPLOY_PORT}" "${DEPLOY_USER}@${HOST}" "ARCHIVE_NAME='${ARCHIVE_NAME}' bash -s" << 'DEPLOY_SCRIPT'
set -euo pipefail

ARCHIVE="/tmp/${ARCHIVE_NAME}"
APP_DIR="/opt/portfolio/server"
DATA_DIR="/var/lib/portfolio"
BACKUP_DIR="/opt/portfolio/releases-backup"

echo "Stopping service..."
sudo systemctl stop portfolio-api || true

# Create backup of current release
if [[ -d "${APP_DIR}" && "$(ls -A "${APP_DIR}")" ]]; then
    mkdir -p "${BACKUP_DIR}"
    BACKUP_NAME="release-$(date +%Y%m%d-%H%M%S)"
    cp -r "${APP_DIR}" "${BACKUP_DIR}/${BACKUP_NAME}"
    echo "Current release backed up to: ${BACKUP_DIR}/${BACKUP_NAME}"
fi

# Extract new release
echo "Installing new release..."
mkdir -p "${APP_DIR}"
rm -rf "${APP_DIR}"/*
tar -xzf "${ARCHIVE}" -C "${APP_DIR}"

# Ensure data directory exists with correct permissions
mkdir -p "${DATA_DIR}"

# Remove archive
rm "${ARCHIVE}"

echo "Starting service..."
sudo systemctl start portfolio-api

# Wait for service to become ready
echo "Waiting for service to become ready..."
for i in {1..30}; do
    if curl -s http://127.0.0.1:5000/api/health > /dev/null 2>&1; then
        echo "Service is ready"
        break
    fi
    echo "Attempt $i/30: Waiting for service..."
    sleep 1
done

# Check health
echo "Checking health..."
curl -i http://127.0.0.1:5000/api/health

echo "Deployment completed successfully"
DEPLOY_SCRIPT

# Cleanup local archive
rm "${DEPLOY_ARCHIVE}"
echo ""
echo "Local build artifacts cleaned up"
echo "Deployment completed successfully!"
