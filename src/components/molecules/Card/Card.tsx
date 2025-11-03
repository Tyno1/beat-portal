import React from "react";

export type CardVariant = "default" | "outlined" | "elevated" | "flat";
export type CardSize = "xs" | "sm" | "md" | "lg";
export type CardRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

export interface CardHeaderConfig {
	title?: string;
	button?: React.ReactNode;
	description?: string;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: CardVariant;
	size?: CardSize;
	radius?: CardRadius;
	children: React.ReactNode;
	className?: string;
	header?: CardHeaderConfig;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
	size?: CardSize;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
	size?: CardSize;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode;
	className?: string;
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode;
	className?: string;
}

const CardContext = React.createContext<{ size: CardSize }>({ size: "md" });

const Card = React.forwardRef<HTMLDivElement, CardProps>(
	({ variant = "default", size = "md", radius = "md", children, className = "", header, ...props }, ref) => {
		const baseClasses = "bg-card text-card-foreground transition-colors";

		const radiusClasses: Record<CardRadius, string> = {
			none: "rounded-none",
			sm: "rounded-sm",
			md: "rounded-md",
			lg: "rounded-lg",
			xl: "rounded-xl",
			"2xl": "rounded-2xl",
			"3xl": "rounded-3xl",
			full: "rounded-full",
		};

		const variantClasses = {
			default: "shadow-sm",
			outlined: "border border-card-border shadow-sm",
			elevated: "shadow-md",
			flat: "shadow-none",
		};

		const sizeClasses = {
			xs: "p-0",
			sm: "p-3",
			md: "p-4",
			lg: "p-6",
		};

		const cardClasses = [
			baseClasses,
			radiusClasses[radius],
			variantClasses[variant],
			sizeClasses[size],
			className,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<CardContext.Provider value={{ size }}>
				<div ref={ref} className={cardClasses} {...props}>
					{header && (
						<CardHeader size={size}>
							<div className="flex items-center justify-between mx-auto mb-2">
								<div>
									{header.title && <CardTitle>{header.title}</CardTitle>}
									{header.description && <CardDescription>{header.description}</CardDescription>}
								</div>
								{header.button && <div>{header.button}</div>}
							</div>
						</CardHeader>
					)}
					{children}
				</div>
			</CardContext.Provider>
		);
	},
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
	({ children, className = "", size, ...props }, ref) => {
		const context = React.useContext(CardContext);
		const finalSize = size ?? context.size;

		const sizeClasses: Record<CardSize, string> = {
			xs: "p-1",
			sm: "p-3",
			md: "p-4",
			lg: "p-6",
		};

		const headerClasses = [
			"flex flex-col space-y-1.5",
			sizeClasses[finalSize],
			className,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<div ref={ref} className={headerClasses} {...props}>
				{children}
			</div>
		);
	},
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
	({ children, className = "", size, ...props }, ref) => {
		const context = React.useContext(CardContext);
		const finalSize = size ?? context.size;

		const sizeClasses: Record<CardSize, string> = {
			xs: "p-1 pt-0",
			sm: "p-3 pt-0",
			md: "p-4 pt-0",
			lg: "p-6 pt-0",
		};

		const contentClasses = [
			sizeClasses[finalSize],
			className,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<div ref={ref} className={contentClasses} {...props}>
				{children}
			</div>
		);
	},
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
	({ children, className = "", ...props }, ref) => {
		const footerClasses = [
			"flex items-center p-6 pt-0",
			className,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<div ref={ref} className={footerClasses} {...props}>
				{children}
			</div>
		);
	},
);

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
	({ children, className = "", as: Component = "h3", ...props }, ref) => {
		const titleClasses = [
			"text-lg font-semibold leading-none tracking-tight text-card-header",
			className,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<Component ref={ref} className={titleClasses} {...props}>
				{children}
			</Component>
		);
	},
);

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
	({ children, className = "", ...props }, ref) => {
		const descriptionClasses = [
			"text-sm text-card-muted",
			className,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<p ref={ref} className={descriptionClasses} {...props}>
				{children}
			</p>
		);
	},
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";

export {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
	CardTitle,
	CardDescription,
};
