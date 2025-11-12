import { AxiosError } from "axios";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveScanStatus } from "../../../hooks/useScan";
import { Badge, Button, LoadingSpinner } from "../../atoms";
import { Alert } from "../../molecules";

type ProgressIndicatorProps = {
	error?: Error | undefined;
};

const DISCOVERY_MESSAGES = [
	"Scanning directories for audio files...",
	"Searching for music files...",
	"Discovering your music library...",
	"Finding audio tracks...",
];

export default function ProgressIndicator({ error }: ProgressIndicatorProps) {
	const navigate = useNavigate();
	const {
		data: scanStatus,
		isLoading,
		error: scanStatusError,
		isError: isScanStatusError,
	} = useActiveScanStatus();
	const [discoveryMessageIndex, setDiscoveryMessageIndex] = useState(0);

	// Rotate discovery messages at intervals when in discovering state
	useEffect(() => {
		if (!scanStatus || scanStatus.status !== "discovering") {
			setDiscoveryMessageIndex(0);
			return;
		}

		const interval = setInterval(() => {
			setDiscoveryMessageIndex(
				(prev) => (prev + 1) % DISCOVERY_MESSAGES.length,
			);
		}, 2000);

		return () => clearInterval(interval);
	}, [scanStatus]);

	if (error) {
		const isAxiosError = error instanceof AxiosError;
		const errorMessage = isAxiosError
			? error.response?.data &&
			  typeof error.response.data === "object" &&
			  error.response.data !== null &&
			  ("detail" in error.response.data || "message" in error.response.data)
				? String(
						("detail" in error.response.data
							? error.response.data.detail
							: error.response.data.message) as string,
					)
				: error.message
			: error.message;
		return (
			<Alert variant="error" size="sm" title="Error" description={errorMessage} />
		);
	}

	if (!scanStatus) return null;
	if (isLoading) return <LoadingSpinner />;
	if (isScanStatusError) return <div>Error: {scanStatusError?.message}</div>;

	const {
		status,
		message,
		progress,
		files_scanned,
		files_added,
		files_skipped,
		errors: scanStatusErrors,
		paths,
	} = scanStatus;

	// Get status badge color
	const getStatusColor = (): "primary" | "success" | "destructive" | "info" => {
		switch (status) {
			case "completed":
				return "success";
			case "failed":
				return "destructive";
			case "discovering":
			case "scanning":
				return "info";
			default:
				return "primary";
		}
	};

	// Get status label
	const getStatusLabel = (): string => {
		switch (status) {
			case "discovering":
				return "Discovering";
			case "scanning":
				return "Scanning";
			case "completed":
				return "Completed";
			case "failed":
				return "Failed";
			default:
				return "Unknown";
		}
	};

	const progressValue = progress ?? 0;
	const isDiscovering = status === "discovering";
	const displayMessage = isDiscovering
		? DISCOVERY_MESSAGES[discoveryMessageIndex]
		: message;

	return (
		<div className="flex flex-col gap-4 p-4 rounded-lg">
			{/* Header with status badge and message */}
			<div className="flex flex-col items-center justify-between gap-4">
				<Badge color={getStatusColor()} variant="solid" size="sm">
					{getStatusLabel()}
				</Badge>
				<div className="flex items-center justify-between gap-2 w-full">
					{displayMessage && (
						<span className="text-sm text-muted-foreground">
							{displayMessage}
						</span>
					)}
					{!isDiscovering && progress !== undefined && (
						<span className="text-sm font-medium text-muted-foreground">
							{Math.round(progressValue)}%
						</span>
					)}
				</div>
			</div>

			{/* Loading spinner during discovery, progress bar otherwise */}
			{isDiscovering ? (
				<div className="flex items-center justify-center py-4">
					<LoadingSpinner />
				</div>
			) : (
				progress !== undefined && (
					<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
							style={{ width: `${progressValue}%` }}
						/>
					</div>
				)
			)}

			{/* Selected paths */}
			{paths && paths.length > 0 && (
				<div className="flex flex-col gap-1">
					<span className="text-xs text-muted-foreground font-medium">
						Scanning:
					</span>
					<div className="flex flex-col gap-1 text-xs text-muted-foreground">
						{paths.map((path: string) => (
							<span key={path} className="truncate" title={path}>
								{path}
							</span>
						))}
					</div>
				</div>
			)}

			{/* File statistics */}
			{(files_scanned !== undefined ||
				files_added !== undefined ||
				files_skipped !== undefined) && (
				<div className="flex flex-wrap items-center justify-center gap-4 text-sm">
					{files_scanned !== undefined && (
						<div className="flex items-center gap-1">
							<span className="text-muted-foreground">Scanned:</span>
							<span className="font-medium">{files_scanned}</span>
						</div>
					)}
					{files_added !== undefined && (
						<div className="flex items-center gap-1">
							<span className="text-muted-foreground">Added:</span>
							<span className="font-medium text-success">{files_added}</span>
						</div>
					)}
					{files_skipped !== undefined && (
						<div className="flex items-center gap-1">
							<span className="text-muted-foreground">Skipped:</span>
							<span className="font-medium text-warning">{files_skipped}</span>
						</div>
					)}
				</div>
			)}

			{/* Errors */}
			{scanStatusErrors && scanStatusErrors.length > 0 && (
				<div className="flex flex-col gap-2">
					{scanStatusErrors.map((error) => {
						console.log(scanStatusError);

						console.log(error);
						return (
							<Alert
								key={error}
								variant="error"
								size="sm"
								title="Error"
								description={error}
							/>
						);
					})}
				</div>
			)}

			{/* Continue to library button when scan is running */}
			{(status === "discovering" || status === "scanning") && (
				<Button
					variant="outline"
					color="primary"
					onClick={() => navigate("/library")}
					iconAfter={<ArrowRight className="w-4 h-4" />}
					className="w-full"
				>
					Continue to Library
				</Button>
			)}
		</div>
	);
}
