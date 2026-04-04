"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Hr from "@/components/Hr";
import Button from "@/components/Button";
import { useLocale } from "@/lib/useLocale";
import { highlightImages } from "@/app/highlights/page";

export default function HighlightDetailPage() {
	const { slug } = useParams();
	const locale = useLocale();
	const isMn = locale === "mn";

	const index = useMemo(() => {
		const n = Number(slug);
		return Number.isFinite(n) ? n : -1;
	}, [slug]);

	const highlight =
		index >= 0 && index < highlightImages.length
			? highlightImages[index]
			: null;

	if (!highlight) {
		return (
			<main className="min-h-screen w-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white flex items-center justify-center p-6">
				<p className="text-sm text-gray-300">
					{isMn ? "Энэ highlight олдсонгүй." : "Highlight not found."}
				</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen w-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white flex items-center justify-center p-6 md:p-10">
			<div className="max-w-5xl w-full space-y-8">
				<Button variation="secondary">
					<Link href="/highlights">
						{isMn ? "Highlight руу буцах" : "Back to highlights"}
					</Link>
				</Button>

				<div className="space-y-4">
					<h1 className="text-3xl md:text-4xl font-extrabold">
						{isMn ? highlight.titleMn : highlight.titleEn}
					</h1>
					<Hr />
					<p className="text-gray-200 leading-relaxed">
						{isMn ? highlight.descMn : highlight.descEn}
					</p>
				</div>

				{highlight.videoUrl && (
					<div className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl border border-red-700/60 bg-black">
						<iframe
							className="absolute inset-0 w-full h-full"
							src={highlight.videoUrl}
							title={isMn ? highlight.titleMn : highlight.titleEn}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen
						/>
					</div>
				)}
			</div>
		</main>
	);
}

