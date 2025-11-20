import { tracks } from "../apiClient";
import type { GetTracksRequest } from "../types/Tracks";

/**
 * Fetches all tracks matching the given filters by making multiple paginated requests.
 * The backend limits to 100 tracks per page, so this function handles pagination automatically.
 */
export async function fetchAllFilteredTracks(
	filters: GetTracksRequest,
): Promise<string[]> {
	const trackIds: string[] = [];
	let page = 1;
	const size = 100; // Max allowed by backend
	let hasMore = true;

	while (hasMore) {
		const response = await tracks.getTracks({
			...filters,
			page,
			size,
		});

		// Collect track IDs
		const ids = response.data
			.map((track) => track.id)
			.filter((id): id is string => !!id);
		trackIds.push(...ids);

		// Check if there are more pages
		hasMore = response.pagination?.has_next || false;
		page++;
	}

	return trackIds;
}

