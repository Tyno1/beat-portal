import React from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import type {
	BaseButtonProps,
	IconButtonSize,
	IconButtonVariant,
} from "../types";

export interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		BaseButtonProps {
	variant?: IconButtonVariant;
	size?: IconButtonSize;
	icon: React.ReactNode;
	"aria-label": string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
			variant = "primary",
			size = "md",
			icon,
			loading = false,
			disabled = false,
			className = "",
			...props
		},
		ref,
	) => {
		const baseClasses =
			"inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

		const variantClasses = {
			primary: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
			destructive:
				"bg-destructive text-destructive-foreground hover:bg-destructive/90",
			outline:
				"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
			ghost: "hover:bg-accent hover:text-accent-foreground",
		};

		const sizeClasses = {
			sm: "h-8 w-8",
			md: "h-10 w-10",
			lg: "h-12 w-12",
		};

		const iconSizeClasses = {
			sm: "h-4 w-4",
			md: "h-5 w-5",
			lg: "h-6 w-6",
		};

		const buttonClasses = [
			baseClasses,
			variantClasses[variant],
			sizeClasses[size],
			className,
		]
			.filter(Boolean)
			.join(" ");

		const iconClasses = [iconSizeClasses[size], loading ? "animate-spin" : ""]
			.filter(Boolean)
			.join(" ");

		return (
			<button
				ref={ref}
				className={buttonClasses}
				disabled={disabled || loading}
				{...props}
			>
				{loading ? (
					<LoadingSpinner size={size} className={iconClasses} />
				) : (
					<span className={iconClasses}>{icon}</span>
				)}
			</button>
		);
	},
);

IconButton.displayName = "IconButton";

export default IconButton;
