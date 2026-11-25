#!/bin/sh
# Publish the prototype on GitHub Pages:
#   builds the app and pushes the dist/ folder to the "gh-pages" branch.
# Live at: https://pavithravijayakumar-09.github.io/leaflet-compare/
# Usage: npm run deploy
set -e
cd "$(dirname "$0")/.."

NAME="$(git config user.name)"
EMAIL="$(git config user.email)"
REMOTE="$(git config remote.origin.url)"

npm test
npm run build

cd dist
touch .nojekyll            # tell GitHub Pages to serve the files as they are
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="$NAME" -c user.email="$EMAIL" commit -q -m "Deploy prototype"
git push -f "$REMOTE" gh-pages
rm -rf .git
echo "Published: https://pavithravijayakumar-09.github.io/leaflet-compare/"
