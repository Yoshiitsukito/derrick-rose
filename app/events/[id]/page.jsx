"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import { useLocale } from "@/lib/useLocale";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { getLocalizedDescription } from "@/lib/localizeDescription";

export default function EventDetailPage() {
	const { id } = useParams();
	const router = useRouter();
	const locale = useLocale();
	const isMn = locale === "mn";

	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [user, setUser] = useState(null);
	const [quantityInput, setQuantityInput] = useState("1");
	const [ticketStatus, setTicketStatus] = useState("idle"); // idle | loading | success | error
	const [ticketError, setTicketError] = useState("");
	const [emailSent, setEmailSent] = useState(null); // null | boolean

	useEffect(() => {
		if (!id) return;
		let mounted = true;
		(async () => {
			try {
				const res = await fetch(`/api/events/${id}`);
				if (!res.ok) {
					throw new Error("Failed to load event.");
				}
				const data = await res.json();
				if (!mounted) return;
				setEvent(data.event || null);
			} catch (err) {
				if (!mounted) return;
				setError(err.message || "Failed to load event.");
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [id]);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch("/api/auth/me");
				if (!res.ok) return;
				const data = await res.json();
				if (!mounted) return;
				setUser(data.user);
			} catch {
				// ignore
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	const handleBuyTicket = async () => {
		if (!event?.id) return;
		const parsedQty = Number.parseInt(quantityInput, 10);
		const quantity = Number.isFinite(parsedQty)
			? Math.min(10, Math.max(1, parsedQty))
			: 1;
		setTicketStatus("loading");
		setTicketError("");
		setEmailSent(null);
		try {
			const res = await fetch("/api/tickets", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					eventId: event.id,
					quantity,
					locale: isMn ? "mn" : "en",
				}),
			});
			if (!res.ok) {
				if (res.status === 401) {
					setTicketStatus("error");
					setTicketError(
						isMn
							? "Тасалбар авахын тулд нэвтэрнэ үү."
							: "Please login to purchase a ticket.",
					);
					return;
				}
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || "Failed to create ticket.");
			}
			const data = await res.json().catch(() => ({}));
			const sent = data?.emailSent === true;
			setEmailSent(sent);
			setTicketStatus("success");
		} catch (err) {
			setTicketStatus("error");
			setTicketError(
				err.message ||
					(isMn
						? "Тасалбар авах явцад алдаа гарлаа."
						: "Ticket purchase failed."),
			);
		}
	};

	const embedVideoUrl = useMemo(
		() => (event?.videoUrl ? getYoutubeEmbedUrl(event.videoUrl) : null),
		[event?.videoUrl],
	);
	const remainingTickets =
		typeof event?.ticketsRemaining === "number" &&
		Number.isFinite(event.ticketsRemaining)
			? Math.max(0, event.ticketsRemaining)
			: null;

	const dateLabel =
		event &&
		new Date(event.date).toLocaleString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	return (
		<main className="min-h-screen w-screen bg-gradient-to-b from-black/85 via-neutral-950/90 to-black/85 text-white overflow-hidden">
			<div className="relative px-4 md:px-12 lg:px-20 pt-28 pb-16">
				<button
					type="button"
					onClick={() => router.back()}
					className="absolute top-6 left-4 md:left-12 z-20 text-sm text-white/90 hover:text-white transition-colors backdrop-blur-sm">
					{isMn ? "← Буцах" : "← Back"}
				</button>

				{loading && (
					<p className="text-gray-400 text-sm">
						{isMn ? "Event-ийг ачаалж байна..." : "Loading event..."}
					</p>
				)}

				{!loading && error && (
					<p className="text-red-400 text-sm">
						{isMn ? "Event ачаалахад алдаа гарлаа." : error}
					</p>
				)}

				{!loading && !error && !event && (
					<p className="text-gray-400 text-sm">
						{isMn ? "Ийм ID-тай event олдсонгүй." : "Event not found."}
					</p>
				)}

				{!loading && !error && event && (
					<motion.div
						className="relative min-h-[85vh] rounded-2xl overflow-hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.4 }}>
						{/* Арын зураг / бичлэг – тухайн event-ийн media */}
						<div className="absolute inset-0">
							{embedVideoUrl ? (
								<div className="absolute inset-0">
									<iframe
										src={embedVideoUrl}
										title={event.title}
										className="absolute inset-0 w-full h-full"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								</div>
							) : event.imageUrl ? (
								<Image
									src={event.imageUrl}
									alt={event.title}
									fill
									className="object-cover"
									sizes="100vw"
									priority
								/>
							) : (
								<div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-red-950/30 to-neutral-950" />
							)}
							{/* Зүүн талд уншигдах overlay – pointer-events-none тул бичлэг дээр дарж үзэж болно */}
							<div
								className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none"
								aria-hidden
							/>
						</div>

						{/* Зүүн тал – цагаан карт, дэлгэрэнгүй */}
						<div className="relative z-10 flex flex-col justify-center min-h-[85vh] py-20 px-6 md:px-12 lg:px-20">
							<div className="max-w-xl">
								<div className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 md:p-8 shadow-2xl text-black">
									<h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
										{event.title}
									</h1>
									<p className="text-sm text-gray-600 mb-2">{dateLabel}</p>
									{event.location && (
										<p className="text-sm text-gray-600 mb-4">
											{isMn ? "Байршил: " : "Location: "}
											<span className="font-medium text-gray-800">
												{event.location}
											</span>
										</p>
									)}
									<p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
										{getLocalizedDescription(event.description, isMn) ||
											(isMn
												? "Дэлгэрэнгүй тайлбар нэмэгдээгүй байна."
												: "No description added yet.")}
									</p>

									{event.hasTicket ? (
										<div className="space-y-3">
											{event.soldOut ? (
												<p className="text-sm font-semibold text-red-600">
													{isMn ? "Тасалбар дууссан" : "Sold out"}
												</p>
											) : (
												<>
													<div className="flex flex-wrap items-center gap-4">
														<div>
															<p className="text-xs uppercase text-gray-500">
																{isMn ? "Үнэ" : "Price"}
															</p>
															<p className="text-xl font-bold text-red-600">
																{`$${Number(event.price || 0).toFixed(2)}`}
															</p>
														</div>
														<label className="flex items-center gap-2 text-sm">
															<span className="text-gray-600">
																{isMn ? "Тоо:" : "Qty:"}
															</span>
															<input
																type="number"
																min={1}
																max={10}
											value={quantityInput}
											onChange={(e) => {
												const nextValue = e.target.value;
												if (nextValue === "") {
													setQuantityInput("");
													return;
												}
												const parsed = Number.parseInt(nextValue, 10);
												if (!Number.isFinite(parsed)) return;
												setQuantityInput(String(Math.min(10, Math.max(1, parsed))));
											}}
											onBlur={() => {
												const parsed = Number.parseInt(quantityInput, 10);
												setQuantityInput(
													String(
														Number.isFinite(parsed)
															? Math.min(10, Math.max(1, parsed))
															: 1,
													),
												);
											}}
																className="w-14 rounded border border-gray-300 px-2 py-1 text-sm"
															/>
														</label>
														<Button
															variation="primary"
															onClick={() => {
																if (!user) {
																	setTicketStatus("error");
																	setTicketError(
																		isMn
																			? "Эхлээд нэвтэрнэ үү."
																			: "Please login first.",
																	);
																	return;
																}
																handleBuyTicket();
															}}>
															<span className="block px-5 py-2">
																{ticketStatus === "loading"
																	? isMn
																		? "Шалгаж байна..."
																		: "Processing..."
																	: isMn
																	? "Тасалбар авах"
																	: "Buy Ticket"}
															</span>
														</Button>
													</div>
													{remainingTickets !== null && (
														<p className="text-xs text-gray-600">
															{isMn ? "Үлдсэн тасалбар: " : "Tickets left: "}
															<span className="font-semibold text-gray-800">
																{remainingTickets}
															</span>
														</p>
													)}
												</>
											)}
											{ticketStatus === "success" && (
												<p className="text-sm text-green-600">
													{isMn ? (
														emailSent ? (
															"Амжилттай. Тасалбарын QR код таны имэйл рүү илгээгдсэн."
														) : (
															<>
																Амжилттай. Харин QR код илгээхэд алдаа гарсан байж магадгүй.
																{" "}
																My tickets хуудсаас хараарай.
															</>
														)
													) : emailSent ? (
														"Success. Your ticket QR was emailed to you."
													) : (
														"Success, but email QR sending may have failed. Check My tickets."
													)}
												</p>
											)}
											{ticketStatus === "error" && ticketError && (
												<p className="text-sm text-red-600">{ticketError}</p>
											)}
										</div>
									) : null}

									{event.videoUrl && !embedVideoUrl && (
										<a
											href={event.videoUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-block mt-4 text-sm text-red-600 hover:text-red-500 font-medium">
											{isMn ? "Видео үзэх" : "Watch video"}
										</a>
									)}
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</main>
	);
}

