"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlay } from "@fortawesome/free-solid-svg-icons";

export const highlightImages = [
	{
		src: "/image/Derrick rose/DV53LB2VW2NV2YH5Z64ANBRULA.webp",
		videoUrl: "https://www.youtube.com/embed/fwtuHrZj7n4",
		titleEn: "Simeon & Early Chicago Years",
		titleMn: "Simeon ба Чикагогийн анхны жилүүд",
		descEn:
			"Illinois Mr. Basketball and McDonald's All-American at Simeon Career Academy, putting Chicago on notice before the NBA.",
		descMn:
			"Сургуулийнхаа үеэсээ Роуз Simeon Career Academy-д багийг хэд хэдэн удаа аварга болгож, 2007 онд Illinois Mr. Basketball, McDonald's All-American болж Чикагогийн ирээдүйн од гэдгээ харуулсан. NBA-д орохоосоо өмнө л тэр хотын домог болсон байлаа.",
	},
	{
		src: "/image/Derrick rose/XSKNX45UBCGUPDJBRU7FHPXOCY.webp",
		videoUrl: "https://www.youtube.com/embed/NJOnzygeut8",
		titleEn: "Memphis Tigers Final Four Run (2008)",
		titleMn: "Memphis Tigers-ийн Финал Фоурын жил (2008)",
		descEn:
			"Led Memphis to a 38–2 record and the NCAA title game, showcasing his explosiveness on the national stage.",
		descMn:
			"Memphis Tigers-ийг 38–2 амжилт, NCAA аваргын тоглолтод хүргэж, үндэсний тавцанд хурд, тэсрэлтээ бүрэн харуулсан улирал.",
	},
	{
		src: "/image/Derrick rose/00000169-0ce2-dbbe-a16f-4ee272eb0000.webp",
		videoUrl: "https://www.youtube.com/embed/BwkoWyXIH2s",
		titleEn: "2009 Rookie of the Year – Chicago Bulls",
		titleMn: "2009 оны Шилдэг Шинэ тоглогч – Chicago Bulls",
		descEn:
			"Won Rookie of the Year averaging 16.8 points and leading the Bulls back to the playoffs as the hometown hero.",
		descMn:
			"Дунджаар 16.8 оноо авч, Chicago Bulls-ыг плейоффт буцаан авчирсныхаа төлөө 2009 оны Rookie of the Year шагналыг хүртэж, Чикагогийн баатар болсон.",
	},
	{
		src: "/image/Derrick rose/derrick-rose-playing-against-the-celtics-in-2009-playoffs.webp",
		videoUrl: "https://www.youtube.com/embed/sBKwzB48wgc",
		titleEn: "Epic 2009 Playoff Series vs. Celtics",
		titleMn: "2009 оны Celtics-ийн эсрэг домогт плейофф цуврал",
		descEn:
			"Had 36 points and 11 assists in his playoff debut vs. the defending champion Celtics, in one of the greatest first-round series ever.",
		descMn:
			"Цувралын нээх тоглолтод аваргаа хамгаалж байсан Celtics-ийн эсрэг 36 оноо, 11 дамжуулалт гүйцэтгэн, плейоффын түүхэн дэх хамгийн гал гарсан анхны тойргийн нэгийг бүтээсэн.",
	},
	{
		src: "/image/Derrick rose/derrick-rose-mvp-2011.webp",
		videoUrl: "https://www.youtube.com/embed/SMjsWUMWPDM",
		titleEn: "2011 MVP Season – Youngest in NBA History",
		titleMn: "2011 MVP улирал – NBA-ийн түүхэн дэх хамгийн залуу MVP",
		descEn:
			"Averaged 25.0 points and 7.7 assists, leading the Bulls to 62 wins and becoming the youngest MVP at age 22.",
		descMn:
			"22-хон насандаа 25.0 оноо, 7.7 дамжуулалт дунджилж, Bulls-ыг 62 хожилтой болгосноор NBA-ийн түүхэн дэх хамгийн залуу MVP болсон домогт улирал.",
	},
	{
		src: "/image/Derrick rose/61hy-fsbcoL._AC_UF894,1000_QL80_.jpg",
		videoUrl: "https://www.youtube.com/embed/1NUsDzeD1Pk",
		titleEn: "Poster Dunks & Fearless Drives",
		titleMn: "Дээрээс дайрсан донжтой данкны жилүүд",
		descEn:
			"Known for attacking the rim fearlessly against big men like Joel Przybilla and Goran Dragic, creating timeless posters.",
		descMn:
			"Joel Przybilla, Goran Dragić зэрэг өндөр төвүүдийн дээрээс айхгүй дайрч, фенүүдийн хананд өнөө ч өлгөөтэй байдаг poster dunk-уудыг бэлэглэсэн мөчүүд.",
	},
	{
		src: "/image/Derrick rose/AP564933399780.webp",
		videoUrl: "https://www.youtube.com/embed/-oOm-WvPgAc",
		titleEn: "2015 Game-Winner vs. Cavaliers",
		titleMn: "2015 онд Cavaliers-ийн эсрэг game-winner",
		descEn:
			"Hit a bank three at the buzzer over the Cavs in the 2015 playoffs, reminding the league of his clutch gene.",
		descMn:
			"2015 оны плейоффт Cavaliers-ийн эсрэг шатан дээр самбар данхран орсон three-pointer game-winner шидэж, clutch хэвээрээ гэдгээ лигт сануулсан.",
	},
	{
		src: "/image/Derrick rose/69eeb63587d4227ea2d1d4b11f74c5e4c1ba730cf06a3d974b1a1efe816e8d32.webp",
		videoUrl: "https://www.youtube.com/embed/6BgJKC1vAV4",
		titleEn: "2018 – 50-Point Game vs. Jazz",
		titleMn: "2018 – 50 онооны тоглолт (Jazz-ийн эсрэг)",
		descEn:
			"An emotional 50-point performance with the Minnesota Timberwolves, symbolizing Derrick Rose's perseverance after years of injuries.",
		descMn:
			"Миннесота Timberwolves-т тоглож байхдаа Роуз олон жилийн гэмтлийн дараах тэмцлийн бэлгэдэл болсон 50 онооны тоглолтыг (2018.10.31) үзүүлсэн. Энэ шөнө түүний тэсвэр хатуужлыг харуулсан, фенүүдийн хувьд зүгээр нэг статистик биш, түүхэн эргэн ирэлт байлаа.",
	},
	{
		src: "/image/Derrick rose/9d5bdade5dd54e5aa94ec0c937241154.jpeg",
		videoUrl: "https://www.youtube.com/embed/gypuGgxFsWc",
		titleEn: "Veteran Spark with the New York Knicks",
		titleMn: "New York Knicks-т ахмад тоглогчийн оч ширээсэн жилүүд",
		descEn:
			"Provided leadership and instant offense off the bench, helping the Knicks reach the playoffs and stabilize a young core.",
		descMn:
			"New York Knicks-д сэлгээнээс орж ирээд тоглолтын хэмнэл өөрчилдөг, залуу бүрэлдэхүүнд туршлагатай тоглогчийн манлайлал үзүүлснээр багийг плейоффт хүргэхэд чухал үүрэг гүйцэтгэсэн.",
	},
	{
		src: "/image/Derrick rose/G4YCEvAW4AAftD0.jpeg",
		videoUrl: "https://www.youtube.com/embed/Wqid5y3NfeI",
		titleEn: "2025 Jersey Retirement – Chicago",
		titleMn: "2025 онд дугаарыг нь өндөрт өргөсөн мөч",
		descEn:
			"The Chicago Bulls honored Rose by raising his No. 1 jersey to the rafters, cementing his legacy in his hometown franchise.",
		descMn:
			"Chicago Bulls баг 1 дугаарыг нь United Center-ийн таазанд өлгөж, Чикагогийн хүүгийн домгийг албан ёсоор мөнхөлсөн 2025 оны сэтгэл хөдөлгөм ёслол.",
	},
];

const legacyStats = [
	{ value: "1x", labelEn: "MVP", labelMn: "MVP" },
	{ value: "50", labelEn: "Points (2018)", labelMn: "Оноо (2018)" },
	{ value: "2009", labelEn: "ROTY", labelMn: "ROTY" },
	{ value: "2025", labelEn: "Jersey #1 Retired", labelMn: "1 дугаар тэтгэвэр" },
];

export default function HighlightsPage() {
	const locale = useLocale();
	const isMn = locale === "mn";

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const scrollAnimation = {
		initial: { opacity: 0, y: 30 },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, margin: "-50px" },
		transition: { duration: 0.5, ease: "easeOut" },
	};

	const cardAnimation = {
		initial: { opacity: 0, y: 40 },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, margin: "-30px" },
		transition: { duration: 0.4, ease: "easeOut" },
	};

	return (
		<main className="min-h-screen w-screen bg-gradient-to-b from-black/85 via-neutral-950/90 to-black/85 text-white overflow-hidden">
			{/* Hero – court-style split layout */}
			<motion.section
				className="relative min-h-[70vh] md:min-h-[80vh] flex flex-col md:flex-row px-4 md:px-12 lg:px-20 pt-28 md:pt-32 pb-16 md:pb-0"
				{...scrollAnimation}>
				<div className="flex-1 flex flex-col justify-center md:pr-8 lg:pr-12 z-10">
					<p className="text-sm font-medium uppercase tracking-[0.3em] text-red-500 mb-2">
						{isMn ? "ХУРД. ЗҮРХ. ДОМОГ." : "SPEED. HEART. LEGACY."}
					</p>
					<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
						<span className="block">
							{isMn ? "КАРЬЕРИЙН ОРГИЛ" : "CAREER HIGHLIGHTS"}
						</span>
						<span className="block mt-1 text-gray-400 font-bold">
							{isMn ? "ДЕРРИК РОУЗ" : "DERRICK ROSE"}
						</span>
					</h1>
					<div className="flex flex-wrap gap-3 mt-8">
						<a
							href="https://youtu.be/k1eXAevhUGc?si=KNRn_ZDxiYFGXnBt"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-red-600 text-white font-medium text-sm hover:bg-red-500 transition-colors">
							<FontAwesomeIcon icon={faPlay} className="text-xs" />
							{isMn ? "Бүрэн highlight үзэх" : "Watch full highlights"}
						</a>
						<a
							href="https://www.youtube.com/watch?v=OhLNpNtzxNY"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-red-600 text-red-500 font-medium text-sm hover:bg-red-600/10 transition-colors group">
							{isMn ? "Jersey retirement video" : "Jersey retirement"}
							<FontAwesomeIcon
								icon={faArrowRight}
								className="text-xs group-hover:translate-x-1 transition-transform"
							/>
						</a>
					</div>
				</div>
				<div className="relative w-full md:w-[45%] lg:w-[50%] min-h-[40vh] md:min-h-[65vh] mt-8 md:mt-0 md:absolute md:right-8 lg:right-12 md:top-1/2 md:-translate-y-1/2">
					<div className="relative w-full h-full min-h-[280px] md:min-h-[450px] rounded-xl overflow-hidden shadow-2xl ring-2 ring-red-600/30 bg-black">
						<Image
							src="/image/Derrick rose/maxresdefault (1).jpg"
							alt={isMn ? "Career highlights зураг" : "Career highlights image"}
							fill
							sizes="(max-width: 768px) 100vw, 45vw"
							className="object-cover"
							priority
						/>
					</div>
				</div>
			</motion.section>

			{/* Quote section – "Forged in Steel" style */}
			<motion.section
				className="px-4 md:px-12 lg:px-20 py-16 md:py-24"
				{...scrollAnimation}>
				<div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
					<div className="flex-1">
						<div className="flex items-start gap-3">
							<div className="w-2 h-12 bg-red-600 flex-shrink-0 mt-1" />
							<p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
								{isMn
									? "Чикагогийн хүү, NBA-ийн түүхэн дэх хамгийн залуу MVP, гэмтлийн дараах тэсвэр хатуужлын бэлэгдэл."
									: "Chicago's son, youngest MVP in NBA history, a symbol of resilience through injury."}
							</p>
						</div>
					</div>
					<div className="relative w-full lg:w-[45%] aspect-[4/3] rounded-xl overflow-hidden ring-1 ring-red-600/20">
						<Image
							src="/image/rose_110512.avif"
							alt="Derrick Rose 50 points"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 45vw"
							priority
						/>
					</div>
				</div>
			</motion.section>

			{/* Our Legacy – stats */}
			<motion.section
				className="px-4 md:px-12 lg:px-20 py-12 md:py-16"
				{...scrollAnimation}>
				<h2 className="text-xl md:text-2xl font-bold text-red-500 uppercase tracking-widest mb-8 text-center">
					{isMn ? "Манай домог" : "Our Legacy"}
				</h2>
				<div className="flex flex-wrap justify-center gap-8 md:gap-16">
					{legacyStats.map((stat, idx) => (
						<div
							key={stat.value}
							className="flex flex-col items-center gap-2">
							<span className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
								{stat.value}
							</span>
							<span className="text-sm text-gray-400 uppercase tracking-wider">
								{isMn ? stat.labelMn : stat.labelEn}
							</span>
						</div>
					))}
				</div>
			</motion.section>

			{/* In the Spotlight – highlights grid */}
			<section className="px-4 md:px-12 lg:px-20 pb-24 pt-8">
				<motion.h2
					className="text-xl md:text-2xl font-bold text-red-500 uppercase tracking-widest mb-10 text-center"
					{...scrollAnimation}>
					{isMn ? "Онцлон харуулах" : "In the Spotlight"}
				</motion.h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
					{highlightImages.map((item, idx) => (
						<Link key={item.titleEn} href={`/highlights/${idx}`}>
							<motion.div
								className="group block rounded-xl overflow-hidden bg-neutral-900/60 border border-neutral-700/50 shadow-lg hover:border-red-600/50 hover:shadow-xl transition-all duration-300 h-full"
								{...cardAnimation}
								transition={{
									...cardAnimation.transition,
									delay: idx * 0.06,
								}}>
								<div className="relative w-full aspect-square overflow-hidden bg-neutral-800">
									<Image
										src={item.src}
										alt={isMn ? item.titleMn : item.titleEn}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-500"
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									/>
									<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
										<span className="opacity-0 group-hover:opacity-100 transition-opacity w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center">
											<FontAwesomeIcon icon={faPlay} className="text-white ml-0.5" />
										</span>
									</div>
								</div>
								<div className="p-4">
									<h3 className="font-semibold text-white line-clamp-2 group-hover:text-red-400 transition-colors">
										{isMn ? item.titleMn : item.titleEn}
									</h3>
									<p className="text-xs text-red-500/90 mt-1">
										{isMn ? "Дэлгэрэнгүй үзэх" : "View details"}
									</p>
								</div>
							</motion.div>
						</Link>
					))}
				</div>
			</section>
		</main>
	);
}
