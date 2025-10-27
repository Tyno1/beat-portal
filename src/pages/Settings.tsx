import { FolderOpen } from "lucide-react";
import { Button, Input } from "../components/atoms";
import { Card, PageHeader } from "../components/molecules";

export default function Settings() {
	return (
		<div className="p-8 overflow-y-auto h-full">
			<PageHeader title="Settings" />

			<div className="space-y-6">
				{/* Default Music Folder */}
				<Card className="p-6">
					<h2 className="text-xl font-semibold text-foreground mb-4">
						Settings
					</h2>
					<div>
						<label
							htmlFor="music-folder"
							className="block text-sm font-medium text-foreground mb-2"
						>
							Default Music Folder
						</label>
						<div className="flex gap-3">
							<Input
								id="music-folder"
								placeholder="/User/Username/Music"
								variant="outline"
								containerClassName="flex-1"
							/>
							<Button
								variant="outline"
								color="secondary"
								iconBefore={<FolderOpen />}
								radius="md"
							>
								Browse
							</Button>
						</div>
					</div>
				</Card>

				{/* AI Enhancement */}
				<Card className="p-6">
					<h2 className="text-xl font-semibold text-foreground mb-4">
						AI Enhancement
					</h2>
					<div className="space-y-3">
						<label className="flex items-center gap-3 cursor-pointer">
							<input type="checkbox" defaultChecked className="w-5 h-5" />
							<span className="text-sm text-foreground">
								Enable AI Enhancement
							</span>
						</label>
						<label className="flex items-center gap-3 cursor-pointer">
							<input type="checkbox" className="w-5 h-5" />
							<span className="text-sm text-foreground">
								Auto Enhance on Import
							</span>
						</label>
					</div>
				</Card>

				{/* Appearance */}
				<Card className="p-6">
					<h2 className="text-xl font-semibold text-foreground mb-4">
						Appearance
					</h2>
					<div>
						<label
							htmlFor="theme-select"
							className="block text-sm font-medium text-foreground mb-2"
						>
							Theme
						</label>
						<select
							id="theme-select"
							className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<option>Dark (Default)</option>
							<option>Light</option>
						</select>
					</div>
				</Card>
			</div>
		</div>
	);
}
