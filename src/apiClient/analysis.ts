import type {
	GetBPMDistributionResponse,
	GetGenreDistributionResponse,
	GetKeyDistributionResponse,
	GetLibraryOverviewResponse,
	GetMoodDistributionResponse,
} from "../types/Analysis";
import { apiClient } from "./client";

export const getLibraryOverview = async (): Promise<GetLibraryOverviewResponse> => {
	const response =
		await apiClient.get<GetLibraryOverviewResponse>("/analysis/overview");
	return response.data;
};

export const getBPMDistribution = async (): Promise<GetBPMDistributionResponse> => {
	const response = await apiClient.get<GetBPMDistributionResponse>(
		"/analysis/bpm-distribution",
	);
	return response.data;
};

export const getKeyDistribution = async (): Promise<GetKeyDistributionResponse> => {
	const response = await apiClient.get<GetKeyDistributionResponse>(
		"/analysis/key-distribution",
	);
	return response.data;
};

export const getGenreDistribution =
	async (): Promise<GetGenreDistributionResponse> => {
		const response = await apiClient.get<GetGenreDistributionResponse>(
			"/analysis/genre-distribution",
		);
		return response.data;
	};

export const getMoodDistribution = async (): Promise<GetMoodDistributionResponse> => {
	const response = await apiClient.get<GetMoodDistributionResponse>(
		"/analysis/mood-distribution",
	);
	return response.data;
};

const analysisApi = {
	getLibraryOverview,
	getBPMDistribution,
	getKeyDistribution,
	getGenreDistribution,
	getMoodDistribution,
};

export default analysisApi;

