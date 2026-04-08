"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import { useLocale } from "@/lib/useLocale";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { getLocalizedDescription } from "@/lib/localizeDescription";

function EventCard({ event, isMn }) {
	const embedUrl = getYoutubeEmbedUrl(event.videoUrl);

	return (
		<motion.div
			className="rounded-xl border border-neutral-700/50 bg-neutral-900/60 p-6 flex flex-col shadow-lg"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}>
			<h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
				{event.title}
			</h3>

			{embedUrl ? (
				<div className="w-full aspect-video rounded-lg overflow-hidden border border-neutral-700/50 bg-black mb-4">
					<iframe
						src={embedUrl}
						title={event.title}
						className="w-full h-full"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						loading="lazy"
					/>
				</div>
			) : event.imageUrl ? (
				<div className="relative w-full aspect-video rounded-lg overflow-hidden border border-neutral-700/50 mb-4">
					<Image
						src={event.imageUrl}
						alt={event.title}
						fill
						className="object-cover"
					/>
				</div>
			) : null}

			<p className="text-sm text-gray-400 mb-2">
				{new Date(event.date).toLocaleString(undefined, {
					year: "numeric",
					month: "long",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				})}
			</p>
			{event.location && (
				<p className="text-xs text-gray-300 mb-3">
					{isMn ? "Байршил: " : "Location: "}
					<span className="text-white">{event.location}</span>
				</p>
			)}
			<p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line mb-4 flex-1">
				{getLocalizedDescription(event.description, isMn) ||
					(isMn ? "Тайлбар байхгүй." : "No description yet.")}
			</p>

			<div className="flex items-center justify-between gap-4 pt-4 border-t border-neutral-700/50">
				{event.hasTicket && (
					<div>
						<span className="text-xs uppercase text-gray-500">
							{isMn ? "Үнэ" : "Price"}
						</span>
						<span className="block text-lg font-bold text-red-400">
							{`$${Number(event.price || 0).toFixed(2)}`}
						</span>
						{typeof event.ticketsRemaining === "number" && (
							<span className="block text-xs text-gray-300 mt-1">
								{isMn ? "Үлдэгдэл: " : "Left: "}
								<span className="font-semibold">{Math.max(0, event.ticketsRemaining)}</span>
							</span>
						)}
						{event.soldOut && (
							<span className="block text-xs font-semibold text-red-400 mt-1">
								{isMn ? "Тасалбар дууссан" : "Sold out"}
							</span>
						)}
					</div>
				)}
				<Button variation="primary">
					<Link href={`/events/${event.id}`}>
						{isMn ? "Дэлгэрэнгүй" : "View details"}
					</Link>
				</Button>
			</div>
		</motion.div>
	);
}

export default function EventsPage() {
	const locale = useLocale();
	const isMn = locale === "mn";
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedDate, setSelectedDate] = useState(null);
	const [currentMonth, setCurrentMonth] = useState(() => {
		const t = new Date();
		return new Date(t.getFullYear(), t.getMonth(), 1);
	});

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch("/api/events");
				if (!res.ok) {
					throw new Error("Failed to load events.");
				}
				const data = await res.json();
				if (!mounted) return;
				setEvents(data.events || []);
			} catch (err) {
				if (!mounted) return;
				setError(err.message || "Failed to load events.");
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	const today = useMemo(() => new Date(), []);

	const normalizedEvents = useMemo(
		() =>
			events.map((e) => {
				const d = new Date(e.date);
				const dayKey = new Date(d.getFullYear(), d.getMonth(), d.getDate())
					.toISOString()
					.slice(0, 10); // YYYY-MM-DD
				return { ...e, _dayKey: dayKey, _dateObj: d };
			}),
		[events],
	);

	const monthYear = useMemo(() => {
		if (!currentMonth) {
			return { year: today.getFullYear(), month: today.getMonth() };
		}
		return { year: currentMonth.getFullYear(), month: currentMonth.getMonth() };
	}, [currentMonth, today]);

	const calendarDays = useMemo(() => {
		const { year, month } = monthYear;
		const firstDay = new Date(year, month, 1);
		const startWeekday = firstDay.getDay(); // 0-6
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const cells = [];
		for (let i = 0; i < startWeekday; i += 1) {
			cells.push(null);
		}
		for (let day = 1; day <= daysInMonth; day += 1) {
			const key = new Date(year, month, day).toISOString().slice(0, 10);
			const dayEvents = normalizedEvents.filter((e) => e._dayKey === key);
			cells.push({
				day,
				key,
				hasEvents: dayEvents.length > 0,
				events: dayEvents,
				title: dayEvents.map((e) => e.title).join(", "),
			});
		}
		return cells;
	}, [monthYear, normalizedEvents]);

	const eventsForSelectedDate = useMemo(() => {
		if (!selectedDate) return normalizedEvents;
		return normalizedEvents.filter((e) => e._dayKey === selectedDate);
	}, [normalizedEvents, selectedDate]);

	const displayEvent = eventsForSelectedDate[0] || normalizedEvents[0];
	const selectedDateHasNoEvents =
		selectedDate && eventsForSelectedDate.length === 0;
	const dayNames = isMn
		? ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"]
		: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	return (
		<main className="min-h-screen w-screen bg-gradient-to-b from-black/85 via-neutral-950/90 to-black/85 text-white overflow-hidden">
			<div className="px-4 md:px-12 lg:px-20 pt-28 pb-16">
				<header className="mb-8">
					<h1 className="text-3xl md:text-4xl font-extrabold">
						{isMn ? "Event-үүд" : "Events"}
					</h1>
					<p className="text-gray-400 text-sm mt-2">
						{isMn
							? "Calendar-аас өдөр сонгоно уу."
							: "Select a day from the calendar."}
					</p>
				</header>

				{loading && (
					<p className="text-gray-400 text-sm">
						{isMn ? "Event-үүдийг ачаалж байна..." : "Loading events..."}
					</p>
				)}

				{!loading && error && (
					<p className="text-red-400 text-sm">
						{isMn ? "Event ачаалахад алдаа гарлаа." : error}
					</p>
				)}

				{!loading && !error && events.length === 0 && (
					<p className="text-gray-400 text-sm">
						{isMn
							? "Одоогоор идэвхтэй event алга."
							: "There are no active events right now."}
					</p>
				)}

				{!loading && !error && events.length > 0 && (
					<div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
						{/* Зүүн тал – бичлэг + дэлгэрэнгүй эсвэл event байхгүй */}
						<div className="lg:col-span-3 order-2 lg:order-1">
							{selectedDateHasNoEvents ? (
								<div className="rounded-xl border border-neutral-700/50 bg-neutral-900/60 p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
									<p className="text-lg font-medium text-gray-400 mb-2">
										{isMn
											? "Энэ өдөрт event байхгүй байна."
											: "No events on this day."}
									</p>
									<p className="text-sm text-gray-500">
										{isMn
											? "Өөр өдөр сонгоно уу эсвэл дээрх \"Бүгдийг харах\" товч дарна уу."
											: "Select another day or click \"Show all\" above."}
									</p>
									<button
										type="button"
										onClick={() => setSelectedDate(null)}
										className="mt-4 text-sm text-red-500 hover:text-red-400 transition-colors">
										{isMn ? "Бүх event харах" : "View all events"}
									</button>
								</div>
							) : displayEvent ? (
								<EventCard event={displayEvent} isMn={isMn} />
							) : null}
						</div>

						{/* Баруун тал – calendar */}
						<div className="lg:col-span-2 order-1 lg:order-2">
							<div className="rounded-xl border border-neutral-700/50 bg-neutral-900/60 p-6 overflow-visible">
								<h2 className="text-2xl md:text-3xl font-bold text-red-500 uppercase tracking-wider mb-6">
									{new Date(
										monthYear.year,
										monthYear.month,
										1,
									).toLocaleDateString(undefined, {
										month: "long",
										year: "numeric",
									})}
								</h2>
								<div className="flex items-center gap-2 mb-4">
									<button
										type="button"
										onClick={() =>
											setCurrentMonth(
												(prev) =>
													new Date(
														prev.getFullYear(),
														prev.getMonth() - 1,
														1,
													),
											)
										}
										className="text-xs px-2 py-1 rounded border border-neutral-600 text-gray-300 hover:bg-neutral-700">
										{isMn ? "Өмнөх" : "Prev"}
									</button>
									<button
										type="button"
										onClick={() =>
											setCurrentMonth(
												(prev) =>
													new Date(
														prev.getFullYear(),
														prev.getMonth() + 1,
														1,
													),
											)
										}
										className="text-xs px-2 py-1 rounded border border-neutral-600 text-gray-300 hover:bg-neutral-700">
										{isMn ? "Дараагийн" : "Next"}
									</button>
									{selectedDate && (
										<button
											type="button"
											onClick={() => setSelectedDate(null)}
											className="text-xs text-red-500 ml-auto">
											{isMn ? "Бүгдийг харах" : "Show all"}
										</button>
									)}
								</div>
								<div className="grid grid-cols-7 gap-2 text-center overflow-visible">
									{dayNames.map((d) => (
										<span
											key={d}
											className="text-[10px] font-semibold text-gray-400 uppercase">
											{d}
										</span>
									))}
									{calendarDays.map((cell, idx) =>
										cell ? (
											<button
												type="button"
												key={cell.key}
												onClick={() => setSelectedDate(cell.key)}
												title={cell.hasEvents ? cell.title : undefined}
												className={`relative aspect-square rounded-lg flex flex-col items-center justify-center border text-[10px] font-bold transition-colors cursor-pointer ${
													cell.key === selectedDate
														? "border-red-600 bg-red-600/20 text-red-400"
														: cell.hasEvents
														? "border-red-700/50 bg-neutral-800/60 text-gray-200 hover:border-red-600/50"
														: "border-neutral-700/50 bg-neutral-800/50 text-gray-500 hover:border-neutral-600"
												}`}>
												<span className="text-red-500/90">{cell.day}</span>
												{cell.hasEvents && (
													<span className="relative block w-full mt-0.5 group/title">
														<span className="block text-[8px] font-semibold text-white w-full px-0.5 leading-tight truncate cursor-pointer hover:text-red-400 transition-colors">
															{cell.events[0]?.title || (isMn ? "Event" : "Event")}
														</span>
														<span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1.5 rounded bg-neutral-800 text-[10px] text-white max-w-[220px] opacity-0 invisible group-hover/title:opacity-100 group-hover/title:visible z-50 transition-all pointer-events-none shadow-lg border border-neutral-600 text-left break-words">
															{cell.title}
														</span>
													</span>
												)}
											</button>
										) : (
											<div key={`empty-${idx}`} className="aspect-square" />
										),
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}

