"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import { findUserById } from "./auth";
import { dbQuery, ensureDbInitialized } from "./db";
const SESSION_COOKIE_NAME = "dr_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export async function createSession(user) {
	await ensureDbInitialized();
	const token = crypto.randomBytes(32).toString("hex");
	const now = Date.now();
	const expiresAt = now + SESSION_TTL_MS;

	const createdAtIso = new Date(now).toISOString();
	const expiresAtIso = new Date(expiresAt).toISOString();

	await dbQuery(
		`INSERT INTO sessions (token, user_id, role, created_at, expires_at)
		 VALUES ($1, $2, $3, $4, $5)`,
		[token, user.id, user.role, createdAtIso, expiresAtIso],
	);

	const cookieStore = await cookies();
	cookieStore.set(SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: SESSION_TTL_MS / 1000,
		path: "/",
	});

	return {
		token,
		userId: user.id,
		role: user.role,
		createdAt: createdAtIso,
		expiresAt: expiresAtIso,
	};
}

export async function destroySession() {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

	if (token) {
		await ensureDbInitialized();
		await dbQuery(`DELETE FROM sessions WHERE token = $1`, [token]);
	}

	cookieStore.delete(SESSION_COOKIE_NAME);
}

async function getSessionFromCookie() {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
	if (!token) return null;

	await ensureDbInitialized();
	const now = Date.now();
	const { rows } = await dbQuery(
		`SELECT token, user_id, role, created_at, expires_at
		 FROM sessions
		 WHERE token = $1
		 LIMIT 1`,
		[token],
	);

	if (!rows[0]) return null;

	const row = rows[0];
	const expiresAtMs = Date.parse(
		row.expires_at?.toISOString?.() ?? row.expires_at,
	);
	if (Number.isFinite(expiresAtMs) && expiresAtMs < now) {
		await dbQuery(`DELETE FROM sessions WHERE token = $1`, [token]);
		cookieStore.delete(SESSION_COOKIE_NAME);
		return null;
	}

	return {
		token: row.token,
		userId: row.user_id,
		role: row.role,
		createdAt: row.created_at?.toISOString?.() ?? row.created_at,
		expiresAt: row.expires_at?.toISOString?.() ?? row.expires_at,
	};
}

export async function getCurrentUser() {
	const session = await getSessionFromCookie();
	if (!session) return null;

	const user = await findUserById(session.userId);
	if (!user) return null;

	const { passwordHash: _ignored, ...safeUser } = user;
	return safeUser;
}

export async function requireUser() {
	const user = await getCurrentUser();
	if (!user) {
		throw new Error("Unauthorized");
	}
	return user;
}

export async function requireAdmin() {
	const user = await requireUser();
	if (user.role !== "admin") {
		throw new Error("Forbidden");
	}
	return user;
}

