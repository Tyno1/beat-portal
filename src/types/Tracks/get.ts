import type { paths } from "../apiTypes";

export type GetTrackRequest =
	paths["/tracks/{track_id}"]["get"]["parameters"]["path"];

export type GetTrackResponse =
	paths["/tracks/{track_id}"]["get"]["responses"]["200"]["content"]["application/json"];

