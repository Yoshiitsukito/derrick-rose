import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { listContactMessages } from "@/lib/contacts";

export async function GET() {
	try {
		await requireAdmin();
		const contacts = await listContactMessages();
		return NextResponse.json({ contacts }, { status: 200 });
	} catch (err) {
		if (err?.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (err?.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		console.error("Admin list contacts error", err);
		return NextResponse.json(
			{ error: "Failed to load contacts." },
			{ status: 500 },
		);
	}
}

