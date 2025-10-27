import React from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import type {
	BaseButtonProps,
	ButtonColor,
	ButtonRadius,
	ButtonSize,
	ButtonVariant,
} from "../types";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		BaseButtonProps {
	color?: ButtonColor;
	variant?: ButtonVariant;
	size?: ButtonSize;
	radius?: ButtonRadius;
	children: React.ReactNode;
	fullWidth?: boolean;
	iconBefore?: React.ReactNode;
	iconAfter?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			color = "primary",
			variant = "solid",
			size = "md",
			radius = "xl",
			children,
			loading = false,
			disabled = false,
			fullWidth = false,
			iconBefore,
			iconAfter,
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
			sm: "h-9 px-3 text-sm",
			md: "h-10 px-4 py-2",
			lg: "h-11 px-8 text-lg",
			icon: "h-10 w-10",
		};

		const widthClass = fullWidth ? "w-full" : "";

		const buttonClasses = [
			baseClasses,
			getVariantClasses(),
			sizeClasses[size],
			widthClass,
			className,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<button
				ref={ref}
				className={buttonClasses}
				disabled={disabled || loading}
				{...props}
			>
				{loading && (
					<LoadingSpinner
						size={size === "icon" ? "sm" : "sm"}
						className="mr-2"
					/>
				)}
				{iconBefore && <span className="mr-2">{iconBefore}</span>}
				{children}
				{iconAfter && <span className="ml-2">{iconAfter}</span>}
			</button>
		);
	},
);

Button.displayName = "Button";

export default Button;
