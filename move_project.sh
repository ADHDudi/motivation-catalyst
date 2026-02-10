#!/bin/bash
set -e

# Target directory
TARGET_DIR="$HOME/Projects/workplace motivation"

echo "Moving project to: $TARGET_DIR"

# Ensure parent directory exists
mkdir -p "$HOME/Projects"

# Move the current project
# We assume the current valid project is at ~/Projects/cofounder-analysis based on previous steps
if [ -d "$HOME/Projects/cofounder-analysis" ]; then
    mv "$HOME/Projects/cofounder-analysis" "$TARGET_DIR"
    echo "Successfully moved ~/Projects/cofounder-analysis to '$TARGET_DIR'"
else
    echo "Error: Source project not found at ~/Projects/cofounder-analysis"
    exit 1
fi

echo "Project ready at '$TARGET_DIR'"
echo "Run the following to verify:"
echo "cd '$TARGET_DIR'"
echo "ls -la"
