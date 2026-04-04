"use server";

import bcrypt from "bcryptjs";
import { dbQuery, ensureDbInitialized } from "./db";

function normalizeEmail(email) {
	return email.trim().toLowerCase();
}

export async function findUserByEmail(email) {
	const normalized = normalizeEmail(email);
	await ensureDbInitialized();

	const { rows } = await dbQuery(
		`SELECT id, email, password_hash, role, google_sub, created_at, updated_at
		 FROM users
		 WHERE email = $1
		 LIMIT 1`,
		[normalized],
	);

	if (!rows[0]) return null;

	const row = rows[0];
	return {
		id: row.id,
		email: row.email,
		passwordHash: row.password_hash,
		role: row.role,
		googleSub: row.google_sub,
		createdAt: row.created_at?.toISOString?.() ?? row.created_at,
		updatedAt: row.updated_at?.toISOString?.() ?? row.updated_at,
	};
}

export async function findUserById(id) {
	await ensureDbInitialized();
	const { rows } = await dbQuery(
		`SELECT id, email, password_hash, role, google_sub, created_at, updated_at
		 FROM users
		 WHERE id = $1
		 LIMIT 1`,
		[id],
	);

	if (!rows[0]) return null;

	const row = rows[0];
	return {
		id: row.id,
		email: row.email,
		passwordHash: row.password_hash,
		role: row.role,
		googleSub: row.google_sub,
		createdAt: row.created_at?.toISOString?.() ?? row.created_at,
		updatedAt: row.updated_at?.toISOString?.() ?? row.updated_at,
	};
}

export async function findUserByGoogleSub(googleSub) {
	if (!googleSub) return null;
	await ensureDbInitialized();
	const { rows } = await dbQuery(
		`SELECT id, email, password_hash, role, google_sub, created_at, updated_at
		 FROM users
		 WHERE google_sub = $1
		 LIMIT 1`,
		[googleSub],
	);

	if (!rows[0]) return null;

	const row = rows[0];
	return {
		id: row.id,
		email: row.email,
		passwordHash: row.password_hash,
		role: row.role,
		googleSub: row.google_sub,
		createdAt: row.created_at?.toISOString?.() ?? row.created_at,
		updatedAt: row.updated_at?.toISOString?.() ?? row.updated_at,
	};
}

export async function createUser({ email, password, role = "user" }) {
	const normalized = normalizeEmail(email);

	await ensureDbInitialized();

	const existing = await findUserByEmail(normalized);
	if (existing) throw new Error("User with this email already exists.");

	const passwordHash = await bcrypt.hash(password, 10);
	const now = new Date().toISOString();

	const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

	const { rows } = await dbQuery(
		`INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $5)
		 RETURNING id, email, role, created_at, updated_at`,
		[id, normalized, passwordHash, role, now],
	);

	const row = rows[0];
	return {
		id: row.id,
		email: row.email,
		role: row.role,
		createdAt: row.created_at?.toISOString?.() ?? row.created_at,
		updatedAt: row.updated_at?.toISOString?.() ?? row.updated_at,
	};
}

export async function verifyUserCredentials({ email, password }) {
	const normalized = normalizeEmail(email);
	await ensureDbInitialized();

	const { rows } = await dbQuery(
		`SELECT id, email, password_hash, role, created_at, updated_at
		 FROM users
		 WHERE email = $1
		 LIMIT 1`,
		[normalized],
	);

	if (!rows[0]) return null;

	const row = rows[0];
	if (!row.password_hash) {
		return null;
	}
	const ok = await bcrypt.compare(password, row.password_hash);
	if (!ok) return null;

	return {
		id: row.id,
		email: row.email,
		role: row.role,
		createdAt: row.created_at?.toISOString?.() ?? row.created_at,
		updatedAt: row.updated_at?.toISOString?.() ?? row.updated_at,
	};
}

export async function updateUserPassword(userId, newPassword) {
	await ensureDbInitialized();
	const user = await findUserById(userId);
	if (!user) throw new Error("User not found.");
	if (user.role === "admin") throw new Error("Cannot change admin password this way.");
	const passwordHash = await bcrypt.hash(newPassword, 10);
	const now = new Date().toISOString();
	await dbQuery(
		`UPDATE users SET password_hash = $2, updated_at = $3 WHERE id = $1`,
		[userId, passwordHash, now],
	);
	return { id: userId };
}

export async function deleteUser(userId) {
	await ensureDbInitialized();
	const user = await findUserById(userId);
	if (!user) throw new Error("User not found.");
	if (user.role === "admin") throw new Error("Cannot delete admin user.");
	await dbQuery(`DELETE FROM users WHERE id = $1`, [userId]);
	return { id: userId };
}

export async function ensureAdminSeedUser() {
	const adminEmail = process.env.ADMIN_EMAIL;
	const adminPassword = process.env.ADMIN_PASSWORD;

	if (!adminEmail || !adminPassword) {
		return null;
	}

	const existing = await findUserByEmail(adminEmail);
	if (existing) {
		const { passwordHash: _ignored, ...safeExisting } = existing;
		return safeExisting;
	}

	return createUser({
		email: adminEmail,
		password: adminPassword,
		role: "admin",
	});
}

/**
 * Google OAuth: шинэ хэрэглэгч үүсгэх эсвэл одоогийнхтой холбох (и-мэйл давхардал).
 */
export async function upsertGoogleUserFromGoogleProfile({
	sub,
	email,
	emailVerified,
}) {
	if (!sub || !email) {
		throw new Error("Invalid Google profile.");
	}
	if (!emailVerified) {
		throw new Error("Google email is not verified.");
	}

	await ensureDbInitialized();
	const normalized = normalizeEmail(email);

	const bySub = await findUserByGoogleSub(sub);
	if (bySub) {
		return {
			id: bySub.id,
			email: bySub.email,
			role: bySub.role,
			createdAt: bySub.createdAt,
			updatedAt: bySub.updatedAt,
		};
	}

	const byEmail = await findUserByEmail(normalized);
	if (byEmail) {
		if (byEmail.googleSub && byEmail.googleSub !== sub) {
			throw new Error("This email is linked to a different Google account.");
		}
		const now = new Date().toISOString();
		if (!byEmail.googleSub) {
			await dbQuery(
				`UPDATE users SET google_sub = $1, updated_at = $2 WHERE id = $3`,
				[sub, now, byEmail.id],
			);
		}
		const refreshed = await findUserById(byEmail.id);
		return {
			id: refreshed.id,
			email: refreshed.email,
			role: refreshed.role,
			createdAt: refreshed.createdAt,
			updatedAt: refreshed.updatedAt,
		};
	}

	const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
	const now = new Date().toISOString();
	const { rows } = await dbQuery(
		`INSERT INTO users (id, email, password_hash, role, google_sub, created_at, updated_at)
		 VALUES ($1, $2, NULL, 'user', $3, $4, $4)
		 RETURNING id, email, role, created_at, updated_at`,
		[id, normalized, sub, now],
	);

	const row = rows[0];
	return {
		id: row.id,
		email: row.email,
		role: row.role,
		createdAt: row.created_at?.toISOString?.() ?? row.created_at,
		updatedAt: row.updated_at?.toISOString?.() ?? row.updated_at,
	};
}

