import { open } from "@tauri-apps/plugin-dialog";
import { platform } from "@tauri-apps/plugin-os";
import { FolderOpen, ShieldUser } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/atoms";
import { useStartScan } from "../hooks/useScan";

export default function Onboarding() {
	const navigate = useNavigate();
	const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
	const startScanMutation = useStartScan();

	const handleGrantAccess = async () => {
		if (selectedPaths.length > 0) {
			try {
				const response = await startScanMutation.mutateAsync(selectedPaths);
				console.log("Scan started:", response);
				navigate("/library");
			} catch (error) {
				console.error("Error starting scan:", error);
			}
		}
	};

	const handleGrantFullAccess = async () => {
		try {
			const osPlatform = platform();
			let defaultPath = "";

			// Set default path based on OS
			if (osPlatform === "macos") {
				// macOS
				defaultPath = "/Users";
			} else if (osPlatform === "windows") {
				// Windows
				defaultPath = "C:\\Users";
			} else {
				// Linux
				defaultPath = "/home";
			}

			const selected = await open({
				directory: true,
				multiple: true,
				title: "Select Folders for Full Access",
				defaultPath,
			});

			if (selected) {
				const paths = Array.isArray(selected) ? selected : [selected];
				setSelectedPaths(paths);

				// Start scan automatically for full access
				if (paths.length > 0) {
					try {
						const response = await startScanMutation.mutateAsync(paths);
						console.log("Full access scan started:", response);
						navigate("/library");
					} catch (error) {
						console.error("Error starting full access scan:", error);
					}
				}
			}
		} catch (error) {
			console.error("Error granting full access:", error);
		}
	};

	const handleContinue = () => {
		navigate("/library");
	};

	const handleChoosePaths = async () => {
		try {
			const selected = await open({
				directory: true,
				multiple: true,
				title: "Select Music Folders",
			});

			if (selected) {
				const paths = Array.isArray(selected) ? selected : [selected];
				setSelectedPaths(paths);
			}
		} catch (error) {
			console.error("Error selecting folders:", error);
		}
	};

	return (
		<div className="flex h-screen bg-background">
			<div className="flex-1 flex flex-col items-center justify-center p-12">
				<div className="max-w-lg w-full">
					<h1 className="text-4xl font-bold text-foreground text-center mb-10">
						Welcome
					</h1>

					<div className="space-y-6">
						<div className="flex flex-col gap-4 items-center">
							<p className="text-medium text-foreground font-base">
								Choose your desired file path
							</p>
							<div className="flex flex-col gap-3 w-full it">
								<Input
									value={selectedPaths.map((path) => path).join(", ")}
									placeholder="/User/Username/Music"
									variant="outline"
									containerClassName="flex-1"
									onChange={(e) => setSelectedPaths(e.target.value.split(", "))}
								/>
								<div className="flex w-full gap-3 items-center justify-center">
									<Button
										variant="ghost"
										color="primary"
										size="md"
										onClick={handleChoosePaths}
										iconBefore={<FolderOpen />}
									>
										Select Folders
									</Button>
									<Button
										variant="solid"
										color="secondary"
										size="md"
										onClick={handleGrantAccess}
										iconBefore={<ShieldUser />}
									>
										Grant Access
									</Button>
								</div>
							</div>
						</div>

						<div className="text-center space-y-4">
							<p className="text-sm text-muted-foreground">
								Granting full access will give access to all files on your
								computer
							</p>
							<Button
								variant="solid"
								color="primary"
								size="md"
								onClick={handleGrantFullAccess}
								iconBefore={<ShieldUser />}
							>
								Grant Full Access
							</Button>
						</div>

						<div className="text-center">
							<Button
								variant="ghost"
								color="muted"
								size="sm"
								radius="full"
								onClick={handleContinue}
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
