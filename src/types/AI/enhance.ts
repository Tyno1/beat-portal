import type { paths } from "../apiTypes";

export type PostEnhanceRequest =
	paths["/ai/enhance"]["post"]["requestBody"]["content"]["application/json"];

export type PostEnhanceResponse =
	paths["/ai/enhance"]["post"]["responses"]["200"]["content"]["application/json"];

