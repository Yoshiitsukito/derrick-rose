const Button = ({ children, variation, ...props }) => (
	<button
		{...props}
		className={`title mr-2 md:mr-3 rounded-2xl px-4 md:px-8 py-2 md:py-2 shadow-md transition duration-300 ease-in-out text-sm md:text-base ${
			variation === "primary"
				? "bg-red-700 hover:bg-transparent border-transparent hover:border-red-700 border-2 text-white hover:text-red-700 box-border"
				: "transparent border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white box-border"
		}`}>
		{children}
	</button>
);

export default Button;