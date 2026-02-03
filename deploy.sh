#!/bin/bash

# Stop on error
set -e

echo "🚀 Starting automated deployment..."

# 1. Build the project
echo "🛠️  Building project..."
npm run build

# 2. Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy

# 3. Git Sync
echo "📦 Syncing with Git..."
git add .
# Check if there are changes to commit
if [[ -n $(git status -s) ]]; then
  git commit -m "Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"
  git push
else
  echo "⚠️  No changes to commit to Git."
fi

echo "✅ Deployment complete!"
