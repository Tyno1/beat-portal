import { Clock, HardDrive, Music, Tag } from "lucide-react";
import { Card, PageHeader } from "../components/molecules";
import {
	useBPMDistribution,
	useGenreDistribution,
	useKeyDistribution,
	useLibraryOverview,
	useMoodDistribution,
} from "../hooks/useAnalysis";

function formatDuration(seconds: number | undefined): string {
	if (!seconds || seconds === 0) return "0s";

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	} else if (minutes > 0) {
		return `${minutes}m ${secs}s`;
	} else {
		return `${secs}s`;
	}
}

function formatFileSize(bytes: number | undefined): string {
	if (!bytes || bytes === 0) return "0 B";

	const units = ["B", "KB", "MB", "GB", "TB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function formatNumber(num: number | undefined): string {
	if (num === undefined || num === null) return "0";
	return num.toLocaleString();
}

export default function Analysis() {
	const { data: overview, isLoading: overviewLoading } = useLibraryOverview();
	const { data: bpmData, isLoading: bpmLoading } = useBPMDistribution();
	const { data: keyData, isLoading: keyLoading } = useKeyDistribution();
	const { data: genreData, isLoading: genreLoading } = useGenreDistribution();
	const { data: moodData, isLoading: moodLoading } = useMoodDistribution();

	// Calculate total for percentage calculations
	const totalBPM = bpmData?.distribution?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;
	const totalGenre = genreData?.distribution?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;
	const totalMood = moodData?.distribution?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;

	const isLoading = overviewLoading || bpmLoading || keyLoading || genreLoading || moodLoading;

	return (
		<div className="py-4 pr-4 overflow-y-auto h-full">
			<PageHeader title="Analysis" />

			{/* Stats Grid */}
			<div className="grid grid-cols-2 gap-6 mb-8">
				<Card className="p-6">
					<div className="flex items-center justify-between mb-2">
						<Music className="w-5 h-5 text-muted-foreground" />
						<span className="text-xs text-muted-foreground">Total</span>
					</div>
					{isLoading ? (
						<p className="text-4xl font-bold text-foreground">...</p>
					) : (
						<p className="text-4xl font-bold text-foreground">
							{formatNumber(overview?.total_tracks)}
						</p>
					)}
					<p className="text-sm text-muted-foreground mt-1">Tracks</p>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between mb-2">
						<Tag className="w-5 h-5 text-muted-foreground" />
						<span className="text-xs text-muted-foreground">Variety</span>
					</div>
					{isLoading ? (
						<p className="text-4xl font-bold text-foreground">...</p>
					) : (
						<p className="text-4xl font-bold text-foreground">
							{formatNumber(overview?.total_genres)}
						</p>
					)}
					<p className="text-sm text-muted-foreground mt-1">Genres</p>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between mb-2">
						<Clock className="w-5 h-5 text-muted-foreground" />
						<span className="text-xs text-muted-foreground">Duration</span>
					</div>
					{isLoading ? (
						<p className="text-4xl font-bold text-foreground">...</p>
					) : (
						<p className="text-4xl font-bold text-foreground">
							{formatDuration(overview?.total_duration_seconds)}
						</p>
					)}
					<p className="text-sm text-muted-foreground mt-1">Total</p>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between mb-2">
						<HardDrive className="w-5 h-5 text-muted-foreground" />
						<span className="text-xs text-muted-foreground">Storage</span>
					</div>
					{isLoading ? (
						<p className="text-4xl font-bold text-foreground">...</p>
					) : (
						<p className="text-4xl font-bold text-foreground">
							{formatFileSize(overview?.total_size_bytes)}
						</p>
					)}
					<p className="text-sm text-muted-foreground mt-1">Total</p>
				</Card>
			</div>

			{/* BPM Distribution */}
			<div className="bg-card border border-border rounded-lg p-6 mb-6">
				<h2 className="text-xl font-semibold text-foreground mb-6">
					BPM Distribution
				</h2>
				{isLoading ? (
					<p className="text-sm text-muted-foreground">Loading...</p>
				) : bpmData?.distribution && bpmData.distribution.length > 0 ? (
					<div className="space-y-4">
						{bpmData.distribution.map((item) => {
							const percentage = totalBPM > 0 ? (item.count || 0) / totalBPM : 0;
							return (
								<div key={item.range}>
									<div className="flex items-center gap-4 mb-2">
										<span className="text-sm text-foreground font-medium w-32">
											{item.range}
										</span>
										<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
											<div
												className="h-full bg-primary"
												style={{ width: `${percentage * 100}%` }}
											/>
										</div>
										<span className="text-sm text-muted-foreground">
											{formatNumber(item.count)} tracks
										</span>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<p className="text-sm text-muted-foreground">No BPM data available</p>
				)}
			</div>

			{/* Key Distribution */}
			<div className="bg-card border border-border rounded-lg p-6 mb-6">
				<h2 className="text-xl font-semibold text-foreground mb-6">
					Key Distribution
				</h2>
				{isLoading ? (
					<p className="text-sm text-muted-foreground">Loading...</p>
				) : keyData?.distribution && keyData.distribution.length > 0 ? (
					<div className="grid grid-cols-3 gap-4">
						{keyData.distribution.map((item) => (
							<Card key={item.key} className="p-4 text-center">
								<p className="text-2xl font-bold text-foreground">{item.key}</p>
								<p className="text-sm text-muted-foreground mt-1">
									{formatNumber(item.count)} tracks
								</p>
							</Card>
						))}
					</div>
				) : (
					<p className="text-sm text-muted-foreground">No key data available</p>
				)}
			</div>

			{/* Top Genres */}
			<div className="bg-card border border-border rounded-lg p-6 mb-6">
				<h2 className="text-xl font-semibold text-foreground mb-6">
					Top Genres
				</h2>
				{isLoading ? (
					<p className="text-sm text-muted-foreground">Loading...</p>
				) : genreData?.distribution && genreData.distribution.length > 0 ? (
					<div className="space-y-4">
						{genreData.distribution.map((item) => {
							const percentage = totalGenre > 0 ? (item.count || 0) / totalGenre : 0;
							return (
								<div key={item.genre}>
									<div className="flex items-center gap-4 mb-2">
										<span className="text-sm text-foreground font-medium w-32">
											{item.genre}
										</span>
										<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
											<div
												className="h-full bg-primary"
												style={{ width: `${percentage * 100}%` }}
											/>
										</div>
										<span className="text-sm text-muted-foreground">
											{formatNumber(item.count)} tracks
										</span>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<p className="text-sm text-muted-foreground">No genre data available</p>
				)}
			</div>

			{/* Mood Distribution */}
			<div className="bg-card border border-border rounded-lg p-6">
				<h2 className="text-xl font-semibold text-foreground mb-6">
					Mood Distribution
				</h2>
				{isLoading ? (
					<p className="text-sm text-muted-foreground">Loading...</p>
				) : moodData?.distribution && moodData.distribution.length > 0 ? (
					<div className="space-y-4">
						{moodData.distribution.map((item) => {
							const percentage = totalMood > 0 ? (item.count || 0) / totalMood : 0;
							return (
								<div key={item.mood}>
									<div className="flex items-center gap-4 mb-2">
										<span className="text-sm text-foreground font-medium w-32">
											{item.mood}
										</span>
										<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
											<div
												className="h-full bg-primary"
												style={{ width: `${percentage * 100}%` }}
											/>
										</div>
										<span className="text-sm text-muted-foreground">
											{formatNumber(item.count)} tracks
										</span>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<p className="text-sm text-muted-foreground">No mood data available</p>
				)}
			</div>
		</div>
	);
}
