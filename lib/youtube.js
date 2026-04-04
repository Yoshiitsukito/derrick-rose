/**
 * YouTube URL-ийг iframe embed-д зориулсан формат болгон хөрвүүлнэ.
 * watch?v=, youtu.be зэрэг хэлбэрүүдийг дэмжинэ.
 */
export function getYoutubeEmbedUrl(url) {
	if (!url || typeof url !== "string") return null;

	const trimmed = url.trim();
	if (!trimmed) return null;

	// youtube.com/watch?v=VIDEO_ID эсвэл youtube.com/v/VIDEO_ID
	const watchMatch = trimmed.match(
		/(?:youtube\.com\/watch\?v=|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/
	);
	if (watchMatch) {
		return `https://www.youtube.com/embed/${watchMatch[1]}`;
	}

	// youtu.be/VIDEO_ID
	const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
	if (shortMatch) {
		return `https://www.youtube.com/embed/${shortMatch[1]}`;
	}

	// Аль хэдийн embed хэлбэртэй бол шууд буцаана
	if (trimmed.includes("youtube.com/embed/")) {
		return trimmed;
	}

	return null;
}
