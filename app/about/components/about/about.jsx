import Image from "next/image";
import { motion } from "framer-motion";
import Hr from "@/components/Hr";
import { useLocale } from "@/lib/useLocale";

function Title() {
	const locale = useLocale();
	const isMn = locale === "mn";
	return (
		<div className="mt-10 flex flex-col justify-start items-center w-full pl-10 md:pl-32">
			<div className="flex justify-center items-center flex-col my-5 self-start ">
				<Hr variant="long" />
				<h1 className="text-3xl font-bold mt-3">
					{isMn ? "Деррик Роузын намтар" : "Derrick Rose Biography"}
				</h1>
			</div>
		</div>
	);
}

export default function About() {
	const primaryImg = "/image/GettyImages-113686364-scaled-e1727350405919-1568x882.webp";
	const secondaryImg = "/image/sddefault.jpg";
	const tertiaryImg = "/image/uctev6ujahzmfwitu7yh.avif";
	const locale = useLocale();
	const isMn = locale === "mn";
	return (
		<>
			<Title />
			<div className="relative mx-auto container gap-4 px-10 grid grid-cols-1 md:grid-cols-2 mb-10">
				<div className="flex justify-center items-start flex-col mb-5 ">
					<div className="images relative w-full aspect-square">
						<div className="absolute top-28 left-10 w-[50%] aspect-square grayscale hover:grayscale-0 transition-all ease duration-300">
							<motion.div
								initial={{ opacity: 0, scale: 0.5, x: 100 }}
								whileInView={{ opacity: 1, scale: 1, x: 0 }}
								className="relative w-full h-full">
								<Image
									src={primaryImg}
									alt="Derrick Rose"
									fill
									sizes="(max-width: 768px) 80vw, 40vw"
									className="object-cover"
								/>
							</motion.div>
						</div>
						<div className="absolute top-16 right-28 w-[30%] aspect-square grayscale hover:grayscale-0 transition-all ease duration-300">
							<motion.div
								initial={{ opacity: 0, scale: 0.5, x: -100 }}
								whileInView={{ opacity: 1, scale: 1, x: 0 }}
								transition={{ delay: 0.3 }}
								className="relative w-full h-full">
								<Image
									src={secondaryImg}
									alt="Derrick Rose"
									fill
									sizes="(max-width: 768px) 60vw, 25vw"
									className="object-cover"
								/>
							</motion.div>
						</div>
						<div className="absolute bottom-16 right-20 w-[40%] aspect-square grayscale hover:grayscale-0 transition-all ease duration-300">
							<motion.div
								initial={{ opacity: 0, scale: 0.5, x: -100 }}
								whileInView={{ opacity: 1, scale: 1, x: 0 }}
								transition={{ delay: 0.5 }}
								className="relative w-full h-full">
								<Image
									src={tertiaryImg}
									alt="Derrick Rose"
									fill
									sizes="(max-width: 768px) 80vw, 35vw"
									className="object-cover"
								/>
							</motion.div>
						</div>
					</div>
				</div>
				<motion.div
					className="flex justify-center items-start flex-col mb-5 md:px-10"
					initial={{ opacity: 0, x: 200 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.5, type: "spring" }}>
					<h2 className="text-2xl font-bold tracking-wider mb-3">
						Derrick Martell Rose
					</h2>
					<p className="text-gray-100 text-justify title text-lg leading-relaxed max-w-[48rem]">
						{isMn ? (
							<>
								Деррик Роуз нь 1988 оны 10-р сарын 4-нд Чикагогийн Englewood
								хороололд төрсөн, NBA-ийн түүхэн дэх хамгийн тэсрэлттэй
								point guard-уудын нэг юм. 191 см өндөр, ~91 кг жинтэй тэрээр
								Чикагогийн гудамжны талбай, Simeon Career Academy-гаас гараагаа
								эхэлж,{" "}
								<span className="text-red-300 font-medium">
									2008 оны NBA драфтын №1 сонголт
								</span>{" "}
								болтлоо өссөн. Коллежийн түвшинд University of Memphis-д нэг
								хон жил тоглохдоо (2007–08) дунджаар 14.9 оноо авч, багийг NCAA
								final хүртэл авч явсан.
								<br />
								<br />
								Chicago Bulls-д (2008–2016) тэр{" "}
								<span className="text-red-300 font-medium">
									2009 оны Rookie of the Year
								</span>{" "}
								шагнал хүртэж, 2010–11 оны улиралд дунджаар 25.0 оноо, 7.7
								dassist, 4.1 rebound авч, багийг 62–20 амжилттайгаар Зүүн
								конференцийн №1 байранд гаргасан. Ингэснээр тэр{" "}
								<span className="text-red-300 font-medium">
									NBA-ийн түүхэн дэх хамгийн залуу MVP (22 настай)
								</span>
								 болсон. Тэр{" "}
								<span className="text-red-300 font-medium">
									3 удаагийн All-Star (2010–2012), 2011 оны All-NBA First Team
								</span>
								–ийн гишүүн.
								<br />
								<br />
								2008–2024 он хүртэл үргэлжилсэн 16 улиралд Bulls, Knicks,
								Cavaliers, Timberwolves, Pistons, Grizzlies багуудад нийт{" "}
								<span className="text-red-300 font-medium">
									723 тоглолтод оролцож, 17.4 оноо, 5.2 дамжуулалт, 3.2 самбар
								</span>
								ийн дундаж үзүүлэлттэй (нийт 12,573 оноо), плейоффт 52
								тоглолтод дунджаар 21.9 оноо авч байв. Түүний тоглолтыг
								тэсрэлттэй анхны алхам, айх зүйлгүй довтолгоо, шон дээрх
								акробатик finish-үүд тодорхойлдог байсан ба хожим нь floater,
								midrange, гурван онооны шидэлт сайжирсан туршлагатай хамгаалагч
								болтлоо тоглолтоо эвдэж өөрчилсөн.
							</>
						) : (
							<>
								Derrick Rose (born October 4, 1988, in Chicago&apos;s Englewood
								neighborhood) is a former professional point guard and one of the
								most electrifying players in NBA history. Standing 191 cm tall and
								weighing around 91 kg, he rose from Chicago&apos;s playgrounds and
								Simeon Career Academy to become the{" "}
								<span className="text-red-300 font-medium">
									No. 1 overall pick in the 2008 NBA Draft
								</span>{" "}
								after one season at the University of Memphis (14.9 PPG in 2007–08).
								<br />
								<br />
								With the Chicago Bulls (2008–2016), Rose earned{" "}
								<span className="text-red-300 font-medium">
									Rookie of the Year honors in 2009
								</span>{" "}
								and became the{" "}
								<span className="text-red-300 font-medium">
									youngest MVP in league history in 2011 (22 years, 7 months)
								</span>
								, averaging 25.0 points, 7.7 assists and leading the Bulls to a
								62–20 record and the top seed in the East. He was a{" "}
								<span className="text-red-300 font-medium">
									three-time All-Star (2010–2012) and All-NBA First Team selection
									in 2011
								</span>
								.
								<br />
								<br />
								Over a 16-season career (2008–2024) with the Bulls, Knicks, Cavaliers,
								Timberwolves, Pistons and Grizzlies, Rose appeared in{" "}
								<span className="text-red-300 font-medium">
									723 games with career averages of 17.4 points, 5.2 assists and 3.2
									rebounds (12,573 total points)
								</span>
								, and{" "}
								<span className="text-red-300 font-medium">
									21.9 points per game across 52 playoff appearances
								</span>
								. His game was defined by explosive first steps, fearless drives, and
								creative finishes at the rim, later evolving into a crafty veteran
								guard with an improved floater and three-point shot.
							</>
						)}
					</p>
				</motion.div>
			</div>
		</>
	);
}
