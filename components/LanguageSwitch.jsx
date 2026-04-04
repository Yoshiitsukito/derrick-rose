"use client";

import { useLocale, setGlobalLocale } from "@/lib/useLocale";

export default function LanguageSwitch() {
	const currentLocale = useLocale();

	const switchTo = (target) => {
		if (target === currentLocale) return;
		setGlobalLocale(target);
	};

	return (
		<div className="flex items-center mr-4 rounded-full border border-red-700 bg-white/80 backdrop-blur px-1 py-0.5 text-xs font-medium shadow-sm">
			<button
				type="button"
				onClick={() => switchTo("en")}
				className={`px-2 py-0.5 rounded-full transition-all ${
					currentLocale === "en" ? "bg-red-700 text-white" : "text-red-700"
				}`}>
				EN
			</button>
			<button
				type="button"
				onClick={() => switchTo("mn")}
				className={`px-2 py-0.5 rounded-full transition-all ${
					currentLocale === "mn" ? "bg-red-700 text-white" : "text-red-700"
				}`}>
				MN
			</button>
		</div>
	);
}

