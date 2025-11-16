import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { playlists } from "../apiClient";
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

export function usePlaylists() {
	return useQuery<GetPlaylistsResponse>({
		queryKey: ["playlists"],
		queryFn: () => playlists.getPlaylists(),
	});
}

export function usePlaylist(playlistId: string | null) {
	return useQuery<GetPlaylistResponse>({
		queryKey: ["playlist", playlistId],
		queryFn: () => {
			if (!playlistId) throw new Error("Playlist ID is required");
			return playlists.getPlaylist(playlistId);
		},
		enabled: !!playlistId,
	});
}

export function useCreatePlaylist() {
	const queryClient = useQueryClient();
	return useMutation<PostPlaylistResponse, AxiosError, PostPlaylistRequest>({
		mutationFn: (request) => playlists.createPlaylist(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["playlists"] });
		},
	});
}

export function useUpdatePlaylist() {
	const queryClient = useQueryClient();
	return useMutation<
		PutPlaylistResponse,
		AxiosError,
		{ playlistId: string; request: PutPlaylistRequest["body"] }
	>({
		mutationFn: ({ playlistId, request }) =>
			playlists.updatePlaylist(playlistId, request),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["playlists"] });
			queryClient.invalidateQueries({
				queryKey: ["playlist", variables.playlistId],
			});
		},
	});
}

export function useDeletePlaylist() {
	const queryClient = useQueryClient();
	return useMutation<void, AxiosError, string>({
		mutationFn: (playlistId) => playlists.deletePlaylist(playlistId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["playlists"] });
		},
	});
}

export function useAddTracksToPlaylist() {
	const queryClient = useQueryClient();
	return useMutation<
		PostAddTracksToPlaylistResponse,
		AxiosError,
		{ playlistId: string; request: PostAddTracksToPlaylistRequest["body"] }
	>({
		mutationFn: ({ playlistId, request }) =>
			playlists.addTracksToPlaylist(playlistId, request),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["playlists"] });
			queryClient.invalidateQueries({
				queryKey: ["playlist", variables.playlistId],
			});
		},
	});
}

export function useRemoveTracksFromPlaylist() {
	const queryClient = useQueryClient();
	return useMutation<
		DeleteTracksFromPlaylistResponse,
		AxiosError,
		{
			playlistId: string;
			request: DeleteTracksFromPlaylistRequest["body"];
		}
	>({
		mutationFn: ({ playlistId, request }) =>
			playlists.removeTracksFromPlaylist(playlistId, request),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["playlists"] });
			queryClient.invalidateQueries({
				queryKey: ["playlist", variables.playlistId],
			});
		},
	});
}

export function useExportPlaylist() {
	return useMutation<
		PostExportPlaylistResponse,
		AxiosError,
		{ playlistId: string; request: PostExportPlaylistRequest["body"] }
	>({
		mutationFn: ({ playlistId, request }) =>
			playlists.exportPlaylist(playlistId, request),
	});
}

