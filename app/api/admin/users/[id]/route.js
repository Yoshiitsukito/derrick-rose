import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { deleteUser } from "@/lib/auth";

export async function DELETE(_req, { params }) {
	try {
		await requireAdmin();
		const { id } = await params;
		if (!id) {
			return NextResponse.json(
				{ error: "User ID required." },
				{ status: 400 },
			);
		}
		await deleteUser(id);
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
		if (err?.message === "Cannot delete admin user.") {
			return NextResponse.json(
				{ error: "Cannot delete admin user." },
				{ status: 403 },
			);
		}
		console.error("Admin delete user error", err);
		return NextResponse.json(
			{ error: "Failed to delete user." },
			{ status: 500 },
		);
	}
}
