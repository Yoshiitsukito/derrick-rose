"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "../app/nprogress.css";

/**
 * App Router-д next/router + Router.events ашиглахгүй (алдаа, [object Event] гэх мэт).
 * Зам өөрчлөгдөх бүрт NProgress ажиллана.
 */
export default function TopProgressbar() {
	const pathname = usePathname();

	useEffect(() => {
		NProgress.configure({ showSpinner: false });
	}, []);

	useEffect(() => {
		NProgress.start();
		const doneTimer = setTimeout(() => {
			NProgress.done();
		}, 280);
		return () => clearTimeout(doneTimer);
	}, [pathname]);

	return null;
}
