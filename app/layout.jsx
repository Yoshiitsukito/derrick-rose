import "./globals.css";
import { Poppins, Jost } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { Analytics } from "@vercel/analytics/react";
import ClientTopProgressBar from "@/components/ClientTopProgressBar";
import ConditionalLayout from "@/components/ConditionalLayout";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	style: ["normal", "italic"],
	display: "swap",
	variable: "--font-poppins",
});

const jost = Jost({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
	variable: "--font-jost",
});

export const metadata = {
	metadataBase: new URL("https://derrick-rose.example.com"),
	title: "Derrick Rose | Official Style Portfolio",

	description:
		"Unofficial Derrick Rose personal-style site – career timeline, stats, merch, business ventures, and contact, inspired by his journey from Chicago’s Englewood to NBA MVP.",

	author: "Derrick Rose",
	siteUrl: "https://derrick-rose.example.com",
	applicationName: "Derrick Rose",

	keywords: [
		"Derrick Rose",
		"Derrick Martell Rose",
		"D Rose",
		"Chicago Bulls",
		"NBA MVP 2011",
		"Rose’s Flower Shop",
		"Coco5",
	],

	openGraph: {
		type: "website",
		url: "https://derrick-rose.example.com",
		title: "Derrick Rose | Official Style Portfolio",
		siteName: "Derrick Rose | Official Style Portfolio",
		description:
			"Career highlights, stats, merch and off-court ventures of Derrick Rose, the youngest MVP in NBA history.",
		images: [
			{
				url: "/og-image-rev.png",
				alt: "Derrick Rose",
				width: 1200,
				height: 630,
			},
		],
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Derrick Rose",
	url: "https://derrick-rose.example.com",
	jobTitle: "Professional Basketball Player (Retired)",
	worksFor: [],
	alumniOf: {
		"@type": "CollegeOrUniversity",
		name: "University of Memphis",
	},
	sameAs: [
		"https://www.nba.com/player/201565/derrick-rose",
		"https://www.basketball-reference.com/players/r/rosede01.html",
		"https://www.instagram.com/drose/",
	],
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={`${poppins.variable} ${jost.variable}`}>
			<body>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				<ClientTopProgressBar />
				<ConditionalLayout>
					{children}
				</ConditionalLayout>
				<Analytics />
			</body>
		</html>
	);
}
