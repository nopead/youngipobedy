#!/usr/bin/env bash

echo "Run apply migrations..."
alembic upgrade head
echo "Migrations applied"

exec "$@"