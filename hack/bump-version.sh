#!/usr/bin/env bash
set -euo pipefail

# bump-version.sh - Update version across manifest.json and package.json
#
# Usage:
#   ./hack/bump-version.sh <new-version>
#   ./hack/bump-version.sh --current

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

get_current_version() {
  python3 -c "import json; print(json.load(open('${ROOT_DIR}/manifest.json'))['version'])"
}

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <new-version>"
  echo "       $0 --current"
  echo "Example: $0 1.1.0"
  exit 1
fi

if [[ "$1" == "--current" ]]; then
  echo "Current version: $(get_current_version)"
  exit 0
fi

NEW_VERSION="$1"
# Strip v prefix if present
NEW_VERSION="${NEW_VERSION#v}"
CURRENT_VERSION="$(get_current_version)"

echo "Bumping version: ${CURRENT_VERSION} → ${NEW_VERSION}"
echo ""

# Update manifest.json
python3 -c "
import json
f = '${ROOT_DIR}/manifest.json'
data = json.load(open(f))
data['version'] = '${NEW_VERSION}'
json.dump(data, open(f, 'w'), indent=2)
print('  ✓ manifest.json')
"

# Update package.json
python3 -c "
import json
f = '${ROOT_DIR}/package.json'
data = json.load(open(f))
data['version'] = '${NEW_VERSION}'
json.dump(data, open(f, 'w'), indent=2)
print('  ✓ package.json')
"

echo ""
echo "Done! Version updated to ${NEW_VERSION}"
echo ""
echo "Next steps:"
echo "  git add manifest.json package.json"
echo "  git commit -m \"chore: bump version to ${NEW_VERSION}\""
echo "  git tag v${NEW_VERSION}"
echo "  git push && git push --tags"
