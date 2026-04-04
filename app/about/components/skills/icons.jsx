function ActivityIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<circle cx="12" cy="12" r="9" />
			<path d="M12 5.5v13" />
			<path d="M7.5 9.5c1.5 1 3 1.5 4.5 1.5s3-.5 4.5-1.5" />
		</svg>
	);
}

function CodepenIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M12 2 9.5 8.5 3 9.5 7.5 14 6.5 21 12 17.8 17.5 21 16.5 14 21 9.5 14.5 8.5 12 2Z" />
		</svg>
	);
}

function WebhookIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<path d="M12 21s-5-3.2-5-8.2C7 9 9 7 12 7s5 2 5 5.8c0 5-5 8.2-5 8.2Z" />
			<circle cx="12" cy="11" r="2.5" />
		</svg>
	);
}

function MobileIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<rect x="3" y="7" width="18" height="12" rx="3" ry="3" />
			<path d="M6 7V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2" />
			<path d="M8 21h8" />
		</svg>
	);
}

export { ActivityIcon, CodepenIcon, WebhookIcon, MobileIcon };