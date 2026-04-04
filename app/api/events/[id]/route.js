import { NextResponse } from "next/server";
import { getEventById } from "@/lib/events";
import { listTicketsForEvent } from "@/lib/tickets";

export async function GET(_req, { params }) {
	try {
		const { id } = params;
		const event = await getEventById(id);
		if (!event) {
			return NextResponse.json({ error: "Event not found." }, { status: 404 });
		}

		const limit =
			typeof event.ticketLimit === "number" &&
			Number.isFinite(event.ticketLimit)
				? event.ticketLimit
				: null;

		if (!event.hasTicket || limit === null) {
			return NextResponse.json(
				{
					event: {
						...event,
						ticketLimit: limit,
						ticketsSold: null,
						soldOut: false,
					},
				},
				{ status: 200 },
			);
		}

		const tickets = await listTicketsForEvent(event.id);
		const sold = tickets.reduce(
			(sum, t) => sum + (Number(t.quantity) || 0),
			0,
		);
		const remaining = limit - sold;

		return NextResponse.json(
			{
				event: {
					...event,
					ticketLimit: limit,
					ticketsSold: sold,
					soldOut: remaining <= 0,
				},
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error("Get event error", err);
		return NextResponse.json(
			{ error: "Failed to load event." },
			{ status: 500 },
		);
	}
}

