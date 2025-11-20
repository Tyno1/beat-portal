import { Edit2, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Input } from "../../atoms";
import { Modal } from "../../molecules";
import { useAnalyzeMetadata } from "../../../hooks/useMetadata";
import { useTrack, useUpdateTrack } from "../../../hooks/useTrack";
import type { PostAnalyzeMetadataRequest } from "../../../types/Metadata";
import type { PutTrackRequest } from "../../../types/Tracks";

interface TrackDetailProps {
	trackId: string;
	onClose: () => void;
}

export default function TrackDetail({ trackId, onClose }: TrackDetailProps) {
	const { data: track, isLoading } = useTrack(trackId);
	const updateMutation = useUpdateTrack();
	const analyzeMutation = useAnalyzeMetadata();

	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		artist: "",
		album: "",
		year: "",
		bpm: "",
		key: "",
		genre: "",
		mood: "",
	});

	// Update form when track is loaded
	useEffect(() => {
		if (track) {
			setFormData({
				title: track.title || "",
				artist: track.artist || "",
				album: track.album || "",
				year: track.year?.toString() || "",
				bpm: track.bpm?.toString() || "",
				key: track.key || "",
				genre: track.genre || "",
				mood: track.mood || "",
			});
		}
	}, [track]);

	const handleSave = async () => {
		if (!track) return;

		const updateData: PutTrackRequest["body"] = {};

		if (formData.title !== track.title) updateData.title = formData.title || undefined;
		if (formData.artist !== track.artist) updateData.artist = formData.artist || undefined;
		if (formData.album !== track.album) updateData.album = formData.album || undefined;
		if (formData.year !== (track.year?.toString() || "")) {
			updateData.year = formData.year ? parseInt(formData.year, 10) : undefined;
		}
		if (formData.bpm !== (track.bpm?.toString() || "")) {
			updateData.bpm = formData.bpm ? parseInt(formData.bpm, 10) : undefined;
		}
		if (formData.key !== track.key) updateData.key = formData.key || undefined;
		if (formData.genre !== track.genre) updateData.genre = formData.genre || undefined;
		if (formData.mood !== track.mood) updateData.mood = formData.mood || undefined;

		if (Object.keys(updateData).length === 0) {
			setIsEditing(false);
			return;
		}

		try {
			await updateMutation.mutateAsync({
				trackId,
				request: updateData,
			});
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating track:", error);
			alert("Failed to update track");
		}
	};

	const handleAnalyze = async () => {
		if (!track?.file_path) {
			alert("Track file path not available");
			return;
		}

		const request: PostAnalyzeMetadataRequest = {
			file_path: track.file_path,
			analysis_options: {
				use_audio_analysis: true,
			},
		};

		try {
			const result = await analyzeMutation.mutateAsync(request);
			alert(
				`Analysis complete!\nBPM: ${result.detected_metadata?.bpm || "N/A"}\nKey: ${result.detected_metadata?.key || "N/A"}`,
			);
			// Refresh track data by closing and reopening
			onClose();
			setTimeout(() => {
				// This would need to be handled by parent component
			}, 100);
		} catch (error) {
			console.error("Error analyzing track:", error);
			alert("Failed to analyze track");
		}
	};

	const formatDuration = (seconds?: number) => {
		if (!seconds) return "0:00";
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const formatFileSize = (bytes?: number) => {
		if (!bytes) return "0 B";
		const units = ["B", "KB", "MB", "GB"];
		let size = bytes;
		let unitIndex = 0;
		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}
		return `${size.toFixed(1)} ${units[unitIndex]}`;
	};

	if (isLoading) {
		return (
			<Modal open={true} onClose={onClose} title="Track Details" size="lg">
				<div className="text-center py-8">
					<p className="text-muted-foreground">Loading track...</p>
				</div>
			</Modal>
		);
	}

	if (!track) {
		return (
			<Modal open={true} onClose={onClose} title="Track Details" size="lg">
				<div className="text-center py-8">
					<p className="text-muted-foreground">Track not found</p>
				</div>
			</Modal>
		);
	}

	return (
		<Modal open={true} onClose={onClose} title={track.title || "Track Details"} size="lg">
			<div className="space-y-6">
				{/* Action Buttons */}
				<div className="flex gap-3">
					{!isEditing ? (
						<>
							<Button
								variant="solid"
								color="primary"
								size="md"
								iconBefore={<Edit2 size={16} />}
								onClick={() => setIsEditing(true)}
							>
								Edit
							</Button>
							<Button
								variant="outline"
								color="primary"
								size="md"
								iconBefore={<Sparkles size={16} />}
								onClick={handleAnalyze}
								disabled={analyzeMutation.isPending || !track.file_path}
							>
								{analyzeMutation.isPending ? "Analyzing..." : "Analyze Metadata"}
							</Button>
						</>
					) : (
						<>
							<Button
								variant="solid"
								color="primary"
								size="md"
								onClick={handleSave}
								disabled={updateMutation.isPending}
							>
								{updateMutation.isPending ? "Saving..." : "Save"}
							</Button>
							<Button
								variant="outline"
								color="secondary"
								size="md"
								onClick={() => {
									setIsEditing(false);
									// Reset form
									if (track) {
										setFormData({
											title: track.title || "",
											artist: track.artist || "",
											album: track.album || "",
											year: track.year?.toString() || "",
											bpm: track.bpm?.toString() || "",
											key: track.key || "",
											genre: track.genre || "",
											mood: track.mood || "",
										});
									}
								}}
							>
								Cancel
							</Button>
						</>
					)}
				</div>

				{/* Track Information */}
				<div className="grid grid-cols-2 gap-6">
					{isEditing ? (
						<>
							<Input
								label="Title"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								variant="outline"
								size="md"
							/>
							<Input
								label="Artist"
								value={formData.artist}
								onChange={(e) =>
									setFormData({ ...formData, artist: e.target.value })
								}
								variant="outline"
								size="md"
							/>
							<Input
								label="Album"
								value={formData.album}
								onChange={(e) =>
									setFormData({ ...formData, album: e.target.value })
								}
								variant="outline"
								size="md"
							/>
							<Input
								label="Year"
								type="number"
								value={formData.year}
								onChange={(e) =>
									setFormData({ ...formData, year: e.target.value })
								}
								variant="outline"
								size="md"
							/>
							<Input
								label="BPM"
								type="number"
								value={formData.bpm}
								onChange={(e) =>
									setFormData({ ...formData, bpm: e.target.value })
								}
								variant="outline"
								size="md"
							/>
							<Input
								label="Key"
								value={formData.key}
								onChange={(e) =>
									setFormData({ ...formData, key: e.target.value })
								}
								variant="outline"
								size="md"
							/>
							<Input
								label="Genre"
								value={formData.genre}
								onChange={(e) =>
									setFormData({ ...formData, genre: e.target.value })
								}
								variant="outline"
								size="md"
							/>
							<Input
								label="Mood"
								value={formData.mood}
								onChange={(e) =>
									setFormData({ ...formData, mood: e.target.value })
								}
								variant="outline"
								size="md"
							/>
						</>
					) : (
						<>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Title
								</label>
								<p className="text-foreground mt-1">{track.title || "—"}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Artist
								</label>
								<p className="text-foreground mt-1">{track.artist || "—"}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Album
								</label>
								<p className="text-foreground mt-1">{track.album || "—"}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Year
								</label>
								<p className="text-foreground mt-1">{track.year || "—"}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									BPM
								</label>
								<p className="text-foreground mt-1">{track.bpm || "—"}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Key
								</label>
								<p className="text-foreground mt-1">{track.key || "—"}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Genre
								</label>
								<p className="text-foreground mt-1">{track.genre || "—"}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Mood
								</label>
								<p className="text-foreground mt-1">{track.mood || "—"}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Duration
								</label>
								<p className="text-foreground mt-1">
									{formatDuration(track.duration_seconds)}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									File Size
								</label>
								<p className="text-foreground mt-1">
									{formatFileSize(track.file_size_bytes)}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									File Path
								</label>
								<p className="text-foreground mt-1 text-xs break-all">
									{track.file_path || "—"}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Format
								</label>
								<p className="text-foreground mt-1">
									{track.file_format || "—"}
								</p>
							</div>
						</>
					)}
				</div>
			</div>
		</Modal>
	);
}

