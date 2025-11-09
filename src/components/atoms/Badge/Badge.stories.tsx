import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from ".";

const meta: Meta<typeof Badge> = {
	title: "Atoms/Badge",
	component: Badge,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		color: "primary",
		variant: "outline",
		children: "Primary",
	},
};

export const Success: Story = {
	args: {
		color: "success",
		variant: "solid",
		children: "Success",
	},
};

export const Error: Story = {
	args: {
		color: "destructive",
		variant: "solid",
		children: "Error",
	},
};

export const Warning: Story = {
	args: {
		color: "warning",
		variant: "solid",
		children: "Warning",
	},
};

export const Info: Story = {
	args: {
		color: "info",
		variant: "solid",
		children: "Info",
	},
};

export const Outline: Story = {
	args: {
		color: "primary",
		variant: "outline",
		children: "Outline",
	},
};

export const Dot: Story = {
	args: {
		color: "success",
		variant: "dot",
		children: "Active",
	},
};

export const Small: Story = {
	args: {
		size: "sm",
		children: "Small",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		children: "Large",
	},
};

export const AllColors: Story = {
	render: () => (
		<div className="space-x-2">
			<Badge color="primary">Primary</Badge>
			<Badge color="secondary">Secondary</Badge>
			<Badge color="destructive">Destructive</Badge>
			<Badge color="success">Success</Badge>
			<Badge color="info">Info</Badge>
			<Badge color="warning">Warning</Badge>
			<Badge color="muted">Muted</Badge>
		</div>
	),
};

