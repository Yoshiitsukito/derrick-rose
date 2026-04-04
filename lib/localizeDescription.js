export function getLocalizedDescription(description, isMn) {
	if (!description || typeof description !== "string") return "";

	// Expected format inside `description`:
	// [[mn]] ... [[/mn]]
	// [[en]] ... [[/en]]
	// Be tolerant to whitespace: [[ mn ]] ... [[ /mn ]]
	const mnMatch = description.match(
		/\[\[\s*mn\s*\]\]([\s\S]*?)(\[\[\s*\/\s*mn\s*\]\]|$)/i,
	);
	const enMatch = description.match(
		/\[\[\s*en\s*\]\]([\s\S]*?)(\[\[\s*\/\s*en\s*\]\]|$)/i,
	);

	if (isMn && mnMatch?.[1]) return mnMatch[1].trim();
	if (!isMn && enMatch?.[1]) return enMatch[1].trim();

	// Fallback: if both exist but requested one is missing, still return any.
	if (mnMatch?.[1] && enMatch?.[1]) {
		return (isMn ? mnMatch[1] : enMatch[1]).trim();
	}

	// If the description isn't localized yet, return it as-is.
	return description.trim();
}

