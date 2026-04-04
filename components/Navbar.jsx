"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitch from "./LanguageSwitch";
import { useLocale } from "@/lib/useLocale";
import { useRouter } from "next/navigation";

const navVariant = {
	open: {
		clipPath: "circle(2000px at calc(100% - 40px) 40px)",
		transition: {
			type: "tween",
			duration: 0.5,
			ease: [0.22, 1, 0.36, 1],
		},
	},
	closed: {
		clipPath: "circle(0px at calc(100% - 40px) 40px)",
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
		<Link href={href}>
			<div
				onClick={handleItemClick}
				className="text-xl md:text-2xl font-bold text-white py-3 px-6 w-full text-center">
				<motion.h2
					className="text-white"
					variants={itemVariants}
					animate={isNavOpen ? "open" : "closed"}
					custom={custom}>
					{label}
				</motion.h2>
			</div>
		</Link>
	);

	const navButton = (onClick, label, custom = 0.2) => (
		<button
			type="button"
			onClick={onClick}
			className="text-xl md:text-2xl font-bold text-white py-3 px-6 w-full text-center">
			<motion.h2
				className="text-white"
				variants={itemVariants}
				animate={isNavOpen ? "open" : "closed"}
				custom={custom}>
				{label}
			</motion.h2>
		</button>
	);

	const isAdmin = user?.role === "admin";

	return (
		<motion.div
			className="fixed z-[45] w-full h-screen flex items-center justify-center transition-all ease duration-700 overflow-hidden"
			variants={navVariant}
			animate={isNavOpen ? "open" : "closed"}
			initial={false}>
			<div className="relative opacity-95 flex flex-col items-center min-h-[100vh] bg-gray-800 min-w-[100vw]">
				<div className="flex flex-col items-center space-y-8 my-auto mx-0 z-50 px-4">
					<motion.h1
						variants={itemVariants}
						animate={isNavOpen ? "open" : "closed"}
						className="text-4xl md:text-6xl font-bold text-white text-center">
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
				className={`navbar px-4 md:px-24 w-screen fixed transition-colors ease duration-500 backdrop-filter backdrop-blur-md inset-0 flex flex-row justify-between items-center h-14 md:h-16 z-50`}>
				<div>
					<h1
						className={`text-lg md:text-2xl ml-2 md:ml-0 font-semibold tracking-wide transition-colors ease duration-500 ${
							isNavOpen ? "text-white" : "text-red-700"
						}`}>
						DERRICK ROSE
					</h1>
				</div>
				<div className="flex flex-row items-center gap-2 md:gap-0">
					<LanguageSwitch />
					<button
						aria-label={isNavOpen ? "Close menu" : "Open menu"}
						className="burger button flex flex-col justify-center items-center space-y-1.5 p-2"
						onClick={toggleNav}>
						<div
							className={`w-8 md:w-10 h-1 rounded-full transition-all ease duration-300 ${
								isNavOpen
									? "rotate-45 bg-white translate-y-[2px]"
									: "bg-red-700"
							}`}></div>
						<div
							className={`w-8 md:w-10 h-1 rounded-full transition-all ease duration-300 ${
								isNavOpen ? "-rotate-45 -translate-y-2 bg-white" : "bg-red-700"
							}`}></div>
					</button>
				</div>
			</nav>
			{/* items */}
			<NavItems isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
		</>
	);
};
export default Navbar;
