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

# Push to GitHub (start background push but wait if needed)
echo "⬆️  Pushing to GitHub..."
git push || echo "⚠️  Git push failed. Check your remote configuration."

# 2. Build the project
echo "🛠️  Building project..."
npm run build

# 3. Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment complete!"

# 4. Open the App
echo "🌍 Opening app..."
open "https://motivation-catalyst-david.web.app"
