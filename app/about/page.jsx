"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Image from "next/image";
import FixedButton from "@/components/FixedButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Quote from "./components/quote/quote.jsx";
import Skills from "./components/skills/skills.jsx";
import Experience from "./components/experience.jsx";
import Education from "./components/education.jsx";

// images
import Hr from "@/components/Hr";
import About from "./components/about/about.jsx";
import { useLocale } from "@/lib/useLocale";

export default function Page() {
	const locale = useLocale();
	const isMn = locale === "mn";
	const heroSrc = "/image/D.Rose1.webp";

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<>
			<main className="overflow-hidden bg-gradient-to-b from-black/85 via-neutral-950/90 to-black/85 text-white">
				<FixedButton href={isMn ? "/mn/#about" : "/#about"}>
					<FontAwesomeIcon
						icon={faChevronLeft}
						className="text-white pr-4 md:pr-10"
					/>
				</FixedButton>
				<div className="relative h-screen gap-4 p-4 md:p-10 flex justify-center items-center flex-col mb-10 overflow-hidden">
					{/* hero */}
					<div className="z-0 mb-48 md:mb-0  md:absolute top-1/4  md:right-[10%] md:-translate-y-16 ">
						<motion.div
							initial={{ scale: 1 }}
							animate={{ scale: 1.6 }}
							transition={{ ease: "circOut", duration: 1 }}
							className="relative bg-neutral-900 rounded-3xl h-[400px] md:h-[600px] w-[80vw] md:w-[30vw] grayscale hover:grayscale-0 ring-2 ring-red-700/70">
							<Image
								src={heroSrc}
								alt="Derrick Rose"
								fill
								sizes="(max-width: 768px) 80vw, 30vw"
								className="object-cover"
							/>
						</motion.div>
					</div>
					<div className="z-10 w-full absolute md:w-auto md:left-[10%] top-[60%] md:top-1/3 col-span-2 flex flex-col justify-center items-start md:items-start text-start px-10 pt-4 backdrop-filter backdrop-blur-sm md:backdrop-blur-none bg-black/40 md:bg-transparent md:pt-0">
						<h1 className="bg-transparent text-5xl md:text-8xl font-extrabold text-white">
							{isMn ? "Деррик Роуз" : "Derrick Rose"}
						</h1>
						<Hr />
						<p className="title text-xl mt-4 tracking-wider text-gray-200 leading-[1.7rem] mb-5 max-w-[42rem]">
							{isMn ? (
								<>
									Чикагогийн Englewood хорооллоос NCAA, NBA MVP, тэтгэвэр болон
									бизнес, буяны ажлууд хүртэлх Деррик Роузын бүрэн замналыг эндээс
									харах боломжтой.
								</>
							) : (
								<>
									A brief introduction to Derrick Rose&apos;s journey from Chicago&apos;s
									Englewood to NBA MVP, and life beyond basketball.
								</>
							)}
						</p>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, ease: "circOut" }}
							onClick={() => {
								window.scrollTo({
									top: 1000,
									behavior: "smooth",
								});
							}}
							className="mb-3">
							<Button variation="primary">
								{isMn ? "Доош гүйлгэх" : "Scroll Down"}
							</Button>
						</motion.div>
					</div>
				</div>
				{/* end hero */}

				{/* about */}
				<About />
				{/* end about */}

				{/* skills */}
				<Skills />
				{/* end skills */}

				{/* experience */}
				<Experience />
				{/* end experience */}

				{/* Education */}
				<Education />
				{/* end Education */}

				{/* Quote */}
				<Quote />
				{/* end Quote */}
			</main>
		</>
	);
}
