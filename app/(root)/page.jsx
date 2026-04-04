// Copyright (C) 2025 Alvalen Bilyunazra
// This file is part of Alvalens-porto-2-nextJs.
// Licensed under the GNU GPL v3.0. See LICENSE for details.

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// components
import Button from "@/components/Button";
import Hr from "@/components/Hr";
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useLocale } from "@/lib/useLocale";

function ContactForm() {
	const [form, setForm] = useState({ name: "", email: "", message: "" });
	const [status, setStatus] = useState("idle"); // idle | loading | success | error
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatus("loading");
		setError("");
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error || "Failed to send message");
			}
			setStatus("success");
			setForm({ name: "", email: "", message: "" });
		} catch (err) {
			setStatus("error");
			setError(err.message || "Something went wrong. Please try again.");
		}
	};

	return (
		<div className="mt-6 w-full max-w-xl bg-neutral-900/90 backdrop-blur-sm rounded-lg shadow-md p-6 border border-red-700/60">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="name" className="block text-sm font-medium text-gray-700">
						Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						value={form.name}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border border-gray-700 px-3 py-2 text-sm shadow-sm focus:border-red-700 focus:ring-red-700 bg-neutral-950 text-white"
					/>
				</div>
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						value={form.email}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border border-gray-700 px-3 py-2 text-sm shadow-sm focus:border-red-700 focus:ring-red-700 bg-neutral-950 text-white"
					/>
				</div>
				<div>
					<label htmlFor="message" className="block text-sm font-medium text-gray-700">
						Message
					</label>
					<textarea
						id="message"
						name="message"
						rows={4}
						required
						value={form.message}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border border-gray-700 px-3 py-2 text-sm shadow-sm focus:border-red-700 focus:ring-red-700 bg-neutral-950 text-white resize-none"
					/>
				</div>
					<Button
						type="submit"
						variation="primary"
						disabled={status === "loading"}
						className="w-full">
						<span className="block w-full text-center">
							{status === "loading" ? "Sending..." : "Send Message"}
						</span>
					</Button>
				{status === "success" && (
					<p className="text-sm text-green-600">Message sent successfully.</p>
				)}
				{status === "error" && (
					<p className="text-sm text-red-600">
						{error || "Failed to send message. Please try again."}
					</p>
				)}
			</form>
			<div className="mt-4 flex items-center space-x-4">
				<span className="text-sm font-medium text-gray-600">Official socials:</span>
				<a
					href="https://www.instagram.com/drose/"
					target="_blank"
					rel="noopener noreferrer"
					className="flex justify-center items-center bg-gray-700 w-10 h-10 rounded-full text-gray-100 hover:bg-gray-400 transition-all ease-in-out duration-300"
					aria-label="Derrick Rose Instagram">
					<FontAwesomeIcon icon={faInstagram} className="text-xl" />
				</a>
				<a
					href="https://twitter.com/drose"
					target="_blank"
					rel="noopener noreferrer"
					className="flex justify-center items-center bg-gray-700 w-10 h-10 rounded-full text-gray-100 hover:bg-gray-400 transition-all ease-in-out duration-300"
					aria-label="Derrick Rose Twitter">
					<FontAwesomeIcon icon={faGithub} className="text-xl" />
				</a>
			</div>
		</div>
	);
}

function ScrollIndicator() {
	return (
		<AnimatePresence>
			<motion.div
				className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.6, delay: 1.2 } }}
				exit={{ opacity: 0, transition: { duration: 0.4 } }}>
				<span className="text-[10px] uppercase tracking-[4px] text-gray-500 font-medium">
					Scroll
				</span>
				<motion.div
					className="w-[1.5px] h-14 bg-gray-500 origin-top"
					animate={{
						scaleY: [0, 1, 1],
						opacity: [0, 1, 0],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: "easeInOut",
						times: [0, 0.5, 1],
					}}
				/>
			</motion.div>
		</AnimatePresence>
	);
}

const MyPage = () => {
	const locale = useLocale();
	const isMn = locale === "mn";
	const heroSrc = "/image/drose-hero.svg";
	const aboutSrc = "/image/il_570xN.4774126839_7p23.avif";
	const courtSrc = "/image/rose_110512.avif";
	const contactSrc = "/image/240913_SamSmith_DerrickRoseEmotion.jpg";

	return (
		<>
			<section id="home" className="min-h-screen flex items-center py-16 md:py-0">
				<div className="mx-auto w-[90%] md:w-[82%] max-w-screen-2xl grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-10 overflow-hidden bg-gradient-to-br from-black via-neutral-900 to-black rounded-3xl shadow-xl">
					<motion.div
						className="col-span-1 md:col-span-2 flex flex-col justify-center items-center md:items-start text-center md:text-start"
						initial={{ x: -100, opacity: 0 }}
						whileInView={{ x: 0, opacity: 1 }}
						transition={{
							type: "spring",
						}}>
						<div className="block md:hidden col-span-1 mx-auto my-6">
							<div className="bg-slate-500 rounded-full h-48 w-48 md:h-60 md:w-60 grayscale hover:grayscale-0 transition-all ease duration-300">
								<Image
									src={heroSrc}
									width={500}
									height={500}
									className="rounded-full w-full h-full object-cover "
									alt="Derrick Rose portrait"
								/>
							</div>
						</div>
						<motion.h3
							className="uppercase text-lg md:text-xl mb-2 md:mb-3 font-normal text tracking-[.3rem] md:tracking-[.5rem] text-red-500"
							initial={{ x: -100, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{
								delay: 0.2,
								type: "spring",
							}}>
							{isMn ? "Деррик Роуз" : "Derrick Rose"}
						</motion.h3>
						<motion.h1
							className="text-white text-3xl md:text-5xl lg:text-6xl 2xl:text-8xl font-extrabold my-2 md:my-5"
							initial={{ x: -100, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{
								delay: 0.3,
								type: "spring",
							}}>
							{isMn ? "Мэргэжлийн сагсан бөмбөгчин" : "Professional Basketball Player"}
						</motion.h1>
						<motion.p
							className="title text-sm md:text-md 2xl:text-xl mt-3 md:mt-4 tracking-wider text-gray-300 leading-[1.5rem] md:leading-[1.7rem] px-2 md:px-0"
							initial={{ x: -100, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{
								delay: 0.4,
								type: "spring",
							}}>
							{isMn ? (
								<>
									Деррик Роуз бол Чикагогоос төрсөн, 2011 оны NBA MVP болсон
									point guard бөгөөд тэсрэлттэй хурд, бөмбөг эзэмшилт,
									шон дээрх хүчтэй довтолгоогоороо домог болсон тоглогч.
									Энэ сайт нь түүний Englewood-с NBA MVP хүртэлх замнал,
									Bulls-ын оргил үе болон гэмтлийн дараах эргэн ирэлтийг
									танилцуулна.
								</>
							) : (
								<>
									Derrick Rose is a former NBA MVP point guard from Chicago,
									known for his explosive athleticism, clutch performances,
									and resilience through injury. This site highlights his
									journey from Chicago&apos;s South Side and Memphis to the
									2011 MVP season, All-Star years, and veteran role across
									the league.
								</>
							)}
						</motion.p>
						<motion.div
							className="buttons flex flex-row justify-center items-center space-x-4 mt-10"
							initial={{ x: -100, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{
								delay: 0.5,
								type: "spring",
							}}>
							<Button variation="primary">
								<Link href={isMn ? "/mn/about" : "/about"}>
									{isMn ? "Карьерийг үзэх" : "View Career"}
								</Link>
							</Button>
							<Button variation="secondary">
								<Link href={isMn ? "/mn/contact" : "/contact"}>
									{isMn ? "Contact хуудас" : "Contact page"}
								</Link>
							</Button>
						</motion.div>
					</motion.div>
					<motion.div
						className="hidden md:flex col-span-1 mx-auto justify-center items-center "
						initial={{ x: 100, opacity: 0 }}
						whileInView={{ x: 0, opacity: 1 }}
						transition={{
							delay: 0.7,
							type: "spring",
						}}>
						<div className="rounded-full h-auto w-auto max-w-[26vw] lg:px-12 grayscale hover:grayscale-0 transition-all ease duration-300 ring-4 ring-red-700/70">
							<Image
								src={heroSrc}
								width={400}
								height={550}
								alt="Derrick Rose portrait"
								className="rounded-full w-full h-full object-cover"
							/>
						</div>
					</motion.div>
				</div>
			</section>
			<section id="highlights" className="min-h-screen flex items-center py-16 md:py-0">
				<div className="relative md:h-screen w-screen gap-4 p-6 sm:p-10 flex flex-col justify-center items-center overflow-visible md:overflow-hidden pb-10 md:pb-0">
					<div className="z-0 mb-8 md:mb-0  md:absolute md:top-1/2  md:right-[10%] md:-translate-y-1/2">
						<motion.div
							className="relative bg-neutral-900 rounded-3xl h-[300px] md:h-[60vh] w-[85vw] md:w-[30vw] grayscale hover:grayscale-0 ring-2 ring-red-700/70"
							initial={{
								x: 300,
								opacity: 0,
								z: -100,
							}}
							whileInView={{
								x: 0,
								opacity: 1,
								z: 0,
							}}
							transition={{
								delay: 0.5,
								type: "spring",
								stiffness: 100,
								damping: 20,
							}}>
							<Image
								src={aboutSrc}
								fill
								sizes="(max-width: 768px) 85vw, 30vw"
								className="object-cover"
								alt="Derrick Rose off-court"
							/>
						</motion.div>
					</div>
					<div className="z-10 w-full relative md:absolute md:w-auto md:left-[10%] md:top-1/3 mt-8 md:mt-0 col-span-2 flex flex-col justify-center items-start md:items-start text-start px-4 sm:px-10 pb-2 overflow-visible">
						<motion.h1
							className="bg-transparent text-white px-3 md-px-0 text-3xl md:text-8xl font-bold"
							initial={{ x: -100, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{
								delay: 0.1,
								type: "spring",
							}}>
							{isMn ? "Карьерийн оргил" : "Career Highlights"}
						</motion.h1>
						<Hr />
						<motion.p
							className="title  text-base md:text-xl mt-3 md:mt-4 tracking-wider text-gray-300 leading-[1.5rem] md:leading-[1.7rem] mb-4 md:mb-5 max-w-[42rem]"
							initial={{ x: -100, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{
								delay: 0.2,
								type: "spring",
							}}>
							{isMn
								? "Rookie of the Year-ээс эхлээд 2011 оны MVP улирал, Timberwolves-тэй 50 онооны шөнө хүртэлх түүний мартагдашгүй мөчүүдийг богино байдлаар танилцуулна."
								: "From Rookie of the Year to the 2011 MVP season and his 50-point night in Minnesota, a snapshot of the moments that defined his career."}
						</motion.p>
						<motion.div
							initial={{ y: 40, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							transition={{
								delay: 0.3,
								type: "spring",
							}}>
							<Button variation="primary">
								<Link href={isMn ? "/mn/highlights" : "/highlights"}>
									{isMn ? "Highlight-уудыг үзэх" : "View Highlights"}
								</Link>
							</Button>
						</motion.div>
					</div>
				</div>
			</section>
			<section id="merch" className="min-h-screen flex items-center py-16 md:py-0">
				<div className="relative md:h-screen w-screen gap-4 p-6 sm:p-10 flex flex-col justify-center items-center overflow-visible md:overflow-hidden pb-10 md:pb-0">
					<div className="z-0 mb-8 md:mb-0  md:absolute md:top-1/2  md:right-[10%] md:-translate-y-1/2">
						<motion.div
							className="relative bg-neutral-900 rounded-3xl h-[300px] md:h-[60vh] w-[85vw] md:w-[30vw] grayscale hover:grayscale-0 ring-2 ring-red-700/70"
							initial={{
								x: 300,
								opacity: 0,
								z: -100,
							}}
							whileInView={{
								x: 0,
								opacity: 1,
								z: 0,
							}}
							transition={{
								delay: 0.5,
								type: "spring",
								stiffness: 100,
								damping: 20,
							}}>
							<Image
								src={courtSrc}
								fill
								sizes="(max-width: 768px) 85vw, 30vw"
								className="object-cover"
								alt="Derrick Rose highlights"
							/>
						</motion.div>
					</div>
					<div className="z-10 w-full relative md:absolute md:w-auto md:left-[10%] md:top-1/3 mt-8 md:mt-0 col-span-2 flex flex-col justify-center items-start md:items-start text-start px-4 sm:px-10 pb-2 overflow-visible">
						<motion.h1
							className="bg-transparent text-white px-3 md-px-0 text-3xl md:text-8xl font-bold"
							initial={{ x: -100, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{
								delay: 0.1,
								type: "spring",
							}}>
							{isMn ? "Merch & Business" : "Merch & Business"}
						</motion.h1>
						<Hr />
						<motion.p
							className="title  text-base md:text-xl mt-3 md:mt-4 tracking-wider text-gray-300 leading-[1.5rem] md:leading-[1.7rem] mb-4 md:mb-5 max-w-[42rem]"
							initial={{ x: -100, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{
								delay: 0.2,
								type: "spring",
							}}>
							{isMn
								? "Bulls-тай хамтарсан The Rose Collection, Rose’s Flower Shop, Adidas D Rose, Coco5 зэрэг merch болон бизнесийн замналыг товч танилцуулна."
								: "A quick look at The Rose Collection with the Bulls, Rose’s Flower Shop, Adidas D Rose line, Coco5 and other off-court ventures."}
						</motion.p>
						<motion.div
							initial={{ y: 40, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							transition={{
								delay: 0.3,
								type: "spring",
							}}>
							<Button variation="primary">
								<Link href={isMn ? "/mn/projects" : "/projects"}>
									{isMn ? "Merch & Business" : "Learn More"}
								</Link>
							</Button>
						</motion.div>
					</div>
				</div>
			</section>
			<section id="contact" className="min-h-screen flex items-center">
				<div className="relative md:h-screen w-screen gap-4 p-6 sm:p-10 flex flex-col justify-center items-center overflow-visible md:overflow-hidden pb-10 md:pb-0">
					<div className="z-0 mb-48 md:mb-0  md:absolute md:top-1/2  md:right-[10%] md:-translate-y-1/2">
						<motion.div
							className="relative bg-neutral-900 rounded-3xl h-[400px] md:h-[60vh] w-[80vw] md:w-[30vw] grayscale hover:grayscale-0 ring-2 ring-red-700/70"
							initial={{
								x: 300,
								opacity: 0,
								z: -100,
							}}
							whileInView={{
								x: 0,
								opacity: 1,
								z: 0,
							}}
							transition={{
								delay: 0.5,
								type: "spring",
								stiffness: 100,
								damping: 20,
							}}>
							<Image
								src={contactSrc}
								fill
								sizes="(max-width: 768px) 80vw, 30vw"
								className="object-cover"
								alt="Derrick Rose community work"
							/>
						</motion.div>
					</div>
					<div className="z-10 w-full relative md:absolute md:w-auto md:left-[10%] md:top-1/3 mt-8 md:mt-0 col-span-2 flex flex-col justify-center items-start md:items-start text-start px-4 sm:px-10 pb-2 overflow-visible">
						<motion.h1
							className="bg-transparent px-3 md-px-0 text-white text-5xl md:text-8xl font-bold mb-3"
							initial={{ x: -100, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{
								delay: 0.1,
								type: "spring",
							}}>
							{isMn ? "Холбогдох" : "Contact"}
						</motion.h1>
						<Hr />
						<motion.p
							className="title text-xl mt-4 tracking-wider text-gray-300 leading-[1.7rem] md:mb-5 max-w-[42rem]"
							initial={{ x: -100, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{
								delay: 0.2,
								type: "spring",
							}}>
							{isMn
								? "Медиа, community event, эсвэл сагсан бөмбөгтэй холбоотой асуулт хүсэлт байвал тусдаа Contact хуудсаар дамжуулан холбогдоно уу."
								: "For media, community work, or basketball-related inquiries, use the dedicated contact page."}
						</motion.p>
						<motion.div
							initial={{ y: 30, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.3, type: "spring" }}>
							<Button variation="primary">
								<Link href={isMn ? "/mn/contact" : "/contact"}>
									{isMn ? "Contact хуудас руу" : "Go to contact page"}
								</Link>
							</Button>
						</motion.div>
					</div>
				</div>
			</section>
			<ScrollIndicator />
		</>
	);
};

export default MyPage;
