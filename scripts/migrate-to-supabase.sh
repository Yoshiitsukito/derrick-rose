#!/usr/bin/env bash
# PostgreSQL (эх үүсвэр) → Supabase (зорилт) — зөвхөн public schema.
# Дэлгэрэнгүй: scripts/MIGRATE-SUPABASE.md
# Шаардлага: локалд pg_dump болон psql суусан байх (PostgreSQL client tools).
#
# Ашиглалт:
#   export SOURCE_DATABASE_URL="postgresql://user:pass@old-host:5432/dbname"
#   # Зөвлөмж: TARGET-д Dashboard-ийн Session pooler URI (IPv4). db.*.supabase.co зарим сүлжээнд IPv6 л өгдөг.
#   export TARGET_DATABASE_URL="postgresql://postgres.ref:pass@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require"
#   ./scripts/migrate-to-supabase.sh
#
# Эхний удаа Supabase дээр хоосон төсөл үүсгэсэн эсвэл public schema цэвэр гэж үзнэ.
# Нууцанд @ байвал URL-д %40 гэж encode хийнэ.

set -euo pipefail

if [[ -z "${SOURCE_DATABASE_URL:-}" || -z "${TARGET_DATABASE_URL:-}" ]]; then
	echo "SOURCE_DATABASE_URL болон TARGET_DATABASE_URL тохируулна уу." >&2
	exit 1
fi

TMP="$(mktemp -t pg-migrate-XXXXXX.sql)"
trap 'rm -f "$TMP"' EXIT

echo "Эх үүсвэрээс public schema dump хийж байна..."
pg_dump "$SOURCE_DATABASE_URL" \
	--schema=public \
	--no-owner \
	--no-acl \
	--clean \
	--if-exists \
	-f "$TMP"

echo "Supabase руу импорт хийж байна..."
psql "$TARGET_DATABASE_URL" -v ON_ERROR_STOP=1 -f "$TMP"

echo "Дууслаа. Vercel дээр Project → Settings → Environment Variables-д TARGET_DATABASE_URL-ийг DATABASE_URL нэрээр оруулна."
