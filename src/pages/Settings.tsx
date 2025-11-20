import { open } from "@tauri-apps/plugin-dialog";
import { platform } from "@tauri-apps/plugin-os";
import { AxiosError } from "axios";
import { FolderOpen } from "lucide-react";
import { useState } from "react";
import { Button, Input } from "../components/atoms";
import { Card, PageHeader } from "../components/molecules";
import ProgressIndicator from "../components/ui/Scan/ProgressIndicator";
import { useStartScan } from "../hooks/useScan";

export default function Settings() {
	const startScanMutation = useStartScan();
	const [startScanError, setStartScanError] = useState<AxiosError | undefined>(
		undefined,
	);
	const [musicFolderPath, setMusicFolderPath] = useState<string>("");

	const handleBrowseFolders = async () => {
		try {
			const osPlatform = platform();
			let defaultPath = "";

			// Set default path based on OS
			if (osPlatform === "macos") {
				defaultPath = "/Users";
			} else if (osPlatform === "windows") {
				defaultPath = "C:\\Users";
			} else {
				defaultPath = "/home";
			}

			const selected = await open({
				directory: true,
				multiple: true,
				title: "Select Music Folders",
				defaultPath: musicFolderPath || defaultPath,
			});

			if (selected) {
				const paths = Array.isArray(selected) ? selected : [selected];
				if (paths.length > 0) {
					setMusicFolderPath(paths[0]);
					
					try {
						await startScanMutation.mutateAsync(paths);
						setStartScanError(undefined);
					} catch (error) {
						console.error("Error starting scan:", error);
						setStartScanError(error as AxiosError);
					}
				}
			}
		} catch (error) {
			console.error("Error selecting folders:", error);
			if (error instanceof AxiosError) {
				setStartScanError(error);
			}
		}
	};

	return (
		<div className="py-4 pr-4 overflow-y-auto h-full">
			<PageHeader title="Settings" />

			<div className="space-y-6">
				{/* Default Music Folder */}
				<Card className="p-6">
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
								value={musicFolderPath}
								onChange={(e) => setMusicFolderPath(e.target.value)}
							/>
							<Button
								variant="ghost"
								color="primary"
								iconBefore={<FolderOpen size={16} />}
								radius="md"
								size="sm"
								onClick={handleBrowseFolders}
								disabled={startScanMutation.isPending}
							>
								{startScanMutation.isPending ? "Scanning..." : "Browse"}
							</Button>
						</div>
						<ProgressIndicator error={startScanError} dismissible />
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
