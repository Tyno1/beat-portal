import { X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Button, IconButton } from "../../atoms";
import type { ButtonColor, ButtonRadius, ButtonSize, ButtonVariant } from "../../atoms/types";

export interface ModalProps {
	children: React.ReactNode;
	open?: boolean;
	onClose: () => void;
	onOpen?: () => void;
	title?: string;
	trigger?: React.ReactNode;
	// Trigger button props
	buttonVariant?: ButtonVariant;
	buttonColor?: ButtonColor;
	buttonSize?: ButtonSize;
	buttonRadius?: ButtonRadius;
	// Modal content props
	size?: "sm" | "md" | "lg" | "xl" | "full";
	radius?: ButtonRadius;
	showCloseButton?: boolean;
	className?: string;
	contentClassName?: string;
	overlayClassName?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
		(
			{
				children,
				open,
				onClose,
				onOpen,
				title,
				trigger,
				buttonVariant = "solid",
				buttonColor = "primary",
				buttonSize = "md",
				buttonRadius = "xl",
				size = "md",
				radius = "xl",
				showCloseButton = true,
				className = "",
				contentClassName = "",
				overlayClassName = "",
			},
			ref,
		) => {
		const modalRef = useRef<HTMLDivElement>(null);
		const previousActiveElement = useRef<HTMLElement | null>(null);

		const sizeClasses = {
			sm: "max-w-md",
			md: "max-w-lg",
			lg: "max-w-2xl",
			xl: "max-w-4xl",
			full: "max-w-[95vw]",
		};

		const radiusClasses: Record<ButtonRadius, string> = {
			none: "rounded-none",
			sm: "rounded-sm",
			md: "rounded-md",
			lg: "rounded-lg",
			xl: "rounded-xl",
			full: "rounded-full",
		};

		const [internalOpen, setInternalOpen] = React.useState(false);
		const isControlled = open !== undefined;
		const modalOpen = isControlled ? open : internalOpen;

		const handleClose = React.useCallback(() => {
			if (!isControlled) {
				setInternalOpen(false);
			}
			onClose();
		}, [isControlled, onClose]);

		// Handle overlay click
		const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
			if (e.target === e.currentTarget) {
				handleClose();
			}
		};

		const handleOverlayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === "Escape") {
				handleClose();
			}
		};

		// Handle ESC key
		useEffect(() => {
			const handleEscape = (e: KeyboardEvent) => {
				if (e.key === "Escape" && modalOpen) {
					handleClose();
				}
			};

			document.addEventListener("keydown", handleEscape);
			return () => {
				document.removeEventListener("keydown", handleEscape);
			};
		}, [modalOpen, handleClose]);

		// Handle focus trap and body scroll lock
		useEffect(() => {
			if (modalOpen) {
				// Store previous active element
				previousActiveElement.current = document.activeElement as HTMLElement;

				// Lock body scroll
				document.body.style.overflow = "hidden";

				// Focus first focusable element
				const firstFocusable = modalRef.current?.querySelector(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
				) as HTMLElement;
				firstFocusable?.focus();

				return () => {
					// Restore body scroll
					document.body.style.overflow = "";
					// Restore focus
					previousActiveElement.current?.focus();
				};
			}
		}, [modalOpen]);

		const modalContent = (
			<>
				{modalOpen && (
					<div
						className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClassName}`}
						onClick={handleOverlayClick}
						onKeyDown={handleOverlayKeyDown}
						role="dialog"
						aria-modal="true"
						aria-labelledby={title ? "modal-title" : undefined}
						tabIndex={-1}
					>
						{/* Backdrop */}
						<div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

						{/* Modal */}
						<div
							ref={modalRef}
							className={`relative z-50 w-full ${sizeClasses[size]} bg-card border border-border ${radiusClasses[radius]} shadow-2xl ${contentClassName}`}
							onClick={(e) => e.stopPropagation()}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									e.stopPropagation();
								}
							}}
							role="document"
						>
							{/* Header */}
							{(title || showCloseButton) && (
								<div className="flex items-center justify-between p-6 border-b border-border">
									{title && (
										<h2
											id="modal-title"
											className="text-xl font-semibold text-foreground"
										>
											{title}
										</h2>
									)}
									{showCloseButton && (
										<IconButton
											icon={<X size={20} />}
											aria-label="Close modal"
											variant="ghost"
											size="sm"
											onClick={handleClose}
										/>
									)}
								</div>
							)}

							{/* Scrollable Content */}
							<div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
								<div className={`p-6 ${className}`}>{children}</div>
							</div>
						</div>
					</div>
				)}
			</>
		);

		// If trigger is provided, render button + modal
		if (trigger) {
			return (
				<div ref={ref} className="inline-block">
					<Button
						variant={buttonVariant}
						color={buttonColor}
						size={buttonSize}
						radius={buttonRadius}
						onClick={() => {
							if (!isControlled) {
								setInternalOpen(true);
							} else {
								onOpen?.();
							}
						}}
					>
						{trigger}
					</Button>
					{modalContent}
				</div>
			);
		}

		// Otherwise, just render the modal (controlled externally)
		return <>{modalContent}</>;
	},
);

Modal.displayName = "Modal";

export default Modal;

