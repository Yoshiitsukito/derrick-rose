"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "@/lib/useLocale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCartShopping } from "@fortawesome/free-solid-svg-icons";

const merchItems = [
	{
		imageSrc:
			"/image/Derrick rose/Retire-Rose_Merch_Hanging.webp",
		titleEn: "The Rose Collection – Chicago Bulls",
		titleMn: "The Rose Collection – Chicago Bulls",
		descriptionEn:
			"Limited-edition collaboration with the Chicago Bulls celebrating Derrick Rose's legacy: letterman jacket, hoodies, graphic tees, snapbacks and more, released around his jersey retirement in 2026.",
		descriptionMn:
			"Chicago Bulls-тай хамтарсан хязгаарлагдмал цуврал. 2026 оны дугаар тэтгэвэрт гаргах ёслолын үеэр гарсан letterman jacket, hoodie, футболк, малгай зэрэг цуглуулга.",
		link: "https://shop.bulls.com/collections/derrick-rose",
		tagEn: "Official Bulls Merch",
		tagMn: "Албан ёсны Bulls merch",
	},
	{
		imageSrc: "/image/Derrick rose/derrick-roses-flower-shop-1 (1).webp",
		titleEn: "Rose's Flower Shop",
		titleMn: "Rose's Flower Shop",
		descriptionEn:
			"Family-run flower brand built by Derrick Rose, specializing in premium rose bouquets and pop-up events in Chicago. Part of his focus on building generational wealth beyond basketball.",
		descriptionMn:
			"Деррик Роузын гэр бүлийн зэрэгцээ бизнес – Чикагод үндсэндээ роз цэцгийн баглаа, pop-up event-үүдээр үйлчилдэг брэнд. Сагсан бөмбөгөөс цаашхиа гэр бүлдээ өв үлдээх зорилгын нэг хэсэг.",
		link: "https://rosesflowershop.com",
		tagEn: "Family Business",
		tagMn: "Гэр бүлийн бизнес",
	},
	{
		imageSrc: "/image/Derrick rose/img_2757.jpg",
		titleEn: "Adidas D Rose Signature Line",
		titleMn: "Adidas D Rose Signature Line",
		descriptionEn:
			"Multiple generations of Adidas D Rose signature basketball shoes that defined a fast, explosive play style and became a staple for fans worldwide.",
		descriptionMn:
			"Adidas-ийн D Rose signature гутлын цувралууд – түүний хурд, тэсрэлттэй тоглолтыг илэрхийлсэн, дэлхийн фенүүдийн дуртай загварууд.",
		link: "https://www.adidas.com/us/adizero-d-rose-1-shoes/FW7591.html",
		tagEn: "Footwear",
		tagMn: "Гутал",
	},
	{
		imageSrc: "/image/Derrick rose/Coco5_NewbottleLineUp_logo-1.png",
		titleEn: "Coco5 & Business Investments",
		titleMn: "Coco5 ба бусад хөрөнгө оруулалт",
		descriptionEn:
			"Equity stakes and partnerships with Coco5, real estate ventures, Freestyle Chess, Sloomoo and more, reflecting his evolution into a full-time businessman.",
		descriptionMn:
			"Coco5 спорт ундаа, үл хөдлөх хөрөнгийн төсөл, Freestyle Chess, Sloomoo зэрэг олон бизнес дэх хувь эзэмшил ба хөрөнгө оруулалт нь түүнийг бүтэн цагийн бизнесмэн болж хувирсныг харуулдаг.",
		link: "https://coco5.com/?srsltid=AfmBOooF8Zevs0plbFvnnVa1TZcfhvxMSPmZEMhiHaXUitFgxbBwYAlm",
		tagEn: "Business & Investment",
		tagMn: "Бизнес ба хөрөнгө оруулалт",
	},
	{
		imageSrc: "/image/Derrick rose/adidas-d-rose-1-roses-FV8057.webp",
		titleEn: "Adidas D Rose 1 \"Chicago\" Retro",
		titleMn: "Adidas D Rose 1 \"Chicago\" Retro",
		descriptionEn:
			"Retro release of Derrick Rose's first signature shoe with Adidas, bringing back the classic Chicago-inspired colorway for a new generation of fans.",
		descriptionMn:
			"Adidas D Rose-ийн анхны signature гутлын ретро хувилбар – Чикаго-оос сэдэвлэсэн улаан, хар өнгийн классик colorway-г шинэ үеийн фенүүдэд дахин хүргэж буй загвар.",
		link: "https://www.sneakerfiles.com/adidas-d-rose-1-roses-release-date-info/",
		tagEn: "Retro Sneakers",
		tagMn: "Ретро кет",
	},
	{
		imageSrc: "/image/Derrick rose/D-Rose4-Brenda.webp",
		titleEn: "Adidas D Rose 4 & 11 Performance Line",
		titleMn: "Adidas D Rose 4 ба 11 тоглолтын гутал",
		descriptionEn:
			"Performance-focused D Rose 4 and D Rose 11 models with bounce cushioning and lightweight uppers, built for quick guards and explosive first steps.",
		descriptionMn:
			"Bounce зөөллүүртэй, хөнгөн материалтай Adidas D Rose 4 ба 11 хувилбарууд – хурдан point guard, анхны алхам хүчтэй тоглогчдод зориулсан тоглолтын гутлууд.",
		link: "https://www.sneakerfiles.com/adidas-d-rose-4-brenda-first-look-release-info/",
		tagEn: "On-Court Gear",
		tagMn: "Талбайн гутал",
	},
	{
		imageSrc: "/image/Derrick rose/01kfrnbk99khvfm09he0.jpg",
		titleEn: "Chicago Bulls No.1 Derrick Rose Jersey",
		titleMn: "Chicago Bulls №1 Derrick Rose jersey",
		descriptionEn:
			"Official Chicago Bulls No.1 Derrick Rose swingman and statement jerseys, perfect for representing his MVP era at the United Center.",
		descriptionMn:
			"Chicago Bulls-ын албан ёсны №1 Derrick Rose swingman болон statement jersey – United Center-т MVP үеийнх нь оргил мөчүүдийг санагдуулах хамгийн классик merch.",
		link: "https://www.si.com/fannation/sneakers/news/derrick-rose-jersey-sneakers-return-limited-numbers",
		tagEn: "Jersey",
		tagMn: "Жерси",
	},
	{
		imageSrc: "/image/Derrick rose/s-l400.jpg",
		titleEn: "Signed Photos & Memorabilia",
		titleMn: "Гарын үсэгтэй зураг, дурсгалын зүйлс",
		descriptionEn:
			"Autographed photos, basketballs, and framed pieces from key moments like the 2011 MVP season and 2018 50-point game.",
		descriptionMn:
			"2011 оны MVP улирал, 2018 оны 50 онооны тоглолт зэрэг түүхэн мөчүүдийн гарын үсэгтэй зураг, сагсан бөмбөг, рамтай дурсгалын зүйлс.",
		link: "https://www.ebay.com.au/itm/272400918033?srsltid=AfmBOorwwqaNiSOr40kz4AmFhwu11-S-NZmwS5HOSn9DIAGRKJ2p12ZU",
		tagEn: "Collectibles",
		tagMn: "Коллекц, дурсгал",
	},
	{
		imageSrc: "/image/Derrick rose/il_fullxfull.6313560274_85w6.jpg",
		titleEn: "D Rose MVP Era Graphic Tees",
		titleMn: "D Rose MVP үеийн graphic футболкнуд",
		descriptionEn:
			"Streetwear-style t-shirts featuring iconic images from his MVP season, poster dunks and Chicago skyline mashups.",
		descriptionMn:
			"MVP үеийнх нь poster dunk, Чикагогийн skyline-тай хосолсон зураг бүхий streetwear хэв маягийн graphic футболкнуд.",
		link: "https://www.etsy.com/search?q=derrick+rose+shirt",
		tagEn: "Streetwear",
		tagMn: "Streetwear футболк",
	},
	{
		imageSrc: "/image/Derrick rose/il_fullxfull.7589445235_qefv.webp",
		titleEn: "D Rose Vintage Posters & Artwork",
		titleMn: "D Rose винтаж постер, арт бүтээлүүд",
		descriptionEn:
			"Fan-made and officially licensed wall art celebrating his crossover, layups and signature moments in Chicago and beyond.",
		descriptionMn:
			"Фэнүүдийн бүтээсэн болон албан ёсны зөвшөөрөлтэй винтаж постер, арт хэвлэлүүд – Чикагод болон бусад багуудад тоглож байх үеийн домогт мөчүүдийг хананд тань хадгална.",
		link: "https://www.etsy.com/search?q=derrick+rose+poster",
		tagEn: "Wall Art",
		tagMn: "Ханын постер",
	},
	{
		imageSrc: "/image/Derrick rose/DerrickRose_Classic001.webp",
		titleEn: "Derrick Rose Books & Biography Features",
		titleMn: "Деррик Роузын ном, намтар нийтлэлүүд",
		descriptionEn:
			"Print and digital features telling his story from Englewood to NBA superstardom, injuries, comebacks and life as a father and businessman.",
		descriptionMn:
			"Englewood дүүргээс NBA-ийн супер од хүртэл, гэмтэл бэртэл, эргэн ирэлт, аав болон бизнесмэн болсон түүхийг өгүүлсэн ном, нийтлэлүүд.",
		link: "https://eu.assouline.com/products/derrick-rose-the-poohprint?srsltid=AfmBOoqpIybX4VjmOmwezu0sTXfOr7FAE8be_lQN8Idg3rVn6pi9F2di",
		tagEn: "Books",
		tagMn: "Ном, нийтлэл",
	},
	{
		imageSrc: "/image/Derrick rose/slam-presents-d-rose-665611.webp",
		titleEn: "Community & Charity Collab Apparel",
		titleMn: "Community & charity хамтарсан хувцаснуудаас",
		descriptionEn:
			"Limited-run hoodies and tees from community events and charity games supporting youth in Chicago and other cities.",
		descriptionMn:
			"Чикаго болон бусад хотуудад залуучуудыг дэмжих зорилготой charity тоглолт, community event-үүдийн үеэр гарсан хязгаарлагдмал hoodie, футболкны цуглуулгууд.",
		link: "https://slamgoods.com/products/d-rose",
		tagEn: "Charity Collabs",
		tagMn: "Буян, community merch",
	},
];

export default function Page() {
	const locale = useLocale();
	const isMn = locale === "mn";
	const heroImg = "/image/Derrick rose/2e4420b9-749b-4b4d-9e08-9f67243e129a_15bf7c11.jpg";

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
			{/* Hero – full-width split layout */}
			<motion.section
				className="relative min-h-[70vh] md:min-h-[80vh] flex flex-col md:flex-row px-4 md:px-12 lg:px-20 pt-28 md:pt-32 pb-16 md:pb-0"
				{...scrollAnimation}>
				<div className="flex-1 flex flex-col justify-center md:pr-8 lg:pr-12 z-10">
					<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
						<span className="block">
							{isMn ? "МЕРЧ & БИЗНЕС" : "MERCH &"}
						</span>
						<span className="block mt-1 text-gray-400 font-bold">
							{isMn ? "ДЕРРИК РОУЗ" : "DERRICK ROSE"}
						</span>
					</h1>
					<a
						href="https://shop.bulls.com/collections/derrick-rose"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 mt-8 text-sm font-medium uppercase tracking-[0.2em] text-red-500 hover:text-red-400 transition-colors group">
						{isMn ? "Цуглуулгыг үзэх" : "View collections"}
						<FontAwesomeIcon
							icon={faArrowRight}
							className="text-xs group-hover:translate-x-1 transition-transform"
						/>
					</a>
				</div>
				<div className="relative w-full md:w-[45%] lg:w-[50%] min-h-[50vh] md:min-h-[65vh] mt-8 md:mt-0 md:absolute md:right-8 lg:right-12 md:top-1/2 md:-translate-y-1/2">
					<div className="relative w-full h-full min-h-[320px] md:min-h-[450px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-neutral-700/50">
						<Image
							src={heroImg}
							alt="Derrick Rose Merch"
							fill
							className="object-cover object-top"
							sizes="(max-width: 768px) 100vw, 50vw"
							priority
						/>
					</div>
				</div>
			</motion.section>

			{/* Product grid – masonry-style */}
			<section className="px-4 md:px-12 lg:px-20 pb-24 pt-8">
				<motion.div
					className="text-center mb-12"
					{...scrollAnimation}>
					<h2 className="text-2xl md:text-3xl font-bold">
						{isMn ? "Цуглуулгууд" : "Collections"}
					</h2>
				</motion.div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
					{merchItems.map((item, idx) => (
						<motion.a
							key={item.titleEn}
							href={item.link}
							target="_blank"
							rel="noopener noreferrer"
							className="group block rounded-xl overflow-hidden bg-neutral-900/60 border border-neutral-700/50 shadow-lg hover:border-red-600/50 hover:shadow-xl transition-all duration-300"
							{...cardAnimation}
							transition={{ ...cardAnimation.transition, delay: idx * 0.06 }}>
							<div className="relative w-full aspect-square overflow-hidden bg-neutral-800">
								{item.imageSrc && (
									<Image
										src={item.imageSrc}
										alt={isMn ? item.titleMn : item.titleEn}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-500"
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									/>
								)}
							</div>
							<div className="p-4 flex items-center justify-between gap-2">
								<div className="min-w-0">
									<p className="text-xs uppercase tracking-widest text-red-500/90 truncate">
										{isMn ? item.tagMn : item.tagEn}
									</p>
									<h3 className="font-semibold text-white truncate">
										{isMn ? item.titleMn : item.titleEn}
									</h3>
								</div>
								<span className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-neutral-600 group-hover:border-red-600/50 transition-colors">
									<FontAwesomeIcon
										icon={faCartShopping}
										className="text-neutral-400 group-hover:text-red-500 transition-colors"
									/>
								</span>
							</div>
						</motion.a>
					))}
				</div>
			</section>
		</main>
	);
}
