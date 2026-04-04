"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import PropTypes from "prop-types";
import FallingPetals from "@/components/FallingPetals";

export default function BackgroundScroll({ children }) {
	const { scrollY } = useScroll();

	// Parallax-style movement: background moves slightly on scroll
	const y = useTransform(scrollY, [0, 1200], [0, -200]);

	return (
		<div className="relative min-h-screen">
			<motion.div
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 -z-10"
				style={{
					y,
					backgroundColor: "#0a0a0a",
					backgroundImage:
						"linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 50%, #050505 100%)",
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center top",
				}}
			/>

			{/* Унаж буй сарнайн дэлбээ — бүх хуудсанд */}
			<FallingPetals />

			<div className="relative z-10">{children}</div>
		</div>
	);
}

 BackgroundScroll.propTypes = {
 	children: PropTypes.node,
 };

