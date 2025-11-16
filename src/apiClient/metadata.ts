import type {
	PostAnalyzeMetadataRequest,
	PostAnalyzeMetadataResponse,
	PostBatchAnalyzeMetadataRequest,
	PostBatchAnalyzeMetadataResponse,
} from "../types/Metadata";
import { apiClient } from "./client";

export const analyzeMetadata = async (
	request: PostAnalyzeMetadataRequest,
): Promise<PostAnalyzeMetadataResponse> => {
	const response = await apiClient.post<PostAnalyzeMetadataResponse>(
		"/metadata/analyze",
		request,
	);
	return response.data;
};

export const batchAnalyzeMetadata = async (
	request: PostBatchAnalyzeMetadataRequest,
): Promise<PostBatchAnalyzeMetadataResponse> => {
	const response = await apiClient.post<PostBatchAnalyzeMetadataResponse>(
		"/metadata/batch-analyze",
		request,
	);
	return response.data;
};

const metadataApi = {
	analyzeMetadata,
	batchAnalyzeMetadata,
};

export default metadataApi;

