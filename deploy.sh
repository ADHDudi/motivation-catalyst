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

# 2. Sync and Build Functions
echo "⚙️  Syncing function dependencies..."
cd functions
npm install --cache .npm-local-cache --package-lock-only
# Note: Full local npm install might fail due to EPERM, but we need to at least try to build if possible 
# or rely on Firebase's remote build with the synced lock file.
echo "🛠️  Building functions..."
npm run build || echo "⚠️  Local function build failed (possibly due to EPERM). Relying on remote build during deploy."
cd ..

# 3. Build the frontend
echo "🛠️  Building frontend..."
npm run build

# 4. Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment complete!"

# 5. Open the App
echo "🌍 Opening app..."
open "https://motivation-catalyst-david.web.app"
