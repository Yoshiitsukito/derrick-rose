"use server";

import { Pool } from "pg";

let pool = null;
let initialized = false;

function getPool() {
	if (!pool) {
		const connectionString = process.env.DATABASE_URL;
		if (!connectionString) {
			throw new Error("DATABASE_URL is not set in the environment.");
		}
		pool = new Pool({ connectionString });
	}
	return pool;
}

export async function dbQuery(text, params) {
	const client = await getPool().connect();
	try {
		const res = await client.query(text, params);
		return res;
	} finally {
		client.release();
	}
}

export async function ensureDbInitialized() {
	if (initialized) {
		// If server was already running when schema changed, still ensure compatibility columns exist.
		await dbQuery(`
			ALTER TABLE tickets ADD COLUMN IF NOT EXISTS booking_block TEXT;
			ALTER TABLE tickets ADD COLUMN IF NOT EXISTS booking_date TEXT;
			ALTER TABLE events ADD COLUMN IF NOT EXISTS qr_image_url TEXT NOT NULL DEFAULT '';
		`);
		await dbQuery(`
			ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub TEXT;
		`);
		await dbQuery(`
			CREATE UNIQUE INDEX IF NOT EXISTS users_google_sub_key
			ON users (google_sub) WHERE google_sub IS NOT NULL;
		`);
		await dbQuery(`
			ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
		`);
		return;
	}

	await dbQuery(
		`
		CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			email TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			role TEXT NOT NULL DEFAULT 'user',
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);

		CREATE TABLE IF NOT EXISTS sessions (
			token TEXT PRIMARY KEY,
			user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			role TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			expires_at TIMESTAMPTZ NOT NULL
		);

		CREATE TABLE IF NOT EXISTS events (
			id TEXT PRIMARY KEY,
			title TEXT NOT NULL,
			description TEXT NOT NULL,
			date TIMESTAMPTZ NOT NULL,
			price NUMERIC NOT NULL DEFAULT 0,
			ticket_limit INTEGER,
			image_url TEXT NOT NULL DEFAULT '',
			video_url TEXT NOT NULL DEFAULT '',
			location TEXT NOT NULL DEFAULT '',
			has_ticket BOOLEAN NOT NULL DEFAULT FALSE,
			is_active BOOLEAN NOT NULL DEFAULT TRUE,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);

		CREATE TABLE IF NOT EXISTS tickets (
			id TEXT PRIMARY KEY,
			event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
			user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			quantity INTEGER NOT NULL,
			total_price NUMERIC NOT NULL,
			status TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);

		-- Backward-compatible columns (older DBs may not have them yet)
		ALTER TABLE tickets ADD COLUMN IF NOT EXISTS booking_block TEXT;
		ALTER TABLE tickets ADD COLUMN IF NOT EXISTS booking_date TEXT;

		CREATE TABLE IF NOT EXISTS contacts (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			email TEXT NOT NULL,
			message TEXT NOT NULL,
			reply_status TEXT NOT NULL DEFAULT 'pending',
			reply_subject TEXT,
			reply_body TEXT,
			reply_at TIMESTAMPTZ,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);
	`,
	);

	// Backward-compatible event column (older DBs may not have it yet)
	await dbQuery(`
		ALTER TABLE events ADD COLUMN IF NOT EXISTS qr_image_url TEXT NOT NULL DEFAULT '';
	`);

	// OAuth: Google sub, optional password for Google-only users
	await dbQuery(`
		ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub TEXT;
	`);
	await dbQuery(`
		CREATE UNIQUE INDEX IF NOT EXISTS users_google_sub_key
		ON users (google_sub) WHERE google_sub IS NOT NULL;
	`);
	await dbQuery(`
		ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
	`);

	initialized = true;
}

