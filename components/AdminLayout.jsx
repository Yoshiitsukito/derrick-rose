"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/lib/useLocale";
import {
	faChartLine,
	faCalendar,
	faListUl,
	faUsers,
	faEnvelope,
	faBars,
	faMagnifyingGlass,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const navItems = [
	{ href: "/admin", labelKey: "Dashboard", icon: faChartLine },
	{ href: "/admin/events", labelKey: "Events", icon: faCalendar },
	{ href: "/admin/orders", labelKey: "OrderList", icon: faListUl },
	{ href: "/admin/customers", labelKey: "Customers", icon: faUsers },
	{ href: "/admin/contacts", labelKey: "Contacts", icon: faEnvelope },
];

export default function AdminLayout({ children }) {
	const pathname = usePathname();
	const router = useRouter();
	const locale = useLocale();
	const isMn = locale === "mn";
	const [user, setUser] = useState(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const labels = {
		Dashboard: isMn ? "Dashboard" : "Dashboard",
		Events: isMn ? "Үйл ажиллагаа" : "Events",
		OrderList: isMn ? "Захиалгын жагсаалт" : "Order List",
		Customers: isMn ? "Хэрэглэгчид" : "Customers",
		Contacts: isMn ? "Холбоо барих" : "Contacts",
	};

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const controller = new AbortController();
				const timeout = setTimeout(() => controller.abort(), 10000);
				let res;
				try {
					res = await fetch("/api/auth/me", {
						credentials: "include",
						signal: controller.signal,
					});
				} finally {
					clearTimeout(timeout);
				}
				if (!res.ok) {
					if (!mounted) return;
					router.replace("/auth");
					return;
				}
				const data = await res.json();
				if (!mounted) return;
				setUser(data.user);
				if (data.user?.role !== "admin") {
					router.replace("/");
				}
			} catch {
				if (mounted) router.replace("/auth");
			}
		})();
		return () => { mounted = false; };
	}, [pathname, router]);

	if (!user) {
		return (
			<div className="min-h-screen bg-[#020617] flex items-center justify-center">
				<div className="text-white/70 animate-pulse">
					{isMn ? "Уншиж байна..." : "Loading..."}
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#020617] flex">
			{/* Sidebar */}
			<aside
				className={`${
					sidebarOpen ? "w-64" : "w-20"
				} flex-shrink-0 bg-[#0a0a0a] border-r border-red-900/40 transition-all duration-300 flex flex-col`}>
				{/* Logo */}
				<div className="p-4 flex items-center gap-3 border-b border-red-900/30">
					<div className="w-10 h-10 rounded-lg bg-red-700/30 flex items-center justify-center flex-shrink-0">
						<span className="text-red-500 font-bold text-lg">DR</span>
					</div>
					{sidebarOpen && (
						<span className="font-bold text-white truncate">
							Derrick Rose Admin
						</span>
					)}
				</div>

				{/* Main Menu */}
				<div className="p-3 flex-1">
					{sidebarOpen && (
						<p className="text-white/40 text-xs uppercase tracking-wider px-3 py-2">
							Main Menu
						</p>
					)}
					<nav className="space-y-0.5">
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
										isActive
											? "bg-red-700/20 text-red-400 border-l-2 border-red-600"
											: "text-white/70 hover:bg-white/5 hover:text-white"
									}`}>
									<FontAwesomeIcon icon={item.icon} className="w-5 flex-shrink-0" />
									{sidebarOpen && (
										<span className="truncate">{labels[item.labelKey]}</span>
									)}
								</Link>
							);
						})}
					</nav>

					{/* CTA */}
					<div className="mt-6">
						<Link
							href="/admin"
							className="flex items-center gap-3 px-3 py-3 rounded-lg bg-red-700/20 hover:bg-red-700/30 text-red-400 transition-colors border border-red-700/40">
							<span className="flex-1 truncate text-sm font-medium">
								{sidebarOpen && (isMn ? "Тайлан харах" : "Get summary report now")}
							</span>
							<FontAwesomeIcon icon={faChevronRight} className="w-4 flex-shrink-0" />
						</Link>
					</div>
				</div>

				{/* Footer */}
				<div className="p-3 border-t border-red-900/30">
					{sidebarOpen && (
						<p className="text-white/30 text-xs">
							© {new Date().getFullYear()} Derrick Rose
						</p>
					)}
				</div>
			</aside>

			{/* Main */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Header */}
				<header className="h-14 flex items-center gap-4 px-4 bg-[#020617] border-b border-red-900/30">
					<button
						type="button"
						onClick={() => setSidebarOpen((o) => !o)}
						className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
						<FontAwesomeIcon icon={faBars} className="w-5" />
					</button>
					<div className="flex-1 flex items-center gap-3">
						<span className="text-white font-medium truncate">
							{(() => {
								const sorted = [...navItems].sort(
									(a, b) => b.href.length - a.href.length,
								);
								const item = sorted.find(
									(n) => pathname === n.href || pathname.startsWith(n.href + "/"),
								);
								return item ? labels[item.labelKey] : "Admin";
							})()}
						</span>
						<div className="hidden sm:flex flex-1 max-w-md">
							<div className="relative flex-1">
								<input
									type="search"
									placeholder={isMn ? "Хайх..." : "Search here"}
									className="w-full pl-3 pr-10 py-2 bg-black/40 border border-red-900/40 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:ring-1 focus:ring-red-600/50"
								/>
								<FontAwesomeIcon
									icon={faMagnifyingGlass}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 w-4"
								/>
							</div>
						</div>
					</div>
				<div className="flex items-center gap-2">
						<Link
							href="/"
							className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
							<div className="w-8 h-8 rounded-full bg-red-700/30 flex items-center justify-center text-red-400 text-sm font-medium">
								{user?.email?.[0]?.toUpperCase() || "A"}
							</div>
							{sidebarOpen && (
								<span className="text-white/90 text-sm truncate max-w-[120px]">
									{user?.email}
								</span>
							)}
						</Link>
					</div>
				</header>

				{/* Content */}
				<main className="flex-1 p-4 overflow-auto">{children}</main>
			</div>
		</div>
	);
}
