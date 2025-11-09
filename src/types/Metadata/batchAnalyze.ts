import type { paths } from "../apiTypes";

export type PostBatchAnalyzeMetadataRequest =
	paths["/metadata/batch-analyze"]["post"]["requestBody"]["content"]["application/json"];

export type PostBatchAnalyzeMetadataResponse =
	paths["/metadata/batch-analyze"]["post"]["responses"]["202"]["content"]["application/json"];

