import { motion } from "framer-motion";

function Wrapper({ children }) {
	return (
		<div className="mx-auto container gap-10 p-10 grid grid-cols-1 my-10">
			<motion.div
				className="flex justify-center items-start flex-col mb-5"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}>
				{children}
			</motion.div>
		</div>
	);
}

export default function Education() {
	return (
		<Wrapper>
			<section className="grid gap-8 md:gap-12">
				<motion.div
					className="text-center space-y-2"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
						Stats &amp; Honors
					</h1>
					<p className="text-muted-foreground max-w-[800px] mx-auto">
						Derrick Rose-ийн карьерийн үндсэн статистик, шагнал урамшуулал (Career overview).
					</p>
				</motion.div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<motion.div
						className="px-5 space-y-4"
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}>
						<h2 className="font-semibold text-xl mb-2">
							Career Averages (Regular Season) / Карьерийн дундаж
						</h2>
						<ul className="space-y-2 text-gray-700 text-lg">
							<li>
								<span className="font-semibold text-black">Games / Тоглолт:</span>{" "}
								723 (16 seasons)
							</li>
							<li>
								<span className="font-semibold text-black">Points / Оноо:</span>{" "}
								17.4 PPG (нийт 12,573 оноо)
							</li>
							<li>
								<span className="font-semibold text-black">Assists / Дамжуулалт:</span>{" "}
								5.2 APG (3,770 assist)
							</li>
							<li>
								<span className="font-semibold text-black">Rebounds / Самбар:</span>{" "}
								3.2 RPG (2,324 rebound)
							</li>
							<li>
								<span className="font-semibold text-black">Field Goal %:</span> 45.6%
							</li>
							<li>
								<span className="font-semibold text-black">3-Point %:</span> 31.6%
							</li>
							<li>
								<span className="font-semibold text-black">Free Throw %:</span> 83.1%
							</li>
						</ul>
						<div className="mt-4">
							<h3 className="font-semibold text-lg mb-1">
								Playoffs / Плейоффын дундаж
							</h3>
							<p className="text-gray-700">
								52 тоглолт • 21.9 PPG • 6.3 APG • 4.3 RPG • 42.6% FG • 32.2% 3P • 84.5% FT
							</p>
						</div>
					</motion.div>
					<motion.div
						className="px-5 space-y-4"
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}>
						<h2 className="font-semibold text-xl mb-2">
							Awards &amp; Milestones / Шагнал ба оргил мөчүүд
						</h2>
						<ul className="space-y-2 text-gray-700 text-lg">
							<li>• 2011 NBA Most Valuable Player (хамгийн залуу MVP)</li>
							<li>• 2009 NBA Rookie of the Year</li>
							<li>• 3× NBA All-Star (2010–2012)</li>
							<li>• All-NBA First Team (2011)</li>
							<li>• 50-point career-high game (2018, Minnesota Timberwolves)</li>
							<li>• Chicago Bulls №1 jersey retired (January 24, 2026)</li>
							<li>• 2007 Illinois Mr. Basketball, McDonald&apos;s All-American</li>
						</ul>
						<div className="mt-4 text-sm text-gray-600 space-y-1">
							<p>
								Detailed stats / Дэлгэрэнгүй статистик:{" "}
								<a
									href="https://www.basketball-reference.com/players/r/rosede01.html"
									target="_blank"
									rel="noopener noreferrer"
									className="underline">
									Basketball-Reference
								</a>
								,{" "}
								<a
									href="https://www.nba.com/player/201565/derrick-rose"
									target="_blank"
									rel="noopener noreferrer"
									className="underline">
									NBA.com
								</a>
								,{" "}
								<a
									href="https://www.espn.com/nba/player/stats/_/id/3456/derrick-rose"
									target="_blank"
									rel="noopener noreferrer"
									className="underline">
									ESPN
								</a>
								.
							</p>
							<p>
								Jersey retirement / Дугаар тэтгэвэрт гаргах ёслол:{" "}
								<a
									href="https://www.youtube.com/watch?v=lyRun1IlMt4"
									target="_blank"
									rel="noopener noreferrer"
									className="underline">
									Full Bulls ceremony (YouTube)
								</a>
								.
							</p>
						</div>
					</motion.div>
				</div>
			</section>
		</Wrapper>
	);
}
