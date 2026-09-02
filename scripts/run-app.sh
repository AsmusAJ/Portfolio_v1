#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Runs server in the background.
cd "$SCRIPT_DIR/../server"
dotnet run dev &
SERVER_PID=$!

trap 'kill $SERVER_PID 2>/dev/null || true' EXIT

cd "$SCRIPT_DIR/../client"
npm run dev