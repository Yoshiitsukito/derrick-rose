import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { requireUser } from "@/lib/session";
import { getEventById } from "@/lib/events";
import { createTicketOrder, listTicketsForEvent } from "@/lib/tickets";

function createTransport() {
	const host = process.env.SMTP_HOST;
	const port = Number(process.env.SMTP_PORT || 587);
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;

	if (!host || !user || !pass) {
		throw new Error("SMTP is not configured.");
	}

	const secure =
		process.env.SMTP_SECURE === "true" ||
		process.env.SMTP_SECURE === "1" ||
		port === 465;

	return nodemailer.createTransport({
		host,
		port,
		secure,
		auth: { user, pass },
	});
}

async function generateQrPngBuffer(text) {
	// No QR dependency installed; use Google Chart to generate a PNG.
	// Returns an image buffer that we can attach via Nodemailer.
	const qrUrl =
		"https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=M|0&chl=" +
		encodeURIComponent(text);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10000);
	let res;
	try {
		res = await fetch(qrUrl, { signal: controller.signal });
	} finally {
		clearTimeout(timeout);
	}
	if (!res.ok) {
		throw new Error(`QR generation failed: ${res.status}`);
	}
	const arrayBuffer = await res.arrayBuffer();
	return Buffer.from(arrayBuffer);
}

async function readQrBufferFromPublicPath(publicUrlPath) {
	// publicUrlPath example: /image/events/qrs/xxx.png
	if (!publicUrlPath) return null;
	const relative = publicUrlPath.replace(/^\/+/, "");
	const fullPath = path.join(process.cwd(), "public", relative);
	try {
		return await fs.readFile(fullPath);
	} catch (err) {
		console.error("Failed reading QR file from disk", err);
		return null;
	}
}

export async function POST(req) {
	try {
		const user = await requireUser();
		const { eventId, quantity = 1, locale = "en" } = await req.json();

		if (!eventId) {
			return NextResponse.json(
				{ error: "eventId is required." },
				{ status: 400 },
			);
		}

		const event = await getEventById(eventId);
		if (!event || event.isActive === false) {
			return NextResponse.json({ error: "Event not found." }, { status: 404 });
		}

		if (!event.hasTicket) {
			return NextResponse.json(
				{ error: "This event does not sell tickets." },
				{ status: 400 },
			);
		}

		const qty = Number.isFinite(Number(quantity)) ? Number(quantity) : 1;
		const safeQty = qty > 0 ? Math.min(qty, 10) : 1;

		const limit =
			typeof event.ticketLimit === "number" && Number.isFinite(event.ticketLimit)
				? event.ticketLimit
				: null;

		if (limit !== null) {
			const existing = await listTicketsForEvent(event.id);
			const sold = existing.reduce(
				(sum, t) => sum + (Number(t.quantity) || 0),
				0,
			);
			const remaining = limit - sold;
			if (remaining <= 0) {
				return NextResponse.json(
					{
						error: "Tickets for this event are sold out.",
					},
					{ status: 400 },
				);
			}
			if (safeQty > remaining) {
				return NextResponse.json(
					{
						error: `Only ${remaining} tickets remaining for this event.`,
					},
					{ status: 400 },
				);
			}
		}
		const price = Number(event.price || 0);
		const totalPrice = price * safeQty;

		const order = await createTicketOrder({
			eventId: event.id,
			userId: user.id,
			quantity: safeQty,
			totalPrice,
		});

		// Best-effort email delivery (ticket purchase should still succeed even if email fails).
		let emailSent = false;
		try {
			const transporter = createTransport();
			const to = user.email;
			const from = process.env.SMTP_FROM || process.env.CONTACT_TO_EMAIL;
			if (to && from) {
				const hasCustomQr = !!event?.qrImageUrl;
				let qrBuffer = null;
				let qrFilename = null;
				let qrContentType = "image/png";

				// 1) Prefer admin-uploaded QR image for this event
				if (hasCustomQr) {
					qrBuffer = await readQrBufferFromPublicPath(event.qrImageUrl);
					if (qrBuffer) {
						qrFilename = path.basename(event.qrImageUrl);
						const ext = path.extname(qrFilename).toLowerCase();
						qrContentType =
							ext === ".jpg" || ext === ".jpeg"
								? "image/jpeg"
								: ext === ".webp"
									? "image/webp"
									: "image/png";
					}
				}

				// 2) Fallback: generate QR that encodes ticket id
				if (!qrBuffer) {
					const qrText = `ticket:${order.id}`;
					try {
						qrBuffer = await generateQrPngBuffer(qrText);
						qrFilename = `${order.id}.png`;
					} catch (qrErr) {
						console.error(
							"QR generation failed; sending email without QR attachment",
							qrErr,
						);
					}
				}

				const eventDateLabel =
					event?.date &&
					new Date(event.date).toLocaleString(undefined, {
						year: "numeric",
						month: "short",
						day: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					});

				const isMn = locale === "mn";
				const subject = isMn
					? `Тасалбарын QR код: ${event.title}`
					: `Your ticket QR: ${event.title}`;

				const text = isMn
					? [
							`Сайн байна уу,`,
							``,
							`Тасалбар худалдан авсанд баярлалаа!`,
							`Хавсралтаар тасалбарын QR код орлоо.`,
							``,
							`Event: ${event.title}`,
							`Location: ${event.location || "—"}`,
							`Date: ${eventDateLabel || "—"}`,
							`Ticket ID: ${order.id}`,
							`Quantity: ${order.quantity}`,
							``,
							`Хамгийн ойрын арга хэмжээндээ энэ имэйл эсвэл QR-г үзүүлээрэй.`,
							`—`,
							`Derrick Rose Team`,
						].join("\n")
					: [
							`Hi,`,
							``,
							`Thanks for supporting Derrick Rose!`,
							`Your ticket QR code is attached.`,
							``,
							`Event: ${event.title}`,
							`Location: ${event.location || "—"}`,
							`Date: ${eventDateLabel || "—"}`,
							`Ticket ID: ${order.id}`,
							`Quantity: ${order.quantity}`,
							``,
							`Please show the QR at the event.`,
							`—`,
							`Derrick Rose Team`,
						].join("\n");

				await transporter.sendMail({
					from,
					to,
					subject,
					text,
					...(qrBuffer
						? {
								attachments: [
									{
										filename: qrFilename || `${order.id}.png`,
										content: qrBuffer,
										contentType: qrContentType,
									},
								],
							}
						: null),
				});

				emailSent = true;
			}
		} catch (emailErr) {
			console.error("Ticket email error", emailErr);
		}

		return NextResponse.json(
			{
				order,
				emailSent,
			},
			{ status: 201 },
		);
	} catch (err) {
		if (err?.message === "Unauthorized") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}
		console.error("Create ticket error", err);
		return NextResponse.json(
			{ error: err?.message || "Failed to create ticket." },
			{ status: 500 },
		);
	}
}

