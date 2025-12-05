#!/usr/bin/env sh
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [ -f "$ROOT_DIR/.env" ]; then
  echo ".env already exists, skipping."
  exit 0
fi

if [ ! -f "$ROOT_DIR/.env.example" ]; then
  echo "Missing .env.example at repository root." >&2
  exit 1
fi

cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
echo "Created .env from .env.example. Remember to fill in your API keys."
