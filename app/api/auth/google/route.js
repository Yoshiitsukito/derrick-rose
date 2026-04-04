import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
	buildGoogleAuthUrl,
	generateOAuthState,
	getGoogleOAuthConfig,
	safeOAuthNextPath,
} from "@/lib/googleOAuth";

const STATE_COOKIE = "oauth_google_state";
const NEXT_COOKIE = "oauth_google_next";
const COOKIE_MAX_AGE = 60 * 10;

function authPagePathForNext(nextPath) {
	return nextPath.startsWith("/mn/") ? "/mn/auth" : "/auth";
}

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const next = safeOAuthNextPath(searchParams.get("next"));

		const { clientId } = getGoogleOAuthConfig();
		if (!clientId) {
			const authPath = `${authPagePathForNext(next)}?error=google_not_configured`;
			return NextResponse.redirect(new URL(authPath, request.url));
		}

		const state = generateOAuthState();
		const url = buildGoogleAuthUrl(state);

		const cookieStore = await cookies();
		const secure = process.env.NODE_ENV === "production";

		cookieStore.set(STATE_COOKIE, state, {
			httpOnly: true,
			secure,
			sameSite: "lax",
			path: "/",
			maxAge: COOKIE_MAX_AGE,
		});
		cookieStore.set(NEXT_COOKIE, next, {
			httpOnly: true,
			secure,
			sameSite: "lax",
			path: "/",
			maxAge: COOKIE_MAX_AGE,
		});

		return NextResponse.redirect(url);
	} catch (err) {
		console.error("Google OAuth start error", err);
		const fallback = `/auth?error=${encodeURIComponent(err?.message || "google_start_failed")}`;
		return NextResponse.redirect(new URL(fallback, request.url));
	}
}
