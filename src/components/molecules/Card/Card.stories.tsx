import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../atoms/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./Card";

const meta: Meta<typeof Card> = {
	title: "Molecules/Card",
	component: Card,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card>
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card description goes here.</CardDescription>
			</CardHeader>
			<CardContent>
				<p>This is the card content.</p>
			</CardContent>
			<CardFooter>
				<Button>Action</Button>
			</CardFooter>
		</Card>
	),
};

export const Outlined: Story = {
	render: () => (
		<Card variant="outlined">
			<CardHeader>
				<CardTitle>Outlined Card</CardTitle>
				<CardDescription>This card has an outlined border.</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Content for outlined card.</p>
			</CardContent>
		</Card>
	),
};

export const Elevated: Story = {
	render: () => (
		<Card variant="elevated">
			<CardHeader>
				<CardTitle>Elevated Card</CardTitle>
				<CardDescription>This card has elevation.</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Content for elevated card.</p>
			</CardContent>
		</Card>
	),
};

export const WithHeader: Story = {
	render: () => (
		<Card
			header={{
				title: "Header Title",
				description: "Header description",
				button: <Button size="sm">Action</Button>,
			}}
		>
			<CardContent>
				<p>This card uses the header prop for a cleaner API.</p>
			</CardContent>
		</Card>
	),
};

export const Small: Story = {
	render: () => (
		<Card size="sm">
			<CardHeader>
				<CardTitle>Small Card</CardTitle>
			</CardHeader>
			<CardContent>
				<p>Small card content.</p>
			</CardContent>
		</Card>
	),
};

export const Large: Story = {
	render: () => (
		<Card size="lg">
			<CardHeader>
				<CardTitle>Large Card</CardTitle>
				<CardDescription>
					This is a large card with more padding.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Large card content goes here.</p>
			</CardContent>
		</Card>
	),
};
