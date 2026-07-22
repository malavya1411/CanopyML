#!/usr/bin/env bash
set -e

echo "🌿 Setting up CanopyML Platform..."

# 1. Python Environment
echo "🐍 Setting up Python backend..."
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 2. Node Environment
echo "📦 Setting up Node workspace..."
npm install
cd apps/frontend
npm install
cd ../..

# 3. Environment variables
if [ ! -f apps/backend/.env ]; then
  echo "📄 Creating default backend .env file..."
  cp apps/backend/.env.example apps/backend/.env 2>/dev/null || true
fi

echo "✅ Setup complete! Run ./scripts/run_dev.sh to start the platform."
