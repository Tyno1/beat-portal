import type { paths } from "../apiTypes";

export type GetTracksRequest =
	paths["/tracks"]["get"]["parameters"]["query"];

export type GetTracksResponse =
	paths["/tracks"]["get"]["responses"]["200"]["content"]["application/json"];

