"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitch from "./LanguageSwitch";
import { useLocale } from "@/lib/useLocale";
import { useRouter } from "next/navigation";

/* 140vmax: жижиг дэлгэцийг бүрэн хамрах (хуучин 2000px зарим утас дээр дутуу байсан) */
const navVariant = {
	open: {
		clipPath: "circle(140vmax at calc(100% - 1.25rem) 2.75rem)",
		transition: {
			type: "tween",
			duration: 0.5,
			ease: [0.22, 1, 0.36, 1],
		},
	},
	closed: {
		clipPath: "circle(0px at calc(100% - 1.25rem) 2.75rem)",
		transition: {
			delay: 0.3,
			type: "tween",
			duration: 0.3,
			ease: [0.4, 0, 1, 1],
		},
	},
};

const itemVariants = {
	open: (custom) => ({
		opacity: 1,
		x: 0,
		transition: {
			delay: custom,
			type: "tween",
			duration: 0.3,
			ease: [0.22, 1, 0.36, 1],
		},
	}),
	closed: {
		opacity: 0,
		x: -80,
		transition: {
			type: "tween",
			duration: 0.2,
		},
	},
};

const NavItems = ({ isNavOpen, setIsNavOpen }) => {
	const locale = useLocale();
	const pathname = usePathname();
	const isMn = locale === "mn";
	const localePrefix = isMn ? "/mn" : "";
	const [user, setUser] = useState(null);
	const [loadingUser, setLoadingUser] = useState(true);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch("/api/auth/me");
				if (!res.ok) return;
				const data = await res.json();
				if (!mounted) return;
				setUser(data.user);
			} catch {
				// ignore
			} finally {
				if (mounted) setLoadingUser(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [pathname]);

	const handleItemClick = () => setIsNavOpen(false);

	const navLink = (href, label, custom = 0.2) => (
		<Link
			href={href}
			onClick={handleItemClick}
			className="block w-full max-w-md touch-manipulation text-lg sm:text-xl md:text-2xl font-bold text-white py-3.5 sm:py-3 px-4 sm:px-6 text-center active:bg-white/10 rounded-lg">
			<motion.span
				className="text-white block"
				variants={itemVariants}
				animate={isNavOpen ? "open" : "closed"}
				custom={custom}>
				{label}
			</motion.span>
		</Link>
	);

	const navButton = (onClick, label, custom = 0.2) => (
		<button
			type="button"
			onClick={() => {
				onClick();
				handleItemClick();
			}}
			className="text-lg sm:text-xl md:text-2xl font-bold text-white py-3.5 sm:py-3 px-4 sm:px-6 w-full max-w-md text-center touch-manipulation active:bg-white/10 rounded-lg">
			<motion.span
				className="text-white block"
				variants={itemVariants}
				animate={isNavOpen ? "open" : "closed"}
				custom={custom}>
				{label}
			</motion.span>
		</button>
	);

	const isAdmin = user?.role === "admin";

	return (
		<motion.div
			className={`fixed inset-0 z-[45] flex flex-col bg-transparent ${
				isNavOpen ? "pointer-events-auto" : "pointer-events-none"
			}`}
			variants={navVariant}
			animate={isNavOpen ? "open" : "closed"}
			initial={false}
			style={{ willChange: "clip-path" }}>
			<div className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col bg-gray-800/95 opacity-100">
				<div
					className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain px-3 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pt-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)] sm:px-4 md:pt-[calc(4rem+env(safe-area-inset-top,0px)+0.75rem)]">
					<div className="mx-auto flex w-full max-w-md flex-col items-center space-y-3 sm:space-y-5 md:space-y-8 pb-4">
					<motion.h1
						variants={itemVariants}
						animate={isNavOpen ? "open" : "closed"}
						className="text-3xl sm:text-4xl md:text-6xl font-bold text-white text-center px-2">
						{isMn ? "Цэс" : "Menu"}
					</motion.h1>

					{isAdmin ? (
						<>
							{navLink(`${localePrefix || "/"}#home`, isMn ? "Нүүр" : "Home", 0.1)}
							{navLink("/events", isMn ? "Үйл ажиллагаа" : "Events", 0.15)}
							{navLink("/admin/events", isMn ? "Admin Events" : "Admin Events", 0.2)}
							{navLink("/admin/contacts", isMn ? "Admin Contacts" : "Admin Contacts", 0.25)}
							{navLink("/admin", isMn ? "Admin Dashboard" : "Admin Dashboard", 0.3)}
							{navButton(
								async () => {
									try {
										await fetch("/api/auth/logout", { method: "POST" });
									} finally {
										window.location.href = "/";
									}
								},
								isMn ? "Гарах" : "Logout",
								0.35,
							)}
						</>
					) : (
						<>
							{navLink(`${localePrefix || "/"}#home`, isMn ? "Нүүр" : "Home", 0.1)}
							{navLink("/events", isMn ? "Үйл ажиллагаа" : "Events", 0.15)}
							{navLink("/tickets", isMn ? "Миний тасалбар" : "My tickets", 0.2)}
							{!loadingUser && !user &&
								navLink("/auth", isMn ? "Нэвтрэх / Бүртгүүлэх" : "Login / Register", 0.25)}
							{!loadingUser && user &&
								navButton(
									async () => {
										try {
											await fetch("/api/auth/logout", { method: "POST" });
										} finally {
											window.location.href = "/";
										}
									},
									isMn ? "Гарах" : "Logout",
									0.25,
								)}
							{navLink(
								`${localePrefix}/highlights`,
								isMn ? "Карьерийн оргил" : "Career Highlights",
								0.3,
							)}
							{navLink(
								`${localePrefix}/projects`,
								isMn ? "Merch & Business" : "Merch & Business",
								0.35,
							)}
							{navLink(`${localePrefix}/about`, isMn ? "Тухай" : "About", 0.4)}
							{navLink(
								`${localePrefix || "/"}#contact`,
								isMn ? "Холбогдох" : "Contact",
								0.4,
							)}
						</>
					)}
					</div>
				</div>
			</div>
		</motion.div>
	);
};

const Navbar = () => {
	const navRef = useRef(null);
	const [isNavOpen, setIsNavOpen] = useState(false);
	const router = useRouter();

	const toggleNav = () => {
		setIsNavOpen(!isNavOpen);
	};

	return (
		<>
			<nav
				ref={navRef}
				className="navbar fixed left-0 right-0 top-0 z-[60] max-w-[100vw] border-b border-white/5 pt-[env(safe-area-inset-top,0px)] transition-colors duration-500 ease-out backdrop-blur-md backdrop-filter">
				<div
					className={`flex h-14 flex-row items-center justify-between px-3 sm:px-5 md:h-16 md:px-24 ${
						isNavOpen ? "bg-black/40" : "bg-black/20"
					}`}>
					<div className="min-w-0 flex-1 pr-2">
						<h1
							className={`truncate text-base font-semibold tracking-wide transition-colors duration-500 sm:text-lg md:text-2xl ${
								isNavOpen ? "text-white" : "text-red-700"
							}`}>
							DERRICK ROSE
						</h1>
					</div>
					<div className="flex shrink-0 flex-row items-center gap-1 sm:gap-2 md:gap-3">
						<LanguageSwitch />
						<button
							type="button"
							aria-expanded={isNavOpen}
							aria-label={isNavOpen ? "Close menu" : "Open menu"}
							className="burger flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 rounded-md p-2 touch-manipulation"
							onClick={toggleNav}>
							<div
								className={`h-1 w-8 rounded-full transition-all duration-300 ease-out md:w-10 ${
									isNavOpen
										? "translate-y-[5px] rotate-45 bg-white"
										: "bg-red-700"
								}`}></div>
							<div
								className={`h-1 w-8 rounded-full transition-all duration-300 ease-out md:w-10 ${
									isNavOpen ? "-translate-y-[5px] -rotate-45 bg-white" : "bg-red-700"
								}`}></div>
						</button>
					</div>
				</div>
			</nav>
			{/* items */}
			<NavItems isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
		</>
	);
};
export default Navbar;
