"use server";

import { dbQuery, ensureDbInitialized } from "./db";

function mapEventRow(row) {
	if (!row) return null;
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		date: row.date?.toISOString?.() ?? row.date,
		price: typeof row.price === "number" ? row.price : Number(row.price ?? 0),
		ticketLimit:
			row.ticket_limit === null || row.ticket_limit === undefined
				? null
				: Number(row.ticket_limit),
		imageUrl: row.image_url || "",
		qrImageUrl: row.qr_image_url || "",
		videoUrl: row.video_url || "",
		location: row.location || "",
		hasTicket: !!row.has_ticket,
		isActive: row.is_active !== false,
		createdAt: row.created_at?.toISOString?.() ?? row.created_at,
		updatedAt: row.updated_at?.toISOString?.() ?? row.updated_at,
	};
}

export async function listActiveEvents() {
	await ensureDbInitialized();
	const { rows } = await dbQuery(
		`SELECT *
		 FROM events
		 WHERE is_active <> FALSE
		 ORDER BY date ASC`,
	);
	return rows.map(mapEventRow);
}

export async function listAllEvents() {
	await ensureDbInitialized();
	const { rows } = await dbQuery(
		`SELECT * FROM events ORDER BY date DESC`,
	);
	return rows.map(mapEventRow);
}

export async function getEventById(id) {
	await ensureDbInitialized();
	const { rows } = await dbQuery(`SELECT * FROM events WHERE id = $1 LIMIT 1`, [
		id,
	]);
	return mapEventRow(rows[0]);
}

export async function createEvent(input) {
	await ensureDbInitialized();
	const nowIso = new Date().toISOString();

	const id = `event_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

	const event = {
		id,
		title: input.title?.trim() || "Untitled Event",
		description: input.description?.trim() || "",
		date: input.date || nowIso,
		price: typeof input.price === "number" ? input.price : 0,
		ticketLimit:
			typeof input.ticketLimit === "number" && Number.isFinite(input.ticketLimit)
				? input.ticketLimit
				: null,
		imageUrl: input.imageUrl?.trim() || "",
		qrImageUrl: input.qrImageUrl?.trim() || "",
		videoUrl: input.videoUrl?.trim() || "",
		location: input.location?.trim() || "",
		hasTicket: Boolean(input.hasTicket),
		isActive: input.isActive !== false,
		createdAt: nowIso,
		updatedAt: nowIso,
	};

	await dbQuery(
		`INSERT INTO events
		 (id, title, description, date, price, ticket_limit, image_url, qr_image_url, video_url, location, has_ticket, is_active, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
		[
			event.id,
			event.title,
			event.description,
			event.date,
			event.price,
			event.ticketLimit,
			event.imageUrl,
			event.qrImageUrl,
			event.videoUrl,
			event.location,
			event.hasTicket,
			event.isActive,
			event.createdAt,
			event.updatedAt,
		],
	);

	return event;
}

export async function updateEvent(id, patch) {
	await ensureDbInitialized();
	const existing = await getEventById(id);
	if (!existing) return null;

	const updated = {
		...existing,
		...patch,
		title: patch.title !== undefined ? patch.title.trim() : existing.title,
		description:
			patch.description !== undefined
				? patch.description.trim()
				: existing.description,
		date: patch.date || existing.date,
		price:
			patch.price !== undefined && typeof patch.price === "number"
				? patch.price
				: existing.price,
		ticketLimit:
			patch.ticketLimit !== undefined && patch.ticketLimit !== null
				? Number.isFinite(Number(patch.ticketLimit))
					? Number(patch.ticketLimit)
					: existing.ticketLimit ?? null
				: patch.ticketLimit === null
				? null
				: existing.ticketLimit ?? null,
		imageUrl:
			patch.imageUrl !== undefined
				? patch.imageUrl.trim()
				: existing.imageUrl || "",
		qrImageUrl:
			patch.qrImageUrl !== undefined
				? patch.qrImageUrl.trim()
				: existing.qrImageUrl || "",
		videoUrl:
			patch.videoUrl !== undefined
				? patch.videoUrl.trim()
				: existing.videoUrl || "",
		location:
			patch.location !== undefined
				? patch.location.trim()
				: existing.location || "",
		hasTicket:
			patch.hasTicket !== undefined
				? !!patch.hasTicket
				: existing.hasTicket,
		isActive:
			patch.isActive !== undefined ? !!patch.isActive : existing.isActive,
		updatedAt: new Date().toISOString(),
	};

	await dbQuery(
		`UPDATE events
		 SET title = $2,
		     description = $3,
			 date = $4,
			 price = $5,
			 ticket_limit = $6,
			 image_url = $7,
			 qr_image_url = $8,
			 video_url = $9,
			 location = $10,
			 has_ticket = $11,
			 is_active = $12,
			 updated_at = $13
		 WHERE id = $1`,
		[
			id,
			updated.title,
			updated.description,
			updated.date,
			updated.price,
			updated.ticketLimit,
			updated.imageUrl,
			updated.qrImageUrl,
			updated.videoUrl,
			updated.location,
			updated.hasTicket,
			updated.isActive,
			updated.updatedAt,
		],
	);

	return updated;
}

export async function deleteEvent(id) {
	await ensureDbInitialized();
	const { rowCount } = await dbQuery(`DELETE FROM events WHERE id = $1`, [id]);
	return rowCount > 0;
}

