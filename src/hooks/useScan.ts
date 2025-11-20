import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { library } from "../apiClient";
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
			return library.getScanStatus(scanId);
		},
		enabled: !!scanId,
		refetchInterval: (query) => {
			const data = query.state.data;
			// Poll every 200ms if discovering or scanning to catch updates
			if (data?.status === "discovering" || data?.status === "scanning") {
				return 200;
			}
			// Stop polling when completed or failed, but keep scan ID accessible
			// The scan ID will be cleared when a new scan starts
			return false;
		},
	});
}

export function useActiveScanStatus() {
	const scanId = getActiveScanId();
	return useScanStatus(scanId);
}

export function useStartScan() {
	return useMutation<PostScanLibraryResponse, AxiosError, string[]>({
		mutationFn: (paths: string[]) => library.scanLibrary(paths),
		onSuccess: (data) => {
			// Clear any existing scan ID and save new one when scan starts
			if (data.scan_id) {
				setActiveScanId(data.scan_id);
			}
		},
	});
}
