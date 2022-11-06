#!/bin/bash
set -e

# update latext.txt
cd "$(dirname "$0")"
: > ./src/latest.txt
echo "$1" >> ./src/latest.txt

# copy template files
cp -r ./src/template/ ./src/$1

# update readme file
: > ./src/$1/readme.md
echo "documentation: https://scrapbox.io/ocello3blog/$1" >> ./src/$1/readme.md

exit 0
