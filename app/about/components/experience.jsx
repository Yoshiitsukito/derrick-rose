"use client";
import Hr from "@/components/Hr";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocale } from "@/lib/useLocale";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const experiences = [
	{
		id: 1,
		startDate: "1988",
		endDate: "2007",
		company: "Chicago, Englewood – Simeon Career Academy",
		companyMn: "Чикаго, Englewood – Simeon Career Academy",
		position: "High School Phenom",
		positionMn: "Ахлах сургуулийн супер од",
		type: "High School",
		typeMn: "Ахлах сургууль",
		location: "Chicago, Illinois",
		locationMn: "Чикаго, Иллинойс",
		description:
			"Born and raised in Chicago’s Englewood neighborhood, Derrick Rose became a local legend at Simeon Career Academy. He led Simeon to multiple state titles and was named Illinois Mr. Basketball in 2007, as well as a McDonald's All-American, making him one of the most coveted recruits in the country.",
		descriptionMn:
			"Деррик Роуз Чикагогийн Englewood хороололд төрж өссөн бөгөөд Simeon Career Academy ахлах сургуульдаа хотын домог болсон. Тэр багийг хэд хэдэн удаа мужийн аваргаар түрүүлэхэд удирдан, 2007 онд Illinois Mr. Basketball болон McDonald’s All-American болж, улс даяарх хамгийн эрэлттэй рекрутүүдийн нэг болсон.",
		skills: ["Illinois Mr. Basketball", "McDonald's All-American", "State Championships"],
	},
	{
		id: 2,
		startDate: "2007",
		endDate: "2008",
		company: "University of Memphis",
		companyMn: "Мемфисийн их сургууль",
		position: "Freshman Point Guard",
		positionMn: "Нэгдүгээр курсийн Point Guard",
		type: "NCAA",
		typeMn: "NCAA",
		location: "Memphis, Tennessee",
		locationMn: "Мемфис, Теннесси",
		description:
			"In his lone college season, Rose averaged 14.9 points per game and led Memphis to a 38–2 record and a trip to the 2008 NCAA title game. His size, explosiveness, and poise under pressure cemented him as the clear No. 1 prospect in the upcoming NBA Draft.",
		descriptionMn:
			"Коллежийн ганц улиралдаа Роуз Мемфисийн багт дундаж 14.9 оноо авч, багийг 38–2 амжилттай, 2008 оны NCAA финалд хүргэсэн. Түүний бие бялдар, тэсрэлттэй хурд, дарамттай үед тайван тоглох чадвар нь түүнийг тухайн үеийн NBA драфтын №1 тодорхой сонголт болгосон.",
		skills: ["14.9 PPG", "NCAA Finals Run", "Leadership"],
	},
	{
		id: 3,
		startDate: "2008",
		endDate: "2011",
		company: "Chicago Bulls",
		companyMn: "Chicago Bulls",
		position: "Franchise Point Guard",
		positionMn: "Багийн гол Point Guard",
		type: "NBA Regular Season & Playoffs",
		typeMn: "NBA – энгийн улирал ба плейофф",
		location: "Chicago, Illinois",
		locationMn: "Чикаго, Иллинойс",
		description:
			"Selected first overall in the 2008 NBA Draft by his hometown Chicago Bulls, Rose immediately transformed the franchise. He won Rookie of the Year in 2009 (16.8 PPG, 6.3 APG) and, by the 2010–11 season, became the youngest MVP in league history at 22, averaging 25.0 points, 7.7 assists and leading the Bulls to a 62–20 record and the No. 1 seed in the East.",
		descriptionMn:
			"2008 оны NBA драфтад төрөлх хотынхоо Chicago Bulls-аар №1 нийтлэг сонголтоор дуудагдсан Роуз богино хугацаанд франчайзыг бүхэлд нь өөрчилсөн. Тэр 2009 онд дундаж 16.8 оноо, 6.3 дамжуулалттайгаар Rookie of the Year болж, 2010–11 оны улиралд 25.0 оноо, 7.7 дамжуулалт, 4.1 самбар авч, Bulls-ыг 62–20 амжилтаар Зүүн бүсийн №1 болгох үеэрээ 22 настайдаа лигийн түүхэн дэх хамгийн залуу MVP болсон.",
		skills: ["Rookie of the Year 2009", "NBA MVP 2011", "All-NBA First Team", "3× All-Star"],
	},
	{
		id: 4,
		startDate: "2012",
		endDate: "2017",
		company: "Chicago Bulls & Cleveland Cavaliers",
		companyMn: "Chicago Bulls & Cleveland Cavaliers",
		position: "Injury & Comeback Years",
		positionMn: "Гэмтэл ба эргэн ирэлтийн жилүүд",
		type: "Adversity",
		typeMn: "Сорилт, бэрхшээл",
		location: "Chicago & Cleveland",
		locationMn: "Чикаго ба Кливлэнд",
		description:
			"On April 28, 2012, Rose suffered a torn ACL in his left knee, missing the entire 2012–13 season. Subsequent meniscus tears in 2013, 2015 and 2017, along with ankle and other injuries, repeatedly disrupted his prime. Despite this, he fought back onto the court, reinventing his game and redefining what resilience looks like in professional sports.",
		descriptionMn:
			"2012 оны 4-р сарын 28-нд Роуз зүүн өвдөгний ACL-ээ урагдуулж, 2012–13 оны бүх улирлыг өнжсөн. Үүний дараа 2013, 2015, 2017 онуудад менисксэн гэмтэл, шагайн болон бусад бэртэл нь түүний оргил үеийг олонтаа тасалдуулсан. Гэсэн ч тэр талбайд буцан ирж, өөрийн тоглолтоо өөрчилж, мэргэжлийн спортод тэсвэр хатуужил гэж юу болохыг шинээр тодорхойлсон.",
		skills: ["ACL Recovery", "Multiple Meniscus Surgeries", "Mental Toughness"],
	},
	{
		id: 5,
		startDate: "2018",
		endDate: "2019",
		company: "Minnesota Timberwolves",
		companyMn: "Minnesota Timberwolves",
		position: "Veteran Guard – Redemption",
		positionMn: "Туршлагатай Guard – Эргэн ирэлт",
		type: "Regular Season",
		typeMn: "Ердийн улирал",
		location: "Minnesota",
		locationMn: "Миннесота",
		description:
			"With the Timberwolves, Rose delivered one of the most emotional nights of his career: a 50-point game on October 31, 2018, a career high and a symbol of his perseverance after years of injuries. The performance was celebrated by fans league-wide as a victory for his journey rather than just a box-score milestone.",
		descriptionMn:
			"Timberwolves-т тоглож байхдаа Роуз карьерийнхаа хамгийн сэтгэл хөдөлгөм шөнийг бүтээсэн: 2018 оны 10-р сарын 31-нд тэр 50 оноо авч, карьерийнх нь дээд амжилт тогтоосон. Энэ тоглолт олон жилийн гэмтлийн дараах түүний шаргуу тэмцлийн бэлгэдэл болж, статистикаас илүү түүхэн эргэн ирэлт хэмээн фенүүд, лиг даяар үнэлэгдсэн.",
		skills: ["50-Point Game", "Sixth-Man Impact", "Fan Favorite"],
	},
	{
		id: 6,
		startDate: "2019",
		endDate: "2023",
		company: "Detroit Pistons & New York Knicks",
		companyMn: "Detroit Pistons & New York Knicks",
		position: "Leader & Mentor",
		positionMn: "Лидер ба ментор",
		type: "Regular Season & Playoffs",
		typeMn: "Ердийн улирал & плейофф",
		location: "Detroit & New York",
		locationMn: "Детройт & Нью-Йорк",
		description:
			"Rose took on a hybrid role as both scoring guard and mentor for younger teammates. With the Knicks, he helped lead the team back to the playoffs, providing efficient bench scoring and veteran leadership in Tom Thibodeau’s system.",
		descriptionMn:
			"Энэ үед Роуз оноо авах guard бөгөөд зэрэгцээ залуу тоглогчдод менторын үүрэгтэй хосолсон байр суурьтай байв. Knicks багт тэр сэлгээний шугамаас өндөр үр ашигтай оноо авч, Том Тибодогийн системд ахлагчын туршлагаараа багийг плейоффт эргэн оруулахад тусалсан.",
		skills: ["Playoff Run with Knicks", "Locker Room Leadership", "Efficient Scoring"],
	},
	{
		id: 7,
		startDate: "2023",
		endDate: "2024",
		company: "Memphis Grizzlies",
		companyMn: "Memphis Grizzlies",
		position: "Veteran Guard",
		positionMn: "Туршлагатай guard",
		type: "Final NBA Season",
		typeMn: "NBA дахь сүүлийн улирал",
		location: "Memphis, Tennessee",
		locationMn: "Мемфис, Теннесси",
		description:
			"Rose joined the Memphis Grizzlies as a veteran presence, contributing on and off the court while mentoring a young roster. After being waived in 2024, he formally stepped away from professional play, closing a 16-season NBA career.",
		descriptionMn:
			"Роуз Memphis Grizzlies-д туршлагатай тоглогчийн хувиар нэгдэж, талбай дээр болон гаднаас залуу бүрэлдэхүүнд менторын үүрэг гүйцэтгэсэн. 2024 онд багаас хасагдсаны дараа тэр мэргэжлийн тоглогчийн замналаа албан ёсоор өндөрлөж, 16 улирал үргэлжилсэн NBA карьераа хаасан.",
		skills: ["Veteran Presence", "Mentorship"],
	},
	{
		id: 8,
		startDate: "Sept 2024",
		endDate: "Jan 2026",
		company: "Retirement & Jersey Ceremony",
		companyMn: "Тэтгэвэр ба дугаар тэтгэвэрт гаргах ёслол",
		position: "Chicago Bulls Legend",
		positionMn: "Chicago Bulls-ын домог",
		type: "Legacy",
		typeMn: "Өв, домог",
		location: "Chicago, Illinois",
		locationMn: "Чикаго, Иллинойс",
		description:
			"In September 2024, Rose’s professional playing chapter effectively closed. On January 24, 2026, the Chicago Bulls retired his iconic No. 1 jersey at the United Center, making him one of the few in franchise history honored alongside Michael Jordan and Scottie Pippen. Surrounded by family, former teammates, and coaches, Rose delivered an emotional speech, thanking Chicago and its fans.",
		descriptionMn:
			"2024 оны 9-р сард Роузын мэргэжлийн тоглогчийн бүлэг үндсэндээ хаагдсан. 2026 оны 1-р сарын 24-нд Chicago Bulls баг United Center-т түүний домогт №1 дугаарыг тэтгэвэрт гаргаж, түүнийг Michael Jordan, Scottie Pippen зэрэг багийн цөөн хэдэн домогтой нэг эгнээнд залав. Гэр бүл, хуучин багийнхан, дасгалжуулагчид, фенүүдийн дунд Роуз Чикаго болон фенүүддээ талархсан, сэтгэл хөдөлгөм үг хэлжээ.",
		skills: ["Bulls Jersey Retirement", "Franchise Icon", "Chicago Legend"],
	},
	{
		id: 9,
		startDate: "2024",
		endDate: "Present",
		company: "Entrepreneur, Author & Philanthropist",
		companyMn: "Бизнесмэн, зохиолч & буяны үйлстэн",
		position: "Businessman & Community Leader",
		positionMn: "Бизнес эрхлэгч & нийгмийн манлайлагч",
		type: "Post-NBA Career",
		typeMn: "NBA-гийн дараах карьер",
		location: "Chicago, Illinois",
		locationMn: "Чикаго, Иллинойс",
		description:
			"Post-retirement, Rose has focused on building generational wealth and giving back to Chicago. He launched Rose’s Flower Shop, invested in Coco5, Freestyle Chess, real estate, Sloomoo and more, while planning future construction projects. In 2026 he released his book “The PoohPrint,” and continues his long-running efforts with Rose Scholars, Simeon partnerships, and community initiatives like The Rose Garden.",
		descriptionMn:
			"NBA-гаас зодог тайлсныхаа дараа Деррик Роуз гэр бүлдээ өв үлдээх, Чикагогийнхоо төлөө буцааж өгөхөд голчлон анхаарч байна. Тэр Rose’s Flower Shop-оо эхлүүлж, Coco5 спорт ундаа, Freestyle Chess, үл хөдлөх хөрөнгө, Sloomoo зэрэг олон бизнесэд хөрөнгө оруулалт хийсэн бөгөөд ирээдүйн барилгын төсөл, хөгжүүлэлтүүдийг төлөвлөж байгаа. 2026 онд тэр өөрийн амьдрал, сургамжийг багтаасан “The PoohPrint” нэртэй номоо гаргаж, олон жилийн турш үргэлжилж буй Rose Scholars тэтгэлэг, Simeon сургуультай хамтын ажиллагаа, The Rose Garden зэрэг community төслүүдээр дамжуулан залууст боломж, урам зориг олгосоор байна.",
		skills: [
			"Rose’s Flower Shop",
			"Coco5",
			"Freestyle Chess",
			"Rose Scholars",
			"The PoohPrint",
		],
	},
];

experiences.reverse();

function Title() {
	const locale = useLocale();
	const isMn = locale === "mn";
	return (
		<div className="mt-16 flex flex-col justify-start items-center w-full pl-10 md:pl-32">
			<div className="flex justify-center items-center flex-col my-5 self-start">
				<Hr variant="long"></Hr>
				<motion.h1
					className="text-3xl font-bold mt-3 text-white"
					initial={{
						opacity: 0,
						x: -200,
					}}
					whileInView={{
						opacity: 1,
						x: 0,
					}}
					transition={{ delay: 0.7, type: "spring" }}>
					{isMn ? "Карьерийн замнал" : "Career Timeline"}
				</motion.h1>
			</div>
		</div>
	);
}

function TimelineCard({ experience, index, isEven }) {
	const locale = useLocale();
	const isMn = locale === "mn";
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.15, duration: 0.5 }}
			className={`flex ps-10 md:ps-0 ${
				isEven
					? "md:justify-center md:translate-x-68"
					: "md:justify-center md:-translate-x-68"
			} justify-center mb-4`}>
			<div className="bg-gradient-to-r from-neutral-900 via-gray-900 to-black text-white px-12 py-3 rounded-xl shadow-lg border border-red-700/70 min-w-max">
				<div className="flex items-center justify-center gap-6">
					<div className="text-center">
						<div className="text-sm font-bold">{experience.startDate}</div>
						<div className="text-xs text-gray-300">
							{isMn ? "Эхлэл" : "Start"}
						</div>
					</div>
					<div className="w-px h-8 bg-gray-500"></div>
					<div className="text-center">
						<div className="text-sm font-bold">{experience.endDate}</div>
						<div className="text-xs text-gray-300">
							{isMn ? "Төгсгөл" : "End"}
						</div>
					</div>					<div className="w-px h-8 bg-gray-500"></div>
					<div className="text-center">
						<div className="text-sm font-medium text-gray-200">
							{experience.locationMn && isMn
								? experience.locationMn
								: experience.location}
						</div>
						<div className="text-xs text-gray-300">
							{isMn ? "Байрлал" : "Location"}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function ExperienceCard({ experience, index, isEven }) {
	const locale = useLocale();
	const isMn = locale === "mn";

	// (id 1-9) show image thumbnails and open a full popout modal on click.
	const isImagePopoverExperience = experience?.id >= 1 && experience?.id <= 9;
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	const imageSrc = isImagePopoverExperience
		? experience?.id === 1
			? "/image/Derrick rose/DV53LB2VW2NV2YH5Z64ANBRULA.webp"
			: experience?.id === 2
				? "/image/Derrick rose/2004330268.webp"
				: experience?.id === 3
					? "/image/Derrick rose/s-l1200.jpg"
					: experience?.id === 4
						? "/image/Derrick rose/usa-today-8557049.0.1431141324.webp"
						: experience?.id === 5
							? "/image/Derrick rose/53144e0cee5b8118363b3af2825ad731e75fcedb3cb597a1fc99220cfd74fcb6.webp"
							: experience?.id === 6
								? "/image/Derrick rose/XDQLVJKSMIQRNEY6YKJ3QFGI3U.webp"
								: experience?.id === 7
									? "/image/Derrick rose/AA27M4I4GFAWPKNKILYVNMMORU.avif"
									: experience?.id === 8
										? "/image/Derrick rose/Bulls-news-Derrick-Rose-reveals-why-jersey-retirement-isnt-happening-until-next-season.webp"
										: "/image/Derrick rose/Derrick-Roses-Flower-Shop.png"
		: null;

	const popoverOpen = isImagePopoverExperience && isPopoverOpen;
	const altText = isMn && experience?.companyMn ? experience.companyMn : experience?.company;

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.2, duration: 0.6 }}
			className={`relative group ${
				isEven ? "md:ml-auto md:pl-12" : "md:mr-auto md:pr-12"
			} md:w-1/2`}>
			{" "}
			{/* Card */}
			<div
				className={`bg-neutral-900/80 backdrop-blur-sm border border-red-700/70 rounded-2xl p-6 shadow-lg 
				hover:shadow-xl hover:bg-neutral-800/90 transition-all duration-300 ml-12 md:ml-0`}>
				{/* Company & Position */}
				<div className="mb-4">
					<h3 className="font-bold text-xl text-white mb-1">
						{isMn && experience.companyMn ? experience.companyMn : experience.company}
					</h3>
					<h4 className="font-medium text-lg text-gray-200">
						{isMn && experience.positionMn ? experience.positionMn : experience.position}
						<span className="text-sm font-normal text-gray-400 ml-2">
							•{" "}
							{isMn && experience.typeMn ? experience.typeMn : experience.type}
						</span>
					</h4>
				</div>

				{/* Image + full description popout */}
				{isImagePopoverExperience ? (
					<>
						<div className="mb-4">
						<div
							className="relative w-full overflow-hidden rounded-xl border border-red-700/30 bg-neutral-800 aspect-[16/9]"
							onClick={() => {
								setIsPopoverOpen(true);
							}}
							role="button"
							tabIndex={0}
							aria-label={isMn ? "Тайлбар popout нээх" : "Open description popout"}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") setIsPopoverOpen(true);
							}}>
							<Image
								src={imageSrc}
								alt={altText}
								fill
								className="object-contain bg-neutral-800 transition-transform duration-300"
								sizes="(max-width: 768px) 85vw, 40vw"
								priority
							/>
						</div>

						<AnimatePresence>
							{popoverOpen && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.15 }}
									className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-start p-4 md:pl-10"
									onClick={() => setIsPopoverOpen(false)}>
									<motion.div
										initial={{ opacity: 0, x: -60, y: 14, scale: 0.98 }}
										animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
										exit={{ opacity: 0, x: -60, y: 14, scale: 0.98 }}
										transition={{ duration: 0.2 }}
										className="relative w-full max-w-3xl bg-neutral-950/95 border border-red-700/40 rounded-2xl overflow-hidden"
										onClick={(e) => e.stopPropagation()}
										role="dialog"
										aria-modal="true"
										aria-label={isMn ? "Тайлбар" : "Description"}>
										<button
											type="button"
											onClick={() => setIsPopoverOpen(false)}
											aria-label={isMn ? "Буцах" : "Back"}
											className="absolute top-4 left-4 z-10 rounded-full bg-black/60 hover:bg-black/85 border border-white/20 p-2">
											<FontAwesomeIcon icon={faChevronLeft} className="text-white" />
										</button>

										<div className="relative w-full aspect-[16/9]">
											<Image
												src={imageSrc}
												alt={altText}
												fill
												className="object-contain bg-neutral-950"
												sizes="(max-width: 768px) 90vw, 1400px"
												priority
											/>
										</div>

										<div className="p-6 md:p-8">
											<h3 className="text-xl md:text-2xl font-bold text-white mb-3">
												{isMn && experience.companyMn
													? experience.companyMn
													: experience.company}
											</h3>
											<p className="text-white/90 text-sm md:text-base leading-relaxed">
												{isMn && experience.descriptionMn
													? experience.descriptionMn
													: experience.description}
											</p>
										</div>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>
						</div>
						{popoverOpen && (
							<p className="text-gray-200 text-justify leading-relaxed mb-4">
								{isMn && experience.descriptionMn
									? experience.descriptionMn
									: experience.description}
							</p>
						)}
					</>
				) : (
					<p className="text-gray-200 text-justify leading-relaxed mb-4">
						{isMn && experience.descriptionMn ? experience.descriptionMn : experience.description}
					</p>
				)}

				{/* Skills */}
				<div className="flex flex-wrap gap-2">
					{experience.skills.map((skill, idx) => (
						<span
							key={idx}
							className="bg-gray-200/60 hover:bg-gray-300/60 border border-gray-400/40 text-black px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm hover:scale-105">
							{skill}
						</span>
					))}
				</div>
			</div>
		</motion.div>
	);
}

function Wrapper({ children }) {
	return (
		<div className="mx-auto container px-6 py-10">
			<div
				className="flex justify-center items-center flex-col">
				{children}
			</div>
		</div>
	);
}

export default function Experience() {
	const [showAll, setShowAll] = useState(false);
	const displayedExperiences = showAll ? experiences : experiences.slice(0, 3);

	return (
		<section id="career-highlights">
			<Title />
			<Wrapper>
				{" "}
				{/* Highlight video */}
				<div className="w-full max-w-5xl mx-auto mb-10">
					<div className="relative pt-[56.25%] rounded-2xl overflow-hidden shadow-xl border border-gray-300/40">
						<iframe
							className="absolute inset-0 w-full h-full"
							src="https://www.youtube.com/embed/OhLNpNtzxNY"
							title="Derrick Rose Career Highlights"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen
						/>
					</div>
				</div>
				<div className="relative w-full max-w-6xl mx-auto">
					{" "}
					{/* Timeline line - hidden on mobile, visible on md+ */}
					<div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-black via-gray-400 to-transparent h-full"></div>
					{/* Mobile timeline line */}
					<div className="md:hidden absolute left-0 w-1 bg-gradient-to-b from-black via-gray-400 to-transparent h-full"></div>{" "}
					{/* Experience cards */}
					<div className="space-y-12 md:space-y-16 relative">
						<AnimatePresence>
							{displayedExperiences.map((experience, index) => (
								<div key={experience.id} className="relative">
									{/* Timeline period card - flows naturally above content */}
									<TimelineCard
										experience={experience}
										index={index}
										isEven={index % 2 === 1}
									/>

									{/* Timeline dot - positioned at the start of the experience card */}
									<div
										className={`absolute w-6 h-6 bg-black rounded-full border-4 border-white shadow-lg z-30
										md:left-1/2 md:-translate-x-1/2 md:top-4
										left-0 -translate-x-1/2 top-5`}
									/>

									{/* Experience content card */}
									<ExperienceCard
										experience={experience}
										index={index}
										isEven={index % 2 === 1}
									/>
								</div>
							))}
						</AnimatePresence>
					</div>
					{/* Expand/Collapse button */}
					{experiences.length > 3 && (
						<motion.div
							className="flex justify-center mt-12"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ delay: 0.5 }}>
							<button
								onClick={() => setShowAll(!showAll)}
								className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium 
									transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2">
								{showAll ? (
									<>
										Show Less
										<svg
											className="w-4 h-4 transform rotate-180"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</>
								) : (
									<>
										View More Experience
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</>
								)}
							</button>
						</motion.div>
					)}{" "}
					{/* Gradient fade effect at bottom */}
					{!showAll && (
						<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stale-300 to-transparent pointer-events-none"></div>
					)}
				</div>
			</Wrapper>
		</section>
	);
}
