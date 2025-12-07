import type React from "react";
import type { LoadingSpinnerProps } from "../types";

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = "md",
	className = "",
}) => {
	const sizeClasses = {
		sm: "h-3 w-3",
		md: "h-4 w-4",
		lg: "h-5 w-5",
	};

	const spinnerClasses = ["animate-spin", sizeClasses[size], className]
		.filter(Boolean)
		.join(" ");
	return (
		<svg
			aria-label="Loading spinner"
			className={spinnerClasses}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			role="img"
		>
			<title>Loading spinner</title>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			/>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	);
};

export default LoadingSpinner;
