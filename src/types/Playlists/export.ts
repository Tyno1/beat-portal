import type { paths } from "../apiTypes";

export type PostExportPlaylistRequest = {
	params: paths["/playlists/{playlist_id}/export"]["post"]["parameters"]["path"];
	body: paths["/playlists/{playlist_id}/export"]["post"]["requestBody"]["content"]["application/json"];
};

export type PostExportPlaylistResponse =
	paths["/playlists/{playlist_id}/export"]["post"]["responses"]["200"];

