import type { paths } from "../apiTypes";

export type PostBatchEnhanceRequest =
	paths["/ai/batch-enhance"]["post"]["requestBody"]["content"]["application/json"];

export type PostBatchEnhanceResponse =
	paths["/ai/batch-enhance"]["post"]["responses"]["202"]["content"]["application/json"];

