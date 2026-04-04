import { NextResponse } from "next/server";
import { listActiveEvents } from "@/lib/events";
import { listTicketsForEvent } from "@/lib/tickets";

export async function GET() {
	try {
		const events = await listActiveEvents();
		const enriched = await Promise.all(
			events.map(async (e) => {
				const limit =
					typeof e.ticketLimit === "number" &&
					Number.isFinite(e.ticketLimit)
						? e.ticketLimit
						: null;
				if (!e.hasTicket || limit === null) {
					return { ...e, ticketLimit: limit, ticketsSold: null, soldOut: false };
				}
				const tickets = await listTicketsForEvent(e.id);
				const sold = tickets.reduce(
					(sum, t) => sum + (Number(t.quantity) || 0),
					0,
				);
				const remaining = limit - sold;
				return {
					...e,
					ticketLimit: limit,
					ticketsSold: sold,
					soldOut: remaining <= 0,
				};
			}),
		);
		return NextResponse.json({ events: enriched }, { status: 200 });
	} catch (err) {
		console.error("List events error", err);
		return NextResponse.json(
			{ error: "Failed to load events." },
			{ status: 500 },
		);
	}
}

