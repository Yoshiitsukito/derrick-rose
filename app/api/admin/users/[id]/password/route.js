import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { updateUserPassword } from "@/lib/auth";

export async function PUT(req, { params }) {
	try {
		await requireAdmin();
		const { id } = await params;
		if (!id) {
			return NextResponse.json(
				{ error: "User ID required." },
				{ status: 400 },
			);
		}
		const body = await req.json();
		const newPassword = body?.password?.trim();
		if (!newPassword || newPassword.length < 6) {
			return NextResponse.json(
				{ error: "Password must be at least 6 characters." },
				{ status: 400 },
			);
		}
		await updateUserPassword(id, newPassword);
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err) {
		if (err?.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (err?.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		if (err?.message === "User not found.") {
			return NextResponse.json({ error: "User not found." }, { status: 404 });
		}
		if (err?.message === "Cannot change admin password this way.") {
			return NextResponse.json(
				{ error: "Cannot change admin password this way." },
				{ status: 403 },
			);
		}
		console.error("Admin update password error", err);
		return NextResponse.json(
			{ error: "Failed to update password." },
			{ status: 500 },
		);
	}
}
