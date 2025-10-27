import { Music } from "lucide-react";
import { Card, PageHeader } from "../components/molecules";

interface PlaylistCard {
	title: string;
	date: string;
}

const playlists: PlaylistCard[] = [
	{ title: "Music Festival Compilation", date: "04/10/2024" },
	{ title: "Baby Shower Mix", date: "12/04/2025" },
	{ title: "Fola Wedding Mix", date: "25/10/2025" },
];

export default function Playlists() {
	return (
		<div className="p-8 overflow-y-auto h-full">
			<PageHeader title="Playlists" />
			<div className="grid grid-cols-3 gap-6">
				{playlists.map((playlist) => (
					<Card key={playlist.title} className="cursor-pointer hover:shadow-lg transition-shadow">
						<div className="w-full h-48 bg-primary rounded-lg flex items-center justify-center mb-4">
							<Music className="w-12 h-12 text-white" />
						</div>
						<h3 className="text-lg font-semibold text-foreground mb-1">
							{playlist.title}
						</h3>
						<p className="text-sm text-muted-foreground">{playlist.date}</p>
					</Card>
				))}
			</div>
		</div>
	);
}
