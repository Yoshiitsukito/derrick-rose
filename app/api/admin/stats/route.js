import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { getTicketStats } from "@/lib/tickets";
import { listAllEvents } from "@/lib/events";
import { countContactMessages } from "@/lib/contacts";
import { dbQuery, ensureDbInitialized } from "@/lib/db";

export async function GET() {
	try {
		await requireAdmin();
		await ensureDbInitialized();

		let ticketStats = { totalOrders: 0, totalQuantity: 0, totalRevenue: 0 };
		let events = [];
		let pendingContacts = 0;
		let userCount = 0;

		try {
			[ticketStats, events, pendingContacts, userCount] = await Promise.all([
				getTicketStats(),
				listAllEvents(),
				countContactMessages(true),
				dbQuery(
					`SELECT COUNT(*)::int AS total FROM users WHERE role <> 'admin'`,
				).then((r) => r?.rows?.[0]?.total ?? 0).catch(() => 0),
			]);
		} catch (e) {
			console.error("Admin stats fetch error:", e);
		}

		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);
		const todayEnd = new Date(todayStart);
		todayEnd.setDate(todayEnd.getDate() + 1);

		let ticketsSoldToday = 0;
		let revenueToday = 0;
		let salesByMonth = [];

		try {
			const [
				{ rows: todayRows },
				{ rows: revenueByMonth },
			] = await Promise.all([
				dbQuery(
					`SELECT COALESCE(SUM(quantity), 0)::bigint AS qty, COALESCE(SUM(total_price), 0)::numeric AS rev
					 FROM tickets WHERE created_at >= $1 AND created_at < $2`,
					[todayStart.toISOString(), todayEnd.toISOString()],
				),
				dbQuery(
					`SELECT TO_CHAR(created_at, 'YYYY-MM') AS month, COALESCE(SUM(total_price), 0)::numeric AS rev
					 FROM tickets GROUP BY TO_CHAR(created_at, 'YYYY-MM') ORDER BY month`,
				),
			]);
			ticketsSoldToday = Number(todayRows?.[0]?.qty ?? 0);
			revenueToday = Number(todayRows?.[0]?.rev ?? 0);
			salesByMonth = (revenueByMonth || []).map((r) => ({
				month: r.month,
				revenue: Number(r.rev ?? 0),
			}));
		} catch (e) {
			console.error("Admin stats date/revenue error:", e);
		}

		return NextResponse.json({
			totalOrders: ticketStats.totalOrders ?? 0,
			totalTickets: ticketStats.totalQuantity ?? 0,
			totalRevenue: ticketStats.totalRevenue ?? 0,
			ticketsSoldToday,
			revenueToday,
			totalEvents: events?.length ?? 0,
			activeEvents: events?.filter((e) => e?.isActive)?.length ?? 0,
			pendingContacts: pendingContacts ?? 0,
			totalCustomers: userCount ?? 0,
			salesByMonth,
		}, { status: 200 });
	} catch (err) {
		if (err?.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (err?.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		console.error("Admin stats error", err);
		return NextResponse.json(
			{ error: "Failed to load stats." },
			{ status: 500 },
		);
	}
}
