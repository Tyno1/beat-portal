import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { refdata } from "../apiClient";
import type {
	DeleteRefdataResponse,
	GetRefdataRequest,
	GetRefdataResponse,
	PostRefdataRequest,
	PostRefdataResponse,
} from "../types/Refdata";

export function useRefdata(refdataType: GetRefdataRequest) {
	return useQuery<GetRefdataResponse>({
		queryKey: ["refdata", refdataType],
		queryFn: () => refdata.getRefdata(refdataType),
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
	});
}

export function useCreateRefdata() {
	const queryClient = useQueryClient();
	return useMutation<
		PostRefdataResponse,
		AxiosError,
		{ refdataType: "trackfilters"; request: PostRefdataRequest }
	>({
		mutationFn: ({ refdataType, request }) =>
			refdata.createRefdata(refdataType, request),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["refdata", variables.refdataType] });
		},
	});
}

export function useDeleteRefdata() {
	const queryClient = useQueryClient();
	return useMutation<DeleteRefdataResponse, AxiosError, "trackfilters">({
		mutationFn: (refdataType) => refdata.deleteRefdata(refdataType),
		onSuccess: (_, refdataType) => {
			queryClient.invalidateQueries({ queryKey: ["refdata", refdataType] });
		},
	});
}


