"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Hr from "@/components/Hr";
import Button from "@/components/Button";
import { useLocale } from "@/lib/useLocale";

export default function AdminContactsPage() {
	const locale = useLocale();
	const isMn = locale === "mn";

	const [user, setUser] = useState(null);
	const [contacts, setContacts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [replyingId, setReplyingId] = useState(null);
	const [replySubject, setReplySubject] = useState("");
	const [replyBody, setReplyBody] = useState("");
	const [sending, setSending] = useState(false);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const meRes = await fetch("/api/auth/me");
				if (!meRes.ok) {
					if (!mounted) return;
					setError(
						isMn
							? "Admin contact хэсэгт хандахын тулд нэвтэрч, admin эрхтэй байх шаардлагатай."
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

				const res = await fetch("/api/admin/contacts");
				if (!res.ok) {
					const body = await res.json().catch(() => ({}));
					throw new Error(body.error || "Failed to load contacts.");
				}
				const data = await res.json();
				if (!mounted) return;
				setContacts(data.contacts || []);
			} catch (err) {
				if (!mounted) return;
				setError(
					err.message ||
						(isMn ? "Contact мессежүүдийг ачаалахад алдаа гарлаа." : "Failed to load contact messages."),
				);
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [isMn]);

	const refreshContacts = async () => {
		try {
			const res = await fetch("/api/admin/contacts");
			if (!res.ok) return;
			const data = await res.json();
			setContacts(data.contacts || []);
		} catch {
			// ignore
		}
	};

	const startReply = (c) => {
		setReplyingId(c.id);
		setReplySubject(
			isMn ? `Re: ${c.subject || "Your message to Derrick Rose"}` : `Re: ${c.subject || "Your message to Derrick Rose"}`,
		);
		setReplyBody("");
	};

	const sendReply = async (e) => {
		e.preventDefault();
		if (!replyingId) return;
		setSending(true);
		try {
			const res = await fetch("/api/admin/contact/reply", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contactId: replyingId,
					subject: replySubject,
					body: replyBody,
				}),
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || "Failed to send reply.");
			}
			setReplyingId(null);
			setReplySubject("");
			setReplyBody("");
			await refreshContacts();
		} catch (err) {
			setError(
				err.message ||
					(isMn ? "Хариу илгээхэд алдаа гарлаа." : "Failed to send reply."),
			);
		} finally {
			setSending(false);
		}
	};

	return (
		<div className="space-y-6">
			<p className="text-white/50 text-sm">
				{isMn ? "Холбоо барих" : "Contacts"} / {isMn ? "Мессежийн жагсаалт" : "Contact Messages"}
			</p>
			<div className="space-y-6">
				<header className="space-y-3">
					<h1 className="text-2xl font-bold text-white">
						{isMn ? "Contact Messages" : "Contact Messages"}
					</h1>
					<Hr />
					<p className="text-white/60 text-sm">
						{isMn
							? "Сайтын Contact form-оор ирсэн бүх мессежүүдийг эндээс харан, хэрэглэгчидэд шууд мэйлээр хариу илгээнэ."
							: "Review all messages submitted via the site contact form and send email replies directly."}
					</p>
				</header>

				{loading && (
					<p className="text-gray-400 text-sm">
						{isMn ? "Contact мессежүүдийг ачаалж байна..." : "Loading contact messages..."}
					</p>
				)}

				{!loading && error && (
					<p className="text-red-400 text-sm">
						{error}
					</p>
				)}

				{!loading && !error && user?.role === "admin" && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<section className="md:col-span-2 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
							{contacts.length === 0 && (
								<p className="text-sm text-gray-400">
									{isMn
										? "Одоогоор contact мессеж ирээгүй байна."
										: "No contact messages yet."}
								</p>
							)}
							{contacts.map((c) => (
								<motion.div
									key={c.id}
									className="rounded-xl border border-white/10 bg-black/60 p-4 space-y-2"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}>
									<div className="flex items-center justify-between gap-2">
										<div>
											<p className="text-sm font-semibold text-white">
												{c.name || c.email}
											</p>
											<p className="text-xs text-gray-400">{c.email}</p>
										</div>
										<div className="text-xs text-right">
											<p className="text-gray-400">
												{new Date(c.createdAt).toLocaleString()}
											</p>
											<p
												className={`mt-1 inline-block px-2 py-0.5 rounded-full ${
													c.replyStatus === "replied"
														? "bg-green-800/60 text-green-300"
														: "bg-yellow-800/60 text-yellow-300"
												}`}>
												{c.replyStatus === "replied"
													? isMn
														? "Хариу илгээсэн"
														: "Replied"
													: isMn
													? "Хүлээгдэж байна"
													: "Pending"}
											</p>
										</div>
									</div>
									<p className="text-sm text-gray-200 whitespace-pre-line">
										{c.message}
									</p>
									<div className="flex justify-end">
										<Button
											variation="secondary"
											type="button"
											onClick={() => startReply(c)}>
											{isMn ? "Хариу бичих" : "Reply"}
										</Button>
									</div>
								</motion.div>
							))}
						</section>

						<section className="md:col-span-1 rounded-xl border border-white/10 bg-black/60 p-5 space-y-3">
							<h2 className="text-xl font-semibold">
								{isMn ? "Хариу илгээх" : "Send reply"}
							</h2>
							{!replyingId && (
								<p className="text-xs text-gray-400">
									{isMn
										? "Зүүн талын жагсаалтаас мессеж сонгон \"Хариу бичих\" товч дарахад энд form гарч ирнэ."
										: "Choose a message on the left and click \"Reply\" to compose an email here."}
								</p>
							)}
							{replyingId && (
								<form onSubmit={sendReply} className="space-y-3">
									<div>
										<label className="block text-xs text-gray-400 mb-1">
											{isMn ? "Гарчиг" : "Subject"}
										</label>
										<input
											value={replySubject}
											onChange={(e) => setReplySubject(e.target.value)}
											required
											className="w-full rounded-md border border-white/10 bg-black/80 px-3 py-2 text-sm text-white"
										/>
									</div>
									<div>
										<label className="block text-xs text-gray-400 mb-1">
											{isMn ? "Мессеж" : "Message"}
										</label>
										<textarea
											rows={6}
											value={replyBody}
											onChange={(e) => setReplyBody(e.target.value)}
											required
											className="w-full rounded-md border border-white/10 bg-black/80 px-3 py-2 text-sm text-white resize-none"
										/>
									</div>
									<div className="flex gap-2">
										<Button
											variation="primary"
											type="submit"
											disabled={sending}>
											{sending
												? isMn
													? "Илгээж байна..."
													: "Sending..."
												: isMn
												? "Хариу илгээх"
												: "Send reply"}
										</Button>
										<Button
											variation="secondary"
											type="button"
											onClick={() => {
												setReplyingId(null);
												setReplySubject("");
												setReplyBody("");
											}}>
											{isMn ? "Болих" : "Cancel"}
										</Button>
									</div>
								</form>
							)}
						</section>
					</div>
				)}
			</div>
		</div>
	);
}

