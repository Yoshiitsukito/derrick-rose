"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Hr from "@/components/Hr";
import Button from "@/components/Button";
import { useLocale } from "@/lib/useLocale";

export default function MyTicketsPage() {
	const locale = useLocale();
	const isMn = locale === "mn";
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch("/api/tickets/my");
				if (res.status === 401) {
					if (!mounted) return;
					setError(
						isMn
							? "Өөрийн тасалбарыг харахын тулд нэвтэрнэ үү."
							: "Please login to view your tickets.",
					);
					return;
				}
				if (!res.ok) {
					const body = await res.json().catch(() => ({}));
					throw new Error(body.error || "Failed to load tickets.");
				}
				const data = await res.json();
				if (!mounted) return;
				setTickets(data.tickets || []);
			} catch (err) {
				if (!mounted) return;
				setError(
					err.message ||
						(isMn ? "Тасалбар ачаалахад алдаа гарлаа." : "Failed to load tickets."),
				);
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [isMn]);

	return (
		<main className="min-h-screen w-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white flex items-center justify-center p-6 md:p-10">
			<div className="max-w-4xl w-full space-y-6">
				<header className="space-y-3">
					<h1 className="text-4xl md:text-5xl font-extrabold">
						{isMn ? "Миний тасалбарууд" : "My tickets"}
					</h1>
					<Hr />
					<p className="text-gray-200 leading-relaxed">
						{isMn
							? "Derrick Rose Event-үүдээс авсан mock тасалбарууд энд харагдана."
							: "All mock tickets you have purchased for Derrick Rose events will appear here."}
					</p>
				</header>

				{loading && (
					<p className="text-gray-400 text-sm">
						{isMn ? "Тасалбаруудыг ачаалж байна..." : "Loading tickets..."}
					</p>
				)}

				{!loading && error && (
					<p className="text-red-400 text-sm">
						{error}
						{error.includes("login") && (
							<>
								{" "}
								{isMn
									? "Нэвтрэх/бүртгүүлэх хэсгийг цэснээс ашиглана уу."
									: "Use the login/register section from the menu."}
							</>
						)}
					</p>
				)}

				{!loading && !error && tickets.length === 0 && (
					<p className="text-gray-400 text-sm">
						{isMn ? (
							<>
								{"Та хараахан тасалбар аваагүй байна. "}
								<Link href="/events" className="text-red-400 underline">
									Event жагсаалт
								</Link>
								{" хэсгээс сонгон mock тасалбар авч үзээрэй."}
							</>
						) : (
							<>
								{"You have no tickets yet. Go to "}
								<Link href="/events" className="text-red-400 underline">
									events
								</Link>
								{" to grab a mock ticket."}
							</>
						)}
					</p>
				)}

				{!loading && !error && tickets.length > 0 && (
					<div className="space-y-4">
						{tickets.map((t) => (
							<motion.div
								key={t.id}
								className="rounded-2xl border border-red-700/60 bg-neutral-900/80 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}>
								<div>
									<p className="text-sm text-gray-400 mb-1">
										{isMn ? "Event:" : "Event:"}{" "}
										<span className="font-semibold text-white">
											{t.eventTitle || t.eventId}
										</span>
									</p>
									{t.eventDate && (
										<p className="text-xs text-gray-500">
											{new Date(t.eventDate).toLocaleString()}
										</p>
									)}
									<p className="text-xs text-gray-500 mt-1">
										{isMn ? "Тасалбар ID:" : "Ticket ID:"} {t.id}
									</p>
								</div>
								<div className="flex flex-col items-end gap-1">
									<p className="text-sm text-gray-300">
										{isMn ? "Тоо ширхэг:" : "Quantity:"}{" "}
										<span className="font-semibold">{t.quantity}</span>
									</p>
									<p className="text-sm text-red-400 font-semibold">
										{isMn ? "Нийт:" : "Total:"} $
										{Number(t.totalPrice || 0).toFixed(2)}
									</p>
									<p className="text-xs uppercase tracking-wide text-green-400">
										{isMn ? "Mock төлбөр амжилттай" : "Mock payment success"}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				)}

				<div className="pt-4">
					<Button variation="secondary">
						<Link href="/events">
							{isMn ? "Event жагсаалт руу буцах" : "Back to events"}
						</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}

