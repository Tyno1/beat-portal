import React from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import type {
	BaseButtonProps,
	ButtonColor,
	ButtonRadius,
	ButtonVariant,
	IconButtonSize,
} from "../types";

export interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		BaseButtonProps {
	color?: ButtonColor;
	variant?: ButtonVariant;
	size?: IconButtonSize;
	radius?: ButtonRadius;
	icon: React.ReactNode;
	"aria-label": string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
			color = "primary",
			variant = "solid",
			size = "md",
			radius = "md",
			icon,
			loading = false,
			disabled = false,
			className = "",
			...props
		},
		ref,
	) => {
		const radiusClasses = {
			none: "rounded-none",
			sm: "rounded-sm",
			md: "rounded-md",
			lg: "rounded-lg",
			xl: "rounded-xl",
			full: "rounded-full",
		};

		const baseClasses =
			`inline-flex items-center justify-center font-medium ${radiusClasses[radius]} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`;

		// Color classes for solid variant
		const colorClasses = {
			primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
			secondary: "bg-secondary text-secondary-foreground hover:opacity-90 shadow-sm",
			destructive: "bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm",
			success: "bg-badge-success text-badge-success-background hover:opacity-90 shadow-sm",
			info: "bg-badge-info text-badge-info-background hover:opacity-90 shadow-sm",
			warning: "bg-badge-warning text-badge-warning-background hover:opacity-90 shadow-sm",
			muted: "bg-muted text-muted-foreground hover:opacity-90 shadow-sm",
		};

		// Variant styles
		const getVariantClasses = () => {
			switch (variant) {
				case "solid":
					return colorClasses[color];
				case "outline": {
					const borderColors = {
						primary: "border-primary text-primary hover:bg-primary/10",
						secondary: "border-secondary text-secondary hover:bg-secondary/10",
						destructive: "border-destructive text-destructive hover:bg-destructive/10",
						success: "border-badge-success text-badge-success hover:bg-badge-success/10",
						info: "border-badge-info text-badge-info hover:bg-badge-info/10",
						warning: "border-badge-warning text-badge-warning hover:bg-badge-warning/10",
						muted: "border-muted text-muted-foreground hover:bg-muted/10",
					};
					return `border ${borderColors[color]} bg-transparent shadow-sm`;
				}
				case "ghost": {
					const ghostColors = {
						primary: "text-primary",
						secondary: "text-secondary",
						destructive: "text-destructive",
						success: "text-badge-success",
						info: "text-badge-info",
						warning: "text-badge-warning",
						muted: "text-muted-foreground",
					};
					return `bg-white/10 backdrop-blur-sm border border-white/20 ${ghostColors[color]} hover:bg-white/20 hover:border-white/30 transition-all`;
				}
				case "plain": {
					const plainColors = {
						primary: "text-primary",
						secondary: "text-secondary",
						destructive: "text-destructive",
						success: "text-badge-success",
						info: "text-badge-info",
						warning: "text-badge-warning",
						muted: "text-muted-foreground",
					};
					return `bg-transparent ${plainColors[color]} hover:opacity-70`;
				}
				default:
					return colorClasses.primary;
			}
		};

		const sizeClasses = {
			sm: "h-7 w-7",
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
			getVariantClasses(),
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
					<span className={`${iconClasses} flex items-center justify-center w-full h-full`}>{icon}</span>
				)}
			</button>
		);
	},
);

IconButton.displayName = "IconButton";

export default IconButton;
