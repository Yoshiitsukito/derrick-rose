import { NextResponse } from "next/server";
import { createUser, ensureAdminSeedUser } from "@/lib/auth";
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

		if (password.length < 6) {
			return NextResponse.json(
				{ error: "Password must be at least 6 characters." },
				{ status: 400 },
			);
		}

		const user = await createUser({ email, password, role: "user" });
		await createSession(user);

		return NextResponse.json(
			{
				user: {
					id: user.id,
					email: user.email,
					role: user.role,
				},
			},
			{ status: 201 },
		);
	} catch (err) {
		if (err?.message?.includes("already exists")) {
			return NextResponse.json({ error: err.message }, { status: 409 });
		}

		console.error("Register error", err);
		return NextResponse.json(
			{ error: "Failed to register user." },
			{ status: 500 },
		);
	}
}

