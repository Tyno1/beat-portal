import { useEffect, useState } from "react";
import FilterChips from "../components/ui/Library/components/FilterChips";
import LibraryHeader from "../components/ui/Library/components/LibraryHeader";
import LibraryToolbar, {
	type ViewMode,
} from "../components/ui/Library/components/LibraryToolbar";
import TrackGrid from "../components/ui/Library/components/TrackGrid";
import TrackTable, {
	type Track,
} from "../components/ui/Library/components/TrackTable";
import useResize from "../hooks/useResize";

const mockTracks: Track[] = [
	{
		id: 377,
		trackName: "Hold me down",
		artist: "Paul Smith",
		year: 2001,
		bpm: 377,
		key: "A",
		genre: "Blues",
		mood: "Happy",
	},
	{
		id: 453,
		trackName: "Sekkle",
		artist: "Gieger",
		year: 2001,
		bpm: 332,
		key: "F",
		genre: "Dancehall",
		mood: "Dark",
	},
	{
		id: 332,
		trackName: "Play",
		artist: "Bonny Bieber",
		year: 2001,
		bpm: 938,
		key: "C",
		genre: "Afro beats",
		mood: "Chill",
	},
	{
		id: 938,
		trackName: "Meet me half way",
		artist: "Cynthia Wood",
		year: 1994,
		bpm: 335,
		key: "F",
		genre: "Amapiano",
		mood: "Sad",
	},
	{
		id: 335,
		trackName: "Kilo",
		artist: "Hard Filly",
		year: 2020,
		bpm: 430,
		key: "F",
		genre: "Hiphop",
		mood: "Sad",
	},
	{
		id: 430,
		trackName: "Me and you",
		artist: "Drake Pint",
		year: 2023,
		bpm: 839,
		key: "C",
		genre: "Rap",
		mood: "Happy",
	},
	{
		id: 839,
		trackName: "Philo",
		artist: "Benny Guiness",
		year: 2010,
		bpm: 390,
		key: "C",
		genre: "Trap",
		mood: "Happy",
	},
	{
		id: 390,
		trackName: "Bend low",
		artist: "Acon Mills",
		year: 1999,
		bpm: 390,
		key: "A",
		genre: "Trap",
		mood: "Happy",
	},
	{
		id: 390,
		trackName: "Island men",
		artist: "Wensty",
		year: 1994,
		bpm: 430,
		key: "A",
		genre: "Blues",
		mood: "Dark",
	},
	{
		id: 430,
		trackName: "Ocean dance",
		artist: "Bulker",
		year: 2000,
		bpm: 839,
		key: "B",
		genre: "Blues",
		mood: "Sad",
	},
	{
		id: 839,
		trackName: "Kill me",
		artist: "Wander Tury",
		year: 2025,
		bpm: 390,
		key: "C",
		genre: "Trap",
		mood: "Chill",
	},
	{
		id: 390,
		trackName: "My heart bleeds",
		artist: "Hale Keith",
		year: 2020,
		bpm: 390,
		key: "F",
		genre: "Dancehall",
		mood: "Chill",
	},
	{
		id: 390,
		trackName: "Money",
		artist: "Hail Maih",
		year: 1980,
		bpm: 390,
		key: "A",
		genre: "Amapiano",
		mood: "Chill",
	},
	{
		id: 390,
		trackName: "Sad Men",
		artist: "Buddy Nod",
		year: 2021,
		bpm: 390,
		key: "A",
		genre: "Dancehall",
		mood: "Sad",
	},
	{
		id: 390,
		trackName: "Opps Home",
		artist: "Killer Maddison",
		year: 2013,
		bpm: 390,
		key: "A",
		genre: "Dancehall",
		mood: "Dark",
	},
];

export default function Library() {
	const [viewMode, setViewMode] = useState<ViewMode>("table");
	const [selectedFilters, setSelectedFilters] = useState<{
		[key: string]: string[];
	}>({});
	const [filteredData, setFilteredData] = useState<Track[]>(mockTracks);
	const { breakpoint, size } = useResize();

	const handleFilterChange = (category: string, selectedValues: string[]) => {
		setSelectedFilters((prev) => ({
			...prev,
			[category]: selectedValues,
		}));
	};

	// Apply filters whenever selectedFilters or mockTracks change
	useEffect(() => {
		let filtered: Track[] = [...mockTracks];

		// Filter by genre
		if (selectedFilters.genre && selectedFilters.genre.length > 0) {
			filtered = filtered.filter((track) =>
				selectedFilters.genre.includes(track.genre),
			);
		}

		// Filter by mood
		if (selectedFilters.mood && selectedFilters.mood.length > 0) {
			filtered = filtered.filter((track) =>
				selectedFilters.mood.includes(track.mood),
			);
		}

		// Filter by key
		if (selectedFilters.key && selectedFilters.key.length > 0) {
			filtered = filtered.filter((track) =>
				selectedFilters.key.includes(track.key),
			);
		}

		// Filter by artist
		if (selectedFilters.artist && selectedFilters.artist.length > 0) {
			filtered = filtered.filter((track) =>
				selectedFilters.artist.includes(track.artist),
			);
		}

		// Filter by BPM range
		if (selectedFilters.bpm && selectedFilters.bpm.length > 0) {
			filtered = filtered.filter((track) => {
				return selectedFilters.bpm.some((range) => {
					const [min, max] = range.replace(" BPM", "").split("-").map(Number);
					return track.bpm >= min && track.bpm <= max;
				});
			});
		}

		// Filter by year range
		if (selectedFilters.year && selectedFilters.year.length > 0) {
			filtered = filtered.filter((track) => {
				return selectedFilters.year.some((range) => {
					const decade = parseInt(range.replace("s", ""), 10);
					const yearStart = decade;
					const yearEnd = decade + 9;
					return track.year >= yearStart && track.year <= yearEnd;
				});
			});
		}

		setFilteredData(filtered);
	}, [selectedFilters]);

	const handleFilterChangeLegacy = (filterLabel: string) => {
		// Legacy handler for filter chips - keeping for backward compatibility
		setSelectedFilters({});

		let filtered: Track[] = [];

		switch (filterLabel) {
			case "All Tracks":
				filtered = mockTracks;
				break;
			case "120 - 128 Bpm":
				filtered = mockTracks.filter(
					(track) => track.bpm >= 120 && track.bpm <= 128,
				);
				break;
			case "Sad":
				filtered = mockTracks.filter((track) => track.mood === "Sad");
				break;
			case "Blues":
				filtered = mockTracks.filter((track) => track.genre === "Blues");
				break;
			case "Recently Added": {
				filtered = mockTracks.filter((track) => track.year >= 2020);
				break;
			}
			default: {
				const genreMatch = mockTracks.find((track) => track.genre === filterLabel);
				if (genreMatch) {
					filtered = mockTracks.filter((track) => track.genre === filterLabel);
				} else {
					const moodMatch = mockTracks.find((track) => track.mood === filterLabel);
					if (moodMatch) {
						filtered = mockTracks.filter((track) => track.mood === filterLabel);
					} else {
						filtered = mockTracks;
					}
				}
				break;
			}
		}

		setFilteredData(filtered);
	};

	const filterChips = [
		{
			label: "All Tracks",
			active: Object.keys(selectedFilters).length === 0,
			onClick: () => handleFilterChangeLegacy("All Tracks"),
		},
		{
			label: "120 - 128 Bpm",
			active: false,
			onClick: () => handleFilterChangeLegacy("120 - 128 Bpm"),
		},
		{
			label: "Sad",
			active: false,
			onClick: () => handleFilterChangeLegacy("Sad"),
		},
		{
			label: "Blues",
			active: false,
			onClick: () => handleFilterChangeLegacy("Blues"),
		},
		{
			label: "Recently Added",
			active: false,
			onClick: () => handleFilterChangeLegacy("Recently Added"),
		},
	];

	useEffect(() => {
		if (breakpoint === "sm" || size < 900) {
			setViewMode("grid");
		} else {
			setViewMode("table");
		}
	}, [breakpoint, size]);

	return (
		<div className="py-4 pr-4 overflow-y-auto h-full w-full">
			<LibraryHeader />
			<LibraryToolbar
				viewMode={viewMode}
				onViewChange={setViewMode}
				tracks={mockTracks}
				selectedFilters={selectedFilters}
				onFilterChange={handleFilterChange}
			/>
			<div className="my-8">
				<FilterChips chips={filterChips} />
			</div>
			{viewMode === "table" ? (
				<TrackTable data={filteredData} />
			) : (
				<TrackGrid data={filteredData} />
			)}
		</div>
	);
}
