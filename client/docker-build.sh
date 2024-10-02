#!/bin/bash

# Define the Dockerfile location and package.json
DOCKERFILE="Dockerfile"
PACKAGE_JSON="package.json"

# Function to display usage information
usage() {
    echo "Usage: $0 -i [major|minor|patch] [-p] [--help]"
    echo "  -i    Specify the version part to increment: major, minor, or patch."
    echo "  -p    Push the Docker image to the repository after building."
    echo "  --help Display this help message."
}

# Check for help flag
if [[ "$1" == "--help" ]]; then
    usage
    exit 0
fi

# Check if Dockerfile exists
if [ ! -f "$DOCKERFILE" ]; then
  echo "Dockerfile not found!"
  exit 1
fi

# Check if package.json exists
if [ ! -f "$PACKAGE_JSON" ]; then
  echo "package.json not found!"
  exit 1
fi

# Get the current version from package.json using Python 3
VERSION=$(python3 -c "import json; print(json.load(open('$PACKAGE_JSON'))['version'])" 2>/dev/null)

if [ $? -ne 0 ]; then
  echo "Error reading version from package.json!"
  exit 1
fi

if [ -z "$VERSION" ]; then
  echo "Version not found in package.json!"
  exit 1
fi

# Print the current version
echo "Current version is: $VERSION"

# Determine which version part to increment
while getopts "i:p" opt; do
  case $opt in
    i)
      INCREMENT="$OPTARG"
      ;;
    p)
      PUSH=true
      ;;
    *)
      usage
      exit 1
      ;;
  esac
done

# Increment the version based on input
IFS='.' read -r major minor patch <<< "$VERSION"

case $INCREMENT in
  major)
    major=$((major + 1))
    minor=0
    patch=0
    ;;
  minor)
    minor=$((minor + 1))
    patch=0
    ;;
  patch)
    patch=$((patch + 1))
    ;;
  *)
    echo "Invalid option for increment: $INCREMENT. Use major, minor, or patch."
    exit 1
    ;;
esac

# Construct the new version
NEW_VERSION="$major.$minor.$patch"

# Build the Docker image with the new version tag
IMAGE_NAME="bluestorm1288/file-upload-client:$NEW_VERSION"  # Change 'your_image_name' to your desired image name
echo "Building Docker image: $IMAGE_NAME"
docker build -t "$IMAGE_NAME" .

# Update the version in package.json using Python 3
python3 -c "
import json
with open('$PACKAGE_JSON', 'r+') as f:
    data = json.load(f)
    data['version'] = '$NEW_VERSION'
    f.seek(0)
    json.dump(data, f, indent=2)
    f.truncate()
"

# Verify the change in package.json
UPDATED_VERSION=$(python3 -c "import json; print(json.load(open('$PACKAGE_JSON'))['version'])" 2>/dev/null)

if [ $? -ne 0 ]; then
  echo "Error reading updated version from package.json!"
  exit 1
fi

# Print version update message
printf "Version updating from %s to %s in package.json...\n" "$VERSION" "$UPDATED_VERSION"

# Check if versions match and print appropriate message
if [ "$NEW_VERSION" == "$UPDATED_VERSION" ]; then
  printf "\e[32mSuccess: Version is correctly updated to %s.\e[0m\n" "$UPDATED_VERSION"  # Green message
else
  printf "\e[31mError: Version update failed. Expected %s but got %s.\e[0m\n" "$NEW_VERSION" "$UPDATED_VERSION"  # Red message
fi

# Push the Docker image if -p option is set
if [ "$PUSH" = true ]; then
  echo "Pushing Docker image: $IMAGE_NAME"
  docker push "$IMAGE_NAME"
  if [ $? -eq 0 ]; then
    echo -e "\e[32mSuccessfully pushed $IMAGE_NAME.\e[0m"
  else
    echo -e "\e[31mFailed to push $IMAGE_NAME.\e[0m"
  fi
fi
