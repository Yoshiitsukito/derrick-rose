"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CodepenIcon, WebhookIcon, ActivityIcon, MobileIcon } from "./icons";
import { useLocale } from "@/lib/useLocale";

const skillCategories = {
	oncourt: {
		title: "On-Court Skills",
		icon: CodepenIcon,
		description:
			"Explosive point guard play – хурд, довтолгоо, шийдвэр гаргалт.",
		languages: [
			{
				name: "Explosive first step",
				nameMn: "Тэсрэлттэй анхны алхам",
			 highlight: true },
			{
				name: "Rim finishing & acrobatics",
				nameMn: "Саван дээрээс өндөр finish, акробатик довтолгоо",
				highlight: true,
			},
			{
				name: "Pick-and-roll playmaking",
				nameMn: "Pick-and-roll шийдвэр гаргалт",
				highlight: true,
			},
			{
				name: "Midrange & floater game",
				nameMn: "Midrange ба floater тоглолт",
				highlight: true,
			},
			{
				name: "Clutch scoring",
				nameMn: "Шийдвэрлэх мөчийн оноо авах чадвар",
				highlight: true,
			},
			{
				name: "Transition offense",
				nameMn: "Шуурхай сөрөг довтолгоо",
				highlight: false,
			},
			{
				name: "Footwork & balance",
				nameMn: "Хөлийн ажил ба тэнцвэр",
				highlight: false,
			},
		],
		tools: [
			"Chicago Bulls offense",
			"Tom Thibodeau system",
			"Isolation scoring",
			"Pick-and-roll reads",
			"Late-game execution",
		],
	},
	mindset: {
		title: "Mindset & Leadership",
		icon: WebhookIcon,
		description:
			"Resilience through injury, Chicago toughness, багийн лидер байх.",
		languages: [
			{
				name: "Resilience after ACL & meniscus injuries",
				nameMn: "ACL, менисксэн гэмтлийн дараах тэсвэр хатуужил",
				highlight: true,
			},
			{
				name: "Work ethic & discipline",
				nameMn: "Хөдөлмөрч байдал ба сахилга бат",
				highlight: true,
			},
			{
				name: "Chicago South Side mentality",
				nameMn: "Chicago South Side сэтгэлгээ",
				highlight: true,
			},
			{
				name: "Locker room leadership",
				nameMn: "Багийн өрөөний лидершип",
				highlight: true,
			},
			{
				name: "Mentorship for young players",
				nameMn: "Залуу тоглогчдод ментор байх",
				highlight: false,
			},
			{
				name: "Composure under pressure",
				nameMn: "Дарамттай үед тайван байдлаа хадгалах",
				highlight: false,
			},
		],
		tools: [
			"Comeback seasons",
			"Playoff runs with Bulls & Knicks",
			"Veteran presence",
			"Media & fan expectations",
		],
	},
	legacy: {
		title: "Career Legacy",
		icon: ActivityIcon,
		description: "NBA шагнал, рекорд, Chicago Bulls домог болсон түүх.",
		languages: [
			{
				name: "2008 No.1 Overall Pick",
				nameMn: "2008 оны №1 нийтлэг сонголт",
				highlight: true,
			},
			{
				name: "2009 Rookie of the Year",
				nameMn: "2009 оны Шилдэг шинэ тоглогч",
				highlight: true,
			},
			{
				name: "2011 NBA MVP (youngest ever)",
				nameMn: "2011 оны NBA MVP (хамгийн залуу MVP)",
				highlight: true,
			},
			{
				name: "3× NBA All-Star",
				nameMn: "3 удаагийн NBA All-Star",
				highlight: true,
			},
			{
				name: "All-NBA First Team 2011",
				nameMn: "2011 оны All-NBA First Team",
				highlight: true,
			},
			{
				name: "50-point game (2018)",
				nameMn: "50 онооны тоглолт (2018)",
				highlight: true,
			},
			{
				name: "Bulls No.1 jersey retired 2026",
				nameMn: "Bulls-ын №1 дугаарыг 2026 онд тэтгэвэрт гаргасан",
				highlight: true,
			},
		],
		tools: [
			"United Center legacy",
			"Global fanbase",
			"Highlight reels & documentaries",
			"What-if conversations",
		],
	},
	offcourt: {
		title: "Off-Court Ventures",
		icon: MobileIcon,
		description:
			"Бизнес, буяны ажил, гэр бүл – сагсан бөмбөгөөс цаашхи амьдрал.",
		languages: [
			{
				name: "Rose’s Flower Shop",
				nameMn: "Rose’s Flower Shop",
				highlight: true,
			},
			{
				name: "Coco5 investment",
				nameMn: "Coco5-д хийсэн хөрөнгө оруулалт",
				highlight: true,
			},
			{
				name: "Freestyle Chess backing",
				nameMn: "Freestyle Chess-д дэмжлэг, хөрөнгө оруулалт",
				highlight: true,
			},
			{
				name: "Real estate development",
				nameMn: "Үл хөдлөх хөрөнгийн төслүүд",
				highlight: false,
			},
			{
				name: "Sloomoo investment",
				nameMn: "Sloomoo компанид хөрөнгө оруулалт",
				highlight: false,
			},
			{
				name: "Rose Scholars program",
				nameMn: "Rose Scholars тэтгэлэг",
				highlight: true,
			},
			{
				name: "The PoohPrint (book)",
				nameMn: "“The PoohPrint” (ном)",
				highlight: true,
			},
		],
		tools: [
			"Business ownership",
			"Community initiatives",
			"Youth mentorship",
			"Brand partnerships (Adidas, etc.)",
		],
	},
};

function SkillCard({ skill, isSelected, onClick }) {
	const Icon = skill.icon;

	return (
		<motion.div
			onClick={onClick}
			className={`relative cursor-pointer group p-6 rounded-2xl border transition-all duration-300 ${
				isSelected
					? "bg-neutral-900 border-red-700 border-2 shadow-lg"
					: "bg-neutral-800/80 border-gray-500/40 hover:bg-neutral-700/80 hover:border-gray-300/60"
			}`}
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.97 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}>
			{/* Glow effect - removed for selected state */}
			{!isSelected && (
				<div className="absolute inset-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-50 bg-gradient-to-r from-gray-400/20 to-gray-600/20 blur-xl" />
			)}

			<div className="relative z-10 flex flex-col items-center text-center space-y-4">
				<div
					className={`p-4 rounded-xl transition-all duration-300 ${
						isSelected
							? "bg-red-700/50"
							: "bg-neutral-700/80 group-hover:bg-neutral-600/80"
					}`}>
					<Icon className="w-8 h-8 text-white" />
				</div>
				<div>
					<h3 className="font-semibold text-white text-lg mb-2">
						{skill.title}
					</h3>
					<p className="text-gray-200 text-sm leading-relaxed">
						{skill.description}
					</p>
				</div>
			</div>
		</motion.div>
	);
}
const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

function SkillDetails({ selectedSkill }) {
	const locale = useLocale();
	const isMn = locale === "mn";
  if (!selectedSkill) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mt-12 space-y-8"
    >
      <motion.div
        className="bg-neutral-900/90 border border-red-700/70 rounded-2xl p-8 shadow-lg"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">
          Focus Areas / Гол хүчтэй талууд
        </h3>
        <motion.div
          key={selectedSkill.title}
          className="flex flex-wrap justify-center gap-3"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }}
          initial="hidden"
          animate="show"
        >
          {selectedSkill.languages.map((skill) => (
            <motion.span
              key={skill.name}
              variants={tagVariants}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-default flex items-center gap-2
                ${
                  skill.highlight
                    ? "bg-red-700 text-white shadow-md border-red-400 scale-105 z-10 hover:shadow-lg"
                    : "bg-gradient-to-r from-neutral-700 to-neutral-800 border border-gray-500/60 text-gray-100 hover:bg-neutral-600"
                }`}
            >
              {skill.highlight && (
                <span className="text-yellow-400 text-[10px] animate-pulse">✦</span>
              )}
              {isMn && skill.nameMn ? skill.nameMn : skill.name}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-neutral-900/80 border border-gray-500/60 rounded-2xl p-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-medium text-gray-200 mb-6 text-center uppercase tracking-wider">
          Context & Environment / Орчин, систем
        </h3>
        <motion.div
          key={selectedSkill.title + "-tools"}
          className="flex flex-wrap justify-center gap-3"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }}
          initial="hidden"
          animate="show"
        >
          {selectedSkill.tools.map((tool) => (
            <motion.span
              key={tool}
              variants={tagVariants}
              className="px-4 py-1.5 bg-neutral-800 border border-gray-500/60 rounded-lg text-gray-100 text-xs font-medium"
            >
              {tool}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
	const [selectedCategory, setSelectedCategory] = useState("oncourt");
	const locale = useLocale();
	const isMn = locale === "mn";
	return (
		<div className="relative">
			<div className="mx-auto container px-6 py-20">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center space-y-4 mb-16">
					<h2 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
						{isMn ? "Ур чадвар & Өөрийн үнэмлэхүй төрх" : "Skills & Identity"}
					</h2>
					<p className="text-gray-200 max-w-2xl mx-auto text-lg leading-relaxed">
						{isMn
							? "Derrick Rose-ийн талбай дээрх ур чадвар, сэтгэлгээ, өв соёл, бизнесийн замналыг өөр өөр өнцгөөс хараарай. Доорх ангиллуудаас сонгож дэлгэрэнгүй мэдээлэл үзнэ үү."
							: "Explore Derrick Rose’s on-court skills, mindset, legacy and off-court ventures from different angles. Tap a category to see more detail."}
					</p>
				</motion.div>

				{/* Skill Categories Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{Object.entries(skillCategories).map(([key, skill], index) => (
						<motion.div
							key={key}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}>
							<SkillCard
								skill={skill}
								isSelected={selectedCategory === key}
								onClick={() => setSelectedCategory(key)}
							/>
						</motion.div>
					))}
				</div>

				{/* Skill Details */}
				<AnimatePresence mode="wait">
					<SkillDetails selectedSkill={skillCategories[selectedCategory]} />
				</AnimatePresence>
			</div>
		</div>
	);
}
