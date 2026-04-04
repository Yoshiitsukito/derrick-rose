import { logContactMessage } from "@/lib/contacts";

export async function POST(req) {
	try {
		const { name, email, message } = await req.json();

		if (!name || !email || !message) {
			return new Response(
				JSON.stringify({ error: "Name, email and message are required." }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
			return new Response(
				JSON.stringify({
					error:
						"Email service is not configured. Please set RESEND_API_KEY and CONTACT_TO_EMAIL.",
				}),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const apiKey = process.env.RESEND_API_KEY;
		const to = process.env.CONTACT_TO_EMAIL;

		const resendRes = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				// Resend-ийн sandbox-д зөвшөөрөгдсөн илгээгч
				from: "Derrick Rose Site <onboarding@resend.dev>",
				to: [to],
				reply_to: email,
				subject: `New message from ${name}`,
				text: `From: ${name} (${email})\n\n${message}`,
				html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(
					/\n/g,
					"<br/>",
				)}</p>`,
			}),
		});

		if (!resendRes.ok) {
			const body = await resendRes.json().catch(() => ({}));
			console.error("Resend API error", body);
			return new Response(
				JSON.stringify({
					error: "Failed to send email via Resend.",
				}),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		await logContactMessage({ name, email, message });

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Contact form error", error);
		return new Response(JSON.stringify({ error: "Failed to send message." }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

