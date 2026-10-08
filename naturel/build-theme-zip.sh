#!/usr/bin/env bash
# Package the NATUREL theme for "Online Store > Themes > Upload zip file".
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist
rm -f dist/naturel-theme.zip
(cd theme && zip -qr ../dist/naturel-theme.zip assets config layout locales sections snippets templates)
echo "Created $(pwd)/dist/naturel-theme.zip"
