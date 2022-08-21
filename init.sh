#!/bin/bash
set -e

# update latext.txt
cd "$(dirname "$0")"
: > ./src/latest.txt
echo "$1" >> ./src/latest.txt

# copy template files
cp -r ./src/template/ ./src/$1

exit 0
