import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button, Input } from "../components/atoms";
import { Modal } from "../components/molecules";
import FilterChips from "../components/ui/Library/FilterChips";
import LibraryHeader from "../components/ui/Library/LibraryHeader";
import LibraryToolbar, {
	type ViewMode,
} from "../components/ui/Library/LibraryToolbar";
import PaginationControl from "../components/ui/Library/PaginationControl";
import TrackDetail from "../components/ui/Library/TrackDetail";
import TrackGrid from "../components/ui/Library/TrackGrid";
import TrackTable from "../components/ui/Library/TrackTable";
import { useCreatePlaylist } from "../hooks/usePlaylists";
import useResize from "../hooks/useResize";
import { useTracks } from "../hooks/useTrack";
import type { PostPlaylistRequest } from "../types/Playlists";
import type { GetTracksRequest } from "../types/Tracks";
import { fetchAllFilteredTracks } from "../utils/fetchAllTracks";

export default function Library() {
	const [viewMode, setViewMode] = useState<ViewMode>("table");
	const [selectedFilters, setSelectedFilters] = useState<{
		[key: string]: string[];
	}>({});
	const [searchText, setSearchText] = useState<string>("");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
	const [createPlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);
	const [playlistName, setPlaylistName] = useState("");
	const [playlistDescription, setPlaylistDescription] = useState("");
	const [isFetchingTracks, setIsFetchingTracks] = useState(false);
	const createPlaylistMutation = useCreatePlaylist();
	const { breakpoint, size } = useResize();
	const generatedFilterId = useId();
	const prevFiltersRef = useRef<string>("");

	const queryParams = useMemo(() => {
		const params: GetTracksRequest = {
			page: currentPage,
			size: 50,
		};

		if (searchText && searchText.trim().length > 0) {
			params.search = searchText.trim();
		}

		if (selectedFilters.genre && selectedFilters.genre.length > 0) {
			params.genre = selectedFilters.genre[0];
		}

		if (selectedFilters.mood && selectedFilters.mood.length > 0) {
			params.mood = selectedFilters.mood[0];
		}

		if (selectedFilters.key && selectedFilters.key.length > 0) {
			params.key = selectedFilters.key[0];
		}

		// Handle BPM range if both min and max are set
		if (selectedFilters.bpm && selectedFilters.bpm.length > 0) {
			const bpmValues = selectedFilters.bpm
				.map(Number)
				.filter((n) => !Number.isNaN(n));
			if (bpmValues.length > 0) {
				params.bpm_min = Math.min(...bpmValues);
				params.bpm_max = Math.max(...bpmValues);
			}
		}

		// Handle artist filter (exact match)
		if (selectedFilters.artist && selectedFilters.artist.length > 0) {
			params.artist = selectedFilters.artist[0];
		}

		// Handle year range (decade ranges like "2010s" -> 2010-2019)
		if (selectedFilters.year && selectedFilters.year.length > 0) {
			const yearRanges = selectedFilters.year.map((range) => {
				const decade = parseInt(range.replace("s", ""), 10);
				return { min: decade, max: decade + 9 };
			});
			if (yearRanges.length > 0) {
				params.year_min = Math.min(...yearRanges.map((r) => r.min));
				params.year_max = Math.max(...yearRanges.map((r) => r.max));
			}
		}

		return params;
	}, [currentPage, searchText, selectedFilters]);

	// Build filter params for fetching all tracks (without pagination)
	const allTracksFilterParams = useMemo(() => {
		const params: GetTracksRequest = {
			page: 1, // Will be overridden by fetchAllFilteredTracks
			size: 100, // Max allowed
		};

		if (searchText && searchText.trim().length > 0) {
			params.search = searchText.trim();
		}

		if (selectedFilters.genre && selectedFilters.genre.length > 0) {
			params.genre = selectedFilters.genre[0];
		}

		if (selectedFilters.mood && selectedFilters.mood.length > 0) {
			params.mood = selectedFilters.mood[0];
		}

		if (selectedFilters.key && selectedFilters.key.length > 0) {
			params.key = selectedFilters.key[0];
		}

		if (selectedFilters.bpm && selectedFilters.bpm.length > 0) {
			const bpmValues = selectedFilters.bpm
				.map(Number)
				.filter((n) => !Number.isNaN(n));
			if (bpmValues.length > 0) {
				params.bpm_min = Math.min(...bpmValues);
				params.bpm_max = Math.max(...bpmValues);
			}
		}

		// Handle artist filter (exact match)
		if (selectedFilters.artist && selectedFilters.artist.length > 0) {
			params.artist = selectedFilters.artist[0];
		}

		// Handle year range (decade ranges like "2010s" -> 2010-2019)
		if (selectedFilters.year && selectedFilters.year.length > 0) {
			const yearRanges = selectedFilters.year.map((range) => {
				const decade = parseInt(range.replace("s", ""), 10);
				return { min: decade, max: decade + 9 };
			});
			if (yearRanges.length > 0) {
				params.year_min = Math.min(...yearRanges.map((r) => r.min));
				params.year_max = Math.max(...yearRanges.map((r) => r.max));
			}
		}

		return params;
	}, [searchText, selectedFilters]);

	const { data: tracksData } = useTracks(queryParams);
	const tracks = useMemo(() => tracksData?.data || [], [tracksData?.data]);

	const filteredData = tracks;

	useEffect(() => {
		if (breakpoint === "sm" || size < 900) {
			setViewMode("grid");
		} else {
			setViewMode("table");
		}
	}, [breakpoint, size]);

	const handleFilterChange = (category: string, selectedValues: string[]) => {
		setSelectedFilters((prev) => ({
			...prev,
			[category]: selectedValues,
		}));
	};

	const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (tracksData?.pagination?.has_next) {
			setCurrentPage(currentPage + 1);
		}
	};

	// Reset to page 1 when filters change
	useEffect(() => {
		const currentFilters = JSON.stringify({ searchText, selectedFilters });
		if (prevFiltersRef.current && prevFiltersRef.current !== currentFilters) {
			setCurrentPage(1);
		}
		prevFiltersRef.current = currentFilters;
	}, [searchText, selectedFilters]);

	const handleCreatePlaylist = () => {
		setPlaylistName("");
		setPlaylistDescription("");
		setCreatePlaylistModalOpen(true);
	};

	const handleCreatePlaylistSubmit = async () => {
		if (!playlistName.trim()) {
			alert("Please enter a playlist name");
			return;
		}

		setIsFetchingTracks(true);
		try {
			// Fetch all track IDs matching current filters
			const trackIds = await fetchAllFilteredTracks(allTracksFilterParams);

			if (trackIds.length === 0) {
				alert("No tracks match the current filters");
				setIsFetchingTracks(false);
				return;
			}

			// Create playlist
			const playlistRequest: PostPlaylistRequest = {
				name: playlistName.trim(),
				description: playlistDescription.trim() || undefined,
			};

			const playlist =
				await createPlaylistMutation.mutateAsync(playlistRequest);

			// Add all tracks to the playlist
			if (playlist.id) {
				// Import the add tracks function
				const { playlists } = await import("../apiClient");
				await playlists.addTracksToPlaylist(playlist.id, {
					track_ids: trackIds,
				});
			}

			alert(
				`Playlist "${playlistName}" created with ${trackIds.length} tracks!`,
			);
			setCreatePlaylistModalOpen(false);
			setPlaylistName("");
			setPlaylistDescription("");
		} catch (error) {
			console.error("Error creating playlist:", error);
			alert("Failed to create playlist");
		} finally {
			setIsFetchingTracks(false);
		}
	};

	const filterChips = Object.keys(selectedFilters)
		.filter((key) => selectedFilters[key].length > 0)
		.map((key) => ({
			label: (
				<span>
					<span className="font-bold">{key}:</span>{" "}
					<span>
						{selectedFilters[key].map((each) => (
							<span
								className="bg-white text-primary rounded-full px-2 py-1 ml-1"
								key={each}
							>
								{each}
							</span>
						))}
					</span>
				</span>
			),
			active: true,
			onClick: () => handleFilterChange(key, []),
			key: `${generatedFilterId}-${key}`,
		}));

	return (
		<div className="py-4 pr-4 overflow-hidden h-full w-full flex flex-col gap-6">
			<LibraryHeader onCreatePlaylist={handleCreatePlaylist} />
			<LibraryToolbar
				viewMode={viewMode}
				onViewChange={setViewMode}
				selectedFilters={selectedFilters}
				onFilterChange={handleFilterChange}
				onSearchTextChange={handleSearchTextChange}
				searchText={searchText}
			/>

			<FilterChips chips={filterChips} />

			<div className="flex flex-col">
				{viewMode === "table" ? (
					<TrackTable
						data={filteredData}
						onTrackClick={(trackId) => setSelectedTrackId(trackId)}
					/>
				) : (
					<TrackGrid
						data={filteredData}
						onTrackClick={(trackId) => setSelectedTrackId(trackId)}
					/>
				)}
				<PaginationControl
					currentPage={tracksData?.pagination?.page || 1}
					totalPages={tracksData?.pagination?.total_pages || 1}
					onPrevious={handlePrevious}
					onNext={handleNext}
					hasNext={tracksData?.pagination?.has_next || false}
					hasPrevious={tracksData?.pagination?.has_previous || false}
				/>
			</div>

			{/* Track Detail Modal */}
			{selectedTrackId && (
				<TrackDetail
					trackId={selectedTrackId}
					onClose={() => setSelectedTrackId(null)}
				/>
			)}

			{/* Create Playlist Modal */}
			<Modal
				open={createPlaylistModalOpen}
				onClose={() => setCreatePlaylistModalOpen(false)}
				title="Create Playlist from Filters"
				size="md"
			>
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						Create a playlist from all tracks matching your current filters.
					</p>
					<Input
						label="Playlist Name"
						placeholder="Enter playlist name"
						value={playlistName}
						onChange={(e) => setPlaylistName(e.target.value)}
						variant="outline"
						size="md"
					/>
					<Input
						label="Description (Optional)"
						placeholder="Enter playlist description"
						value={playlistDescription}
						onChange={(e) => setPlaylistDescription(e.target.value)}
						variant="outline"
						size="md"
					/>
					<div className="flex gap-3 justify-end pt-4">
						<Button
							variant="outline"
							color="secondary"
							size="md"
							onClick={() => setCreatePlaylistModalOpen(false)}
							disabled={isFetchingTracks || createPlaylistMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							variant="solid"
							color="primary"
							size="md"
							onClick={handleCreatePlaylistSubmit}
							disabled={
								!playlistName.trim() ||
								isFetchingTracks ||
								createPlaylistMutation.isPending
							}
						>
							{isFetchingTracks
								? "Fetching tracks..."
								: createPlaylistMutation.isPending
									? "Creating..."
									: "Create Playlist"}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
