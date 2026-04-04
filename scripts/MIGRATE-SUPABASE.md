# PostgreSQL → Supabase өгөгдөл зөөх (public schema)

Төсөлд `migrate-to-supabase.sh` нь эх санд байгаа **`public` schema**-ийн бүтэц + өгөгдлийг Supabase руу хуулна. Supabase-ийн `auth`, `storage` гэх мэт системийн schema-д **хүрэхгүй**.

---

## 1. Шаардлага (Mac)

Терминалд `pg_dump` болон `psql` ажиллаж байх ёстой:

```bash
pg_dump --version
psql --version
```

Хэрэв олдохгүй бол Homebrew:

```bash
brew install libpq
brew link --force libpq
```

Эсвэл бүтэн серверийн хэрэгслүүд:

```bash
brew install postgresql@16
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## 2. Supabase талын бэлтгэл

1. [Supabase Dashboard](https://supabase.com/dashboard) → төсөлөө сонгоно.
2. **Project Settings → Database**:
   - **Database password** — мартсан бол “Reset database password” хийнэ.
   - **Connection string** → **URI** сонгоно, нууц үгийг оруулна.
3. Нууц үгэнд **`@`** байвал URI-д **`%40`** гэж бичнэ (жишээ: `pass@word` → `pass%40word`).

### Direct vs Pooler (чухал)

`db.<ref>.supabase.co` (**Direct**) зарим төслүүдэд зөвхөн **IPv6** өгдөг. Олон Wi‑Fi / сүлжээ IPv6-г зөв дамжуулахгүй тул Mac дээр `psql: could not translate host name ... not known` гэж гарч болно.

| Зориулалт | Ямар холболт |
|-----------|----------------|
| **`pg_dump` / `psql` импорт** (энэ скрипт) | **Session pooler** — Dashboard-аас **Session mode** URI хуулна (ихэвчлэн IPv4-тэй `aws-0-...` эсвэл `aws-1-...pooler.supabase.com`, порт **5432**) |
| **Vercel / Next.js** (олон холболт) | Ихэвчлэн **Transaction pooler** (порт **6543**) — Supabase-ийн заавартай тааруулна |
| Direct `db.*` | IPv6 дэмжтэй сүлжээнд ажиллана; алдаа гарвал доорх Session pooler ашиглана |

**Imпортын `TARGET`-д Session pooler ашиглах (зөвлөмж):**

1. Dashboard: **Project Settings → Database**.
2. **Connection pooling** хэсгийг нээнэ.
3. **Session mode** сонгоно (урт ажиллагаанд тохиромжтой; `psql` -f том файлд зөвлөмжтэй).
4. Холболтын URI-г **бүтнээр нь** хуулна — хэрэглэгчийн нэр ихэвчлэн `postgres.<project-ref>` хэлбэртэй.

Жишээ хэлбэр (бүс, `aws-0` / `aws-1`, ref нь төсөл бүрт өөр):

```text
postgresql://postgres.ifgcdgpblofididnyact:ТАНЫ_НУУЦ@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require
```

Dashboard-ийн Session mode URI ихэвчлэн ийм байна — `[YOUR-PASSWORD]`-ийг **бодит database password**-аар сольж, шаардлагатай бол `?sslmode=require` нэмнэ. Нууцанд `@` байвал `%40`.

---

## 3. Хувьсагч тохируулах

Терминалд (нэг сессийн дотор):

```bash
# Эх: ихэвчлэн таны локал Postgres (.env.local-тай ижил)
export SOURCE_DATABASE_URL="postgresql://postgres:LOCAL_PASSWORD@localhost:5432/derrick_rose"

# Зорилт: Session pooler (Dashboard-аас Session mode URI хуулна)
export TARGET_DATABASE_URL="postgresql://postgres.YOUR_REF:ENCODED_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require"
# эсвэл: aws-1-ap-northeast-1.pooler.supabase.com гэх мэт — Dashboard-ийн host-ыг ашиглана
```

`ENCODED_PASSWORD` = нууц үгийн тусгай тэмдгүүдийг URL encode хийсэн хувилбар.

**Анхаар:** `[YOUR-PASSWORD]` гэж биш, Supabase-ийн **бодит нууц үгийг** оруулна.

---

## 4. Скрипт ажиллуулах

```bash
cd "/Users/macbook/Downloads/Derrick Rose"
chmod +x scripts/migrate-to-supabase.sh   # анх удаа л
./scripts/migrate-to-supabase.sh
```

Амжилттай бол эхэнд `dump`, дараа нь `импорт` гэсэн мессеж гарна.

---

## 5. Скрипт юу хийдэг вэ

`pg_dump` дараах сонголтуудтай:

- `--schema=public` — зөвхөн `public`.
- `--no-owner --no-acl` — Supabase дээрх эзэн/эрхийн зөрчил арилгана.
- `--clean --if-exists` — **зорилтын `public` schema доторх** одоо байгаа объектуудыг устгаад дахин үүсгэнэ.

**Анхаар:** Supabase төсөлд `public` дээр өөр хүснэгт/ өгөгдөл байвал тэдгээр нь **устаж болно**. Шинэ эсвэл зөвхөн энэ аппын schema байхыг зөвлөнө.

---

## 6. Түгээмэл алдаа, шийдэл

| Алдаа | Шийдэл |
|--------|--------|
| `command not found: pg_dump` | Дээрх Homebrew `libpq` эсвэл `postgresql@16` суулгаад PATH шалгана. |
| SSL / connection refused | Direct URI, порт **5432**, `?sslmode=require` байгаа эсэх. |
| `password authentication failed` | Supabase нууц, URI-д `%40` encode. `[YOUR-PASSWORD]` placeholder биш бодит нууц. |
| `could not translate host name ... not known` (`db.*.supabase.co`) | Ихэвчлэн **Direct нь зөвхөн IPv6**; сүлжээ IPv6 дэмжихгүй. **Session pooler** URI (дээрх) ашиглана. |
| Pooler-оор бусад алдаа | Dashboard-ийн **Session mode** (порт 5432) эсэхийг шалгана. |
| Foreign key / order алдаа | Бүтэн dump (`--data-only` биш) ихэвчлэн дарааллыг зөв гаргана; эх санг бүрэн dump хийнэ. |

---

## 7. Зөвхөн өгөгдөл зөөх (schema аль хэдийн Supabase дээр байвал)

Хэрэв аппыг Supabase дээр нэг удаа ажиллуулж `ensureDbInitialized()`-аар хүснэгт үүссэн, зөвхөн **мөрүүд** хуулмаар бол:

```bash
pg_dump "$SOURCE_DATABASE_URL" \
  --schema=public \
  --data-only \
  --no-owner \
  --no-acl \
  -f /tmp/data-only.sql

psql "$TARGET_DATABASE_URL" -v ON_ERROR_STOP=1 -f /tmp/data-only.sql
```

Энэ тохиолдолд `--clean` **битгий** ашиглана (schema устахгүй). ID давхцах бол эх санг хоослох эсвэл зорилт дээрх холбогдох хүснэгтүүдийг урьдчилан цэвэрлэх шаардлагатай.

---

## 8. Дараагийн алхмууд

1. **Апп шалгах:** `.env.local` дээр `DATABASE_URL`-ийг Supabase (шилжүүлэхэд pooler эсвэл Supabase-ийн зөвлөмжийн дагуу) болгож `pnpm dev` эсвэл build ажиллуулна.
2. **Vercel:** **Settings → Environment Variables** → `DATABASE_URL` = production Supabase string (ихэвчлэн pooler эсвэл таны тохиргоо).
3. **Нууц:** Connection string-ийг Git, скриншот, чатанд бүү тараана; илэрсэн бол Supabase дээр нууц дахин тохируулна.

---

## Холбоотой файл

- `scripts/migrate-to-supabase.sh` — нэг товшилтонд dump + `psql` импорт.
