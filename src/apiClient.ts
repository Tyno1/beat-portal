import axios from "axios";
import type {
	GetScanStatusResponse,
	PostScanLibraryRequest,
	PostScanLibraryResponse,
} from "./types/Library";

const apiClient = axios.create({
	baseURL: "http://127.0.0.1:8000",
});

// API Methods
const scanLibrary = async (
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

const getScanStatus = async (
	scanId: string,
): Promise<GetScanStatusResponse> => {
	const response = await apiClient.get<GetScanStatusResponse>(
		`/library/scan/${scanId}/status`,
	);
	return response.data;
};

// Export
const apiClientExports = {
	scanLibrary,
	getScanStatus,
};

export default apiClientExports;
