import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { listTicketsForUser } from "@/lib/tickets";
import { getEventById } from "@/lib/events";

export async function GET() {
	try {
		const user = await requireUser();
		const rawTickets = await listTicketsForUser(user.id);

		const withEvent = await Promise.all(
			rawTickets.map(async (t) => {
				const event = await getEventById(t.eventId);
				return {
					...t,
					eventTitle: event?.title || null,
					eventDate: event?.date || null,
				};
			}),
		);

		return NextResponse.json({ tickets: withEvent }, { status: 200 });
	} catch (err) {
		if (err?.message === "Unauthorized") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}
		console.error("List my tickets error", err);
		return NextResponse.json(
			{ error: "Failed to load tickets." },
			{ status: 500 },
		);
	}
}

