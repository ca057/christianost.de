#!/usr/bin/env bash
set -eo pipefail

echo "Starting deployment."
echo ""

if [ ! -d "dist" ]; then
  echo "ERROR: The build directory does not exist."
  exit 1
fi

echo "Deploying assets to server."

rsync --progress -r dist/* $deploy_user@$deploy_host:$deploy_path
