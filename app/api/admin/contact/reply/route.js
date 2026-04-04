import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { requireAdmin } from "@/lib/session";
import { listContactMessages, updateContactReply } from "@/lib/contacts";

function createTransport() {
	const host = process.env.SMTP_HOST;
	const port = Number(process.env.SMTP_PORT || 587);
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;

	if (!host || !user || !pass) {
		throw new Error("SMTP is not configured.");
	}

	return nodemailer.createTransport({
		host,
		port,
		secure: port === 465,
		auth: { user, pass },
	});
}

export async function POST(req) {
	try {
		await requireAdmin();
		const { contactId, subject, body } = await req.json();

		if (!contactId || !subject || !body) {
			return NextResponse.json(
				{ error: "contactId, subject and body are required." },
				{ status: 400 },
			);
		}

		const contacts = await listContactMessages();
		const contact = contacts.find((c) => c.id === contactId);
		if (!contact) {
			return NextResponse.json(
				{ error: "Contact message not found." },
				{ status: 404 },
			);
		}

		const transporter = createTransport();
		const from = process.env.SMTP_FROM || process.env.CONTACT_TO_EMAIL;

		await transporter.sendMail({
			from,
			to: contact.email,
			replyTo: from,
			subject,
			text: body,
		});

		const updated = await updateContactReply(contactId, { subject, body });

		return NextResponse.json({ contact: updated }, { status: 200 });
	} catch (err) {
		if (err?.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (err?.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		if (err?.message === "SMTP is not configured.") {
			return NextResponse.json(
				{ error: "SMTP is not configured on the server." },
				{ status: 500 },
			);
		}
		console.error("Admin contact reply error", err);
		return NextResponse.json(
			{ error: "Failed to send reply." },
			{ status: 500 },
		);
	}
}

