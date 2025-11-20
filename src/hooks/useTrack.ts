import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { tracks } from "../apiClient";
import type {
	GetTrackResponse,
	GetTracksRequest,
	GetTracksResponse,
	PostBulkDeleteTracksRequest,
	PostBulkDeleteTracksResponse,
	PostTrackMetadataResetRequest,
	PostTrackMetadataResetResponse,
	PostTrackRequest,
	PostTrackResponse,
	PutTrackRequest,
	PutTrackResponse,
} from "../types/Tracks";

export function useTracks(params?: GetTracksRequest) {
	return useQuery<GetTracksResponse>({
		queryKey: ["tracks", params],
		queryFn: () => tracks.getTracks(params),
	});
}

export function useAllTracks(params?: Omit<GetTracksRequest, "page">) {
	return useInfiniteQuery<GetTracksResponse>({
		queryKey: ["tracks", "all", params],
		queryFn: ({ pageParam = 1 }) =>
			tracks.getTracks({ ...params, page: pageParam as number, size: 100 }),
		getNextPageParam: (lastPage) => {
			if (lastPage.pagination?.has_next) {
				return (lastPage.pagination?.page || 1) + 1;
			}
			return undefined;
		},
		initialPageParam: 1,
	});
}

export function useTrack(trackId: string | null) {
	return useQuery<GetTrackResponse>({
		queryKey: ["track", trackId],
		queryFn: () => {
			if (!trackId) throw new Error("Track ID is required");
			return tracks.getTrack(trackId);
		},
		enabled: !!trackId,
	});
}

export function useCreateTrack() {
	const queryClient = useQueryClient();
	return useMutation<PostTrackResponse, AxiosError, PostTrackRequest>({
		mutationFn: (request) => tracks.createTrack(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
		},
	});
}

export function useUpdateTrack() {
	const queryClient = useQueryClient();
	return useMutation<
		PutTrackResponse,
		AxiosError,
		{ trackId: string; request: PutTrackRequest["body"] }
	>({
		mutationFn: ({ trackId, request }) => tracks.updateTrack(trackId, request),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
			queryClient.invalidateQueries({ queryKey: ["track", variables.trackId] });
		},
	});
}

export function useDeleteTrack() {
	const queryClient = useQueryClient();
	return useMutation<void, AxiosError, string>({
		mutationFn: (trackId) => tracks.deleteTrack(trackId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
		},
	});
}

export function useBulkDeleteTracks() {
	const queryClient = useQueryClient();
	return useMutation<
		PostBulkDeleteTracksResponse,
		AxiosError,
		PostBulkDeleteTracksRequest
	>({
		mutationFn: (request) => tracks.bulkDeleteTracks(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
		},
	});
}

export function useResetTrackMetadata() {
	const queryClient = useQueryClient();
	return useMutation<
		PostTrackMetadataResetResponse,
		AxiosError,
		{
			trackId: string;
			request?: PostTrackMetadataResetRequest;
		}
	>({
		mutationFn: ({ trackId, request }) =>
			tracks.resetTrackMetadata(trackId, request),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
			queryClient.invalidateQueries({ queryKey: ["track", variables.trackId] });
		},
	});
}
