import { Trash2 } from "lucide-react";
import type { components } from "../../../types/apiTypes";
import { Button } from "../../atoms";
import { Card } from "../../molecules";

type Track = components["schemas"]["Track"];

interface PlaylistTrackListProps {
	tracks: Track[];
	onRemoveTrack: (trackId: string) => void;
}

function formatDuration(seconds?: number): string {
	if (!seconds) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function PlaylistTrackList({
	tracks,
	onRemoveTrack,
}: PlaylistTrackListProps) {
	if (tracks.length === 0) {
		return null;
	}

	return (
		<div className="space-y-2 max-h-96 overflow-y-auto">
			{tracks.map((track, index) => (
				<Card key={track.id || index} className="p-4">
					<div className="flex items-center justify-between">
						<div className="flex-1 min-w-0">
							<p className="font-medium text-foreground truncate">
								{track.title || "Unknown Title"}
							</p>
							<p className="text-sm text-muted-foreground truncate">
								{track.artist || "Unknown Artist"}
							</p>
							<div className="flex gap-2 mt-1">
								{track.bpm && (
									<span className="text-xs text-muted-foreground">
										{track.bpm} BPM
									</span>
								)}
								{track.key && (
									<span className="text-xs text-muted-foreground">
										{track.key}
									</span>
								)}
								{track.duration_seconds && (
									<span className="text-xs text-muted-foreground">
										{formatDuration(track.duration_seconds)}
									</span>
								)}
							</div>
						</div>
						<Button
							variant="outline"
							size="sm"
							color="warning"
							iconBefore={<Trash2 size={14} />}
							onClick={() => track.id && onRemoveTrack(track.id)}
						>
							Remove
						</Button>
					</div>
				</Card>
			))}
		</div>
	);
}
