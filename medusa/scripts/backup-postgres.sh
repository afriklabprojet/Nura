#!/usr/bin/env bash
set -euo pipefail

: "${BACKUP_ENCRYPTION_KEY:?export BACKUP_ENCRYPTION_KEY before running backups}"

backup_dir="${BACKUP_DIR:-./backups}"
retention_days="${BACKUP_RETENTION_DAYS:-30}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_path="${backup_dir}/medusa-${timestamp}.dump.enc"
temporary_path="${backup_path}.tmp"

mkdir -p "$backup_dir"
chmod 700 "$backup_dir"
trap 'rm -f "$temporary_path"' EXIT

docker compose exec -T postgres pg_dump -U medusa -Fc medusa |
  openssl enc -aes-256-cbc -salt -pbkdf2 -pass env:BACKUP_ENCRYPTION_KEY \
    -out "$temporary_path"

chmod 600 "$temporary_path"
mv "$temporary_path" "$backup_path"
find "$backup_dir" -type f -name 'medusa-*.dump.enc' -mtime "+$retention_days" -delete

echo "Encrypted backup created: $backup_path"