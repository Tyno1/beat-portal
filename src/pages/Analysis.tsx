import { Clock, HardDrive, Music, Tag } from "lucide-react";
import { Card, PageHeader } from "../components/molecules";

export default function Analysis() {
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
					<p className="text-4xl font-bold text-foreground">23,201</p>
					<p className="text-sm text-muted-foreground mt-1">Tracks</p>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between mb-2">
						<Tag className="w-5 h-5 text-muted-foreground" />
						<span className="text-xs text-muted-foreground">Variety</span>
					</div>
					<p className="text-4xl font-bold text-foreground">32</p>
					<p className="text-sm text-muted-foreground mt-1">Genres</p>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between mb-2">
						<Clock className="w-5 h-5 text-muted-foreground" />
						<span className="text-xs text-muted-foreground">Duration</span>
					</div>
					<p className="text-4xl font-bold text-foreground">102h</p>
					<p className="text-sm text-muted-foreground mt-1">Tracks</p>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between mb-2">
						<HardDrive className="w-5 h-5 text-muted-foreground" />
						<span className="text-xs text-muted-foreground">Storage</span>
					</div>
					<p className="text-4xl font-bold text-foreground">14.92</p>
					<p className="text-sm text-muted-foreground mt-1">GB</p>
				</Card>
			</div>

			{/* BPM Distribution */}
			<div className="bg-card border border-border rounded-lg p-6 mb-6">
				<h2 className="text-xl font-semibold text-foreground mb-6">
					BPM Distribution
				</h2>
				<div className="space-y-4">
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								80-100 BPM
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "15%" }} />
							</div>
							<span className="text-sm text-muted-foreground">203 tracks</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								100-120 BPM
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "32%" }} />
							</div>
							<span className="text-sm text-muted-foreground">430 tracks</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								120-140 BPM
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "55%" }} />
							</div>
							<span className="text-sm text-muted-foreground">739 tracks</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								140-160 BPM
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "24%" }} />
							</div>
							<span className="text-sm text-muted-foreground">322 tracks</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								160+ BPM
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "8%" }} />
							</div>
							<span className="text-sm text-muted-foreground">100 tracks</span>
						</div>
					</div>
				</div>
			</div>

			{/* Key Distribution */}
			<div className="bg-card border border-border rounded-lg p-6 mb-6">
				<h2 className="text-xl font-semibold text-foreground mb-6">
					Key Distribution
				</h2>
				<div className="grid grid-cols-3 gap-4">
					<Card className="p-4 text-center">
						<p className="text-2xl font-bold text-foreground">Am</p>
						<p className="text-sm text-muted-foreground mt-1">223 tracks</p>
					</Card>
					<Card className="p-4 text-center">
						<p className="text-2xl font-bold text-foreground">Cm</p>
						<p className="text-sm text-muted-foreground mt-1">223 tracks</p>
					</Card>
					<Card className="p-4 text-center">
						<p className="text-2xl font-bold text-foreground">Dm</p>
						<p className="text-sm text-muted-foreground mt-1">223 tracks</p>
					</Card>
					<Card className="p-4 text-center">
						<p className="text-2xl font-bold text-foreground">Em</p>
						<p className="text-sm text-muted-foreground mt-1">223 tracks</p>
					</Card>
					<Card className="p-4 text-center">
						<p className="text-2xl font-bold text-foreground">Gm</p>
						<p className="text-sm text-muted-foreground mt-1">223 tracks</p>
					</Card>
					<Card className="p-4 text-center">
						<p className="text-2xl font-bold text-foreground">Am</p>
						<p className="text-sm text-muted-foreground mt-1">223 tracks</p>
					</Card>
					<Card className="p-4 text-center">
						<p className="text-2xl font-bold text-foreground">C</p>
						<p className="text-sm text-muted-foreground mt-1">223 tracks</p>
					</Card>
					<Card className="p-4 text-center">
						<p className="text-2xl font-bold text-foreground">G</p>
						<p className="text-sm text-muted-foreground mt-1">223 tracks</p>
					</Card>
					<Card className="p-4 text-center">
						<p className="text-2xl font-bold text-foreground">Others</p>
						<p className="text-sm text-muted-foreground mt-1">223 tracks</p>
					</Card>
				</div>
			</div>

			{/* Top Genres */}
			<div className="bg-card border border-border rounded-lg p-6 mb-6">
				<h2 className="text-xl font-semibold text-foreground mb-6">
					Top Genres
				</h2>
				<div className="space-y-4">
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								House
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "15%" }} />
							</div>
							<span className="text-sm text-muted-foreground">203 tracks</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								Blues
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "32%" }} />
							</div>
							<span className="text-sm text-muted-foreground">430 tracks</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								Dancehall
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "55%" }} />
							</div>
							<span className="text-sm text-muted-foreground">739 tracks</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								Afrobeats
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "24%" }} />
							</div>
							<span className="text-sm text-muted-foreground">322 tracks</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								Amapiano
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "8%" }} />
							</div>
							<span className="text-sm text-muted-foreground">100 tracks</span>
						</div>
					</div>
				</div>
			</div>

			{/* Mood Distribution */}
			<div className="bg-card border border-border rounded-lg p-6">
				<h2 className="text-xl font-semibold text-foreground mb-6">
					Mood Distribution
				</h2>
				<div className="space-y-4">
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								Energetic
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "15%" }} />
							</div>
							<span className="text-sm text-muted-foreground">203 tracks</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								Uplifting
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "32%" }} />
							</div>
							<span className="text-sm text-muted-foreground">430 tracks</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								Dark
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "55%" }} />
							</div>
							<span className="text-sm text-muted-foreground">739 tracks</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								Intense
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "24%" }} />
							</div>
							<span className="text-sm text-muted-foreground">322 tracks</span>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-4 mb-2">
							<span className="text-sm text-foreground font-medium w-32">
								Chill
							</span>
							<div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
								<div className="h-full bg-primary" style={{ width: "8%" }} />
							</div>
							<span className="text-sm text-muted-foreground">100 tracks</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
