import React, { useState } from "react";
import { IconButton } from "../../atoms";

export type AlertVariant = "success" | "error" | "warning" | "info";
export type AlertSize = "sm" | "md" | "lg";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: AlertVariant;
	size?: AlertSize;
	title?: string;
	description?: string;
	children?: React.ReactNode;
	dismissible?: boolean;
	onDismiss?: () => void;
	icon?: React.ReactNode;
	className?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
	(
		{
			variant = "info",
			size = "md",
			title,
			description,
			children,
			dismissible = false,
			onDismiss,
			icon,
			className = "",
			...props
		},
		ref,
	) => {
		const [isVisible, setIsVisible] = useState(true);

		const handleDismiss = () => {
			setIsVisible(false);
			onDismiss?.();
		};

		if (!isVisible) {
			return null;
		}

		const baseClasses = "rounded-lg border p-4 transition-all duration-200";

		const variantClasses = {
			success: "bg-alert-success-background border-alert-success-border text-alert-success",
			error: "bg-alert-error-background border-alert-error-border text-alert-error",
			warning: "bg-alert-warning-background border-alert-warning-border text-alert-warning",
			info: "bg-alert-info-background border-alert-info-border text-alert-info",
		};

		const sizeClasses = {
			sm: "p-3 text-sm",
			md: "p-4 text-sm",
			lg: "p-6 text-base",
		};

		const iconSizeClasses = {
			sm: "h-4 w-4",
			md: "h-5 w-5",
			lg: "h-6 w-6",
		};

		const alertClasses = [
			baseClasses,
			variantClasses[variant],
			sizeClasses[size],
			className,
		]
			.filter(Boolean)
			.join(" ");

		const defaultIcons = {
			success: (
				<svg
					className={iconSizeClasses[size]}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 13l4 4L19 7"
					/>
				</svg>
			),
			error: (
				<svg
					className={iconSizeClasses[size]}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			),
			warning: (
				<svg
					className={iconSizeClasses[size]}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
					/>
				</svg>
			),
			info: (
				<svg
					className={iconSizeClasses[size]}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			),
		};

		const displayIcon = icon || defaultIcons[variant];

		return (
			<div ref={ref} className={alertClasses} role="alert" {...props}>
				<div className="flex items-start">
					{displayIcon && (
						<div className="flex-shrink-0 mr-3 mt-0.5">
							{displayIcon}
						</div>
					)}
					<div className="flex-1">
						{title && (
							<h3 className="font-medium mb-1">{title}</h3>
						)}
						{description && (
							<p className="opacity-90">{description}</p>
						)}
						{children && !title && !description && (
							<div>{children}</div>
						)}
						{children && (title || description) && (
							<div className="mt-2">{children}</div>
						)}
					</div>
					{dismissible && (
						<div className="flex-shrink-0 ml-3">
							<IconButton
								variant="ghost"
								size="sm"
								icon={
									<svg
										className="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								}
								aria-label="Dismiss alert"
								onClick={handleDismiss}
							/>
						</div>
					)}
				</div>
			</div>
		);
	},
);

Alert.displayName = "Alert";

export default Alert;
