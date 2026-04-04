"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/useLocale";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowLeft,
	faDollarSign,
	faTicket,
	faMapMarkerAlt,
	faCalendar,
} from "@fortawesome/free-solid-svg-icons";

function formatDate(iso) {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString(undefined, {
		weekday: "long",
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function formatDateTime(iso) {
	if (!iso) return "—";
	return new Date(iso).toLocaleString(undefined, {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function AdminEventDetailPage() {
	const params = useParams();
	const id = params?.id;
	const locale = useLocale();
	const isMn = locale === "mn";
	const [event, setEvent] = useState(null);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;
		let mounted = true;
		(async () => {
			setLoading(true);
			try {
				const [eventRes, ordersRes] = await Promise.all([
					fetch(`/api/events/${id}`),
					fetch(`/api/admin/orders?limit=50&eventId=${id}`),
				]);
				if (!eventRes.ok || !ordersRes.ok) {
					if (!mounted) return;
					setEvent(null);
					return;
				}
				const eventData = await eventRes.json();
				const ordersData = await ordersRes.json();
				if (!mounted) return;
				setEvent(eventData.event);
				setOrders(ordersData.orders || []);
			} catch {
				if (mounted) setEvent(null);
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, [id]);

	if (loading || !event) {
		return (
			<div className="flex items-center justify-center min-h-[300px]">
				<div className="text-white/50 animate-pulse">
					{isMn ? "Уншиж байна..." : "Loading..."}
				</div>
			</div>
		);
	}

	const revenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
	const ticketsSold = orders.reduce((s, o) => s + (o.quantity || 0), 0);
	const remaining = event.ticketLimit != null ? event.ticketLimit - (event.ticketsSold ?? ticketsSold) : null;

	const byDay = {};
	orders.forEach((o) => {
		const d = o.createdAt?.slice(0, 10) || "";
		byDay[d] = (byDay[d] || 0) + (o.quantity || 0);
	});
	const chartData = Object.entries(byDay)
		.map(([date, qty]) => ({ date, sold: qty }))
		.sort((a, b) => a.date.localeCompare(b.date));

	return (
		<div className="space-y-6">
			<Link
				href="/admin/events"
				className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm">
				<FontAwesomeIcon icon={faArrowLeft} />
				{isMn ? "Буцах" : "Back"}
			</Link>

			<p className="text-white/50 text-sm">
				{isMn ? "Үйл ажиллагаа" : "Events"} / {event.title}
			</p>

			{/* Event overview */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 bg-black/60 rounded-xl border border-white/5 overflow-hidden">
					<div className="flex flex-col md:flex-row">
						{event.imageUrl && (
							<div className="relative md:w-1/2 aspect-video md:aspect-auto md:min-h-[200px] bg-black/50">
								<Image
									src={event.imageUrl}
									alt={event.title}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, 50vw"
								/>
							</div>
						)}
						<div className="p-6 flex-1">
							<h1 className="text-2xl font-bold text-white mb-2">{event.title}</h1>
							<p className="text-white/60 text-sm mb-4 line-clamp-3">
								{event.description || "—"}
							</p>
							<div className="space-y-2">
								{event.price != null && (
									<div className="flex items-center gap-2 text-red-400">
										<FontAwesomeIcon icon={faDollarSign} />
										<span>${Number(event.price).toFixed(2)}</span>
									</div>
								)}
								{event.date && (
									<div className="flex items-center gap-2 text-white/80">
										<FontAwesomeIcon icon={faCalendar} />
										<span>{formatDate(event.date)}</span>
									</div>
								)}
								{event.location && (
									<div className="flex items-center gap-2 text-white/80">
										<FontAwesomeIcon icon={faMapMarkerAlt} />
										<span>{event.location}</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					{event.ticketLimit != null && (
						<div className="bg-black/60 rounded-xl border border-white/5 p-5">
							<p className="text-white/60 text-sm mb-1">
								{isMn ? "Үлдсэн тасалбар" : "Available Ticket"}
							</p>
							<p className="text-2xl font-bold text-white">
								{remaining ?? 0} {isMn ? "үлдсэн" : "Left"}
							</p>
							<p className="text-white/40 text-xs mt-1">
								{event.ticketsSold ?? ticketsSold} {isMn ? "борлуулсан" : "sold"}
							</p>
						</div>
					)}

					<div className="bg-black/60 rounded-xl border border-white/5 p-5">
						<p className="text-white/60 text-sm mb-1">
							{isMn ? "Борлуулалтын хураангуй" : "Sales Summary"}
						</p>
						<p className="text-2xl font-bold text-red-400">
							${revenue.toFixed(2)}
						</p>
						<p className="text-white/40 text-xs mt-1">
							{ticketsSold} {isMn ? "тасалбар" : "tickets"}
						</p>
					</div>
				</div>
			</div>

			{/* Chart */}
			{chartData.length > 0 && (
				<div className="bg-black/60 rounded-xl border border-white/5 p-5">
					<h3 className="text-white font-semibold mb-4">
						{isMn ? "Өдөр бүрийн борлуулалт" : "Sales by Day"}
					</h3>
					<div className="h-48">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#333" />
								<XAxis dataKey="date" stroke="#888" tick={{ fill: "#888", fontSize: 10 }} />
								<YAxis stroke="#888" tick={{ fill: "#888", fontSize: 10 }} />
								<Tooltip
									contentStyle={{
										backgroundColor: "#0a0a0a",
										border: "1px solid #333",
										borderRadius: "8px",
									}}
								/>
								<Bar dataKey="sold" fill="#b91c1c" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			)}

			{/* Recent sales */}
			<div className="bg-black/60 rounded-xl border border-white/5 overflow-hidden">
				<h3 className="text-white font-semibold p-4 border-b border-white/10">
					{isMn ? "Сүүлийн борлуулалт" : "Recent Sales"}
				</h3>
				{orders.length === 0 ? (
					<div className="p-8 text-center text-white/50">
						{isMn ? "Борлуулалт байхгүй" : "No sales yet"}
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-white/10">
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										Order ID
									</th>
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										Date
									</th>
									<th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
										Customer
									</th>
									<th className="text-right py-3 px-4 text-white/60 text-sm font-medium">
										Qty
									</th>
									<th className="text-right py-3 px-4 text-white/60 text-sm font-medium">
										Total
									</th>
								</tr>
							</thead>
							<tbody>
								{orders.slice(0, 10).map((o) => (
									<tr
										key={o.id}
										className="border-b border-white/5 hover:bg-white/5">
										<td className="py-3 px-4 text-white font-mono text-sm">
											#{o.id?.slice(-8)}
										</td>
										<td className="py-3 px-4 text-white/80 text-sm">
											{formatDateTime(o.createdAt)}
										</td>
										<td className="py-3 px-4 text-white/80 text-sm">
											{o.userEmail || "—"}
										</td>
										<td className="py-3 px-4 text-right text-white/80">
											{o.quantity} pcs
										</td>
										<td className="py-3 px-4 text-right text-red-400 font-medium">
											${Number(o.totalPrice ?? 0).toFixed(2)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
