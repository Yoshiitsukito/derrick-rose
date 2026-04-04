"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/useLocale";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTicket,
	faDollarSign,
	faUsers,
	faEnvelope,
	faCalendar,
	faArrowRight,
	faChartLine,
} from "@fortawesome/free-solid-svg-icons";

const COLORS = ["#b91c1c", "#7f1d1d", "#991b1b", "#dc2626"];

export default function AdminDashboardPage() {
	const locale = useLocale();
	const isMn = locale === "mn";
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch("/api/admin/stats");
				if (!res.ok) return;
				const data = await res.json();
				if (!mounted) return;
				setStats(data);
			} catch {
				// ignore
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, []);

	if (loading || !stats) {
		return (
			<div className="flex items-center justify-center min-h-[300px]">
				<div className="text-white/50 animate-pulse">
					{isMn ? "Уншиж байна..." : "Loading..."}
				</div>
			</div>
		);
	}

	const chartData = stats.salesByMonth?.map((m) => ({
		name: m.month,
		revenue: m.revenue,
	})) || [];

	const pieData = [
		{ name: "Tickets", value: stats.totalTickets || 1 },
		{ name: "Orders", value: stats.totalOrders || 1 },
		{ name: "Events", value: stats.totalEvents || 1 },
		{ name: "Customers", value: stats.totalCustomers || 1 },
	].filter((d) => d.value > 0);

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<p className="text-white/50 text-sm">
				{isMn ? "Dashboard" : "Dashboard"} / {isMn ? "Тайлан" : "Analytics"}
			</p>

			{/* Top stat cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0 }}
					className="bg-black/60 rounded-xl p-5 border border-white/5">
					<div className="flex items-center justify-between mb-3">
						<span className="text-white/60 text-sm">
							{isMn ? "Өнөөдөр борлуулсан" : "Ticket Sold Today"}
						</span>
						<div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
							<FontAwesomeIcon icon={faTicket} className="text-red-400 w-5" />
						</div>
					</div>
					<p className="text-2xl font-bold text-white">
						{stats.ticketsSoldToday?.toLocaleString() ?? 0}{" "}
						{isMn ? "ш" : "pcs"}
					</p>
					<p className="text-red-400 text-sm mt-1">
						{isMn ? "Нийт орлогын" : "Total revenue"}: $
						{stats.revenueToday?.toFixed(2) ?? "0.00"}
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.05 }}
					className="bg-black/60 rounded-xl p-5 border border-white/5">
					<div className="flex items-center justify-between mb-3">
						<span className="text-white/60 text-sm">
							{isMn ? "Орлого" : "Income"}
						</span>
						<div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
							<FontAwesomeIcon icon={faDollarSign} className="text-red-400 w-5" />
						</div>
					</div>
					<p className="text-2xl font-bold text-white">
						${(stats.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
					</p>
					<p className="text-white/40 text-sm mt-1">
						{stats.totalOrders ?? 0} {isMn ? "захиалга" : "orders"}
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="bg-black/60 rounded-xl p-5 border border-white/5">
					<div className="flex items-center justify-between mb-3">
						<span className="text-white/60 text-sm">
							{isMn ? "Хэрэглэгчид" : "Customers"}
						</span>
						<div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
							<FontAwesomeIcon icon={faUsers} className="text-red-400 w-5" />
						</div>
					</div>
					<p className="text-2xl font-bold text-white">
						{(stats.totalCustomers ?? 0).toLocaleString()}{" "}
						{isMn ? "хүн" : "Person"}
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.15 }}
					className="bg-black/60 rounded-xl p-5 border border-white/5">
					<div className="flex items-center justify-between mb-3">
						<span className="text-white/60 text-sm">
							{isMn ? "Хүлээгдэж буй мессеж" : "Pending Contacts"}
						</span>
						<div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
							<FontAwesomeIcon icon={faEnvelope} className="text-red-400 w-5" />
						</div>
					</div>
					<p className="text-2xl font-bold text-white">
						{stats.pendingContacts ?? 0}
					</p>
					<Link
						href="/admin/contacts"
						className="text-red-400 text-sm mt-1 inline-flex items-center gap-1 hover:underline">
						{isMn ? "Харах" : "View"}
						<FontAwesomeIcon icon={faArrowRight} className="w-3" />
					</Link>
				</motion.div>
			</div>

			{/* Charts row */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="lg:col-span-2 bg-black/60 rounded-xl p-5 border border-white/5">
					<h3 className="text-white font-semibold mb-4">
						{isMn ? "Борлуулалтын орлого" : "Sales Revenue"}
					</h3>
					<div className="h-64">
						{chartData.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#333" />
									<XAxis
										dataKey="name"
										stroke="#888"
										tick={{ fill: "#888", fontSize: 12 }}
									/>
									<YAxis
										stroke="#888"
										tick={{ fill: "#888", fontSize: 12 }}
										tickFormatter={(v) => `$${v}`}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "#0a0a0a",
											border: "1px solid #333",
											borderRadius: "8px",
										}}
										labelStyle={{ color: "#fff" }}
										formatter={(v) => [`$${Number(v).toFixed(2)}`, "Revenue"]}
									/>
									<Line
										type="monotone"
										dataKey="revenue"
										stroke="#b91c1c"
										strokeWidth={2}
										dot={{ fill: "#b91c1c" }}
									/>
								</LineChart>
							</ResponsiveContainer>
						) : (
							<div className="flex items-center justify-center h-full text-white/40">
								{isMn ? "Өгөгдөл байхгүй" : "No data yet"}
							</div>
						)}
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.25 }}
					className="bg-black/60 rounded-xl p-5 border border-white/5">
					<h3 className="text-white font-semibold mb-4">
						{isMn ? "Түгээлт" : "Distribution"}
					</h3>
					<div className="h-64">
						{pieData.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={pieData}
										cx="50%"
										cy="50%"
										innerRadius={50}
										outerRadius={80}
										paddingAngle={2}
										dataKey="value"
										label={({ name }) => name}>
										{pieData.map((_, i) => (
											<Cell key={i} fill={COLORS[i % COLORS.length]} />
										))}
									</Pie>
									<Tooltip
										contentStyle={{
											backgroundColor: "#0a0a0a",
											border: "1px solid #333",
											borderRadius: "8px",
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
						) : (
							<div className="flex items-center justify-center h-full text-white/40">
								{isMn ? "Өгөгдөл байхгүй" : "No data yet"}
							</div>
						)}
					</div>
				</motion.div>
			</div>

			{/* Quick links */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Link
					href="/admin/events"
					className="flex items-center gap-4 p-4 bg-black/60 rounded-xl border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 transition-colors">
					<div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
						<FontAwesomeIcon icon={faCalendar} className="text-red-400 w-6" />
					</div>
					<div>
						<p className="text-white font-medium">
							{isMn ? "Үйл ажиллагаа" : "Events"}
						</p>
						<p className="text-white/40 text-sm">
							{stats.activeEvents}/{stats.totalEvents}{" "}
							{isMn ? "идэвхтэй" : "active"}
						</p>
					</div>
					<FontAwesomeIcon icon={faArrowRight} className="text-red-400 w-4 ml-auto" />
				</Link>
				<Link
					href="/admin/orders"
					className="flex items-center gap-4 p-4 bg-black/60 rounded-xl border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 transition-colors">
					<div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
						<FontAwesomeIcon icon={faChartLine} className="text-red-400 w-6" />
					</div>
					<div>
						<p className="text-white font-medium">
							{isMn ? "Захиалгын жагсаалт" : "Order List"}
						</p>
						<p className="text-white/40 text-sm">
							{stats.totalOrders} {isMn ? "захиалга" : "orders"}
						</p>
					</div>
					<FontAwesomeIcon icon={faArrowRight} className="text-red-400 w-4 ml-auto" />
				</Link>
			</motion.div>
		</div>
	);
}
