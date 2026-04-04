"use server";

import { dbQuery, ensureDbInitialized } from "./db";

export async function logContactMessage({ name, email, message }) {
	await ensureDbInitialized();
	const nowIso = new Date().toISOString();

	const entry = {
		id: `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
		name: name?.trim() || "",
		email: email?.trim() || "",
		message: message?.trim() || "",
		replyStatus: "pending",
		createdAt: nowIso,
	};

	await dbQuery(
		`INSERT INTO contacts
		 (id, name, email, message, reply_status, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		[
			entry.id,
			entry.name,
			entry.email,
			entry.message,
			entry.replyStatus,
			entry.createdAt,
		],
	);

	return entry;
}

export async function countContactMessages(pendingOnly = false) {
	await ensureDbInitialized();
	const filter = pendingOnly ? " WHERE reply_status = 'pending'" : "";
	const { rows } = await dbQuery(
		`SELECT COUNT(*)::int AS total FROM contacts${filter}`,
	);
	return rows[0]?.total ?? 0;
}

export async function listContactMessages() {
	await ensureDbInitialized();
	const { rows } = await dbQuery(
		`SELECT id, name, email, message, reply_status, reply_subject, reply_body, reply_at, created_at
		 FROM contacts
		 ORDER BY created_at DESC`,
	);

	return rows.map((row) => ({
		id: row.id,
		name: row.name,
		email: row.email,
		message: row.message,
		replyStatus: row.reply_status,
		replySubject: row.reply_subject ?? undefined,
		replyBody: row.reply_body ?? undefined,
		replyAt: row.reply_at?.toISOString?.() ?? row.reply_at ?? undefined,
		createdAt: row.created_at?.toISOString?.() ?? row.created_at,
	}));
}

export async function updateContactReply(id, { subject, body }) {
	await ensureDbInitialized();
	const { rows } = await dbQuery(
		`SELECT id, name, email, message, reply_status, reply_subject, reply_body, reply_at, created_at
		 FROM contacts
		 WHERE id = $1
		 LIMIT 1`,
		[id],
	);
	if (!rows[0]) return null;

	const existing = rows[0];
	const updated = {
		id: existing.id,
		name: existing.name,
		email: existing.email,
		message: existing.message,
		replyStatus: "replied",
		replySubject: subject,
		replyBody: body,
		replyAt: new Date().toISOString(),
		createdAt:
			existing.created_at?.toISOString?.() ?? existing.created_at ?? undefined,
	};

	await dbQuery(
		`UPDATE contacts
		 SET reply_status = $2,
		     reply_subject = $3,
			 reply_body = $4,
			 reply_at = $5
		 WHERE id = $1`,
		[id, updated.replyStatus, updated.replySubject, updated.replyBody, updated.replyAt],
	);

	return updated;
}

