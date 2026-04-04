import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { createEvent, listAllEvents } from "@/lib/events";
import fs from "fs/promises";
import path from "path";

async function storeUploadedImage(file) {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const originalName = file?.name || "upload";
	const extFromName = path.extname(originalName).toLowerCase();
	const ext = extFromName || ".png";

	// Keep it safe: allow a small set of common image extensions
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

	// QR images are usually png/jpg/webp; default to png.
	const allowed = new Set([".png", ".jpg", ".jpeg", ".webp"]);
	const safeExt = allowed.has(ext) ? ext : ".png";

	const filename = `qr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${safeExt}`;
	const dir = path.join(process.cwd(), "public", "image", "events", "qrs");
	await fs.mkdir(dir, { recursive: true });

	const dest = path.join(dir, filename);
	await fs.writeFile(dest, buffer);

	return `/image/events/qrs/${filename}`;
}

export async function GET() {
	try {
		await requireAdmin();
		const events = await listAllEvents();
		return NextResponse.json({ events }, { status: 200 });
	} catch (err) {
		if (err?.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (err?.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		console.error("Admin list events error", err);
		return NextResponse.json(
			{ error: "Failed to load events." },
			{ status: 500 },
		);
	}
}

export async function POST(req) {
	try {
		await requireAdmin();
		const contentType = req.headers.get("content-type") || "";
		const isMultipart = contentType.includes("multipart/form-data");

		let body = null;
		let imageUrl = "";
		let qrImageUrl = "";

		if (isMultipart) {
			const formData = await req.formData();
			const file = formData.get("image");

			if (file && typeof file !== "string" && file.size > 0) {
				imageUrl = await storeUploadedImage(file);
			}

			const qrFile = formData.get("qr");
			if (qrFile && typeof qrFile !== "string" && qrFile.size > 0) {
				qrImageUrl = await storeUploadedQr(qrFile);
			}

			const priceRaw = formData.get("price");
			const price = priceRaw !== null && priceRaw !== ""
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
				imageUrl,
				qrImageUrl,
				videoUrl: formData.get("videoUrl"),
				location: formData.get("location"),
				hasTicket: formData.get("hasTicket"),
				isActive: formData.get("isActive"),
			};
		} else {
			body = await req.json();
			imageUrl = body.imageUrl || "";
			qrImageUrl = body.qrImageUrl || "";
		}

		if (!body.title || !body.date) {
			return NextResponse.json(
				{ error: "Title and date are required." },
				{ status: 400 },
			);
		}

		const price =
			body.price !== undefined && body.price !== null
				? Number(body.price)
				: 0;

		const event = await createEvent({
			title: body.title,
			description: body.description || "",
			date: body.date,
			price: Number.isFinite(price) ? price : 0,
			imageUrl: body.imageUrl || imageUrl || "",
			qrImageUrl: body.qrImageUrl || qrImageUrl || "",
			videoUrl: body.videoUrl || "",
			location: body.location || "",
			hasTicket:
				typeof body.hasTicket === "string"
					? body.hasTicket === "true"
					: Boolean(body.hasTicket),
			isActive:
				typeof body.isActive === "string"
					? body.isActive !== "false"
					: body.isActive !== false,
		});

		return NextResponse.json({ event }, { status: 201 });
	} catch (err) {
		if (err?.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (err?.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		console.error("Admin create event error", err);
		return NextResponse.json(
			{ error: "Failed to create event." },
			{ status: 500 },
		);
	}
}

