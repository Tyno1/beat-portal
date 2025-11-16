import type {
	GetTrackResponse,
	GetTracksRequest,
	GetTracksResponse,
	PostBulkDeleteTracksRequest,
	PostBulkDeleteTracksResponse,
	PostTrackRequest,
	PostTrackResponse,
	PutTrackRequest,
	PutTrackResponse,
} from "../types/Tracks";
import { apiClient } from "./client";

export const getTracks = async (
	params?: GetTracksRequest,
): Promise<GetTracksResponse> => {
	const response = await apiClient.get<GetTracksResponse>("/tracks", {
		params,
	});
	return response.data;
};

export const createTrack = async (
	request: PostTrackRequest,
): Promise<PostTrackResponse> => {
	const response = await apiClient.post<PostTrackResponse>("/tracks", request);
	return response.data;
};

export const getTrack = async (trackId: string): Promise<GetTrackResponse> => {
	const response = await apiClient.get<GetTrackResponse>(`/tracks/${trackId}`);
	return response.data;
};

export const updateTrack = async (
	trackId: string,
	request: PutTrackRequest["body"],
): Promise<PutTrackResponse> => {
	const response = await apiClient.put<PutTrackResponse>(
		`/tracks/${trackId}`,
		request,
	);
	return response.data;
};

export const deleteTrack = async (trackId: string): Promise<void> => {
	await apiClient.delete(`/tracks/${trackId}`);
};

export const bulkDeleteTracks = async (
	request: PostBulkDeleteTracksRequest,
): Promise<PostBulkDeleteTracksResponse> => {
	const response = await apiClient.post<PostBulkDeleteTracksResponse>(
		"/tracks/bulk/delete",
		request,
	);
	return response.data;
};

const tracksApi = {
	getTracks,
	createTrack,
	getTrack,
	updateTrack,
	deleteTrack,
	bulkDeleteTracks,
};

export default tracksApi;

