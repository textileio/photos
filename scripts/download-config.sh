#!/usr/bin/env bash

PROJECT_DIR=$1

echo "Project dir - $PROJECT_DIR"

rm -rf /tmp/config-private
git clone git@github.com:textileio/config-private.git /tmp/config-private

BUILD_TYPE=${RN_RELEASE_TYPE:-"dev"}

echo "Build type - ${BUILD_TYPE}"

cp -Rv /tmp/config-private/photos/${BUILD_TYPE}/* $PROJECT_DIR
