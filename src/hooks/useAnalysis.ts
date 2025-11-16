import { useQuery } from "@tanstack/react-query";
import { analysis } from "../apiClient";
import type {
	GetBPMDistributionResponse,
	GetGenreDistributionResponse,
	GetKeyDistributionResponse,
	GetLibraryOverviewResponse,
	GetMoodDistributionResponse,
} from "../types/Analysis";

export function useLibraryOverview() {
	return useQuery<GetLibraryOverviewResponse>({
		queryKey: ["analysis", "overview"],
		queryFn: () => analysis.getLibraryOverview(),
	});
}

export function useBPMDistribution() {
	return useQuery<GetBPMDistributionResponse>({
		queryKey: ["analysis", "bpm-distribution"],
		queryFn: () => analysis.getBPMDistribution(),
	});
}

export function useKeyDistribution() {
	return useQuery<GetKeyDistributionResponse>({
		queryKey: ["analysis", "key-distribution"],
		queryFn: () => analysis.getKeyDistribution(),
	});
}

export function useGenreDistribution() {
	return useQuery<GetGenreDistributionResponse>({
		queryKey: ["analysis", "genre-distribution"],
		queryFn: () => analysis.getGenreDistribution(),
	});
}

export function useMoodDistribution() {
	return useQuery<GetMoodDistributionResponse>({
		queryKey: ["analysis", "mood-distribution"],
		queryFn: () => analysis.getMoodDistribution(),
	});
}

