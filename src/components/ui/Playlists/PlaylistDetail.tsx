import { Download, Music, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import {
	useAddTracksToPlaylist,
	useExportPlaylist,
	usePlaylist,
	useRemoveTracksFromPlaylist,
} from "../../../hooks/usePlaylists";
import { useAllTracks } from "../../../hooks/useTrack";
import type {
	PostAddTracksToPlaylistRequest,
	PostExportPlaylistRequest,
} from "../../../types/Playlists";
import type { SelectOption } from "../../atoms";
import { Button, Select } from "../../atoms";
import { Modal } from "../../molecules";
import PlaylistTrackList from "./PlaylistTrackList";

interface PlaylistDetailProps {
	playlistId: string;
	onClose: () => void;
}

export default function PlaylistDetail({
	playlistId,
	onClose,
}: PlaylistDetailProps) {
	const { data: playlist, isLoading } = usePlaylist(playlistId);
	const {
		data: allTracksData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useAllTracks({ size: 100 });
	const addTracksMutation = useAddTracksToPlaylist();
	const removeTracksMutation = useRemoveTracksFromPlaylist();
	const exportMutation = useExportPlaylist();

	const [addTracksModalOpen, setAddTracksModalOpen] = useState(false);
	const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
	const [exportFormat, setExportFormat] = useState<
		"m3u" | "pls" | "xspf" | "json"
	>("m3u");
	const [exportModalOpen, setExportModalOpen] = useState(false);

	// Flatten all pages into a single array of tracks
	const allTracks = useMemo(() => {
		if (!allTracksData?.pages) return [];
		return allTracksData.pages.flatMap((page) => page.data || []);
	}, [allTracksData?.pages]);

	const playlistTracks = playlist?.tracks || [];

	// Get tracks not already in playlist
	const availableTracks = allTracks.filter(
		(track) => !playlistTracks.some((pt) => pt.id === track.id),
	);

	const trackOptions: SelectOption[] = availableTracks.map((track) => ({
		label: `${track.artist || "Unknown"} - ${track.title || "Unknown"}`,
		value: track.id || "",
	}));

	const handleAddTracks = async () => {
		if (selectedTrackIds.length === 0) return;

		const request: PostAddTracksToPlaylistRequest["body"] = {
			track_ids: selectedTrackIds,
		};

		try {
			await addTracksMutation.mutateAsync({
				playlistId,
				request,
			});
			setAddTracksModalOpen(false);
			setSelectedTrackIds([]);
		} catch (error) {
			console.error("Error adding tracks:", error);
		}
	};

	const handleRemoveTrack = async (trackId: string) => {
		const request = {
			track_ids: [trackId],
		};

		try {
			await removeTracksMutation.mutateAsync({
				playlistId,
				request,
			});
		} catch (error) {
			console.error("Error removing track:", error);
		}
	};

	const handleExport = async () => {
		const request: PostExportPlaylistRequest["body"] = {
			format: exportFormat,
		};

		try {
			const response = await exportMutation.mutateAsync({
				playlistId,
				request,
			});
			// Response structure: { content: { "application/json": { file_path, format } } }
			const filePath =
				"content" in response &&
				typeof response.content === "object" &&
				response.content !== null &&
				"application/json" in response.content &&
				typeof response.content["application/json"] === "object" &&
				response.content["application/json"] !== null &&
				"file_path" in response.content["application/json"]
					? (response.content["application/json"] as { file_path?: string })
							.file_path
					: "file_path" in response && typeof response.file_path === "string"
						? response.file_path
						: "Unknown location";
			alert(`Playlist exported to: ${filePath}`);
			setExportModalOpen(false);
		} catch (error) {
			console.error("Error exporting playlist:", error);
			alert("Failed to export playlist");
		}
	};

	const formatDuration = (seconds?: number) => {
		if (!seconds) return "0:00";
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	if (isLoading) {
		return (
			<Modal open={true} onClose={onClose} title="Playlist Details" size="xl">
				<div className="text-center py-8">
					<p className="text-muted-foreground">Loading playlist...</p>
				</div>
			</Modal>
		);
	}

	if (!playlist) {
		return (
			<Modal open={true} onClose={onClose} title="Playlist Details" size="xl">
				<div className="text-center py-8">
					<p className="text-muted-foreground">Playlist not found</p>
				</div>
			</Modal>
		);
	}

	return (
		<>
			<Modal
				open={true}
				onClose={onClose}
				title={playlist.name || "Playlist Details"}
				size="xl"
			>
				<div className="space-y-6">
					{playlist.description && (
						<p className="text-sm text-muted-foreground">
							{playlist.description}
						</p>
					)}

					<div className="flex items-center justify-between">
						<div className="flex gap-4">
							<Button
								variant="solid"
								color="primary"
								size="md"
								iconBefore={<Plus size={16} />}
								onClick={() => setAddTracksModalOpen(true)}
							>
								Add Tracks
							</Button>
							<Button
								variant="outline"
								color="primary"
								size="md"
								iconBefore={<Download size={16} />}
								onClick={() => setExportModalOpen(true)}
							>
								Export
							</Button>
						</div>
						<div className="text-sm text-muted-foreground">
							{playlistTracks.length} track
							{playlistTracks.length !== 1 ? "s" : ""}
							{playlist.total_duration_seconds && (
								<span className="ml-2">
									• {formatDuration(playlist.total_duration_seconds)}
								</span>
							)}
						</div>
					</div>

					{playlistTracks.length === 0 ? (
						<div className="text-center py-12 border border-border rounded-lg">
							<Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
							<p className="text-foreground font-medium mb-2">
								No tracks in playlist
							</p>
							<p className="text-sm text-muted-foreground mb-4">
								Add tracks to get started
							</p>
							<Button
								variant="solid"
								color="primary"
								size="md"
								iconBefore={<Plus size={16} />}
								onClick={() => setAddTracksModalOpen(true)}
							>
								Add Tracks
							</Button>
						</div>
					) : (
						<PlaylistTrackList
							tracks={playlistTracks}
							onRemoveTrack={handleRemoveTrack}
						/>
					)}
				</div>
			</Modal>

			{/* Add Tracks Modal */}
			<Modal
				open={addTracksModalOpen}
				onClose={() => {
					setAddTracksModalOpen(false);
					setSelectedTrackIds([]);
				}}
				title="Add Tracks to Playlist"
				size="lg"
			>
				<div className="space-y-4">
					{availableTracks.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							All available tracks are already in this playlist.
						</p>
					) : (
						<>
							<Select
								label="Select Tracks"
								options={trackOptions}
								value={selectedTrackIds}
								onChange={(values) => setSelectedTrackIds(values)}
								multiple
								variant="outline"
								size="md"
								placeholder="Search and select tracks..."
								maxHeight="300px"
							/>
							{hasNextPage && (
								<div className="flex justify-center">
									<Button
										variant="outline"
										size="sm"
										onClick={() => fetchNextPage()}
										disabled={isFetchingNextPage}
									>
										{isFetchingNextPage
											? "Loading more tracks..."
											: `Load More (${allTracks.length} loaded)`}
									</Button>
								</div>
							)}
						</>
					)}
					<div className="flex gap-3 justify-end pt-4">
						<Button
							variant="outline"
							color="secondary"
							size="md"
							onClick={() => {
								setAddTracksModalOpen(false);
								setSelectedTrackIds([]);
							}}
						>
							Cancel
						</Button>
						<Button
							variant="solid"
							color="primary"
							size="md"
							onClick={handleAddTracks}
							disabled={
								selectedTrackIds.length === 0 ||
								addTracksMutation.isPending ||
								availableTracks.length === 0
							}
						>
							{addTracksMutation.isPending
								? "Adding..."
								: `Add ${selectedTrackIds.length} Track${selectedTrackIds.length !== 1 ? "s" : ""}`}
						</Button>
					</div>
				</div>
			</Modal>

			{/* Export Modal */}
			<Modal
				open={exportModalOpen}
				onClose={() => setExportModalOpen(false)}
				title="Export Playlist"
				size="md"
			>
				<div className="space-y-4">
					<p className="text-sm text-foreground">
						Choose a format to export your playlist:
					</p>
					<Select
						label="Export Format"
						options={[
							{ label: "M3U", value: "m3u" },
							{ label: "PLS", value: "pls" },
							{ label: "XSPF", value: "xspf" },
							{ label: "JSON", value: "json" },
						]}
						value={[exportFormat]}
						onChange={(values) =>
							setExportFormat(values[0] as typeof exportFormat)
						}
						variant="outline"
						size="md"
					/>
					<div className="flex gap-3 justify-end pt-4">
						<Button
							variant="outline"
							color="secondary"
							size="md"
							onClick={() => setExportModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant="solid"
							color="primary"
							size="md"
							iconBefore={<Download size={16} />}
							onClick={handleExport}
							disabled={exportMutation.isPending || playlistTracks.length === 0}
						>
							{exportMutation.isPending ? "Exporting..." : "Export"}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}
