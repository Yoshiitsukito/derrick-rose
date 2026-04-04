"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import BackgroundScroll from "./BackgroundScroll";
import Footer from "./Footer";

export default function ConditionalLayout({ children }) {
	const pathname = usePathname();
	const isAdmin = pathname?.startsWith("/admin");

	if (isAdmin) {
		return <>{children}</>;
	}

	return (
		<BackgroundScroll>
			<Navbar />
			<Sidebar />
			{children}
			<Footer />
			<Chat />
		</BackgroundScroll>
	);
}
