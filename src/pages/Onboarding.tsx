import { ShieldUser } from "lucide-react";
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
				<div className="max-w-lg w-full">
					<h1 className="text-4xl font-bold text-foreground text-center mb-10">
						Welcome
					</h1>

					<div className="space-y-6">

					<div className="flex flex-col gap-4 items-center">
						<p className="text-medium text-foreground font-base">
							Choose your desired file path
						</p>
						<div className="flex gap-3 w-full">
						<Input
							value={selectedPath}
							onChange={(e) => setSelectedPath(e.target.value)}
							placeholder="/User/Username/Music"
							variant="outline"
							containerClassName="flex-1"
						/>
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
