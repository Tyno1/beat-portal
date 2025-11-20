import { open } from "@tauri-apps/plugin-dialog";
import { platform } from "@tauri-apps/plugin-os";
import { AxiosError } from "axios";
import { FolderOpen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/atoms";
import ProgressIndicator from "../components/ui/Scan/ProgressIndicator";
import { useStartScan } from "../hooks/useScan";

export default function Onboarding() {
	const navigate = useNavigate();
	const startScanMutation = useStartScan();
	const [startScanError, setStartScanError] = useState<AxiosError | undefined>(
		undefined,
	);

	const handleSelectFolders = async () => {
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
				defaultPath,
			});

			if (selected) {
				const paths = Array.isArray(selected) ? selected : [selected];
				if (paths.length > 0) {
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
			// This catch is for dialog errors, not API errors
			if (error instanceof AxiosError) {
				setStartScanError(error);
			}
		}
	};

	const handleSkip = () => {
		navigate("/library");
	};

	return (
		<div className="flex h-screen bg-background">
			<div className="flex-1 flex flex-col items-center justify-center p-12">
				<div className="max-w-md w-full space-y-8">
					<div className="text-center space-y-2">
						<h1 className="text-4xl font-bold text-foreground">Welcome</h1>
						<p className="text-muted-foreground">
							Select your music folders to get started
						</p>
					</div>

					<div className="space-y-4">
						<Button
							variant="solid"
							color="primary"
							size="lg"
							onClick={handleSelectFolders}
							iconBefore={<FolderOpen className="w-5 h-5" />}
							className="w-full"
							disabled={startScanMutation.isPending}
						>
							{startScanMutation.isPending
								? "Starting scan..."
								: "Select Music Folders"}
						</Button>

						<ProgressIndicator error={startScanError} />

						<div className="text-center">
							<Button
								variant="ghost"
								color="muted"
								size="sm"
								onClick={handleSkip}
							>
								Skip for now
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
