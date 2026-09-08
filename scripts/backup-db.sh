#!/bin/bash
# Database initialization script for portfolio SQLite database
# Usage: ./init-db.sh
# One-time database initialization; no backups needed as database is read-only

set -euo pipefail

DB_PATH="/var/lib/portfolio/app.db"

# Verify database file was created by the application
if [[ ! -f "${DB_PATH}" ]]; then
    echo "Error: Database file not found at ${DB_PATH}"
    echo "Database should be created automatically on first application startup"
    exit 1
fi

# Verify database integrity
if ! sqlite3 "${DB_PATH}" "PRAGMA integrity_check;" > /dev/null 2>&1; then
    echo "Error: Database integrity check failed"
    exit 1
fi

echo "Database verified successfully at ${DB_PATH}"
