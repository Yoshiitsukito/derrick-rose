import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import {
	listAllTickets,
	countAllTickets,
	listTicketDailyCountsByMonth,
} from "@/lib/tickets";

export async function GET(req) {
	try {
		await requireAdmin();
		const { searchParams } = new URL(req.url);
		const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
		const offset = parseInt(searchParams.get("offset") || "0", 10);
		const eventId = searchParams.get("eventId") || null;
		const month = searchParams.get("month") || null;

		const [orders, total, dailySeries] = await Promise.all([
			listAllTickets(limit, offset, eventId, month),
			countAllTickets(eventId, month),
			listTicketDailyCountsByMonth(month),
		]);

		return NextResponse.json(
			{ orders, total, dailySeries },
			{ status: 200 },
		);
	} catch (err) {
		if (err?.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (err?.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		console.error("Admin list orders error", err);
		return NextResponse.json(
			{ error: "Failed to load orders." },
			{ status: 500 },
		);
	}
}
