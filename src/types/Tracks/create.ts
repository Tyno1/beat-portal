import type { paths } from "../apiTypes";

export type PostTrackRequest =
	paths["/tracks"]["post"]["requestBody"]["content"]["application/json"];

export type PostTrackResponse =
	paths["/tracks"]["post"]["responses"]["201"]["content"]["application/json"];

