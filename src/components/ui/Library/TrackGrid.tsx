import { MoreVertical, Music } from "lucide-react";
import { Badge, IconButton } from "../../atoms";
import { Card, CardContent } from "../../molecules";
import type { Track } from "./TrackTable";

interface TrackGridProps {
	data: Track[];
}

export default function TrackGrid({ data }: TrackGridProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{data.map((track, index) => (
				<Card
					key={`${track.id}-${track.title}-${track.artist}-${index}`}
					variant="outlined"
					radius="xl"
					className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
				>
					<CardContent size="md" className="p-4">
						<div className="flex items-start justify-between mb-3">
							<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
								<Music className="w-6 h-6 text-primary" />
							</div>
							<IconButton
								icon={<MoreVertical />}
								aria-label="Actions"
								color="secondary"
								variant="plain"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									// Handle actions
								}}
								className="group-hover:text-muted-foreground transition-opacity duration-200"
							/>
						</div>

						<div className="space-y-2">
							<div>
								<h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
									{track.title || "Unknown Title"}
								</h3>
								<p className="text-xs text-muted-foreground mt-1">
									{track.artist || "Unknown Artist"}
								</p>
							</div>

							<div className="flex flex-wrap gap-2 mt-3">
								{track.genre && (
									<Badge color="muted" variant="outline" size="sm">
										{track.genre}
									</Badge>
								)}
								{track.mood && (
									<Badge color="muted" variant="outline" size="sm">
										{track.mood}
									</Badge>
								)}
							</div>

							<div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border">
								{track.bpm && (
									<div>
										<p className="text-xs text-muted-foreground">BPM</p>
										<p className="text-sm font-medium text-foreground">
											{track.bpm}
										</p>
									</div>
								)}
								{track.key && (
									<div>
										<p className="text-xs text-muted-foreground">Key</p>
										<p className="text-sm font-medium text-foreground">
											{track.key}
										</p>
									</div>
								)}
								{track.year && (
									<div>
										<p className="text-xs text-muted-foreground">Year</p>
										<p className="text-sm font-medium text-foreground">
											{track.year}
										</p>
									</div>
								)}
								{track.id && (
									<div>
										<p className="text-xs text-muted-foreground">ID</p>
										<p className="text-sm font-medium text-foreground truncate">
											{track.id.slice(0, 8)}
										</p>
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
