import type { paths } from "../apiTypes";

export type PostAddTracksToPlaylistRequest = {
	params: paths["/playlists/{playlist_id}/tracks"]["post"]["parameters"]["path"];
	body: paths["/playlists/{playlist_id}/tracks"]["post"]["requestBody"]["content"]["application/json"];
};

export type PostAddTracksToPlaylistResponse =
	paths["/playlists/{playlist_id}/tracks"]["post"]["responses"]["200"];

