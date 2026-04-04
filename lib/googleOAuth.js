import crypto from "crypto";

function getAppBaseUrl() {
	const explicit = process.env.NEXT_PUBLIC_APP_URL;
	if (explicit) {
		return explicit.replace(/\/$/, "");
	}
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	return "http://localhost:3000";
}

export function getGoogleOAuthConfig() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	const baseUrl = getAppBaseUrl();
	const redirectUri = `${baseUrl}/api/auth/google/callback`;
	return { clientId, clientSecret, redirectUri, baseUrl };
}

export function buildGoogleAuthUrl(state) {
	const { clientId, redirectUri } = getGoogleOAuthConfig();
	if (!clientId) {
		throw new Error("GOOGLE_CLIENT_ID is not set.");
	}
	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: "code",
		scope: "openid email profile",
		state,
		access_type: "online",
		prompt: "select_account",
	});
	return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCodeForTokens(code) {
	const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
	if (!clientId || !clientSecret) {
		throw new Error("Google OAuth is not configured.");
	}
	const res = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			code,
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: redirectUri,
			grant_type: "authorization_code",
		}),
	});
	const body = await res.json().catch(() => ({}));
	if (!res.ok) {
		throw new Error(body.error_description || body.error || "Token exchange failed.");
	}
	return body;
}

export async function fetchGoogleUserInfo(accessToken) {
	const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!res.ok) {
		throw new Error("Failed to fetch Google user profile.");
	}
	return res.json();
}

export function generateOAuthState() {
	return crypto.randomBytes(32).toString("hex");
}

/** Open redirect-ээс зайлсхийх: зөвхөн дотоод зам */
export function safeOAuthNextPath(next) {
	if (!next || typeof next !== "string") {
		return "/events";
	}
	const trimmed = next.trim();
	if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
		return "/events";
	}
	return trimmed.slice(0, 512);
}
