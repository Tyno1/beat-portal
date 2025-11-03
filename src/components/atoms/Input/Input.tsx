import React from "react";

export type InputVariant = "default" | "filled" | "outline" | "ghost" | "alt";
export type InputSize = "sm" | "md" | "lg";
export type InputType = 
	| "text" 
	| "email" 
	| "password" 
	| "number" 
	| "tel" 
	| "url" 
	| "search" 
	| "date" 
	| "time" 
	| "datetime-local";

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	variant?: InputVariant;
	size?: InputSize;
	type?: InputType;
	label?: string;
	placeholder?: string;
	error?: string;
	helperText?: string;
	required?: boolean;
	disabled?: boolean;
	loading?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	className?: string;
	containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			variant = "default",
			size = "md",
			type = "text",
			label,
			placeholder,
			error,
			helperText,
			required = false,
			disabled = false,
			loading = false,
			leftIcon,
			rightIcon,
			className = "",
			containerClassName = "",
			id,
			...props
		},
		ref,
	) => {
		const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;

		const baseClasses =
			"flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors";

		const variantClasses = {
			default: "bg-input border-input-border focus:border-input-focus-border",
			filled: "bg-input border-transparent focus:border-input-focus-border",
			outline: "bg-transparent border-input-border focus:border-input-focus-border",
			ghost: "bg-transparent border-transparent focus:bg-input",
			alt: "bg-input-foreground border-input-foreground-border focus:border-input-foreground-focus-border",
		};

		const sizeClasses = {
			sm: "h-8 px-2 text-xs",
			md: "h-10 px-3 text-sm",
			lg: "h-12 px-4 text-base",
		};

		const iconSizeClasses = {
			sm: "h-3 w-3",
			md: "h-4 w-4",
			lg: "h-5 w-5",
		};

		const inputClasses = [
			baseClasses,
			variantClasses[variant],
			sizeClasses[size],
			error ? "border-destructive focus:border-destructive" : "",
			leftIcon ? "pl-10" : "",
			rightIcon || loading ? "pr-10" : "",
			className,
		]
			.filter(Boolean)
			.join(" ");

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

		return (
			<div className={`space-y-1 ${containerClassName}`}>
				{label && (
					<label htmlFor={inputId} className={labelClasses}>
						{label}
						{required && <span className="text-destructive ml-1">*</span>}
					</label>
				)}
				<div className="relative">
					{leftIcon && (
						<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
							<span className={iconSizeClasses[size]}>{leftIcon}</span>
						</div>
					)}
					<input
						ref={ref}
						id={inputId}
						type={type}
						className={inputClasses}
						placeholder={placeholder}
						disabled={disabled || loading}
						required={required}
						{...props}
					/>
					{(rightIcon || loading) && (
						<div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
							{loading ? (
								<svg
									className={`${iconSizeClasses[size]} animate-spin`}
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
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
							) : (
								<span className={iconSizeClasses[size]}>{rightIcon}</span>
							)}
						</div>
					)}
				</div>
				{(error || helperText) && (
					<p className={helperTextClasses}>
						{error || helperText}
					</p>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";

export default Input;
