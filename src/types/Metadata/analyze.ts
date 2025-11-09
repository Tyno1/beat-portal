import type { paths } from "../apiTypes";

export type PostAnalyzeMetadataRequest =
	paths["/metadata/analyze"]["post"]["requestBody"]["content"]["application/json"];

export type PostAnalyzeMetadataResponse =
	paths["/metadata/analyze"]["post"]["responses"]["200"]["content"]["application/json"];

