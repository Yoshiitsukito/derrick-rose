"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Hr from "@/components/Hr";
import Button from "@/components/Button";
import { useLocale } from "@/lib/useLocale";

export default function AuthPage() {
	const locale = useLocale();
	const isMn = locale === "mn";
	const router = useRouter();
	const pathname = usePathname();
	const nextAfterLogin =
		pathname?.startsWith("/mn/") ? "/mn/events" : "/events";
	const googleHref = `/api/auth/google?next=${encodeURIComponent(nextAfterLogin)}`;

	const [mode, setMode] = useState("login"); // login | register
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		if (typeof window === "undefined") return;
		const p = new URLSearchParams(window.location.search);
		const err = p.get("error");
		if (!err) return;
		if (err === "google_not_configured") {
			setError(
				isMn
					? "Google нэвтрэлт сервер дээр тохируулаагүй байна. .env.local файлд GOOGLE_CLIENT_ID болон GOOGLE_CLIENT_SECRET оруулж, серверийг дахин эхлүүлнэ үү."
					: "Google sign-in is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local and restart the dev server.",
			);
		} else if (err.startsWith("google_") || err.includes("google")) {
			setError(
				isMn
					? "Google-ээр нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу."
					: "Google sign-in failed. Please try again.",
			);
		} else {
			try {
				setError(decodeURIComponent(err).slice(0, 240));
			} catch {
				setError(err.slice(0, 240));
			}
		}
		const url = new URL(window.location.href);
		url.searchParams.delete("error");
		window.history.replaceState({}, "", url.pathname + url.search);
	}, [isMn]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");
		try {
			if (mode === "register") {
				if (!name.trim()) {
					setError(isMn ? "Нэрээ оруулна уу." : "Please enter your name.");
					return;
				}
				if (password !== confirmPassword) {
					setError(
						isMn
							? "Нууц үг давтсан утгатай таарахгүй байна."
							: "Password and confirm password do not match.",
					);
					return;
				}
			}

			const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: name.trim(), email, password }),
			});
			const body = await res.json().catch(() => ({}));

			if (!res.ok) {
				if (mode === "login" && res.status === 401) {
					setError(
						isMn
							? "Имэйл эсвэл нууц үг буруу байна."
							: "Email or password is incorrect.",
					);
					return;
				}
				if (mode === "register" && res.status === 409) {
					setError(
						isMn
							? "Энэ имэйлээр аль хэдийн бүртгэл үүссэн байна."
							: "An account with this email already exists.",
					);
					return;
				}
				setError(
					body.error ||
						(isMn ? "Нэвтрэхэд алдаа гарлаа." : "Authentication failed."),
				);
				return;
			}

			const user = body.user;

			if (mode === "register") {
				setSuccess(
					isMn
						? "Бүртгэл амжилттай! Одоо системд нэвтэрлээ."
						: "Registration successful! You are now logged in.",
				);
			}

			if (user?.role === "admin") {
				router.push("/admin/events");
			} else {
				router.push("/events");
			}
		} catch (err) {
			setError(
				err.message ||
					(isMn ? "Нэвтрэхэд алдаа гарлаа." : "Failed to authenticate."),
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-screen w-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white flex items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-md bg-neutral-900/90 border border-red-700/60 rounded-2xl p-6 space-y-5 shadow-xl">
				<header className="space-y-2">
					<div className="flex justify-center">
						<div className="relative h-40 w-40 rounded-full overflow-hidden border border-red-700/60 bg-black/40">
							<Image
								src="/image/drose-hero.svg"
								alt="Derrick Rose logo"
								fill
								className="object-cover"
								sizes="160px"
								priority
							/>
						</div>
					</div>
					<h1 className="text-2xl md:text-3xl font-extrabold">
						{mode === "login"
							? isMn
								? "Нэвтрэх"
								: "Login"
							: isMn
							? "Бүртгүүлэх"
							: "Register"}
					</h1>
					<Hr />
					<p className="text-xs text-gray-300">
						{isMn
							? "Derrick Rose Event-ийн тасалбар авахын тулд данстай байж нэвтэрнэ үү."
							: "Login or create an account to purchase tickets for Derrick Rose events."}
					</p>
				</header>

				<div className="space-y-3">
					<a
						href={googleHref}
						className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-600 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50">
						<svg
							className="h-5 w-5"
							viewBox="0 0 24 24"
							aria-hidden="true">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						{isMn ? "Google-ээр үргэлжлүүлэх" : "Continue with Google"}
					</a>
					<p className="text-[10px] text-center text-gray-500">
						{isMn
							? "Нэг товшилтоор нэвтрэх эсвэл шинэ бүртгэл үүсгэнэ."
							: "Sign in or create an account with one click."}
					</p>
				</div>

				<div className="relative flex items-center gap-2 text-[10px] text-gray-500">
					<span className="h-px flex-1 bg-gray-700" />
					{isMn ? "эсвэл имэйлээр" : "or with email"}
					<span className="h-px flex-1 bg-gray-700" />
				</div>

				<div className="flex gap-2 text-xs">
					<button
						type="button"
						onClick={() => setMode("login")}
						className={`flex-1 px-3 py-1 rounded-full border ${
							mode === "login"
								? "border-red-600 bg-red-700/40 text-white"
								: "border-gray-700 text-gray-300"
						}`}>
						{isMn ? "Нэвтрэх" : "Login"}
					</button>
					<button
						type="button"
						onClick={() => setMode("register")}
						className={`flex-1 px-3 py-1 rounded-full border ${
							mode === "register"
								? "border-red-600 bg-red-700/40 text-white"
								: "border-gray-700 text-gray-300"
						}`}>
						{isMn ? "Бүртгүүлэх" : "Register"}
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{mode === "register" && (
						<div>
							<label className="block text-xs text-gray-400 mb-1">
								{isMn ? "Нэр" : "Name"}
							</label>
							<input
								type="text"
								required={mode === "register"}
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full rounded-md border border-gray-700 bg-neutral-950 px-2 py-1 text-sm"
							/>
						</div>
					)}
					<div>
						<label className="block text-xs text-gray-400 mb-1">
							Email
						</label>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded-md border border-gray-700 bg-neutral-950 px-2 py-1 text-sm"
						/>
					</div>
					<div>
						<label className="block text-xs text-gray-400 mb-1">
							{isMn ? "Нууц үг" : "Password"}
						</label>
						<input
							type="password"
							required
							minLength={6}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full rounded-md border border-gray-700 bg-neutral-950 px-2 py-1 text-sm"
						/>
					</div>
					{mode === "register" && (
						<div>
							<label className="block text-xs text-gray-400 mb-1">
								{isMn ? "Нууц үг давтах" : "Confirm password"}
							</label>
							<input
								type="password"
								required={mode === "register"}
								minLength={6}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full rounded-md border border-gray-700 bg-neutral-950 px-2 py-1 text-sm"
							/>
						</div>
					)}
					<Button variation="primary">
						<span className="w-full h-full block text-center">
							{loading
								? isMn
									? "Илгээж байна..."
									: "Submitting..."
								: mode === "login"
								? isMn
									? "Нэвтрэх"
									: "Login"
								: isMn
								? "Бүртгүүлэх"
								: "Register"}
						</span>
					</Button>
					{success && (
						<p className="text-xs text-green-400">
							{success}
						</p>
					)}
					{error && (
						<p className="text-xs text-red-400">
							{error}
						</p>
					)}
				</form>

				<p className="text-[10px] text-gray-500">
					{isMn
						? "Тавтай морилно уу."
						: "Welocome/"}
				</p>
			</div>
		</main>
	);
}

