"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

// Сарнайн дэлбээний SVG (улаан сарнай)
const PetalSvg = ({ className }) => (
	<svg
		viewBox="0 0 24 40"
		className={className}
		aria-hidden="true"
	>
		<ellipse cx="12" cy="20" rx="10" ry="18" fill="currentColor" />
		<path
			d="M12 2 Q18 12 12 20 Q6 12 12 2"
			fill="currentColor"
			opacity="0.9"
		/>
	</svg>
);

const PETAL_COUNT = 14;

function randomBetween(min, max) {
	return min + Math.random() * (max - min);
}

export default function FallingPetals() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const petals = useMemo(
		() =>
			Array.from({ length: PETAL_COUNT }, (_, i) => ({
				id: i,
				left: randomBetween(0, 100),
				delay: randomBetween(0, 12),
				duration: randomBetween(8, 18),
				size: randomBetween(8, 22),
				rotate: randomBetween(-180, 180),
				sway: randomBetween(30, 80),
				repeatDelay: randomBetween(0, 4),
				extraRotate: randomBetween(180, 360),
				color: ["#ff3333", "#ff0000", "#ff4444", "#ff2222", "#ff6666"][
					i % 5
				],
			})),
		[]
	);

	if (!mounted) return null;

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 overflow-hidden z-[1]"
		>
			{petals.map((p) => (
				<motion.div
					key={p.id}
					className="absolute"
					style={{
						left: `${p.left}%`,
						top: "-5%",
						width: p.size,
						height: p.size * 1.6,
						color: p.color,
						filter: "drop-shadow(0 0 2px rgba(0,0,0,0.2))",
					}}
					initial={{ y: -50, x: 0, rotate: p.rotate }}
					animate={{
						y: "110vh",
						x: [0, p.sway, -p.sway * 0.5, p.sway * 0.3, 0],
						rotate: p.rotate + p.extraRotate,
					}}
					transition={{
						duration: p.duration,
						delay: p.delay,
						repeat: Infinity,
						repeatDelay: p.repeatDelay,
					}}
				>
					<PetalSvg className="w-full h-full block" />
				</motion.div>
			))}
		</div>
	);
}
