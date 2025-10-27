import type { Meta, StoryObj } from "@storybook/react";
import { Button } from ".";

const meta: Meta<typeof Button> = {
	title: "Atoms/Button",
	component: Button,
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
		variant: "solid",
		children: "Primary Button",
	},
};

export const Secondary: Story = {
	args: {
		color: "secondary",
		variant: "solid",
		children: "Secondary Button",
	},
};

export const Destructive: Story = {
	args: {
		color: "destructive",
		variant: "solid",
		children: "Destructive Button",
	},
};

export const Outline: Story = {
	args: {
		color: "primary",
		variant: "outline",
		children: "Outline Button",
	},
};

export const Ghost: Story = {
	args: {
		color: "primary",
		variant: "ghost",
		children: "Ghost Button",
	},
};

export const Small: Story = {
	args: {
		size: "sm",
		children: "Small Button",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		children: "Large Button",
	},
};

export const Loading: Story = {
	args: {
		loading: true,
		children: "Loading Button",
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		children: "Disabled Button",
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="space-y-4">
			<div className="space-x-2">
				<Button color="primary" variant="solid">Primary</Button>
				<Button color="secondary" variant="solid">Secondary</Button>
				<Button color="destructive" variant="solid">Destructive</Button>
			</div>
			<div className="space-x-2">
				<Button color="primary" variant="outline">Primary Outline</Button>
				<Button color="secondary" variant="outline">Secondary Outline</Button>
				<Button color="destructive" variant="outline">Destructive Outline</Button>
			</div>
			<div className="space-x-2">
				<Button color="primary" variant="ghost">Primary Ghost</Button>
				<Button color="secondary" variant="ghost">Secondary Ghost</Button>
				<Button color="destructive" variant="ghost">Destructive Ghost</Button>
			</div>
		</div>
	),
};

