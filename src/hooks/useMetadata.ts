import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { metadata } from "../apiClient";
import type {
	PostAnalyzeMetadataRequest,
	PostAnalyzeMetadataResponse,
	PostBatchAnalyzeMetadataRequest,
	PostBatchAnalyzeMetadataResponse,
} from "../types/Metadata";

export function useAnalyzeMetadata() {
	return useMutation<
		PostAnalyzeMetadataResponse,
		AxiosError,
		PostAnalyzeMetadataRequest
	>({
		mutationFn: (request) => metadata.analyzeMetadata(request),
	});
}

export function useBatchAnalyzeMetadata() {
	const queryClient = useQueryClient();
	return useMutation<
		PostBatchAnalyzeMetadataResponse,
		AxiosError,
		PostBatchAnalyzeMetadataRequest
	>({
		mutationFn: (request) => metadata.batchAnalyzeMetadata(request),
		onSuccess: () => {
			// Invalidate tracks queries since metadata was updated
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
		},
	});
}

