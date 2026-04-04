import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

export async function POST() {
	try {
		await destroySession();
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err) {
		console.error("Logout error", err);
		return NextResponse.json(
			{ error: "Failed to logout." },
			{ status: 500 },
		);
	}
}

