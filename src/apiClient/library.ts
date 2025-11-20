import type {
	GetScanStatusResponse,
	PostScanLibraryRequest,
	PostScanLibraryResponse,
} from "../types/Library";
import { apiClient } from "./client";

export const scanLibrary = async (
	paths: string[],
	options?: {
		include_subfolders?: boolean;
		skip_duplicates?: boolean;
		watch_for_changes?: boolean;
	},
): Promise<PostScanLibraryResponse> => {
	const request: PostScanLibraryRequest = {
		paths,
		include_subfolders: options?.include_subfolders ?? true,
		skip_duplicates: options?.skip_duplicates ?? false,
		watch_for_changes: options?.watch_for_changes ?? false,
	};

	const response = await apiClient.post<PostScanLibraryResponse>(
		"/library/scan",
		request,
	);
	return response.data;
};

export const getScanStatus = async (
	scanId: string,
): Promise<GetScanStatusResponse> => {
	const response = await apiClient.get<GetScanStatusResponse>(
		`/library/scan/${scanId}/status`,
	);
	return response.data;
};

const libraryApi = {
	scanLibrary,
	getScanStatus,
};

export default libraryApi;

