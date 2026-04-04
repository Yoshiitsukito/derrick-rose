"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/useLocale";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faDollarSign,
	faUsers,
	faChevronLeft,
	faChevronRight,
	faCalendar,
} from "@fortawesome/free-solid-svg-icons";

function formatDate(iso) {
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

export default function AdminOrdersPage() {
	const locale = useLocale();
	const isMn = locale === "mn";
	const currentMonth = new Date().toISOString().slice(0, 7);
	const [orders, setOrders] = useState([]);
	const [dailySeries, setDailySeries] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [monthInput, setMonthInput] = useState(currentMonth);
	const [reportMonth, setReportMonth] = useState(currentMonth);
	const pageSize = 10;

	useEffect(() => {
		let mounted = true;
		(async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`/api/admin/orders?limit=${pageSize}&offset=${page * pageSize}&month=${reportMonth}`,
				);
				if (!res.ok) return;
				const data = await res.json();
				if (!mounted) return;
				setOrders(data.orders || []);
				setTotal(data.total ?? 0);
				setDailySeries(data.dailySeries || []);
			} catch {
				// ignore
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, [page, reportMonth]);

	const applyMonthFilter = () => {
		setPage(0);
		setReportMonth(monthInput || currentMonth);
	};

	const useCurrentMonth = () => {
		setMonthInput(currentMonth);
		setPage(0);
		setReportMonth(currentMonth);
	};

	const totalPages = Math.ceil(total / pageSize) || 1;
	const from = page * pageSize + 1;
	const to = Math.min((page + 1) * pageSize, total);

	return (
		<div className="space-y-6">
			<p className="text-white/50 text-sm">
				{isMn ? "Үйл ажиллагаа" : "Event"} / {isMn ? "Захиалгын жагсаалт" : "Order List"}
			</p>

			<div className="flex flex-wrap items-center gap-3">
				<div className="min-w-[220px]">
					<label className="block text-white/60 text-xs mb-2">
						{isMn ? "Сар сонгох (YYYY-MM)" : "Pick Month (YYYY-MM)"}
					</label>
					<input
						type="month"
						value={monthInput}
						onChange={(e) => setMonthInput(e.target.value)}
						className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-1 focus:ring-red-600/50"
					/>
				</div>
				<button
					type="button"
					onClick={applyMonthFilter}
					className="mt-6 rounded-full border border-white/60 px-6 py-2.5 text-white font-medium hover:bg-white/10 transition-colors">
					{isMn ? "Тайлан харах" : "Show report"}
				</button>
				<button
					type="button"
					onClick={useCurrentMonth}
					className="mt-6 rounded-full border border-white/60 px-6 py-2.5 text-white font-medium hover:bg-white/10 transition-colors">
					{isMn ? "Өнөө сар" : "This month"}
				</button>
				<Link
					href="/tickets"
					className="mt-6 rounded-full border border-white/60 px-6 py-2.5 text-white font-medium hover:bg-white/10 transition-colors">
					{isMn ? "Миний захиалгууд" : "My orders"}
				</Link>
			</div>

			<div className="rounded-xl border border-white/10 bg-black/60 p-5 space-y-2">
				<h3 className="text-xl font-semibold">
					{isMn ? "Monthly completed jobs" : "Monthly completed jobs"}
				</h3>
				<p className="text-white/60 text-sm">
					{isMn
						? `Сонгосон сар (${reportMonth}) хүртэлх өдрөөр ангилсан захиалгын тоо.`
						: `Daily order totals for selected month (${reportMonth}).`}
				</p>
				<div className="h-[380px]">
					{dailySeries.length > 0 ? (
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart
								data={dailySeries}
								margin={{ top: 16, right: 12, left: -18, bottom: 0 }}>
								<defs>
									<linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
										<stop offset="100%" stopColor="#22c55e" stopOpacity={0.06} />
									</linearGradient>
								</defs>
								<CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
								<XAxis dataKey="date" stroke="#a3b0c4" tick={{ fill: "#a3b0c4" }} />
								<YAxis
									stroke="#a3b0c4"
									allowDecimals={false}
									tick={{ fill: "#a3b0c4" }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "#0a1328",
										border: "1px solid rgba(148,163,184,0.3)",
										borderRadius: "12px",
										color: "#fff",
									}}
								/>
								<Legend />
								<Area
									type="monotone"
									dataKey="total"
									name={isMn ? "Completed bookings" : "Completed bookings"}
									stroke="#22c55e"
									fill="url(#ordersFill)"
									strokeWidth={3}
									dot={{ r: 5, strokeWidth: 3, fill: "#0b1226", stroke: "#22c55e" }}
								/>
							</AreaChart>
						</ResponsiveContainer>
					) : (
						<div className="h-full flex items-center justify-center text-white/50">
							{isMn ? "Сонгосон сард захиалга алга." : "No data for selected month."}
						</div>
					)}
				</div>
			</div>

			{/* Summary */}
			<div className="flex flex-wrap items-center gap-4">
				<div className="flex items-center gap-2 text-white/70">
					<FontAwesomeIcon icon={faDollarSign} className="text-red-400" />
					<span>
						{isMn ? "Орлого" : "Income"}: $
						{orders
							.reduce((s, o) => s + (o.totalPrice || 0), 0)
							.toFixed(2)}
					</span>
				</div>
				<div className="flex items-center gap-2 text-white/70">
					<FontAwesomeIcon icon={faUsers} className="text-red-400" />
					<span>
						{total} {isMn ? "захиалга" : "orders"}
					</span>
				</div>
				<div className="flex items-center gap-2 text-white/70">
					<FontAwesomeIcon icon={faCalendar} className="text-red-400" />
					<span>
						{isMn ? "Сонгосон сар" : "Selected month"}: {reportMonth}
					</span>
				</div>
			</div>

			{/* Table */}
			<div className="bg-black/60 rounded-xl border border-white/5 overflow-hidden">
				{loading ? (
					<div className="p-12 text-center text-white/50">
						{isMn ? "Уншиж байна..." : "Loading..."}
					</div>
				) : orders.length === 0 ? (
					<div className="p-12 text-center text-white/50">
						{isMn ? "Захиалга олдсонгүй" : "No orders yet"}
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-white/10">
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "Захиалгын ID" : "Order ID"}
									</th>
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "Огноо" : "Date"}
									</th>
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "Үйл ажиллагаа" : "Event Name"}
									</th>
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "Хэрэглэгч" : "Customer"}
									</th>
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "Байршил" : "Location"}
									</th>
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "Block цаг" : "Time block"}
									</th>
									<th className="text-right py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "Борлуулсан" : "Sold"}
									</th>
									<th className="text-right py-3 px-4 text-white/60 text-sm font-medium">
										{isMn ? "Нийт орлого" : "Total Revenue"}
									</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((o, i) => (
									<motion.tr
										key={o.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: i * 0.02 }}
										className="border-b border-white/5 hover:bg-white/5 transition-colors">
										<td className="py-3 px-4 text-white font-mono text-sm">
											#{o.id?.slice(-8) || "—"}
										</td>
										<td className="py-3 px-4 text-white/80 text-sm">
											{formatDate(o.createdAt)}
										</td>
										<td className="py-3 px-4 text-white/90">
											{o.eventTitle || "—"}
										</td>
										<td className="py-3 px-4 text-white/80 text-sm">
											{o.userEmail || "—"}
										</td>
										<td className="py-3 px-4 text-white/70 text-sm">
											{o.eventLocation || "—"}
										</td>
										<td className="py-3 px-4 text-white/70 text-sm">
											{o.bookingDate && o.bookingBlock
												? `${o.bookingDate} / ${o.bookingBlock.toUpperCase()}`
												: "—"}
										</td>
										<td className="py-3 px-4 text-right text-white/80">
											{o.quantity ?? 0} {isMn ? "ш" : "pcs"}
										</td>
										<td className="py-3 px-4 text-right text-red-400 font-medium">
											${Number(o.totalPrice ?? 0).toFixed(2)}
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
		</div>
	);
}
