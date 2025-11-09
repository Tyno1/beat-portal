import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from ".";

const meta: Meta<typeof Alert> = {
	title: "Molecules/Alert",
	component: Alert,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
	args: {
		variant: "success",
		title: "Success",
		description: "This is a success alert message.",
	},
};

export const Error: Story = {
	args: {
		variant: "error",
		title: "Error",
		description: "This is an error alert message.",
	},
};

export const Warning: Story = {
	args: {
		variant: "warning",
		title: "Warning",
		description: "This is a warning alert message.",
	},
};

export const Info: Story = {
	args: {
		variant: "info",
		title: "Info",
		description: "This is an info alert message.",
	},
};

export const Dismissible: Story = {
	args: {
		variant: "success",
		title: "Dismissible",
		description: "This alert can be dismissed.",
		dismissible: true,
	},
};

export const Small: Story = {
	args: {
		size: "sm",
		title: "Small Alert",
		description: "This is a small alert.",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		title: "Large Alert",
		description: "This is a large alert.",
	},
};

export const WithChildren: Story = {
	args: {
		variant: "info",
		title: "Custom Content",
		children: <p className="text-sm">This alert contains custom children content.</p>,
	},
};

