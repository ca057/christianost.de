#!/usr/bin/env bash
set -ev

echo "Starting deployment."
echo ""

if [ ! -d "dist" ]; then
  echo "ERROR: The build directory does not exist."
  exit 1
fi

echo "DEPLOY: Start deploying assets to remote."

export SSHPASS=$deploy_password

sshpass -e scp -o stricthostkeychecking=no -r dist/. $deploy_user@$deploy_host:$deploy_path

export SSHPASS=
