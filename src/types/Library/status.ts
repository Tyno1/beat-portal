import type { paths } from "../apiTypes";

export type GetScanStatusResponse =
	paths["/library/scan/{scan_id}/status"]["get"]["responses"]["200"]["content"]["application/json"];

export type GetScanStatusRequest =
	paths["/library/scan/{scan_id}/status"]["get"]["parameters"] 