import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "../../atoms/Button/Button";
import type { ButtonColor, ButtonRadius, ButtonSize, ButtonVariant } from "../../atoms/types";

export type PopoverVariant = "default" | "glass";
export type PopoverPlacement =
	| "top"
	| "bottom"
	| "left"
	| "right"
	| "top-start"
	| "top-end"
	| "bottom-start"
	| "bottom-end"
	| "left-start"
	| "left-end"
	| "right-start"
	| "right-end";

export interface PopoverProps {
	children: React.ReactNode;
	trigger: React.ReactNode;
	// Popover content props
	color?: ButtonColor;
	variant?: PopoverVariant;
	radius?: ButtonRadius;
	placement?: PopoverPlacement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
	contentClassName?: string;
	offset?: number;
	// Button trigger props
	buttonVariant?: ButtonVariant;
	buttonColor?: ButtonColor;
	buttonSize?: ButtonSize;
	buttonRadius?: ButtonRadius;
}

	const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
	(
		{
			children,
			trigger,
			color = "primary",
			variant = "default",
			radius = "lg",
			placement = "bottom",
			open: controlledOpen,
			onOpenChange,
			className = "",
			contentClassName = "",
			offset = 8,
			buttonVariant = "solid",
			buttonColor = "primary",
			buttonSize = "md",
			buttonRadius = "xl",
			...props
		},
		ref,
	) => {
		const [internalOpen, setInternalOpen] = useState(false);
		const isControlled = controlledOpen !== undefined;
		const open = isControlled ? controlledOpen : internalOpen;
		const triggerRef = useRef<HTMLDivElement>(null);
		const popoverRef = useRef<HTMLDivElement>(null);
		const [position, setPosition] = useState({ top: 0, left: 0 });

		const radiusClasses: Record<ButtonRadius, string> = {
			none: "rounded-none",
			sm: "rounded-sm",
			md: "rounded-md",
			lg: "rounded-lg",
			xl: "rounded-xl",
			full: "rounded-full",
		};

		// Color classes for glass variant
		const getGlassColorClasses = (): string => {
			const colorMap: Record<ButtonColor, string> = {
				primary: "bg-primary/20 text-primary-foreground",
				secondary: "bg-secondary/20 text-secondary-foreground",
				destructive: "bg-destructive/20 text-destructive-foreground",
				success: "bg-badge-success/20 text-badge-success",
				info: "bg-badge-info/20 text-badge-info",
				warning: "bg-badge-warning/20 text-badge-warning",
				muted: "bg-muted/20 text-muted-foreground",
			};
			return colorMap[color];
		};

		// Color classes for default variant
		const getDefaultColorClasses = (): string => {
			const colorMap: Record<ButtonColor, string> = {
				primary: "bg-primary text-primary-foreground",
				secondary: "bg-secondary text-secondary-foreground",
				destructive: "bg-destructive text-destructive-foreground",
				success: "bg-badge-success text-badge-success-background",
				info: "bg-badge-info text-badge-info-background",
				warning: "bg-badge-warning text-badge-warning-background",
				muted: "bg-muted text-muted-foreground",
			};
			return colorMap[color];
		};

		const getVariantClasses = (): string => {
			if (variant === "glass") {
				return `backdrop-blur-xl border border-white/20 ${getGlassColorClasses()}`;
			}
			return `${getDefaultColorClasses()} shadow-lg`;
		};

		const handleToggle = () => {
			const newOpen = !open;
			if (isControlled) {
				onOpenChange?.(newOpen);
			} else {
				setInternalOpen(newOpen);
			}
		};

		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				handleToggle();
			}
		};

		const calculatePosition = useCallback(() => {
			if (!triggerRef.current || !popoverRef.current) return;

			const triggerRect = triggerRef.current.getBoundingClientRect();
			const popoverRect = popoverRef.current.getBoundingClientRect();
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			let top = 0;
			let left = 0;

			const [primary, secondary] = placement.split("-");

			// Calculate primary position
			switch (primary) {
				case "top":
					top = triggerRect.top - popoverRect.height - offset;
					left =
						triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
					break;
				case "bottom":
					top = triggerRect.bottom + offset;
					left =
						triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
					break;
				case "left":
					top =
						triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
					left = triggerRect.left - popoverRect.width - offset;
					break;
				case "right":
					top =
						triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
					left = triggerRect.right + offset;
					break;
			}

			// Adjust for secondary placement
			if (secondary === "start") {
				if (primary === "top" || primary === "bottom") {
					left = triggerRect.left;
				} else {
					top = triggerRect.top;
				}
			} else if (secondary === "end") {
				if (primary === "top" || primary === "bottom") {
					left = triggerRect.right - popoverRect.width;
				} else {
					top = triggerRect.bottom - popoverRect.height;
				}
			}

			// Keep within viewport bounds
			left = Math.max(8, Math.min(left, viewportWidth - popoverRect.width - 8));
			top = Math.max(8, Math.min(top, viewportHeight - popoverRect.height - 8));

			setPosition({ top, left });
		}, [placement, offset]);

		useEffect(() => {
			if (open) {
				calculatePosition();
				const handleResize = () => calculatePosition();
				const handleScroll = () => calculatePosition();
				window.addEventListener("resize", handleResize);
				window.addEventListener("scroll", handleScroll, true);
				return () => {
					window.removeEventListener("resize", handleResize);
					window.removeEventListener("scroll", handleScroll, true);
				};
			}
		}, [open, calculatePosition]);

		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					open &&
					triggerRef.current &&
					popoverRef.current &&
					!triggerRef.current.contains(event.target as Node) &&
					!popoverRef.current.contains(event.target as Node)
				) {
					if (isControlled) {
						onOpenChange?.(false);
					} else {
						setInternalOpen(false);
					}
				}
			};

			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [open, isControlled, onOpenChange]);

		return (
			<div
				ref={ref}
				className={`relative inline-block ${className}`}
				{...props}
			>
				<div ref={triggerRef}>
					<Button
						variant={buttonVariant}
						color={buttonColor}
						size={buttonSize}
						radius={buttonRadius}
						onClick={handleToggle}
						onKeyDown={handleKeyDown}
						aria-expanded={open}
						aria-haspopup="true"
					>
						{trigger}
					</Button>
				</div>
				{open && (
					<div
						ref={popoverRef}
						className={`fixed z-50 ${getVariantClasses()} ${radiusClasses[radius]} ${contentClassName}`}
						style={{
							top: `${position.top}px`,
							left: `${position.left}px`,
						}}
						role="dialog"
						aria-modal="true"
					>
						{children}
					</div>
				)}
			</div>
		);
	},
);

Popover.displayName = "Popover";

export default Popover;
