import type { paths } from "../apiTypes";

export type PostBulkDeleteTracksRequest =
	paths["/tracks/bulk/delete"]["post"]["requestBody"]["content"]["application/json"];

export type PostBulkDeleteTracksResponse =
	paths["/tracks/bulk/delete"]["post"]["responses"]["200"]["content"]["application/json"];

