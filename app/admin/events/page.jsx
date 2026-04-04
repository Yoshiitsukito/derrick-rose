"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Hr from "@/components/Hr";
import Button from "@/components/Button";
import { useLocale } from "@/lib/useLocale";

export default function AdminEventsPage() {
	const locale = useLocale();
	const isMn = locale === "mn";
	const router = useRouter();

	const [user, setUser] = useState(null);
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [form, setForm] = useState({
		title: "",
		description: "",
		date: "",
		price: "",
		ticketLimit: "",
		imageFile: null,
		qrFile: null,
		videoUrl: "",
		location: "",
		hasTicket: true,
		isActive: true,
	});
	const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
	const [qrPreviewUrl, setQrPreviewUrl] = useState(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const meRes = await fetch("/api/auth/me");
				if (!meRes.ok) {
					if (!mounted) return;
					setError(
						isMn
							? "Admin хэсэгт хандахын тулд нэвтэрч, admin эрхтэй байх шаардлагатай."
							: "You must be logged in as an admin to access this page.",
					);
					return;
				}
				const me = await meRes.json();
				if (!mounted) return;
				setUser(me.user);
				if (me.user?.role !== "admin") {
					setError(
						isMn
							? "Энэ хэсэг зөвхөн admin хэрэглэгчдэд зориулагдсан."
							: "This area is restricted to admin users.",
					);
					return;
				}

				const res = await fetch("/api/admin/events");
				if (!res.ok) {
					const body = await res.json().catch(() => ({}));
					throw new Error(body.error || "Failed to load events.");
				}
				const data = await res.json();
				if (!mounted) return;
				setEvents(data.events || []);
			} catch (err) {
				if (!mounted) return;
				setError(
					err.message ||
						(isMn ? "Admin event-үүдийг ачаалахад алдаа гарлаа." : "Failed to load admin events."),
				);
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [isMn]);

	const refreshEvents = async () => {
		try {
			const res = await fetch("/api/admin/events");
			if (!res.ok) return;
			const data = await res.json();
			setEvents(data.events || []);
		} catch {
			// ignore
		}
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleImageFileChange = (e) => {
		const file = e.target.files?.[0] ?? null;
		setForm((prev) => ({ ...prev, imageFile: file }));

		if (imagePreviewUrl) {
			try {
				URL.revokeObjectURL(imagePreviewUrl);
			} catch {
				// ignore
			}
		}

		if (file) {
			const objectUrl = URL.createObjectURL(file);
			setImagePreviewUrl(objectUrl);
		} else {
			setImagePreviewUrl(null);
		}
	};

	const handleQrFileChange = (e) => {
		const file = e.target.files?.[0] ?? null;
		setForm((prev) => ({ ...prev, qrFile: file }));

		if (qrPreviewUrl) {
			try {
				URL.revokeObjectURL(qrPreviewUrl);
			} catch {
				// ignore
			}
		}

		if (file) {
			const objectUrl = URL.createObjectURL(file);
			setQrPreviewUrl(objectUrl);
		} else {
			setQrPreviewUrl(null);
		}
	};

	const handleCreate = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			const formData = new FormData();
			formData.append("title", form.title);
			formData.append("description", form.description);
			formData.append("date", form.date);
			formData.append("price", form.price ? String(Number(form.price)) : "0");
			formData.append(
				"ticketLimit",
				form.ticketLimit ? String(Number(form.ticketLimit)) : "",
			);
			formData.append("videoUrl", form.videoUrl);
			formData.append("location", form.location);
			formData.append("hasTicket", String(!!form.hasTicket));
			formData.append("isActive", String(!!form.isActive));

			if (form.imageFile) {
				formData.append("image", form.imageFile);
			}
			if (form.qrFile) {
				formData.append("qr", form.qrFile);
			}

			const res = await fetch("/api/admin/events", {
				method: "POST",
				body: formData,
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || "Failed to create event.");
			}
			setForm({
				title: "",
				description: "",
				date: "",
				price: "",
				ticketLimit: "",
				imageFile: null,
				qrFile: null,
				videoUrl: "",
				location: "",
				hasTicket: true,
				isActive: true,
			});
			if (imagePreviewUrl) {
				try {
					URL.revokeObjectURL(imagePreviewUrl);
				} catch {
					// ignore
				}
			}
			setImagePreviewUrl(null);
			if (qrPreviewUrl) {
				try {
					URL.revokeObjectURL(qrPreviewUrl);
				} catch {
					// ignore
				}
			}
			setQrPreviewUrl(null);
			await refreshEvents();
		} catch (err) {
			setError(
				err.message ||
					(isMn ? "Event үүсгэхэд алдаа гарлаа." : "Failed to create event."),
			);
		} finally {
			setSaving(false);
		}
	};

	const handleToggleActive = async (eventId, current) => {
		try {
			await fetch(`/api/admin/events/${eventId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isActive: !current }),
			});
			await refreshEvents();
		} catch {
			// ignore
		}
	};

	const handleToggleHasTicket = async (eventId, current) => {
		try {
			await fetch(`/api/admin/events/${eventId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ hasTicket: !current }),
			});
			await refreshEvents();
		} catch {
			// ignore
		}
	};

	const handleDelete = async (eventId) => {
		if (!window.confirm(isMn ? "Энэ event-ийг устгах уу?" : "Delete this event?")) {
			return;
		}
		try {
			await fetch(`/api/admin/events/${eventId}`, {
				method: "DELETE",
			});
			await refreshEvents();
		} catch {
			// ignore
		}
	};

	return (
		<div className="space-y-6">
			<p className="text-white/50 text-sm">
				{isMn ? "Үйл ажиллагаа" : "Events"} / {isMn ? "Үйл ажиллагаа удирдах" : "Manage Events"}
			</p>
			<div className="space-y-6">
				<header className="space-y-3">
					<h1 className="text-2xl font-bold text-white">
						{isMn ? "Derrick Rose Events" : "Derrick Rose Events"}
					</h1>
					<Hr />
					<p className="text-white/60 text-sm">
						{isMn
							? "Эндээс Derrick Rose Event-үүдийг өдөр, тайлбар, үнэ, тасалбартай эсэх, идэвхтэй эсэхээр нь удирдана."
							: "Create and manage Derrick Rose events with date, description, pricing and ticket availability."}
					</p>
				</header>

				{loading && (
					<p className="text-gray-400 text-sm">
						{isMn ? "Admin event-үүдийг ачаалж байна..." : "Loading admin events..."}
					</p>
				)}

				{!loading && error && (
					<p className="text-red-400 text-sm">
						{error}
					</p>
				)}

				{!loading && !error && user?.role === "admin" && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<section className="md:col-span-1 rounded-xl border border-white/10 bg-black/60 p-5 space-y-4">
							<h2 className="text-xl font-semibold">
								{isMn ? "Шинэ event үүсгэх" : "Create new event"}
							</h2>
							<form onSubmit={handleCreate} className="space-y-3">
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										{isMn ? "Гарчиг" : "Title"}
									</label>
									<input
										name="title"
										value={form.title}
										onChange={handleChange}
										required
										className="w-full rounded-md border border-white/10 bg-black/80 px-3 py-2 text-sm text-white placeholder-white/40"
									/>
								</div>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										{isMn ? "Огноо (ISO эсвэл local)" : "Date/time (ISO or local)"}
									</label>
									<input
										name="date"
										type="datetime-local"
										value={form.date}
										onChange={handleChange}
										required
										className="w-full rounded-md border border-white/10 bg-black/80 px-3 py-2 text-sm text-white placeholder-white/40"
									/>
								</div>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										{isMn ? "Тайлбар" : "Description"}
									</label>
									<textarea
										name="description"
										rows={3}
										value={form.description}
										onChange={handleChange}
										className="w-full rounded-md border border-white/10 bg-black/80 px-3 py-2 text-sm text-white placeholder-white/40 resize-none"
									/>
								</div>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										{isMn ? "Үнэ (USD)" : "Price (USD)"}
									</label>
									<input
										name="price"
										type="number"
										min="0"
										step="0.01"
										value={form.price}
										onChange={handleChange}
										className="w-full rounded-md border border-white/10 bg-black/80 px-3 py-2 text-sm text-white placeholder-white/40"
									/>
								</div>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										{isMn ? "Тасалбарын лимит" : "Ticket limit"}
									</label>
									<input
										name="ticketLimit"
										type="number"
										min="1"
										step="1"
										value={form.ticketLimit}
										onChange={handleChange}
										placeholder={
											isMn
												? "Хоосон бол лимитгүй"
												: "Leave empty for no limit"
										}
										className="w-full rounded-md border border-white/10 bg-black/80 px-3 py-2 text-sm text-white placeholder-white/40"
									/>
								</div>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										{isMn ? "Зураг (файл)" : "Image (file)"}
									</label>
									<input
										type="file"
										name="image"
										accept="image/*"
										onChange={handleImageFileChange}
										className="w-full text-sm text-white placeholder-white/40"
									/>

									{imagePreviewUrl && (
										<div className="relative mt-3 w-full h-48">
											<Image
												src={imagePreviewUrl}
												alt="Selected preview"
												fill
												unoptimized
												className="object-cover rounded-md border border-white/10"
												sizes="100vw"
											/>
										</div>
									)}
								</div>

								<div>
									<label className="block text-xs text-gray-400 mb-1">
										{isMn ? "QR зураг (файл)" : "QR image (file)"}
									</label>
									<input
										type="file"
										name="qr"
										accept="image/*"
										onChange={handleQrFileChange}
										className="w-full text-sm text-white placeholder-white/40"
									/>
									{qrPreviewUrl && (
										<div className="relative mt-3 w-full h-48">
											<Image
												src={qrPreviewUrl}
												alt="QR Preview"
												fill
												unoptimized
												className="object-contain rounded-md border border-white/10"
												sizes="100vw"
											/>
										</div>
									)}
								</div>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										{isMn ? "Видео (URL)" : "Video URL"}
									</label>
									<input
										name="videoUrl"
										value={form.videoUrl}
										onChange={handleChange}
										placeholder={
											isMn ? "YouTube link эсвэл бусад видео URL" : "YouTube link or other video URL"
										}
										className="w-full rounded-md border border-white/10 bg-black/80 px-3 py-2 text-sm text-white placeholder-white/40"
									/>
								</div>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										{isMn ? "Байршил" : "Location"}
									</label>
									<input
										name="location"
										value={form.location}
										onChange={handleChange}
										placeholder={
											isMn ? "Жишээ: United Center, Chicago" : "e.g. United Center, Chicago"
										}
										className="w-full rounded-md border border-white/10 bg-black/80 px-3 py-2 text-sm text-white placeholder-white/40"
									/>
								</div>
								<div className="flex items-center gap-3 text-sm">
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											name="hasTicket"
											checked={form.hasTicket}
											onChange={handleChange}
										/>
										<span>{isMn ? "Тасалбар борлуулна" : "Has ticket sales"}</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											name="isActive"
											checked={form.isActive}
											onChange={handleChange}
										/>
										<span>{isMn ? "Идэвхтэй" : "Active"}</span>
									</label>
								</div>
								<Button
									variation="primary"
									type="submit"
									disabled={saving}
									className="w-full">
									{saving
										? isMn
											? "Хадгалж байна..."
											: "Saving..."
										: isMn
										? "Event үүсгэх"
										: "Create event"}
								</Button>
							</form>
						</section>

						<section className="md:col-span-2 space-y-3">
							<h2 className="text-xl font-semibold">
								{isMn ? "Event жагсаалт" : "Events list"}
							</h2>
							<div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
								{events.length === 0 && (
									<p className="text-sm text-gray-400">
										{isMn
											? "Одоогоор event бүртгэгдээгүй байна."
											: "No events have been created yet."}
									</p>
								)}
								{events.map((ev) => (
									<motion.div
										key={ev.id}
										role="button"
										tabIndex={0}
										aria-label={`Edit event: ${ev.title}`}
										onClick={() => router.push(`/admin/events/${ev.id}/edit`)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												router.push(`/admin/events/${ev.id}/edit`);
											}
										}}
										className="rounded-xl border border-white/10 bg-black/60 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 cursor-pointer hover:border-red-600/40"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}>
										<div>
											<p className="text-sm font-semibold text-white hover:text-red-400 transition-colors">
												{ev.title}
											</p>
											<p className="text-xs text-gray-400">
												{new Date(ev.date).toLocaleString()}
											</p>
											<p className="text-xs text-gray-500 mt-1">
												{isMn ? "Үнэ:" : "Price:"} $
												{Number(ev.price || 0).toFixed(2)}
											</p>
											{typeof ev.ticketLimit === "number" && (
												<p className="text-xs text-gray-500">
													{isMn ? "Тасалбарын лимит:" : "Ticket limit:"}{" "}
													{ev.ticketLimit}
												</p>
											)}
											<p className="text-xs text-gray-500">
												ID: {ev.id}
											</p>
										</div>
										<div className="flex flex-col items-end gap-2 text-xs">
											<div className="flex gap-2">
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														handleToggleActive(ev.id, ev.isActive !== false);
													}}
													className={`px-2 py-1 rounded-md border ${
														ev.isActive !== false
															? "border-green-500 text-red-400"
															: "border-white/20 text-white/60"
													}`}>
													{ev.isActive !== false
														? isMn
															? "Идэвхтэй"
															: "Active"
														: isMn
														? "Идэвхгүй"
														: "Inactive"}
												</button>
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														handleToggleHasTicket(ev.id, !!ev.hasTicket);
													}}
													className={`px-2 py-1 rounded-md border ${
														ev.hasTicket
															? "border-red-500 text-red-400"
															: "border-white/20 text-white/60"
													}`}>
													{ev.hasTicket
														? isMn
															? "Тасалбартай"
															: "Ticketed"
														: isMn
														? "Тасалбаргүй"
														: "Non-ticketed"}
												</button>
											</div>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													handleDelete(ev.id);
												}}
												className="px-2 py-1 rounded-md border border-red-500/50 text-red-400">
												{isMn ? "Устгах" : "Delete"}
											</button>
										</div>
									</motion.div>
								))}
							</div>
						</section>
					</div>
				)}
			</div>
		</div>
	);
}

