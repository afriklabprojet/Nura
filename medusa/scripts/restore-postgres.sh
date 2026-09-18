#!/usr/bin/env bash
set -euo pipefail

: "${BACKUP_ENCRYPTION_KEY:?export BACKUP_ENCRYPTION_KEY before restoring}"
: "${RESTORE_CONFIRM:?set RESTORE_CONFIRM=medusa to confirm destructive restore}"

if [[ "$RESTORE_CONFIRM" != "medusa" ]]; then
  echo "RESTORE_CONFIRM must equal medusa" >&2
  exit 1
fi

backup_path="${1:?usage: scripts/restore-postgres.sh backups/medusa-TIMESTAMP.dump.enc}"

if [[ ! -f "$backup_path" ]]; then
  echo "Backup not found: $backup_path" >&2
  exit 1
fi

openssl enc -d -aes-256-cbc -pbkdf2 -pass env:BACKUP_ENCRYPTION_KEY \
  -in "$backup_path" |
  docker compose exec -T postgres pg_restore \
    -U medusa -d medusa --clean --if-exists --no-owner --no-privileges

echo "Restore completed from: $backup_path"