import { ChevronDown, X } from "lucide-react";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";

export type SelectVariant = "default" | "filled" | "outline" | "ghost" | "alt";
export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
	label: string;
	value: string;
}

export interface SelectProps {
	options: SelectOption[];
	value?: string[];
	onChange?: (selectedValues: string[]) => void;
	multiple?: boolean;
	variant?: SelectVariant;
	size?: SelectSize;
	label?: string;
	placeholder?: string;
	error?: string;
	helperText?: string;
	disabled?: boolean;
	className?: string;
	containerClassName?: string;
	id?: string;
	maxHeight?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
	(
		{
			options,
			value = [],
			onChange,
			multiple = false,
			variant = "default",
			size = "md",
			label,
			placeholder = "Select options...",
			error,
			helperText,
			disabled = false,
			className = "",
			containerClassName = "",
			id,
			maxHeight = "200px",
		},
		ref,
	) => {
		const generatedId = useId();
		const selectId = id || generatedId;
		const [isOpen, setIsOpen] = useState(false);
		const [dropdownPosition, setDropdownPosition] = useState<{
			top: number;
			left: number;
			width: number;
		} | null>(null);
		const selectRef = useRef<HTMLDivElement>(null);
		const dropdownRef = useRef<HTMLDivElement>(null);

		const baseClasses =
			"flex w-full rounded-md border bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer";

		const variantClasses = {
			default: "bg-input border-input-border focus-visible:border-transparent",
			filled: "bg-input border-transparent focus-visible:border-transparent",
			outline: "bg-transparent border-input-border focus-visible:border-transparent",
			ghost: "bg-transparent border-transparent focus-visible:bg-input",
			alt: "bg-input-foreground border-input-foreground-border focus-visible:border-transparent",
		};

		const sizeClasses = {
			sm: "min-h-[32px] px-2 py-1 text-xs",
			md: "min-h-[40px] px-3 py-2 text-sm",
			lg: "min-h-[48px] px-4 py-3 text-base",
		};

		const labelClasses = [
			"block text-sm font-medium text-foreground mb-1",
			error ? "text-destructive" : "",
		]
			.filter(Boolean)
			.join(" ");

		const helperTextClasses = [
			"text-xs mt-1",
			error ? "text-destructive" : "text-muted-foreground",
		]
			.filter(Boolean)
			.join(" ");

		const selectedOptions = options.filter((option) =>
			value.includes(option.value),
		);

		const updateDropdownPosition = useCallback(() => {
			if (selectRef.current) {
				const rect = selectRef.current.getBoundingClientRect();
				const viewportHeight = window.innerHeight;
				const spaceBelow = viewportHeight - rect.bottom;
				const spaceAbove = rect.top;
				// Parse maxHeight (e.g., "200px" -> 200)
				const dropdownHeight = parseInt(maxHeight, 10) || 200;

				// Position below if there's enough space, otherwise above
				const top =
					spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove
						? rect.bottom + 4
						: rect.top - dropdownHeight - 4;

				setDropdownPosition({
					top,
					left: rect.left,
					width: rect.width,
				});
			}
		}, [maxHeight]);

		const handleToggle = () => {
			if (!disabled) {
				const newOpen = !isOpen;
				if (newOpen) {
					// Calculate position synchronously before opening
					updateDropdownPosition();
					setIsOpen(true);
				} else {
					setIsOpen(false);
					setDropdownPosition(null);
				}
			}
		};

		const handleOptionClick = (optionValue: string) => {
			if (disabled) return;

			if (multiple) {
				const newValue = value.includes(optionValue)
					? value.filter((v) => v !== optionValue)
					: [...value, optionValue];
				onChange?.(newValue);
			} else {
				
				onChange?.(value.includes(optionValue) ? [] : [optionValue]);
				setIsOpen(false);
			}
		};

		const handleRemove = (optionValue: string, e: React.MouseEvent) => {
			e.stopPropagation();
			if (multiple && onChange) {
				onChange(value.filter((v) => v !== optionValue));
			}
		};

		// Update position on scroll/resize when open
		useEffect(() => {
			if (isOpen) {
				window.addEventListener("scroll", updateDropdownPosition, true);
				window.addEventListener("resize", updateDropdownPosition);
				return () => {
					window.removeEventListener("scroll", updateDropdownPosition, true);
					window.removeEventListener("resize", updateDropdownPosition);
				};
			}
		}, [isOpen, updateDropdownPosition]);

		// Close dropdown when clicking outside
		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					selectRef.current &&
					!selectRef.current.contains(event.target as Node) &&
					dropdownRef.current &&
					!dropdownRef.current.contains(event.target as Node)
				) {
					setIsOpen(false);
				}
			};

			if (isOpen) {
				document.addEventListener("mousedown", handleClickOutside);
				return () => {
					document.removeEventListener("mousedown", handleClickOutside);
				};
			}
		}, [isOpen]);

		const selectClasses = [
			baseClasses,
			variantClasses[variant],
			sizeClasses[size],
			error
				? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive"
				: "",
			className,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<div className={`space-y-1 ${containerClassName}`} ref={ref}>
				{label && (
					<label htmlFor={selectId} className={labelClasses}>
						{label}
					</label>
				)}
				<div className="relative" ref={selectRef}>
					<div
						id={selectId}
						className={`${selectClasses} flex items-center justify-between`}
						onClick={handleToggle}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								handleToggle();
							}
						}}
						tabIndex={disabled ? -1 : 0}
						role="combobox"
						aria-expanded={isOpen}
						aria-haspopup="listbox"
					>
						<div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
							{selectedOptions.length > 0 ? (
								selectedOptions.map((option) => (
									<span
										key={option.value}
										className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs"
									>
										{option.label}
										{multiple && (
											<button
												type="button"
												onClick={(e) => handleRemove(option.value, e)}
												className="hover:bg-primary/20 rounded-full p-0.5"
												aria-label={`Remove ${option.label}`}
											>
												<X className="h-3 w-3" />
											</button>
										)}
									</span>
								))
							) : (
								<span className="text-muted-foreground">{placeholder}</span>
							)}
						</div>
						<ChevronDown
							className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ml-2 ${
								isOpen ? "transform rotate-180" : ""
							}`}
						/>
					</div>
					{isOpen && dropdownPosition && (
						<div
							ref={dropdownRef}
							className="fixed z-[100] bg-card border border-input-border rounded-lg shadow-lg overflow-hidden"
							role="listbox"
							style={{
								maxHeight,
								width: `${dropdownPosition.width}px`,
								top: `${dropdownPosition.top}px`,
								left: `${dropdownPosition.left}px`,
							}}
						>
							<div className="overflow-y-auto" style={{ maxHeight }}>
								{options.map((option) => {
									const isSelected = value.includes(option.value);
									return (
										<div
											key={option.value}
											className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors ${
												isSelected ? "bg-primary/10" : ""
											}`}
											onClick={() => handleOptionClick(option.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													handleOptionClick(option.value);
												}
											}}
											tabIndex={0}
											role="option"
											aria-selected={isSelected}
										>
											{multiple && (
												<input
													type="checkbox"
													checked={isSelected}
													onChange={() => {}}
													className="h-4 w-4 rounded border-input-border text-primary focus:ring-primary"
												/>
											)}
											<span className="flex-1 text-sm text-foreground">
												{option.label}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
				{(error || helperText) && (
					<p className={helperTextClasses}>{error || helperText}</p>
				)}
			</div>
		);
	},
);

Select.displayName = "Select";

export default Select;

