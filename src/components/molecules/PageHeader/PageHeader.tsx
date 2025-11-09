import type { ReactNode } from "react";

interface PageHeaderProps {
	title: string;
	children?: ReactNode;
}

export default function PageHeader({ title, children }: PageHeaderProps) {
	return (
		<div className="flex justify-between items-center border-b border-border pb-4 mb-6">
			<h1 className="text-2xl font-bold text-foreground">{title}</h1>
			{children && <div className="flex gap-3">{children}</div>}
		</div>
	);
}

