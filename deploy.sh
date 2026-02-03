#!/bin/bash

# Check if a commit message was provided
if [ -z "$1" ]
then
  echo "Error: Please provide a commit message."
  echo "Usage: npm run deploy -- \"Your commit message\""
  exit 1
fi

echo "🚀 Starting deployment..."

# 1. Add and Commit to Git
echo "📦 Committing to Git..."
git add .
git commit -m "$1"

# 2. Push to GitHub
echo "☁️  Pushing to GitHub..."
git push

# 3. Build the App
echo "🏗️  Building project..."
npm run build

# 4. Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy

echo "✅ Done! Update deployed successfully."
