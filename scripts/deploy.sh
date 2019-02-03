#!/usr/bin/env bash

target_environment=$1 # production
# web_build_dir=$2 # dist/web
# server_build_dir=$3 # dist/server

echo $target_environment
echo $web_build_dir 
echo $server_build_dir

deploy_assets_to_server () {
  name=$1
  remote_path=$2
  assets_path=$3

  echo "DEPLOY [$name]: Start deploying assets to remote ($2)."
}

echo "Starting deployment."
echo ""

if [ ! -d "$web_build_dir" ] || [ ! -d "$server_build_dir" ]; then
  echo "ERROR: One of the build directories does not exist."
  exit 1
fi

deploy_assets_to_server "web" "test.test" $web_build_dir
