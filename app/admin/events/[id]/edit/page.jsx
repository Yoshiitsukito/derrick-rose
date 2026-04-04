"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";
import Hr from "@/components/Hr";
import { useLocale } from "@/lib/useLocale";

function toDatetimeLocal(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	// datetime-local expects: YYYY-MM-DDTHH:mm
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminEventEditPage() {
	const params = useParams();
	const router = useRouter();
	const id = params?.id;
	const locale = useLocale();
	const isMn = locale === "mn";

	const [event, setEvent] = useState(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const [form, setForm] = useState({
		title: "",
		description: "",
		date: "",
		price: "",
		ticketLimit: "",
		videoUrl: "",
		location: "",
		hasTicket: true,
		isActive: true,
		imageFile: null,
		qrFile: null,
	});

	const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
	const [qrPreviewUrl, setQrPreviewUrl] = useState(null);

	useEffect(() => {
		if (!id) return;
		let mounted = true;

		(async () => {
			setError("");
			setEvent(null);
			try {
				const res = await fetch(`/api/events/${id}`);
				if (!res.ok) {
					throw new Error(isMn ? "Event олдсонгүй." : "Event not found.");
				}
				const data = await res.json();
				if (!mounted) return;
				const ev = data?.event;
				setEvent(ev);

				setForm({
					title: ev?.title || "",
					description: ev?.description || "",
					date: toDatetimeLocal(ev?.date),
					price: ev?.price ?? 0,
					ticketLimit:
						typeof ev?.ticketLimit === "number" ? String(ev.ticketLimit) : "",
					videoUrl: ev?.videoUrl || "",
					location: ev?.location || "",
					hasTicket: !!ev?.hasTicket,
					isActive: ev?.isActive !== false,
					imageFile: null,
					qrFile: null,
				});
			} catch (e) {
				if (!mounted) return;
				setError(e?.message || (isMn ? "Алдаа гарлаа." : "Failed."));
			}
		})();

		return () => {
			mounted = false;
		};
	}, [id, isMn]);

	useEffect(() => {
		return () => {
			if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
		};
	}, [imagePreviewUrl]);

	useEffect(() => {
		return () => {
			if (qrPreviewUrl) URL.revokeObjectURL(qrPreviewUrl);
		};
	}, [qrPreviewUrl]);

	const handleImageFileChange = (e) => {
		const file = e.target.files?.[0] ?? null;
		if (imagePreviewUrl) {
			try {
				URL.revokeObjectURL(imagePreviewUrl);
			} catch {
				// ignore
			}
		}

		setForm((prev) => ({ ...prev, imageFile: file }));
		if (file) setImagePreviewUrl(URL.createObjectURL(file));
		else setImagePreviewUrl(null);
	};

	const handleQrFileChange = (e) => {
		const file = e.target.files?.[0] ?? null;
		if (qrPreviewUrl) {
			try {
				URL.revokeObjectURL(qrPreviewUrl);
			} catch {
				// ignore
			}
		}

		setForm((prev) => ({ ...prev, qrFile: file }));
		if (file) setQrPreviewUrl(URL.createObjectURL(file));
		else setQrPreviewUrl(null);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setError("");
		try {
			const formData = new FormData();
			formData.append("title", form.title);
			formData.append("description", form.description);
			formData.append("date", form.date);
			formData.append(
				"price",
				form.price !== "" && form.price !== null ? String(Number(form.price)) : "0",
			);
			formData.append(
				"ticketLimit",
				form.ticketLimit !== "" && form.ticketLimit !== null
					? String(Number(form.ticketLimit))
					: "",
			);
			formData.append("videoUrl", form.videoUrl);
			formData.append("location", form.location);
			formData.append("hasTicket", String(!!form.hasTicket));
			formData.append("isActive", String(!!form.isActive));
			if (form.imageFile) formData.append("image", form.imageFile);
			if (form.qrFile) formData.append("qr", form.qrFile);

			const res = await fetch(`/api/admin/events/${id}`, {
				method: "PUT",
				body: formData,
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || "Failed to update event.");
			}

			router.push(`/admin/events`);
		} catch (err) {
			setError(err?.message || (isMn ? "Шинэчлэхэд алдаа гарлаа." : "Failed."));
		} finally {
			setSaving(false);
		}
	};

	if (!event && !error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-white/50 animate-pulse">
					{isMn ? "Event ачаалж байна..." : "Loading event..."}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<p className="text-white/50 text-sm">
				{isMn ? "Үйл ажиллагаа" : "Events"} / {isMn ? "Засах" : "Edit"}{" "}
				/ {event?.title || ""}
			</p>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<section className="md:col-span-1 rounded-xl border border-white/10 bg-black/60 p-5 space-y-4">
					<h2 className="text-xl font-semibold">{isMn ? "Event засах" : "Edit event"}</h2>

					{error && <p className="text-red-400 text-sm">{error}</p>}
					{event?.imageUrl && (
						<div className="rounded-lg border border-white/10 overflow-hidden">
							<img
								src={event.imageUrl}
								alt={event.title}
								className="w-full h-40 object-cover bg-black"
							/>
						</div>
					)}

					<div className="space-y-2 text-xs text-white/40">
						<p>{isMn ? "Зураг:" : "Image:"}</p>
						<p>{isMn ? "Хоосон байвал одоогийн зураг үлдэнэ." : "Leave empty to keep current image."}</p>
					</div>

					<Link
						href={`/admin/events/${id}`}
						className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm"
					>
						{isMn ? "Буцах (Sales)" : "Back (Sales)"}
					</Link>
				</section>

				<section className="md:col-span-2 rounded-xl border border-white/10 bg-black/60 p-5 space-y-3">
					<Hr />
					<form onSubmit={handleSubmit} className="space-y-3">
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
								{isMn ? "Огноо (local)" : "Date (local)"}
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
								rows={4}
								value={form.description}
								onChange={handleChange}
								className="w-full rounded-md border border-white/10 bg-black/80 px-3 py-2 text-sm text-white placeholder-white/40 resize-none"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
									placeholder={isMn ? "Хоосон бол лимитгүй" : "Leave empty for no limit"}
									className="w-full rounded-md border border-white/10 bg-black/80 px-3 py-2 text-sm text-white placeholder-white/40"
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs text-gray-400 mb-1">
								{isMn ? "Зураг (file)" : "Image (file)"}
							</label>
							<input
								type="file"
								name="image"
								accept="image/*"
								onChange={handleImageFileChange}
								className="w-full text-sm text-white placeholder-white/40"
							/>
							{imagePreviewUrl && (
								<div className="mt-3">
									<img
										src={imagePreviewUrl}
										alt="Preview"
										className="w-full max-h-48 object-cover rounded-md border border-white/10"
									/>
								</div>
							)}
						</div>

						<div>
							<label className="block text-xs text-gray-400 mb-1">
								{isMn ? "QR зураг (file)" : "QR image (file)"}
							</label>
							<input
								type="file"
								name="qr"
								accept="image/*"
								onChange={handleQrFileChange}
								className="w-full text-sm text-white placeholder-white/40"
							/>
							<div className="mt-3 space-y-2">
								{qrPreviewUrl ? (
									<img
										src={qrPreviewUrl}
										alt="QR Preview"
										className="w-full max-h-48 object-contain rounded-md border border-white/10"
									/>
								) : event?.qrImageUrl ? (
									<img
										src={event.qrImageUrl}
										alt="Current QR"
										className="w-full max-h-48 object-contain rounded-md border border-white/10"
									/>
								) : null}
								<p className="text-xs text-white/40">
									{isMn
										? "Энэ QR нь хэрэглэгчид харагдахгүй, зөвхөн худалдаж авсан үед имэйлээр явна."
										: "This QR is not shown to users; it is only emailed after purchase."}
								</p>
							</div>
						</div>

						<div>
							<label className="block text-xs text-gray-400 mb-1">
								{isMn ? "Видео (URL)" : "Video URL"}
							</label>
							<input
								name="videoUrl"
								value={form.videoUrl}
								onChange={handleChange}
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
								className="w-full rounded-md border border-white/10 bg-black/80 px-3 py-2 text-sm text-white placeholder-white/40"
							/>
						</div>

						<div className="flex items-center gap-3 text-sm">
							<label className="flex items-center gap-2">
								<input type="checkbox" name="hasTicket" checked={form.hasTicket} onChange={handleChange} />
								<span>{isMn ? "Тасалбар борлуулна" : "Has ticket sales"}</span>
							</label>
							<label className="flex items-center gap-2">
								<input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
								<span>{isMn ? "Идэвхтэй" : "Active"}</span>
							</label>
						</div>

						<Button variation="primary" type="submit" disabled={saving} className="w-full">
							{saving ? (isMn ? "Хадгалж байна..." : "Saving...") : isMn ? "Өөрчлөх" : "Save changes"}
						</Button>
					</form>
				</section>
			</div>
		</div>
	);
}

