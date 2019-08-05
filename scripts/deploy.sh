#!/usr/bin/env bash
set -ev

deploy_assets_to_server () {
  assets_path=$1

  echo "DEPLOY: Start deploying assets to remote."

  export SSHPASS=$deploy_password
  sshpass -e scp -o stricthostkeychecking=no -r $assets_path $deploy_user@$deploy_host:$deploy_path
  export SSHPASS=
}

echo "Starting deployment."
echo ""

if [ ! -d "$web_build_dir" ]; then
  echo "ERROR: One of the build directories does not exist."
  exit 1
fi

deploy_assets_to_server $web_build_dir
