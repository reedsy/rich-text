#!/bin/bash

set -eo pipefail

PACKAGE=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")

if [ -n "$(npm view "$PACKAGE@$VERSION" version 2> /dev/null)" ]
then
  echo "Version $VERSION already published."
  exit 0
fi

echo "Publishing version $VERSION"
npm publish --tag latest

if ! git tag "$VERSION" || ! git push origin "refs/tags/$VERSION"
then
  echo "Published $VERSION but could not tag it." >&2
fi
