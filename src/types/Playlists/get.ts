import type { paths } from "../apiTypes";

export type GetPlaylistRequest =
	paths["/playlists/{playlist_id}"]["get"]["parameters"]["path"];

export type GetPlaylistResponse =
	paths["/playlists/{playlist_id}"]["get"]["responses"]["200"]["content"]["application/json"];

