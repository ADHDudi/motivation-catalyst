#!/bin/bash

# Stop on error
set -e

# Error handling function
handle_error() {
  local line=$1
  local command=$2
  echo "❌ Error on line $line: Command '$command' failed."
  exit 1
}

# Trap errors
trap 'handle_error $LINENO "$BASH_COMMAND"' ERR

echo "🚀 Starting automated deployment..."

# Git config check - adding remote if missing
if ! git remote | grep -q origin; then
  echo "⚠️  No remote 'origin' found. Please ensure you have added a remote repository."
  # Optionally fetch if remote exists to avoid issues
fi

# 1. Git Sync FIRST (save work before build/deploy)
echo "📦 Syncing with Git..."
git add .

# Check if there are changes to commit
if [[ -n $(git status -s) ]]; then
  echo "📝 Committing changes..."
  git commit -m "Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"
else
  echo "⚠️  No new changes to commit."
fi

# Push to GitHub (handle missing upstream)
echo "⬆️  Pushing to GitHub..."
BRANCH=$(git branch --show-current)
git push -u origin "$BRANCH" || echo "⚠️  Git push failed. Check your remote configuration."

# 2. Setup Isolated Build Environment
echo "🏗️  Setting up isolated build environment..."
DEPLOY_DIR="/tmp/motivation-deploy-auto"
mkdir -p "$DEPLOY_DIR"
# Use || [ $? -eq 23 ] to ignore "some files could not be transferred" which is expected for locked/forbidden dirs
rsync -av --exclude node_modules --exclude .git --exclude dist . "$DEPLOY_DIR/" || [ $? -eq 23 ]

# 3. Build & Deploy from Isolated Environment
echo "⚙️  Building and Deploying from $DEPLOY_DIR..."
cd "$DEPLOY_DIR"

# Force dependency sync and local cache to avoid EPERM
export FIREBASE_CHECK_UPDATES=false
export XDG_CONFIG_HOME="$DEPLOY_DIR/.config"
export TMPDIR="$DEPLOY_DIR/tmp"
mkdir -p "$XDG_CONFIG_HOME/configstore"
mkdir -p "$TMPDIR"

# Copy existing firebase auth if available to the isolated environment
if [ -f "$HOME/.config/configstore/firebase-tools.json" ]; then
  cp "$HOME/.config/configstore/firebase-tools.json" "$XDG_CONFIG_HOME/configstore/"
fi

# Inject API Key if provided as an environment variable or hardcoded here (as a fix for current session)
# Check if GEMINI_API_KEY is available in functions/.env or environment
if [ ! -f "$DEPLOY_DIR/functions/.env" ] && [ -z "$GEMINI_API_KEY" ]; then
  echo "⚠️  WARNING: GEMINI_API_KEY not found in functions/.env or environment variables."
  echo "The deployment might fail or the function might not work correctly."
fi

echo "📥 Installing frontend dependencies..."
npm install --cache .npm-local-cache --silent

echo "🛠️  Building frontend..."
npm run build

echo "⚙️  Preparing functions..."
cd functions
npm install --cache ../.npm-local-cache --silent
echo "🛠️  Building functions..."
npm run build
cd ..

echo "🔥 Deploying to Firebase..."
# Use local firebase if possible, otherwise rely on globally installed
if [ -f "./node_modules/.bin/firebase" ]; then
  ./node_modules/.bin/firebase deploy
else
  firebase deploy
fi

echo "✅ Deployment complete!"

# 4. Cleanup (optional, but good for security/space)
# rm -rf "$DEPLOY_DIR"

# 5. Open the App
echo "🌍 Opening app..."
open "https://motivation-catalyst-david.web.app"
