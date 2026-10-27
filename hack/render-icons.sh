#!/usr/bin/env bash
# Draws icons/icon{16,48,128}.png: a red toolbox with </> on its front. Drawn at 512px, then downscaled.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if command -v magick >/dev/null 2>&1; then
  MAGICK="magick"
elif command -v convert >/dev/null 2>&1; then
  MAGICK="convert"
else
  echo "ImageMagick is required (brew install imagemagick)" >&2
  exit 1
fi

MASTER="$(mktemp "${TMPDIR:-/tmp}/dev-toolkit-icon.XXXXXX")"
trap 'rm -f "${MASTER}"' EXIT

STROKE='stroke-linecap round stroke-linejoin round fill none'

"${MAGICK}" -size 512x512 xc:none \
  -draw "${STROKE} stroke #59606B stroke-width 40 path 'M 176,168 L 176,112 Q 176,84 204,84 L 308,84 Q 336,84 336,112 L 336,168'" \
  -fill '#DC384D' -draw 'roundrectangle 40,150 471,456 64,64' \
  -fill '#B8283C' -draw 'rectangle 40,226 471,250' \
  -fill '#59606B' -draw 'roundrectangle 96,206 136,270 12,12' -draw 'roundrectangle 376,206 416,270 12,12' \
  -draw "${STROKE} stroke #FFFFFF stroke-width 30 path 'M 196,300 L 150,348 L 196,396 M 316,300 L 362,348 L 316,396 M 276,288 L 236,408'" \
  "png:${MASTER}"

for size in 16 48 128; do
  "${MAGICK}" "png:${MASTER}" -filter Lanczos -resize "${size}x${size}" "${ROOT_DIR}/icons/icon${size}.png"
  echo "  ✓ icons/icon${size}.png"
done
