import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json(
				{ error: "Not authenticated." },
				{ status: 401 },
			);
		}

		return NextResponse.json(
			{
				user: {
					id: user.id,
					email: user.email,
					role: user.role,
				},
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error("Me endpoint error", err);
		return NextResponse.json(
			{ error: "Failed to load user." },
			{ status: 500 },
		);
	}
}

