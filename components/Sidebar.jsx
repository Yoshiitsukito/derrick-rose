"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBasketball,
	faStar,
	faStore,
	faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
	{ icon: faBasketball, label: "Go to Home section", targetId: "home" },
	{
		icon: faStar,
		label: "Go to Career Highlights section",
		targetId: "highlights",
	},
	{
		icon: faStore,
		label: "Go to Merch & Business section",
		targetId: "merch",
	},
	{ icon: faPhone, label: "Go to Contact section", targetId: "contact" },
];

const Sidebar = () => {
	const router = useRouter();
	const pathname = usePathname() || "/";

	return (
		<div className="hidden md:flex fixed z-40 bg-black/70 h-[50vh] w-14 flex-col justify-between items-center p-4 left-0 top-1/4 rounded-e-3xl border border-red-700/70">
			<ul
				id="sidebar"
				className="flex flex-col justify-evenly items-center h-full text-gray-50">
				{navItems.map((item) => (
					<li key={item.label}>
						<button
							type="button"
							aria-label={item.label}
							onClick={() => {
								if (typeof document === "undefined") return;

								// Хэрэв home хуудсан дээр байвал шууд scroll хийх
								if (pathname === "/" || pathname === "/en" || pathname === "/mn") {
									const el = document.getElementById(item.targetId);
									if (el) {
										el.scrollIntoView({ behavior: "smooth", block: "start" });
										return;
									}
								}

								// Бусад хуудсаас бол home руу anchor-тайгаар очих
								router.push(`/#${item.targetId}`);
							}}
							className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-red-700/80 transition-colors">
							<FontAwesomeIcon icon={item.icon} className="text-xl" />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
