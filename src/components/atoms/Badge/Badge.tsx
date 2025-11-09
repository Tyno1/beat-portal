import React from "react";

export type BadgeColor = "primary" | "secondary" | "destructive" | "success" | "info" | "warning" | "muted";
export type BadgeVariant = "solid" | "outline" | "dot";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	color?: BadgeColor;
	variant?: BadgeVariant;
	size?: BadgeSize;
	children: React.ReactNode;
	className?: string;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
	({ color = "primary", variant = "solid", size = "md", children, className = "", ...props }, ref) => {
		const baseClasses = "inline-flex items-center font-medium rounded-full transition-colors";

		// Color classes for solid variant
		const colorClasses = {
			primary: "bg-primary text-primary-foreground",
			secondary: "bg-secondary text-secondary-foreground",
			destructive: "bg-destructive text-destructive-foreground",
			success: "bg-badge-success text-badge-success-background",
			info: "bg-badge-info text-badge-info-background",
			warning: "bg-badge-warning text-badge-warning-background",
			muted: "bg-muted text-muted-foreground",
		};

		// Variant styles
		const getVariantClasses = () => {
			switch (variant) {
				case "solid":
					return colorClasses[color];
				case "outline": {
					const borderColors = {
						primary: "border-primary text-primary bg-transparent",
						secondary: "border-secondary text-secondary bg-transparent",
						destructive: "border-destructive text-destructive bg-transparent",
						success: "border-badge-success text-badge-success bg-transparent",
						info: "border-badge-info text-badge-info bg-transparent",
						warning: "border-badge-warning text-badge-warning bg-transparent",
						muted: "border-muted text-muted-foreground bg-transparent",
					};
					return `border ${borderColors[color]}`;
				}
				case "dot":
					return `${colorClasses[color]} relative`;
				default:
					return colorClasses.primary;
			}
		};

		const sizeClasses = {
			sm: "px-2 py-0.5 text-xs",
			md: "px-2.5 py-1 text-sm",
			lg: "px-3 py-1.5 text-base",
		};

		const badgeClasses = [
			baseClasses,
			getVariantClasses(),
			sizeClasses[size],
			className,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<span ref={ref} className={badgeClasses} {...props}>
				{children}
			</span>
		);
	},
);

Badge.displayName = "Badge";

export default Badge;
