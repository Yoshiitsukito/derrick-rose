"use client";

import { useEffect, useState } from "react";

const LOCALE_EVENT = "app:locale-change";

export function useLocale() {
	const [locale, setLocale] = useState("en");

	useEffect(() => {
		if (typeof window === "undefined") return;
		const stored = window.localStorage.getItem("locale");
		if (stored === "mn" || stored === "en") {
			setLocale(stored);
		}

		const handler = (event) => {
			const next = event.detail;
			if (next === "mn" || next === "en") {
				setLocale(next);
			}
		};

		window.addEventListener(LOCALE_EVENT, handler);
		return () => window.removeEventListener(LOCALE_EVENT, handler);
	}, []);

	return locale;
}

export function setGlobalLocale(next) {
	if (typeof window === "undefined") return;
	const value = next === "mn" ? "mn" : "en";
	window.localStorage.setItem("locale", value);
	window.dispatchEvent(new CustomEvent(LOCALE_EVENT, { detail: value }));
}

