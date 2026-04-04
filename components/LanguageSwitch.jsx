"use client";

import { useLocale, setGlobalLocale } from "@/lib/useLocale";

export default function LanguageSwitch() {
	const currentLocale = useLocale();

	const switchTo = (target) => {
		if (target === currentLocale) return;
		setGlobalLocale(target);
	};

	return (
		<div className="flex shrink-0 items-center mr-1 sm:mr-3 md:mr-4 rounded-full border border-red-700 bg-white/80 backdrop-blur px-1 py-0.5 text-[11px] sm:text-xs font-medium shadow-sm">
			<button
				type="button"
				onClick={() => switchTo("en")}
				className={`min-h-11 px-2.5 sm:min-h-0 sm:px-2 py-1.5 sm:py-0.5 rounded-full transition-all touch-manipulation flex items-center justify-center ${
					currentLocale === "en" ? "bg-red-700 text-white" : "text-red-700"
				}`}>
				EN
			</button>
			<button
				type="button"
				onClick={() => switchTo("mn")}
				className={`min-h-11 px-2.5 sm:min-h-0 sm:px-2 py-1.5 sm:py-0.5 rounded-full transition-all touch-manipulation flex items-center justify-center ${
					currentLocale === "mn" ? "bg-red-700 text-white" : "text-red-700"
				}`}>
				MN
			</button>
		</div>
	);
}

