"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Hr from "@/components/Hr";
import { useLocale } from "@/lib/useLocale";

function ContactForm() {
	const [status, setStatus] = useState("idle"); // idle | loading | success | error
	const [error, setError] = useState("");

	return (
		<div className="mt-6 w-full max-w-xl bg-neutral-900/90 backdrop-blur-sm rounded-lg shadow-md p-6 border border-red-700/60">
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setStatus("loading");
					setError("");
					const form = e.currentTarget;
					const data = {
						name: form.name.value,
						email: form.email.value,
						message: form.message.value,
					};
					try {
						const res = await fetch("/api/contact", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(data),
						});
						if (!res.ok) {
							const body = await res.json().catch(() => ({}));
							throw new Error(body.error || "Failed to send message.");
						}
						form.reset();
						setStatus("success");
					} catch (err) {
						setStatus("error");
						setError(err.message || "Failed to send message.");
					}
				}}
				className="space-y-4">
				<div>
					<label htmlFor="name" className="block text-sm font-medium text-gray-700">
						Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						className="mt-1 block w-full rounded-md border border-gray-600 px-3 py-2 text-sm shadow-sm focus:border-red-700 focus:ring-red-700 bg-neutral-950 text-white placeholder-gray-500"
					/>
				</div>
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						className="mt-1 block w-full rounded-md border border-gray-600 px-3 py-2 text-sm shadow-sm focus:border-red-700 focus:ring-red-700 bg-neutral-950 text-white placeholder-gray-500"
					/>
				</div>
				<div>
					<label htmlFor="message" className="block text-sm font-medium text-gray-700">
						Message
					</label>
					<textarea
						id="message"
						name="message"
						rows={4}
						required
						className="mt-1 block w-full rounded-md border border-gray-600 px-3 py-2 text-sm shadow-sm focus:border-red-700 focus:ring-red-700 bg-neutral-950 text-white resize-none"
					/>
				</div>
				<Button variation="primary">
					<span className="w-full h-full block text-center">
						{status === "loading" ? "Sending..." : "Send Message"}
					</span>
				</Button>
				{status === "success" && (
					<p className="text-sm text-green-400 mt-2">
						Message sent successfully.
					</p>
				)}
				{status === "error" && (
					<p className="text-sm text-red-400 mt-2">
						{error || "Failed to send message. Please try again."}
					</p>
				)}
			</form>
		</div>
	);
}

export default function ContactPage() {
	const locale = useLocale();
	const isMn = locale === "mn";

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<main className="min-h-screen w-screen bg-gradient-to-b from-black/85 via-neutral-950/90 to-black/85 text-white flex items-center justify-center p-6">
			<div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
				<div className="space-y-4">
					<h1 className="text-4xl md:text-5xl font-extrabold">
						{isMn ? "Холбогдох" : "Contact Derrick Rose Team"}
					</h1>
					<Hr />
					<p className="text-gray-200 leading-relaxed">
						{isMn
							? "Медиа, интервю, community event болон бизнесийн хамтын ажиллагааны тухай асуулт байвал энэ form-оор илгээнэ үү."
							: "For media, interviews, community events or business collaboration inquiries, please reach out using this contact form."}
					</p>
					<p className="text-sm text-gray-400">
						{isMn
							? "Жич: Энэ сайт албан ёсны менежменттэй шууд холбоогүй, fan-style танилцуулга сайт юм."
							: "Note: this is an unofficial, fan-style personal site and not directly affiliated with official team management."}
					</p>
				</div>
				<div className="flex justify-center items-start">
					<ContactForm />
				</div>
			</div>
		</main>
	);
}

