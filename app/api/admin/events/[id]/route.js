import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { updateEvent, deleteEvent, getEventById } from "@/lib/events";

import fs from "fs/promises";
import path from "path";

async function storeUploadedImage(file) {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const originalName = file?.name || "upload";
	const extFromName = path.extname(originalName).toLowerCase();
	const ext = extFromName || ".png";

	const allowed = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg"]);
	const safeExt = allowed.has(ext) ? ext : ".png";

	const filename = `event_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${safeExt}`;
	const dir = path.join(process.cwd(), "public", "image", "events");
	await fs.mkdir(dir, { recursive: true });

	const dest = path.join(dir, filename);
	await fs.writeFile(dest, buffer);

	return `/image/events/${filename}`;
}

async function storeUploadedQr(file) {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const originalName = file?.name || "qr";
	const extFromName = path.extname(originalName).toLowerCase();
	const ext = extFromName || ".png";

	const allowed = new Set([".png", ".jpg", ".jpeg", ".webp"]);
	const safeExt = allowed.has(ext) ? ext : ".png";

	const filename = `qr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${safeExt}`;
	const dir = path.join(process.cwd(), "public", "image", "events", "qrs");
	await fs.mkdir(dir, { recursive: true });

	const dest = path.join(dir, filename);
	await fs.writeFile(dest, buffer);

	return `/image/events/qrs/${filename}`;
}

export async function PUT(req, { params }) {
	try {
		await requireAdmin();
		const { id } = params;
		const contentType = req.headers.get("content-type") || "";
		const isMultipart = contentType.includes("multipart/form-data");

		let body = null;
		let uploadedImageUrl = "";
		let uploadedQrImageUrl = "";
		if (isMultipart) {
			const formData = await req.formData();
			const file = formData.get("image");
			if (file && typeof file !== "string" && file.size > 0) {
				uploadedImageUrl = await storeUploadedImage(file);
			}

			const qrFile = formData.get("qr");
			if (qrFile && typeof qrFile !== "string" && qrFile.size > 0) {
				uploadedQrImageUrl = await storeUploadedQr(qrFile);
			}

			const priceRaw = formData.get("price");
			const price =
				priceRaw !== null && priceRaw !== ""
					? Number(priceRaw)
					: 0;

			const ticketLimitRaw = formData.get("ticketLimit");
			const ticketLimit =
				ticketLimitRaw !== null && ticketLimitRaw !== "" && ticketLimitRaw !== undefined
					? Number(ticketLimitRaw)
					: null;

			body = {
				title: formData.get("title"),
				description: formData.get("description"),
				date: formData.get("date"),
				price,
				ticketLimit,
				videoUrl: formData.get("videoUrl"),
				location: formData.get("location"),
				hasTicket: formData.get("hasTicket"),
				isActive: formData.get("isActive"),
				// imageUrl is handled separately (uploadedImageUrl)
			};
		} else {
			body = await req.json();
		}

		const existing = await getEventById(id);
		if (!existing) {
			return NextResponse.json({ error: "Event not found." }, { status: 404 });
		}

		const price =
			body.price !== undefined && body.price !== null
				? Number(body.price)
				: existing.price;

		const patch = {
			title: body.title ?? undefined,
			description: body.description ?? undefined,
			date: body.date ?? undefined,
			price: Number.isFinite(price) ? price : existing.price,
			ticketLimit:
				typeof body.ticketLimit === "number"
					? body.ticketLimit
					: body.ticketLimit === null
						? null
						: undefined,
			videoUrl: body.videoUrl ?? undefined,
			location: body.location ?? undefined,
			hasTicket:
				typeof body.hasTicket === "string"
					? body.hasTicket === "true"
					: body.hasTicket !== undefined
						? Boolean(body.hasTicket)
						: undefined,
			isActive:
				typeof body.isActive === "string"
					? body.isActive !== "false"
					: body.isActive !== undefined
						? Boolean(body.isActive)
						: undefined,
		};

		if (uploadedImageUrl) {
			patch.imageUrl = uploadedImageUrl;
		}

		if (uploadedQrImageUrl) {
			patch.qrImageUrl = uploadedQrImageUrl;
		}

		const updated = await updateEvent(id, {
			...patch,
		});

		return NextResponse.json({ event: updated }, { status: 200 });
	} catch (err) {
		if (err?.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (err?.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		console.error("Admin update event error", err);
		return NextResponse.json(
			{ error: "Failed to update event." },
			{ status: 500 },
		);
	}
}

export async function DELETE(_req, { params }) {
	try {
		await requireAdmin();
		const { id } = params;

		const ok = await deleteEvent(id);
		if (!ok) {
			return NextResponse.json({ error: "Event not found." }, { status: 404 });
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (err) {
		if (err?.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (err?.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		console.error("Admin delete event error", err);
		return NextResponse.json(
			{ error: "Failed to delete event." },
			{ status: 500 },
		);
	}
}

