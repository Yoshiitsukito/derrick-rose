"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/useLocale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUsers,
	faChevronLeft,
	faChevronRight,
	faKey,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";

function formatDate(iso) {
	if (!iso) return "—";
	const d = new Date(iso);
	return d.toLocaleDateString(undefined, {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});
}

function formatDateTime(iso) {
	if (!iso) return "—";
	const d = new Date(iso);
	return d.toLocaleString(undefined, {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

const fetchCustomers = async (limit, offset) => {
	const res = await fetch(
		`/api/admin/customers?limit=${limit}&offset=${offset}`,
	);
	if (!res.ok) return null;
	return res.json();
};

export default function AdminCustomersPage() {
	const locale = useLocale();
	const isMn = locale === "mn";
	const [customers, setCustomers] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [passwordModal, setPasswordModal] = useState(null);
	const [newPassword, setNewPassword] = useState("");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const pageSize = 10;

	const refresh = async () => {
		const data = await fetchCustomers(pageSize, page * pageSize);
		if (data) {
			setCustomers(data.customers || []);
			setTotal(data.total ?? 0);
		}
	};

	useEffect(() => {
		let mounted = true;
		(async () => {
			setLoading(true);
			try {
				const data = await fetchCustomers(pageSize, page * pageSize);
				if (!mounted) return;
				if (data) {
					setCustomers(data.customers || []);
					setTotal(data.total ?? 0);
				}
			} catch {
				// ignore
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, [page]);

	const handleChangePassword = async (e) => {
		e.preventDefault();
		if (!passwordModal || !newPassword.trim()) return;
		if (newPassword.length < 6) {
			setError(isMn ? "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой" : "Password must be at least 6 characters");
			return;
		}
		setSaving(true);
		setError("");
		try {
			const res = await fetch(`/api/admin/users/${passwordModal.id}/password`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password: newPassword }),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				setError(data.error || (isMn ? "Алдаа гарлаа" : "Failed"));
				return;
			}
			setPasswordModal(null);
			setNewPassword("");
		} catch {
			setError(isMn ? "Холболт амжилтгүй" : "Connection failed");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (c) => {
		if (!window.confirm(
			isMn
				? `${c.email} хэрэглэгчийг устгах уу? Тасалбарууд нь устгагдана.`
				: `Delete user ${c.email}? Their tickets will also be removed.`
		)) return;
		try {
			const res = await fetch(`/api/admin/users/${c.id}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				alert(data.error || (isMn ? "Алдаа гарлаа" : "Failed"));
				return;
			}
			await refresh();
		} catch {
			alert(isMn ? "Холболт амжилтгүй" : "Connection failed");
		}
	};

	const totalPages = Math.ceil(total / pageSize) || 1;
	const from = page * pageSize + 1;
	const to = Math.min((page + 1) * pageSize, total);

	return (
		<div className="space-y-6">
			<p className="text-white/50 text-sm">
				{isMn ? "Хэрэглэгчид" : "Customers"} /{" "}
				{isMn ? "Хэрэглэгчдийн жагсаалт" : "Customer List"}
			</p>

			{/* Summary */}
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2 text-white/70">
					<FontAwesomeIcon icon={faUsers} className="text-red-400" />
					<span>
						{isMn ? "Нийт хэрэглэгч" : "Total Customer"}: {total}{" "}
						{isMn ? "хүн" : "Person"}
					</span>
				</div>
			</div>

			{/* Table */}
			<div className="bg-black/60 rounded-xl border border-white/5 overflow-hidden">
				{loading ? (
					<div className="p-12 text-center text-white/50">
						{isMn ? "Уншиж байна..." : "Loading..."}
					</div>
				) : customers.length === 0 ? (
					<div className="p-12 text-center text-white/50">
						{isMn ? "Хэрэглэгч олдсонгүй" : "No customers yet"}
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-white/10">
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "ID" : "Cust. ID"}
									</th>
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "Бүртгүүлсэн" : "Date Join"}
									</th>
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "И-мэйл" : "Customer Name"}
									</th>
									<th className="text-right py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "Тасалбар" : "Tickets"}
									</th>
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "Сүүлчийн захиалга" : "Last Order"}
									</th>
									<th className="text-right py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "Нийт зарцуулсан" : "Total Spent"}
									</th>
									<th className="text-right py-3 px-4 text-white/60 text-sm font-medium w-24">
										{isMn ? "Үйлдлүүд" : "Actions"}
									</th>
								</tr>
							</thead>
							<tbody>
								{customers.map((c, i) => (
									<motion.tr
										key={c.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: i * 0.02 }}
										className="border-b border-white/5 hover:bg-white/5 transition-colors">
										<td className="py-3 px-4 text-white font-mono text-sm">
											#{c.id?.slice(-8) || "—"}
										</td>
										<td className="py-3 px-4 text-white/80 text-sm">
											{formatDate(c.dateJoin)}
										</td>
										<td className="py-3 px-4 text-white/90">{c.email || "—"}</td>
										<td className="py-3 px-4 text-right text-white/80">
											{c.ticketsOrdered ?? 0} {isMn ? "ш" : "pcs"}
										</td>
										<td className="py-3 px-4 text-white/70 text-sm">
											{formatDateTime(c.lastOrderAt)}
										</td>
										<td className="py-3 px-4 text-right text-red-400 font-medium">
											${Number(c.totalSpent ?? 0).toFixed(2)}
										</td>
										<td className="py-3 px-4 text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													type="button"
													onClick={() => {
														setPasswordModal(c);
														setNewPassword("");
														setError("");
													}}
													className="p-2 rounded-lg hover:bg-red-700/20 text-red-400 hover:text-red-300 transition-colors"
													title={isMn ? "Нууц үг солих" : "Change password"}>
													<FontAwesomeIcon icon={faKey} className="w-4" />
												</button>
												<button
													type="button"
													onClick={() => handleDelete(c)}
													className="p-2 rounded-lg hover:bg-red-900/30 text-red-400 hover:text-red-300 transition-colors"
													title={isMn ? "Устгах" : "Delete"}>
													<FontAwesomeIcon icon={faTrash} className="w-4" />
												</button>
											</div>
										</td>
									</motion.tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Pagination */}
				{total > pageSize && (
					<div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
						<p className="text-white/50 text-sm">
							{isMn ? "Харуулж байна" : "Showing"} {from}–{to}{" "}
							{isMn ? "of" : "from"} {total} {isMn ? "өгөгдөл" : "data"}
						</p>
						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={() => setPage((p) => Math.max(0, p - 1))}
								disabled={page === 0}
								className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white/70">
								<FontAwesomeIcon icon={faChevronLeft} />
							</button>
							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								const p = page < 3 ? i : page - 2 + i;
								if (p < 0 || p >= totalPages) return null;
								return (
									<button
										key={p}
										type="button"
										onClick={() => setPage(p)}
										className={`w-9 h-9 rounded-lg font-medium text-sm transition-colors ${
											p === page
												? "bg-red-500 text-white"
												: "text-white/70 hover:bg-white/10"
										}`}>
										{p + 1}
									</button>
								);
							})}
							<button
								type="button"
								onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
								disabled={page >= totalPages - 1}
								className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white/70">
								<FontAwesomeIcon icon={faChevronRight} />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Password change modal */}
			{passwordModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-black/90 border border-red-900/50 rounded-xl p-6 w-full max-w-md">
						<h3 className="text-lg font-semibold text-white mb-2">
							{isMn ? "Нууц үг солих" : "Change password"}
						</h3>
						<p className="text-white/70 text-sm mb-4">
							{passwordModal.email}
						</p>
						<form onSubmit={handleChangePassword} className="space-y-4">
							<div>
								<label className="block text-white/60 text-sm mb-1">
									{isMn ? "Шинэ нууц үг" : "New password"}
								</label>
								<input
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder={isMn ? "Хамгийн багадаа 6 тэмдэгт" : "Min 6 characters"}
									className="w-full px-3 py-2 rounded-lg bg-black/60 border border-red-900/40 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-red-600"
									minLength={6}
									autoFocus
								/>
							</div>
							{error && (
								<p className="text-red-400 text-sm">{error}</p>
							)}
							<div className="flex gap-2 justify-end">
								<button
									type="button"
									onClick={() => {
										setPasswordModal(null);
										setNewPassword("");
										setError("");
									}}
									className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/5">
									{isMn ? "Цуцлах" : "Cancel"}
								</button>
								<button
									type="submit"
									disabled={saving}
									className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white disabled:opacity-50">
									{saving
										? (isMn ? "Хадгалж байна..." : "Saving...")
										: (isMn ? "Хадгалах" : "Save")}
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</div>
	);
}
