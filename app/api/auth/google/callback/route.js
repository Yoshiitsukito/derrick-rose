import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { upsertGoogleUserFromGoogleProfile, ensureAdminSeedUser } from "@/lib/auth";
import { createSession } from "@/lib/session";
import {
	exchangeGoogleCodeForTokens,
	fetchGoogleUserInfo,
	getGoogleOAuthConfig,
	safeOAuthNextPath,
} from "@/lib/googleOAuth";

const STATE_COOKIE = "oauth_google_state";
const NEXT_COOKIE = "oauth_google_next";

function clearOAuthCookies(cookieStore) {
	cookieStore.delete(STATE_COOKIE);
	cookieStore.delete(NEXT_COOKIE);
}

export async function GET(request) {
	const { baseUrl } = getGoogleOAuthConfig();
	const cookieStore = await cookies();

	try {
		await ensureAdminSeedUser();

		const { searchParams } = new URL(request.url);
		const code = searchParams.get("code");
		const state = searchParams.get("state");
		const errParam = searchParams.get("error");

		if (errParam) {
			clearOAuthCookies(cookieStore);
			return NextResponse.redirect(
				new URL(`/auth?error=google_${encodeURIComponent(errParam)}`, baseUrl),
			);
		}

		const savedState = cookieStore.get(STATE_COOKIE)?.value;
		const nextRaw = cookieStore.get(NEXT_COOKIE)?.value;
		clearOAuthCookies(cookieStore);

		if (!code || !state || !savedState || state !== savedState) {
			return NextResponse.redirect(
				new URL("/auth?error=google_state", baseUrl),
			);
		}

		const tokens = await exchangeGoogleCodeForTokens(code);
		const accessToken = tokens.access_token;
		if (!accessToken) {
			return NextResponse.redirect(
				new URL("/auth?error=google_token", baseUrl),
			);
		}

		const profile = await fetchGoogleUserInfo(accessToken);
		const sub = profile.sub;
		const email = profile.email;
		const emailVerified =
			profile.email_verified === true || profile.email_verified === "true";

		if (!sub || !email) {
			return NextResponse.redirect(
				new URL("/auth?error=google_profile", baseUrl),
			);
		}

		const user = await upsertGoogleUserFromGoogleProfile({
			sub,
			email,
			emailVerified,
		});

		await createSession(user);

		const nextPath = safeOAuthNextPath(nextRaw);
		const redirectPath =
			user.role === "admin" ? "/admin/events" : nextPath;

		return NextResponse.redirect(new URL(redirectPath, baseUrl));
	} catch (err) {
		console.error("Google OAuth callback error", err);
		const cs = await cookies();
		clearOAuthCookies(cs);
		const msg = encodeURIComponent(
			err?.message?.slice(0, 120) || "google_callback",
		);
		return NextResponse.redirect(
			new URL(`/auth?error=${msg}`, baseUrl),
		);
	}
}
