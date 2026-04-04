"use server";

import { dbQuery, ensureDbInitialized } from "./db";

const BLOCK_IDS = new Set([
	"block1",
	"block2",
	"block3",
	"block4",
	"block5",
	"block6",
]);

function parseMonthRange(month) {
	if (!month) return null;
	const [year, monthNum] = String(month).split("-").map(Number);
	if (!year || !monthNum) return null;
	return {
		start: new Date(Date.UTC(year, monthNum - 1, 1)).toISOString(),
		end: new Date(Date.UTC(year, monthNum, 1)).toISOString(),
	};
}

export async function createTicketOrder({
	eventId,
	userId,
	quantity,
	totalPrice,
	bookingBlock = null,
	bookingDate = null,
}) {
	await ensureDbInitialized();
	const nowIso = new Date().toISOString();
	const normalizedBlock = BLOCK_IDS.has(bookingBlock) ? bookingBlock : null;
	const normalizedDate = bookingDate || nowIso.slice(0, 10);

	const order = {
		id: `ticket_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
		eventId,
		userId,
		quantity: quantity > 0 ? quantity : 1,
		totalPrice: typeof totalPrice === "number" ? totalPrice : 0,
		status: "paid",
		bookingBlock: normalizedBlock,
		bookingDate: normalizedDate,
		createdAt: nowIso,
	};

	await dbQuery(
		`INSERT INTO tickets
		 (id, event_id, user_id, quantity, total_price, status, booking_block, booking_date, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		[
			order.id,
			order.eventId,
			order.userId,
			order.quantity,
			order.totalPrice,
			order.status,
			order.bookingBlock,
			order.bookingDate,
			order.createdAt,
		],
	);

	return order;
}

export async function listTicketsForUser(userId) {
	await ensureDbInitialized();
	const { rows } = await dbQuery(
		`SELECT id, event_id, user_id, quantity, total_price, status, booking_block, booking_date, created_at
		 FROM tickets
		 WHERE user_id = $1
		 ORDER BY created_at DESC`,
		[userId],
	);

	return rows.map((row) => ({
		id: row.id,
		eventId: row.event_id,
		userId: row.user_id,
		quantity: row.quantity,
		totalPrice:
			typeof row.total_price === "number"
				? row.total_price
				: Number(row.total_price ?? 0),
		status: row.status,
		bookingBlock: row.booking_block ?? null,
		bookingDate: row.booking_date ?? null,
		createdAt: row.created_at?.toISOString?.() ?? row.created_at,
	}));
}

export async function listTicketsForEvent(eventId) {
	await ensureDbInitialized();
	const { rows } = await dbQuery(
		`SELECT id, event_id, user_id, quantity, total_price, status, booking_block, booking_date, created_at
		 FROM tickets
		 WHERE event_id = $1`,
		[eventId],
	);

	return rows.map((row) => ({
		id: row.id,
		eventId: row.event_id,
		userId: row.user_id,
		quantity: row.quantity,
		totalPrice:
			typeof row.total_price === "number"
				? row.total_price
				: Number(row.total_price ?? 0),
		status: row.status,
		bookingBlock: row.booking_block ?? null,
		bookingDate: row.booking_date ?? null,
		createdAt: row.created_at?.toISOString?.() ?? row.created_at,
	}));
}

export async function listAllTickets(limit = 100, offset = 0, eventId = null, month = null) {
	await ensureDbInitialized();
	const filters = [];
	const params = [];
	if (eventId) {
		params.push(eventId);
		filters.push(`t.event_id = $${params.length}`);
	}
	const monthRange = parseMonthRange(month);
	if (monthRange) {
		params.push(monthRange.start);
		filters.push(`t.created_at >= $${params.length}`);
		params.push(monthRange.end);
		filters.push(`t.created_at < $${params.length}`);
	}
	const whereClause = filters.length > 0 ? ` WHERE ${filters.join(" AND ")}` : "";
	params.push(limit);
	const limitIdx = params.length;
	params.push(offset);
	const offsetIdx = params.length;
	const { rows } = await dbQuery(
		`SELECT t.id, t.event_id, t.user_id, t.quantity, t.total_price, t.status, t.booking_block, t.booking_date, t.created_at,
		        u.email,
		        e.title AS event_title,
		        e.date AS event_date,
		        e.location AS event_location
		 FROM tickets t
		 LEFT JOIN users u ON u.id = t.user_id
		 LEFT JOIN events e ON e.id = t.event_id
		 ${whereClause}
		 ORDER BY t.created_at DESC
		 LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
		params,
	);

	return rows.map((row) => ({
		id: row.id,
		eventId: row.event_id,
		userId: row.user_id,
		quantity: row.quantity,
		totalPrice:
			typeof row.total_price === "number"
				? row.total_price
				: Number(row.total_price ?? 0),
		status: row.status,
		bookingBlock: row.booking_block ?? null,
		bookingDate: row.booking_date ?? null,
		createdAt: row.created_at?.toISOString?.() ?? row.created_at,
		userEmail: row.email || null,
		eventTitle: row.event_title || null,
		eventDate: row.event_date?.toISOString?.() ?? row.event_date,
		eventLocation: row.event_location || null,
	}));
}

export async function countAllTickets(eventId = null, month = null) {
	await ensureDbInitialized();
	const filters = [];
	const params = [];
	if (eventId) {
		params.push(eventId);
		filters.push(`event_id = $${params.length}`);
	}
	const monthRange = parseMonthRange(month);
	if (monthRange) {
		params.push(monthRange.start);
		filters.push(`created_at >= $${params.length}`);
		params.push(monthRange.end);
		filters.push(`created_at < $${params.length}`);
	}
	const whereClause = filters.length ? ` WHERE ${filters.join(" AND ")}` : "";
	const { rows } = await dbQuery(
		`SELECT COUNT(*)::int AS total FROM tickets${whereClause}`,
		params,
	);
	return rows[0]?.total ?? 0;
}

export async function listTicketDailyCountsByMonth(month, eventId = null) {
	await ensureDbInitialized();
	const monthRange = parseMonthRange(month);
	if (!monthRange) return [];

	const params = [monthRange.start, monthRange.end];
	const eventFilter = eventId
		? ` AND event_id = $${params.push(eventId)}`
		: "";

	const { rows } = await dbQuery(
		`SELECT TO_CHAR(created_at::date, 'YYYY-MM-DD') AS day, COUNT(*)::int AS total
		 FROM tickets
		 WHERE created_at >= $1 AND created_at < $2${eventFilter}
		 GROUP BY created_at::date
		 ORDER BY day`,
		params,
	);

	return rows.map((row) => ({
		date: row.day,
		total: row.total ?? 0,
	}));
}

export async function isBookingBlockTaken({ bookingDate, bookingBlock, eventId }) {
	await ensureDbInitialized();
	if (!bookingDate || !bookingBlock || !BLOCK_IDS.has(bookingBlock)) return false;

	const { rows } = await dbQuery(
		`SELECT COUNT(*)::int AS total
		 FROM tickets
		 WHERE booking_date = $1
		   AND booking_block = $2
		   AND ($3::text IS NULL OR event_id = $3::text)`,
		[bookingDate, bookingBlock, eventId ?? null],
	);
	return (rows[0]?.total ?? 0) > 0;
}

export async function getTicketStats() {
	await ensureDbInitialized();
	const { rows } = await dbQuery(
		`SELECT
		   COUNT(*)::int AS total_orders,
		   COALESCE(SUM(quantity), 0)::bigint AS total_quantity,
		   COALESCE(SUM(total_price), 0)::numeric AS total_revenue
		 FROM tickets`,
	);
	return {
		totalOrders: rows[0]?.total_orders ?? 0,
		totalQuantity: rows[0]?.total_quantity ?? 0,
		totalRevenue: Number(rows[0]?.total_revenue ?? 0),
	};
}

