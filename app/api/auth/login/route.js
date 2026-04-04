import { NextResponse } from "next/server";
import { verifyUserCredentials, ensureAdminSeedUser } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req) {
	try {
		await ensureAdminSeedUser();

		const { email, password } = await req.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required." },
				{ status: 400 },
			);
		}

		const user = await verifyUserCredentials({ email, password });
		if (!user) {
			return NextResponse.json(
				{ error: "Invalid email or password." },
				{ status: 401 },
			);
		}

		await createSession(user);

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
		console.error("Login error", err);
		return NextResponse.json(
			{ error: "Failed to login user." },
			{ status: 500 },
		);
	}
}

