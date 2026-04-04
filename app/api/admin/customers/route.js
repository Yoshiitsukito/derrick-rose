import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { dbQuery, ensureDbInitialized } from "@/lib/db";

export async function GET(req) {
	try {
		await requireAdmin();
		await ensureDbInitialized();

		const { searchParams } = new URL(req.url);
		const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
		const offset = parseInt(searchParams.get("offset") || "0", 10);

		const { rows } = await dbQuery(
			`SELECT
			   u.id,
			   u.email,
			   u.created_at AS date_join,
			   COUNT(t.id)::int AS order_count,
			   COALESCE(SUM(t.quantity), 0)::bigint AS tickets_ordered,
			   COALESCE(SUM(t.total_price), 0)::numeric AS total_spent,
			   MAX(t.created_at) AS last_order_at
			 FROM users u
			 LEFT JOIN tickets t ON t.user_id = u.id
			 WHERE u.role <> 'admin'
			 GROUP BY u.id, u.email, u.created_at
			 ORDER BY total_spent DESC NULLS LAST, last_order_at DESC NULLS LAST
			 LIMIT $1 OFFSET $2`,
			[limit, offset],
		);

		const { rows: countRows } = await dbQuery(
			`SELECT COUNT(*)::int AS total FROM users WHERE role <> 'admin'`,
		);

		const customers = rows.map((r) => ({
			id: r.id,
			email: r.email,
			dateJoin: r.date_join?.toISOString?.() ?? r.date_join,
			orderCount: r.order_count,
			ticketsOrdered: r.tickets_ordered,
			totalSpent: Number(r.total_spent ?? 0),
			lastOrderAt: r.last_order_at?.toISOString?.() ?? r.last_order_at,
		}));

		return NextResponse.json(
			{ customers, total: countRows[0]?.total ?? 0 },
			{ status: 200 },
		);
	} catch (err) {
		if (err?.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (err?.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		console.error("Admin list customers error", err);
		return NextResponse.json(
			{ error: "Failed to load customers." },
			{ status: 500 },
		);
	}
}
