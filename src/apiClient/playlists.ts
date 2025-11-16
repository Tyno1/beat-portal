import type {
	DeleteTracksFromPlaylistRequest,
	DeleteTracksFromPlaylistResponse,
	GetPlaylistResponse,
	GetPlaylistsResponse,
	PostAddTracksToPlaylistRequest,
	PostAddTracksToPlaylistResponse,
	PostExportPlaylistRequest,
	PostExportPlaylistResponse,
	PostPlaylistRequest,
	PostPlaylistResponse,
	PutPlaylistRequest,
	PutPlaylistResponse,
} from "../types/Playlists";
import { apiClient } from "./client";

export const getPlaylists = async (): Promise<GetPlaylistsResponse> => {
	const response = await apiClient.get<GetPlaylistsResponse>("/playlists");
	return response.data;
};

export const createPlaylist = async (
	request: PostPlaylistRequest,
): Promise<PostPlaylistResponse> => {
	const response = await apiClient.post<PostPlaylistResponse>(
		"/playlists",
		request,
	);
	return response.data;
};

export const getPlaylist = async (
	playlistId: string,
): Promise<GetPlaylistResponse> => {
	const response = await apiClient.get<GetPlaylistResponse>(
		`/playlists/${playlistId}`,
	);
	return response.data;
};

export const updatePlaylist = async (
	playlistId: string,
	request: PutPlaylistRequest["body"],
): Promise<PutPlaylistResponse> => {
	const response = await apiClient.put<PutPlaylistResponse>(
		`/playlists/${playlistId}`,
		request,
	);
	return response.data;
};

export const deletePlaylist = async (playlistId: string): Promise<void> => {
	await apiClient.delete(`/playlists/${playlistId}`);
};

export const addTracksToPlaylist = async (
	playlistId: string,
	request: PostAddTracksToPlaylistRequest["body"],
): Promise<PostAddTracksToPlaylistResponse> => {
	const response = await apiClient.post<PostAddTracksToPlaylistResponse>(
		`/playlists/${playlistId}/tracks`,
		request,
	);
	return response.data;
};

export const removeTracksFromPlaylist = async (
	playlistId: string,
	request: DeleteTracksFromPlaylistRequest["body"],
): Promise<DeleteTracksFromPlaylistResponse> => {
	const response = await apiClient.delete<DeleteTracksFromPlaylistResponse>(
		`/playlists/${playlistId}/tracks`,
		{ data: request },
	);
	return response.data;
};

export const exportPlaylist = async (
	playlistId: string,
	request: PostExportPlaylistRequest["body"],
): Promise<PostExportPlaylistResponse> => {
	const response = await apiClient.post<PostExportPlaylistResponse>(
		`/playlists/${playlistId}/export`,
		request,
	);
	return response.data;
};

const playlistsApi = {
	getPlaylists,
	createPlaylist,
	getPlaylist,
	updatePlaylist,
	deletePlaylist,
	addTracksToPlaylist,
	removeTracksFromPlaylist,
	exportPlaylist,
};

export default playlistsApi;

