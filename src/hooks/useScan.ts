import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import type {
	GetScanStatusResponse,
	PostScanLibraryResponse,
} from "../types/Library";

const ACTIVE_SCAN_ID_KEY = "activeScanId";

export function getActiveScanId(): string | null {
	return localStorage.getItem(ACTIVE_SCAN_ID_KEY);
}

export function setActiveScanId(scanId: string | null): void {
	if (scanId) {
		localStorage.setItem(ACTIVE_SCAN_ID_KEY, scanId);
	} else {
		localStorage.removeItem(ACTIVE_SCAN_ID_KEY);
	}
}

export function useScanStatus(scanId: string | null) {
	return useQuery<GetScanStatusResponse>({
		queryKey: ["scanStatus", scanId],
		queryFn: () => {
			if (!scanId) throw new Error("Scan ID is required");
			return apiClient.getScanStatus(scanId);
		},
		enabled: !!scanId,
		refetchInterval: (query) => {
			const data = query.state.data;
			// Poll every 200ms if discovering or scanning to catch updates
			if (data?.status === "discovering" || data?.status === "scanning") {
				return 200;
			}
			// Clear scan ID when completed or failed
			if (data?.status === "completed" || data?.status === "failed") {
				setActiveScanId(null);
			}
			return false;
		},
	});
}

export function useActiveScanStatus() {
	const scanId = getActiveScanId();
	return useScanStatus(scanId);
}

export function useStartScan() {
	return useMutation<PostScanLibraryResponse, Error, string[]>({
		mutationFn: (paths: string[]) => apiClient.scanLibrary(paths),
		onSuccess: (data) => {
			// Save scan ID to localStorage when scan starts
			if (data.scan_id) {
				setActiveScanId(data.scan_id);
			}
		},
	});
}
