#!/usr/bin/env bash

web_build_dir=$1
server_build_dir=$2

deploy_assets_to_server () {
  name=$1
  remote_path=$2
  assets_path=$3

  echo "DEPLOY [$name]: Start deploying assets to remote ($2)."
}

echo "Starting deployment."
echo ""

if [ ! -d "$web_build_dir" ]; then
  echo "ERROR: The web output directory does not exist."
  exit 1
fi

if [ ! -d "$server_build_dir" ]; then
  echo "ERROR: The server output directory does not exist."
  exit 1
fi

deploy_assets_to_server "web" "test.test" $web_build_dir
