#!/bin/bash

# Script to push environment variables to Vercel
# Usage: ./push-env.sh [production|preview|development]

set -e

ENV_TYPE="${1:-production}"
ENV_FILE=".env.production"

echo "🚀 Pushing environment variables to Vercel ($ENV_TYPE)"
echo "=================================================="
echo ""

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: $ENV_FILE not found!"
    exit 1
fi

# Read .env.production and push each variable
while IFS='=' read -r key value || [ -n "$key" ]; do
    # Skip empty lines and comments
    if [[ -z "$key" || "$key" =~ ^#.* ]]; then
        continue
    fi
    
    # Remove quotes and whitespace
    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//" | xargs)
    
    # Skip empty values
    if [[ -z "$value" || "$value" =~ ^#.* ]]; then
        echo "⏭️  Skipping $key (empty or commented)"
        continue
    fi
    
    echo "📤 Setting $key..."
    echo "$value" | vercel env add "$key" "$ENV_TYPE" --force
    
done < "$ENV_FILE"

echo ""
echo "✅ All environment variables pushed successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'vercel --prod' to deploy to production"
echo "2. Visit your deployment URL"
echo "3. Create admin user with: cd backend && MONGODB_URI=your_uri npm run create-admin"
