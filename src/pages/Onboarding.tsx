import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components/atoms";

export default function Onboarding() {
	const navigate = useNavigate();
	const [selectedPath, setSelectedPath] = useState("");

	const handleGrantAccess = () => {
		// TODO: Open file dialog to select folder
		navigate("/library");
	};

	const handleGrantFullAccess = () => {
		// TODO: Request full filesystem access
		navigate("/library");
	};

	const handleContinue = () => {
		navigate("/library");
	};

	return (
		<div className="flex h-screen bg-background">
			<div className="flex-1 flex flex-col items-center justify-center p-12">
				<div className="max-w-md w-full space-y-12">
					<h1 className="text-4xl font-bold text-foreground text-center bg-secondary">
						Welcome
					</h1>

					{/* File Path Selection */}
					<div className="space-y-4">
						<p className="text-lg text-foreground font-medium">
							Choose your desired file path
						</p>
						<div className="flex gap-3">
							<Input
								value={selectedPath}
								onChange={(e) => setSelectedPath(e.target.value)}
								placeholder="/User/Username/Music"
								variant="outline"
								className="flex-1"
							/>
							<Button
								variant="solid"
								color="primary"
								size="md"
								onClick={handleGrantAccess}
							>
								Grant Access
							</Button>
						</div>
					</div>

					{/* Full Access Warning */}
					<div className="space-y-4">
						<p className="text-sm text-muted-foreground">
							Granting full access will give access to all files on your
							computer
						</p>
						<Button
							variant="solid"
							color="secondary"
							size="md"
							fullWidth
							onClick={handleGrantFullAccess}
						>
							Grant Full Access
						</Button>
					</div>

					{/* Skip option */}
					<div className="text-center">
						<button
							onClick={handleContinue}
							className="text-sm text-muted-foreground hover:text-foreground underline"
						>
							Skip for now
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
