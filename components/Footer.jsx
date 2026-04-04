"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";

const supporterLogos = [
	{
		src: "/image/Derrick rose/689347.jpg",
		alt: "Adidas logo",
		title: "Насан туршийн гэрээ, D Rose signature sneaker line",
		href: "https://www.adidas.com",
	},
	{
		src: "/image/Derrick rose/powerade374.logowik.com.webp",
		alt: "Powerade logo",
		title: "Зарим кампанит ажлуудад оролцсон",
		href: "https://www.powerade.com",
	},
	{
		src: "/image/Derrick rose/Beats_Electronics_logo.svg.png",
		alt: "Beats by Dre logo",
		title: "Dr. Dre-ийн брэнд",
		href: "https://www.beatsbydre.com",
	},
	{
		src: "/image/Derrick rose/2K_Sports_Logo.svg.png",
		alt: "2K Sports logo",
		title: "NBA 2K series дээр нүүр царай, сурталчилгаа",
		href: "https://www.2k.com",
	},
	{
		src: "/image/Derrick rose/Wilson_logo.jpg",
		alt: "Wilson logo",
		title: "Спорт тоног төхөөрөмж",
		href: "https://www.wilson.com",
	},
	{
		src: "/image/Derrick rose/giordanos-social-sharing-image.webp",
		alt: "Giordano's logo",
		title: "Chicago-style deep dish pizza franchise-д хөрөнгө оруулсан",
		href: "https://www.giordanos.com",
	},
	{
		src: "/image/Derrick rose/derrick-rose-logo-png_seeklogo-352101.png",
		alt: "Rose's Flower Shop logo",
		title: "Rose's Flower Shop (цэцгийн дэлгүүр)",
		href: "https://rosesflowershop.com",
	},
	{
		src: "/image/Derrick rose/Uninterrupted.jpeg.jpeg",
		alt: "Uninterrupted logo",
		title: "Тамирчдын түүх, контент платформд оролцсон",
		href: "https://uninterrupted.com",
	},
	{
		src: "/image/Derrick rose/1753384531489-Coco5_Logo_Cherry_Web.webp",
		alt: "Coco5 logo",
		title: "Active hydration (Coco5)",
		href: "https://coco5.com",
	},
];

export default function Footer() {
	return (
		<div className="flex justify-center items-center flex-col mt-5 overflow-hidden px-4">
			<div className="flex justify-center items-center flex-col mt-5 self-center min-h-[50vh] border-b-2 min-w-[80vw] ">
				<Link href="/#contact">
					<motion.h2
						className="text-base md:text-xl font-medium mt-3 text-center text-gray-400  hover:underline whitespace-nowrap leading-none md:tracking-[0.5rem]"
						initial={{
							opacity: 0,
							x: -100,
						}}
						whileInView={{
							opacity: 1,
							x: 0,
						}}
						transition={{
							delay: 0.2,
						}}>
						Want something like this?
					</motion.h2>
					<motion.h1
						className="text-3xl md:text-5xl lg:text-7xl font-medium mt-3  hover:underline whitespace-nowrap leading-none text-center"
						initial={{
							opacity: 0,
							x: 100,
						}}
						whileInView={{
							opacity: 1,
							x: 0,
						}}
						transition={{
							delay: 0.5,
						}}>
						Get In Touch{" "}
						<FontAwesomeIcon
							icon={faArrowAltCircleRight}
							className="text-2xl md:text-5xl ml-2 "
						/>
					</motion.h1>
				</Link>
			</div>

			<div className="w-full max-w-[1000px] px-2 md:px-0 mt-8 pb-2">
				<motion.h3
					className="text-center text-gray-400 text-sm md:text-base mb-4 uppercase tracking-[0.25em]"
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}>
					Supporters / Partners
				</motion.h3>

				<div className="flex flex-wrap justify-center gap-4 md:gap-6">
					{supporterLogos.map((logo) => {
						const boxClassName =
							"w-[120px] h-[60px] md:w-[140px] md:h-[70px] flex items-center justify-center bg-neutral-950/40 rounded-lg border border-red-700/20";

						if (logo.href) {
							return (
								<a
									key={logo.src}
									aria-label={logo.alt}
									className={boxClassName}
									href={logo.href}
									target="_blank"
									rel="noopener noreferrer">
									<Image
										src={logo.src}
										alt={logo.alt}
										width={140}
										height={70}
										className="object-contain w-10/12 h-10/12"
									/>
								</a>
							);
						}

						return (
							<div
								key={logo.src}
								aria-label={logo.alt}
								className={boxClassName}>
								<Image
									src={logo.src}
									alt={logo.alt}
									width={140}
									height={70}
									className="object-contain w-10/12 h-10/12"
								/>
							</div>
						);
					})}
				</div>
			</div>

			<footer className="flex justify-center items-center flex-col my-5 self-start px-4">
				<p className="text-gray-800 text-xs md:text-sm text-center">
					&copy;{new Date().getFullYear()} -{" "}
					<span className="text-gray-700 text-sm md:text-lg">Derrick Rose</span>
				</p>
			</footer>
		</div>
	);
}
