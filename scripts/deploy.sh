#!/usr/bin/env bash
set -ev

deploy_assets_to_server () {
  name=$1
  remote_path=$2
  assets_path=$3

  echo "DEPLOY [$name]: Start deploying assets to remote ($2)."

  scp -o stricthostkeychecking=no -r $assets_path $remote_path
}

echo "Starting deployment."
echo ""

if [ ! -d "$web_build_dir" ] || [ ! -d "$server_build_dir" ]; then
  echo "ERROR: One of the build directories does not exist."
  exit 1
fi

deploy_assets_to_server "web" $server_web_path $web_build_dir
